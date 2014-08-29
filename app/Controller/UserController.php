<?php
require_once(dirname(__FILE__) . '/../globals.php');
require_once(dirname(__FILE__) . '/../Database/DataAccess/check-login.php');
require_once(dirname(__FILE__) . '/../Model/UserEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/UserDao.php');
require_once(dirname(__FILE__) . '/Debugger.php');


class UserController extends Debugger {	
	private $userDao = null;

	public function __construct(&$mdb2){
		$this->userDao = new UserDao($mdb2);
	}	
	
	public function signUp($data){
	   if (isset($data)){
            $user = UserEntity::setFromPost($data);
            
            if (isset($user)){
                $password = $user->getPassword();
                $confirmPassword = $user->getConfirmPassword();
                
                if ($password != $confirmPassword){
                    return "Passwords do not match!";   
                }
                
                $insertedRows = $this->userDao->signUp($user);                
                
                if (isset($insertedRows) && $insertedRows === 1){
                    // TODO: LOGIN   
                }
            }
        }
                
        $this->debug("UserController", "signUp", "There was no user supplied to create!");
        return false;
	}
	
	public function login($data){
	   if (isset($data)){
            $user = UserEntity::setFromPost($data);
            
            if (isset($user)){
                  $this->userDao->updateUserPassword($user);              
                
                  // TODO: uncomment once we login via php
//                $savedPassword = $this->userDao->getUserPassword($user);
//                                    
//                if (isset($savedPassword) && $savedPassword !== false){
//                    $inputPassword = $user->getPassword();                           
//                    return $inputPassword == $savedPassword;
//                }
            }
        }
                
        $this->debug("UserController", "login", "Something went wrong when trying to login!");
        return false;
	}			
	
	public function updateUserInfo($data){
	   if (isset($data)){
            $user = UserEntity::setFromPost($data);
            
            if (isset($user)){
                $userId = $user->getUserId();
                
                if ($userId == $_SESSION['userid']){ 
                    return $this->userDao->updateUserInfo($user);
                }
            }
        }
                
        $this->debug("UserController", "updateUserInfo", "There was no user supplied to update!");
        return false;
	}	
	
	public function getUserInfo(){ 
        $userResult = $this->userDao->getUserInfo($_SESSION['userid']);
        $userEntity = array();
        
        if(is_object($userResult)){
			if($row = $userResult->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
				$userEntity = UserEntity::setFromDB($row);								
			}			
	   }
	   	   
		return stripslashes(json_encode($userEntity->toArray()));
	}	
	
	public function getUserName($data){
	   if (isset($data)){
            $user = UserEntity::setFromPost($data);
            
            if (isset($user)){
                $userId = $user->getUserId();                
                
                $userResult = $this->userDao->getUserInfo($userId);
                $userName = null;
                
                if(is_object($userResult)){
        			if($row = $userResult->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
        				$userName = $row[USER_NAME];								
        			}			
        	   }
        	   	   
        		return stripslashes(json_encode(array("name" => $userName)));
                                
            }
        }
                
        $this->debug("UserController", "getUserName", "There was no user supplied to update!");
        return false;
	}		
}


if (isset($_GET['method'])){
    $userController = new UserController($mdb2);             
    
    switch($_GET['method']){
        case 'signup':            
            echo $userController->signUp($_POST);
            break;
        case 'login':            
            echo $userController->login($_POST);
            break;
        case 'update':            
            echo $userController->updateUserInfo($_POST);
            break;
        case 'get':            
            echo $userController->getUserInfo();
            break;
        case 'name':            
            echo $userController->getUserName($_POST);
            break;
    }            
}


?>