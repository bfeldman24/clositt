<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Model/ClosetEntity.php');
require_once(dirname(__FILE__) . '/../Model/ClosetItemEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ClosetDao.php');
require_once(dirname(__FILE__) . '/Debugger.php');
require_once(dirname(__FILE__) . '/ProductController.php');
require_once(dirname(__FILE__) . '/StatsController.php');				
require_once(dirname(__FILE__) . '/../Elastic/ElasticDao.php');

class ClosetController extends Debugger {	
	private $closetDao = null;
	private $productController = null;

	public function __construct(){
		$this->closetDao = new ClosetDao();
		$this->productController = new ProductController();		
				
		if (!isset($_SESSION['closets'])){  
		      $i = -1;
		      $likeIt = new ClosetEntity();
		      $likeIt->setClosetId($i--);
		      $likeIt->setName("Like it");
		      
		      $loveIt = new ClosetEntity();
		      $loveIt->setClosetId($i--);
		      $loveIt->setName("Love it");
		      
		      $gottaHaveIt = new ClosetEntity();
		      $gottaHaveIt->setClosetId($i--);
		      $gottaHaveIt->setName("Gotta have it!");		  
		  
              $_SESSION['closets'] = array();
              $_SESSION['closets'][$likeIt->getClosetId()] = $likeIt->toArray();
              $_SESSION['closets'][$loveIt->getClosetId()] = $loveIt->toArray();
              $_SESSION['closets'][$gottaHaveIt->getClosetId()] = $gottaHaveIt->toArray();                                                  
		}
	}
	
	public function createNewCloset($data){
        if (isset($data)){
            $closet = ClosetEntity::setClosetFromPost($data);
            
            if (isset($closet)){
                $user = $closet->getUserId();
                
                if ($_SESSION['active'] && $user == $_SESSION['userid']){ 
                    $insertedId = $this->closetDao->createNewCloset($_SESSION['userid'], $closet);
                    
                    if ($insertedId > 0){
                        return $insertedId;
                    }else{
                        // Try to find pre-existing closet
                        $results = $this->closetDao->getClosetId($_SESSION['userid'], $closet); 
                        
                        if(is_object($results)){
                			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){				    	
                				$closetId = $row[CLOSET_ID];
                	            return $closetId > 0 ? $closetId : "failed" ;
                			}
                	    }                	                    	      
                    }    
                    
                    return "failed";
                }else{                    
                    if (!isset($_SESSION['closets'])){
                        $_SESSION['closets'] = array();
                    }                    
                    
                    $closetId = -1 * (count($_SESSION['closets']) + 1);
                    $closet->setClosetId($closetId); 
                    
                    $_SESSION['closets'][$closetId] = $closet->toArray();
                    
                    StatsController::addClosetAction("Created a Guest Closet", $closetId, $closet->getName());
                    return $closetId;   
                }
            }
        }
                    
        $this->debug("ClosetController", "createNewCloset", "There was no closet supplied to create!");
        return "failed";
	}
	
	public function updateCloset($data){
	   if (isset($data)){
            $closet = ClosetEntity::setClosetFromPost($data);
            
            if (isset($closet)){
                $user = $closet->getUserId();
                
                if ($_SESSION['active'] && $user == $_SESSION['userid']){                
                    $affectedRows = $this->closetDao->updateCloset($_SESSION['userid'], $closet);
                    return $affectedRows === 1 ? "success" : "failed";
                }else{                    
                    if (isset($_SESSION['closets'])){                        
                        $closetid = $closet->getClosetId();                                                                                                                       
                        
                        $_SESSION['closets'][$closetid] = $closet->toArray();
                        
                        StatsController::addClosetAction("Updated a Guest Closet", $closetid, $closet->getName());
                        return "success";   
                    }                                                            
                }
            }
        }
                
        $this->debug("ClosetController", "updateCloset", "There was no closet supplied to update!");
        return "failed";
	}
	
	public function deleteCloset($data){
	   if (isset($data)){
            $closet = ClosetEntity::setClosetFromPost($data);
            
            if (isset($closet)){
                $closetId = $closet->getClosetId();
                $user = $closet->getUserId();
                
                if ($_SESSION['active'] && $user == $_SESSION['userid'] && isset($closetId)){                                
                    $affectedRows = $this->closetDao->deleteCloset($_SESSION['userid'], $closetId);
                    return $affectedRows === 1 ? "success" : "failed";
                }else{                    
                    if (isset($_SESSION['closets']) && isset($_SESSION['closets'][$closetId])){
                        unset($_SESSION['closets'][$closetId]);
                        
                        StatsController::addClosetAction("Removed a Guest Closet", $closetId, $closet->getName());
                        return "success";   
                    }                                                            
                }
            }
        }
                
        $this->debug("ClosetController", "deleteCloset", "There was no closet supplied to delete!");
        return "failed";
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
   
    public function createNewClosetAndAddItems($data){
        if (!isset($data['id']) || !is_numeric($data['id']) || $data['id'] < 0){ 
            $closetid = $this->createNewCloset($data);                        
            $data['id'] = $closetid;
        }
        
        return $this->addItemToCloset($data);
    }
	
	public function addItemToCloset($data){	   	   	   
	   if (isset($data)){
            $closetItem = ClosetItemEntity::setFromPost($data);
            
            if (isset($closetItem)){                  
                $user = $closetItem->getUserId();
                
                if ($_SESSION['active'] && $user == $_SESSION['userid']){                                                  
                    $affectedRows = $this->closetDao->addItemToCloset($_SESSION['userid'], $closetItem);
                    
                    if ($affectedRows === 1){
                        $sku = $closetItem->getSku();
                        $closetName = $closetItem->getClosetName();
                        $this->productController->updateClosittCounter($sku);
                        
                        try{
                            // Update elastic count                            
                            $elastic = new ElasticDao();
                            $elastic->updateClosittCount($sku);
                        }catch(Exception $e) {                              
                            $this->error("ClosetController", "addItemToCloset", "Could not update elastic clositt count: $sku");                          
                        }
                        
                        try{                            
                            $rawImage = $this->file_get_contents_curl($closetItem->getImage());                          
                            
                            if (isset($rawImage) && strlen($rawImage) > 100){
                                $this->closetDao->saveItemImage($sku, $rawImage);
                            }
                        }catch(Exception $e) {  
                            $img = $closetItem->getImage();
                            $sku = $closetItem->getSku();
                            $this->error("ClosetController", "addItemToCloset", "Could not cache ($sku) image: $img");                          
                        }
                        
                        // remove item from unsaved session
                        if (isset($_SESSION['closetItems']) && 
                            isset($_SESSION['closetItems'][$closetName]) && 
                            isset($_SESSION['closetItems'][$closetName][$sku])){
                        
                                unset($_SESSION['closetItems'][$closetName][$sku]);   
                        }
                        
                        return "success";
                    }
                    
                    return "failed";
                }else{                    
                    $closetName = $closetItem->getClosetName();                    
                    $itemId = $closetItem->getSku();
                    
                    if (!isset($_SESSION['closetItems'])){
                        $_SESSION['closetItems'] = array();
                    }                                        
                    
                    if (!isset($_SESSION['closetItems'][$closetName])){
                        $_SESSION['closetItems'][$closetName] = array();
                    }                                                              
                    
                    $_SESSION['closetItems'][$closetName][$itemId] = $closetItem->toArray();
                    
                    StatsController::add("Added Item to a Guest Closet", null, $closetName, $itemId, $closetItem->getClosetId());
                    return "success";
                }
            }
        }
                
        $this->debug("ClosetController", "addItemToCloset", "There was no closet item supplied to add!");
        return "failed";
	}

    public function addCustomItemToCloset($data){	   	   	   
	   if (isset($data)){  	                                                     
            
            if ($data['userid']){              
                
                // Make urls absolute
                $img = null;
                $link = null; 
                $page = $data['page'];               
                
                // Update image src
                if (strpos($data['src'], "/") === 0 && strpos($data['src'], "//") !== 0){
                   	$tempLink = substr($data['page'], 0, strpos($data['page'], "/", 8));
                   	$img = $tempLink . $data['src'];                
                }else if (strpos($data['src'] , "http") === 0 || strpos($data['src'] , "//") === 0 || strpos($data['src'] , "www") === 0){
                   	$img = $data['src'];
                }else{	
                	$tempLink = substr($data['page'], 0, strrpos($data['page'], "/"));
                   	$img = $tempLink . "/" . $data['src'];
                } 
                
                // Update link
                if (isset($data['link'])){
                    if (strpos($data['link'], "/") === 0){
                       	$tempLink = substr($data['page'], 0, strpos($data['page'], "/", 8));
                       	$link = $tempLink . $data['link'];
                    }else if (strpos($data['link'] , "http") === 0 || strpos($data['link'] , "//") === 0 || strpos($data['link'] , "www") === 0){
                   	    $link = $data['link'];
                    }else{	
                    	$tempLink = substr($data['page'], 0, strrpos($data['page'], "/"));
                        $link = $tempLink . "/" . $data['link'];
                    }
                }
                
                // replace #'s
                $img = $img ? str_replace("~p~","#",$img) : null;
                $link = $link ? str_replace("~p~","#",$link) : null;
                $page = $page ? str_replace("~p~","#",$page) : null;
                
                // replace &'s
                $img = $img ? str_replace("~a~","&",$img) : null;
                $link = $link ? str_replace("~a~","&",$link) : null;
                $page = $page ? str_replace("~a~","&",$page) : null;
                
                // replace ?'s
                $img = $img ? str_replace("~q~","?",$img) : null;
                $link = $link ? str_replace("~q~","?",$link) : null;
                $page = $page ? str_replace("~q~","?",$page) : null;
                                
                // TODO Check if product exists
                
                try{
                    $rawImage = $this->file_get_contents_curl($img);                            
                }catch(Exception $e) {                     
                    $rawImage = null;
                    $this->error("ClosetController", "addCustomItemToCloset", "Could not cache image: $img");                          
                }       
                
                                         
                $affectedRows = $this->closetDao->addCustomItemToCloset($data['userid'], $data['closet'], $img, $rawImage, $link, $page);
                
                if ($affectedRows === 1 || $affectedRows === 2){                                                                                                       
                    return file_get_contents(dirname(__FILE__) . '/../../www/css/images/success.png');                
                }                
            }
        }
                        
        return file_get_contents(dirname(__FILE__) . '/../../www/css/images/error.png');    
	}		
	
	public function removeItemFromCloset($data){
	   if (isset($data)){
            $closetItem = ClosetItemEntity::setFromPost($data);
            
            if (isset($closetItem)){
                $user = $closetItem->getUserId();
                
                if ($_SESSION['active'] && $user == $_SESSION['userid']){                
                    $affectedRows = $this->closetDao->removeItemFromCloset($_SESSION['userid'], $closetItem);
                    return $affectedRows > 0 ? "success" : "failed";
                }else{
                    $closetName = $closetItem->getClosetName();
                    $itemId = $closetItem->getSku();
                    
                    if (isset($_SESSION['closetItems']) && 
                        isset($_SESSION['closetItems'][$closetName]) && 
                        isset($_SESSION['closetItems'][$closetName][$itemId])){                     
                            
                            unset($_SESSION['closetItems'][$closetName][$itemId]);
                            StatsController::add("Removed Item from a Guest Closet", null, $closetName, $itemId, $closetItem->getClosetId());
                            
                            return "success";                     
                    }
                    
                    return "failed";   
                }
            }
        }
                
        $this->debug("ClosetController", "removeItemFromCloset", "There was no closet item supplied to remove!");
        return "failed";
	}
	
	public function getAllClosets($json = true, $id = false){
	   $closets = array();
	   
	   if ($_SESSION['active'] || $id){
	       $id = $id ? $id : $_SESSION['userid'];
    	   $closetResults = $this->closetDao->getAllClosets($id);	   
    	   
    	   if(is_object($closetResults)){
    			while($row = $closetResults->fetchRow(MDB2_FETCHMODE_ASSOC)){	
    			    $closetEntity = new ClosetEntity();				
    				ClosetEntity::setClosetFromDB($closetEntity, $row);				
    				$closets[] = $closetEntity->toArray();				
    			}			
    	   }
	   }else if(isset($_SESSION['closets'])){
	       $closets = array_values($_SESSION['closets']);
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
	   	   
	   if (isset($owner) && is_numeric($owner)){
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
	   }else{
	       $this->getAllSessionClosetItems($closetItems, true);
	   }
	   
	   if ($json){	   
	       return json_encode($closetItems);
	   }else{
	       return $closetItems;   
	   }
	}
	
	public function getAllSessionClosetItems(&$closetItems = null, $getEmptyClosets = false){
	   if (!isset($closetItems)){
	       $closetItems = array();
	   }	   
	   
	   if(isset($_SESSION['closetItems'])){	       	       	       	       	      	       
	       $skus = array(); 
	       foreach ($_SESSION['closetItems'] as $closetName => $closetItemEntities){
                $skus = array_merge($skus, array_keys($closetItemEntities)); 		
	       }	       
	       
            $products = $this->productController->getMultipleProducts($skus, true);                       
            
            foreach ($_SESSION['closetItems'] as $closetName => $closetItemEntities){                            
                if ($closetItemEntities != null && count($closetItemEntities) > 0){
                    $closetItems[$closetName] = array();
                    
                    foreach ($closetItemEntities as $sku => $item){
    			         if (isset($products[$sku])){
    			             $_SESSION['closetItems'][$closetName][$sku]['reference'] = $products[$sku]->toArray();
    			             $closetItems[$closetName][] = $_SESSION['closetItems'][$closetName][$sku];
    			         }
                    }
                }
	       }	       
       }
       
       if(isset($_SESSION['closets']) && $getEmptyClosets){
	       foreach ($_SESSION['closets'] as $defaultClosetId => $defaultCloset){
	           $closetName = $defaultCloset['title'];
	           
	           if (!isset($closetItems[$closetName])){
	               $item = new ClosetItemEntity();
	               $item->setClosetId($defaultClosetId);
	               $item->setClosetName($closetName);
	               
	               $closetItems[$closetName] = array();
	               $closetItems[$closetName][] = $item->toArray();
	           }
	       }
       }       
       
	   return $closetItems;   
	}
}
?>
