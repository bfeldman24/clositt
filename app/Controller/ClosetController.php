<?php
require_once(dirname(__FILE__) . '/../globals.php');
require_once(dirname(__FILE__) . '/../Database/DataAccess/check-login.php');
require_once(dirname(__FILE__) . '/../Model/ClosetEntity.php');
require_once(dirname(__FILE__) . '/../Model/ClosetItemEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ClosetDao.php');
require_once(dirname(__FILE__) . '/Debugger.php');


class ClosetController extends Debugger {	
	private $closetDao = null;

	public function __construct(&$mdb2){
		$this->closetDao = new ClosetDao($mdb2);
	}
	
	public function createNewCloset($data){
        if (isset($data)){
            $closet = ClosetEntity::setClosetFromPost($data);
            
            if (isset($closet)){
                $user = $closet->getUserId();
                
                if ($user == $_SESSION['userid']){ 
                    return $this->closetDao->createNewCloset($_SESSION['userid'], $closet);
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
                    return $this->closetDao->updateCloset($_SESSION['userid'], $closet);
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
                    return $this->closetDao->deleteCloset($_SESSION['userid'], $closetId);
                }
            }
        }
                
        $this->debug("ClosetController", "deleteCloset", "There was no closet supplied to delete!");
        return false;
	}
	
	public function addItemToCloset($data){
	   if (isset($data)){
            $closetItem = ClosetItemEntity::setClosetItemFromPost($data);
            
            if (isset($closetItem)){                  
                $user = $closetItem->getUserId();
                
                if ($user == $_SESSION['userid']){                              
                    return $this->closetDao->addItemToCloset($_SESSION['userid'], $closetItem);
                }
            }
        }
                
        $this->debug("ClosetController", "addItemToCloset", "There was no closet item supplied to add!");
        return false;
	}
	
	public function removeItemFromCloset($data){
	   if (isset($data)){
            $closetItem = ClosetItemEntity::setClosetItemFromPost($data);
            
            if (isset($closetItem)){
                $user = $closetItem->getUserId();
                
                if ($user == $_SESSION['userid']){                
                    return $this->closetDao->removeItemFromCloset($_SESSION['userid'], $closetItem);
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
			    $closetItemEntity = new ClosetItemEntity();				
				ClosetItemEntity::setClosetItemFromDB($closetItemEntity, $row);				
				$closetItems[] = $closetItemEntity->toArray();				
			}			
	   }	 
	   	   
		return stripslashes(json_encode($closetItems));
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
            echo $closetController->getAllClosetItems($_POST['owner']);
            break;
    }            
}


?>