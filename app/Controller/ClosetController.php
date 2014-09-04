<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Model/ClosetEntity.php');
require_once(dirname(__FILE__) . '/../Model/ClosetItemEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ClosetDao.php');
require_once(dirname(__FILE__) . '/Debugger.php');
require_once(dirname(__FILE__) . '/ProductController.php');

class ClosetController extends Debugger {	
	private $closetDao = null;
	private $productController = null;

	public function __construct(&$mdb2){
		$this->closetDao = new ClosetDao($mdb2);
		$this->productController = new ProductController($mdb2);
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
	
	public function addItemToCloset($data){
	   if (isset($data)){
            $closetItem = ClosetItemEntity::setFromPost($data);
            
            if (isset($closetItem)){                  
                $user = $closetItem->getUserId();
                
                if ($user == $_SESSION['userid']){                              
                    $affectedRows = $this->closetDao->addItemToCloset($_SESSION['userid'], $closetItem);
                    
                    if ($affectedRows === 1){
                        $this->productController->updateClosittCounter($closetItem->getSku());   
                    }
                    
                    return $affectedRows === 1 ? "success" : "failed";
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
                    return $affectedRows === 1 ? "success" : "failed";
                }
            }
        }
                
        $this->debug("ClosetController", "removeItemFromCloset", "There was no closet item supplied to remove!");
        return false;
	}
	
	public function getAllClosets(){
	   $closets = array();
	   $closetResults = $this->closetDao->getAllClosets($_SESSION['userid']);	   
	   
	   if(is_object($closetResults)){
			while($row = $closetResults->fetchRow(MDB2_FETCHMODE_ASSOC)){	
			    $closetEntity = new ClosetEntity();				
				ClosetEntity::setClosetFromDB($closetEntity, $row);				
				$closets[] = $closetEntity->toArray();				
			}			
	   }
	   	   
		return stripslashes(json_encode($closets));
	}
	
	public function getAllClosetItems($owner){
	   $closetItems = array();
	   
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
	   	   
		return stripslashes(json_encode($closetItems, true));
	}				
}


if (isset($_GET['method'])){
    $closetController = new ClosetController($mdb2);             
    
    switch($_GET['method']){
        case 'create':            
            echo $closetController->createNewCloset($_POST);
            break;
        case 'update':            
            echo $closetController->updateCloset($_POST);
            break;
        case 'delete':            
            echo $closetController->deleteCloset($_POST);
            break;
        case 'add':            
            echo $closetController->addItemToCloset($_POST);
            break;
        case 'remove':            
            echo $closetController->removeItemFromCloset($_POST);
            break;
        case 'get':            
            echo $closetController->getAllClosets();
            break;            
        case 'getall':
            $owner = isset($_POST['owner']) ? $_POST['owner'] : null;                
            echo $closetController->getAllClosetItems($owner);
            break;
    }            
}


?>