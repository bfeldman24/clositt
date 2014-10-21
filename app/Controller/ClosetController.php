<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Model/ClosetEntity.php');
require_once(dirname(__FILE__) . '/../Model/ClosetItemEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ClosetDao.php');
require_once(dirname(__FILE__) . '/Debugger.php');
require_once(dirname(__FILE__) . '/ProductController.php');
require_once(dirname(__FILE__) . '/../Elastic/ElasticDao.php');

class ClosetController extends Debugger {	
	private $closetDao = null;
	private $productController = null;

	public function __construct(){
		$this->closetDao = new ClosetDao();
		$this->productController = new ProductController();
	}
	
	public function createNewCloset($data){
        if (isset($data)){
            $closet = ClosetEntity::setClosetFromPost($data);
            
            if (isset($closet)){
                $user = $closet->getUserId();
                
                if ($user == $_SESSION['userid']){ 
                    $insertedId = $this->closetDao->createNewCloset($_SESSION['userid'], $closet);
                    return $insertedId > 0 ? $insertedId : "failed";
                }
            }
        }
                
        $this->debug("ClosetController", "createNewCloset", "There was no closet supplied to create!");
        return false;
	}
	
	public function updateCloset($data){
	   if (isset($data)){
            $closet = ClosetEntity::setClosetFromPost($data);
            
            if (isset($closet)){
                $user = $closet->getUserId();
                
                if ($user == $_SESSION['userid']){                
                    $affectedRows = $this->closetDao->updateCloset($_SESSION['userid'], $closet);
                    return $affectedRows === 1 ? "success" : "failed";
                }
            }
        }
                
        $this->debug("ClosetController", "updateCloset", "There was no closet supplied to update!");
        return false;
	}
	
	public function deleteCloset($data){
	   if (isset($data)){
            $closet = ClosetEntity::setClosetFromPost($data);
            
            if (isset($closet)){
                $closetId = $closet->getClosetId();
                $user = $closet->getUserId();
                
                if ($user == $_SESSION['userid'] && isset($closetId)){                                
                    $affectedRows = $this->closetDao->deleteCloset($_SESSION['userid'], $closetId);
                    return $affectedRows === 1 ? "success" : "failed";
                }
            }
        }
                
        $this->debug("ClosetController", "deleteCloset", "There was no closet supplied to delete!");
        return false;
	}	
   
   private function file_get_contents_curl($url) {
       $curl = curl_init($url);
       curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:26.0) Gecko/20100101 Firefox/26.0');
       curl_setopt($curl, CURLOPT_AUTOREFERER, true);
       curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
       curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1 );
       curl_setopt($curl, CURLOPT_TIMEOUT, 2 );
       $html = curl_exec( $curl );
       curl_close( $curl);
       return $html;
   }
	
	public function addItemToCloset($data){	   	   	   
	   if (isset($data)){
            $closetItem = ClosetItemEntity::setFromPost($data);
            
            if (isset($closetItem)){                  
                $user = $closetItem->getUserId();
                
                if ($user == $_SESSION['userid']){                              
                    $affectedRows = $this->closetDao->addItemToCloset($_SESSION['userid'], $closetItem);
                    
                    if ($affectedRows === 1){
                        $this->productController->updateClosittCounter($closetItem->getSku());
                        
                        try{
                            // Update elastic count
                            $sku = $closetItem->getSku();
                            $elastic = new ElasticDao();
                            $elastic->updateClosittCount($sku);
                        }catch(Exception $e) {                              
                            $this->error("ClosetController", "addItemToCloset", "Could not update elastic clositt count: $sku");                          
                        }
                        
                        try{                            
                            $rawImage = $this->file_get_contents_curl($closetItem->getImage());                          
                            
                            if (isset($rawImage) && strlen($rawImage) > 100){
                                $this->closetDao->saveItemImage($closetItem->getSku(), $rawImage);
                            }
                        }catch(Exception $e) {  
                            $img = $closetItem->getImage();
                            $sku = $closetItem->getSku();
                            $this->error("ClosetController", "addItemToCloset", "Could not cache ($sku) image: $img");                          
                        }
                        
                        return "success";
                    }
                    
                    return "failed";
                }
            }
        }
                
        $this->debug("ClosetController", "addItemToCloset", "There was no closet item supplied to add!");
        return false;
	}
	
	public function removeItemFromCloset($data){
	   if (isset($data)){
            $closetItem = ClosetItemEntity::setFromPost($data);
            
            if (isset($closetItem)){
                $user = $closetItem->getUserId();
                
                if ($user == $_SESSION['userid']){                
                    $affectedRows = $this->closetDao->removeItemFromCloset($_SESSION['userid'], $closetItem);
                    return $affectedRows > 0 ? "success" : "failed";
                }
            }
        }
                
        $this->debug("ClosetController", "removeItemFromCloset", "There was no closet item supplied to remove!");
        return false;
	}
	
	public function getAllClosets($json = true){
	   $closets = array();
	   $closetResults = $this->closetDao->getAllClosets($_SESSION['userid']);	   
	   
	   if(is_object($closetResults)){
			while($row = $closetResults->fetchRow(MDB2_FETCHMODE_ASSOC)){	
			    $closetEntity = new ClosetEntity();				
				ClosetEntity::setClosetFromDB($closetEntity, $row);				
				$closets[] = $closetEntity->toArray();				
			}			
	   }
	   
	   if ($json){	   
	       return stripslashes(json_encode($closets));	       
	   }else{
	       return $closets;
	   }
	}
	
	public function getAllClosetItems($data = null, $json = false){
	   $closetItems = array();
	   	   	   
	   $owner = isset($data['owner']) ? $data['owner'] : null;	   	   
	   
	   if (!isset($owner)){
	       $owner = $_SESSION['userid'];
	   }
	   
	   $closetItemResults = $this->closetDao->getAllClosetItems($owner, $owner == $_SESSION['userid']);    	   
	   
	   if(is_object($closetItemResults)){
			while($row = $closetItemResults->fetchRow(MDB2_FETCHMODE_ASSOC)){				    	
				$closetItemEntity = ClosetItemEntity::setFromDB($row);				
				$closetName = $closetItemEntity->getClosetName();
				
				if (!isset($closetItems[$closetName])){
				    $closetItems[$closetName] = array();        
				}
				
				$closetItems[$closetName][] = $closetItemEntity->toArray();				
			}			
	   }	 
	   
	   if ($json){	   
	       return json_encode($closetItems, true);
	   }else{
	       return $closetItems;   
	   }
	}					
}
?>