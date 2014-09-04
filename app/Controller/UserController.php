<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../email.php');
require_once(dirname(__FILE__) . '/../Model/UserEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/UserDao.php');
require_once(dirname(__FILE__) . '/Debugger.php');


class UserController extends Debugger {	
	private $userDao = null;

	public function __construct(&$mdb2){
		$this->userDao = new UserDao($mdb2);
	}	
	
	public function signUp($data){
	   global $session;
	   
	   if (isset($data)){
            $user = UserEntity::setFromPost($data);
            
            if (isset($user)){
                $password = $user->getPassword();
                $confirmPassword = $user->getConfirmPassword();
                
                if (isset($confirmPassword) && $password != $confirmPassword){
                    return "Passwords do not match!";   
                }
                
                $lastInsertId = $this->userDao->signUp($user);                
                
                if (isset($lastInsertId) && is_numeric($lastInsertId) && $lastInsertId > 0){                

                    $session->setSession($user, true);
                    $session->setCookie($data['remember']);
                    
                    EmailController::sendWelcomeMessage($user->getEmail());    
                                        
                    $user->setUserId($lastInsertId);
                    return json_encode($user->toArray());                      
                }else{
                    // does user already exist
                    $doesUserExists = $this->userDao->doesUserExist($user);
            
                    if ($doesUserExists) {                        
                        // attempt to login                               
                        return $this->login($data);
                    }             
                }
            }
        }
                
        $this->debug("UserController", "signUp", "There was no user supplied to create!");
        return "failed";
	}
	
	public function login($data){
	   global $session;
	   
	   if( isset($_SESSION['failedcount']) && $_SESSION['failedcount'] > 5){
			$this->warning("checkLogin", " failed 5 times from ip: " . $_SERVER['REMOTE_ADDR']);
			return "failed too many times";
		}
	   
	   if (isset($data)){
            $requestUser = UserEntity::setFromPost($data);            
            
            if (isset($requestUser)){                                                          
                $results = $this->userDao->getUserPassword($requestUser->getEmail());
                         
                if(is_object($results)){
        			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){        			    				    
        				$userFromDB = UserEntity::setFromDB($row);								
        				$savedPassword = $userFromDB->getPassword();	
        				
        				if (isset($savedPassword)){
        				     $user = new UserEntity();
        				     $user->setSalt($userFromDB->getSalt());
        				     UserEntity::setFromPost($data, $user);
        				     
                             $inputPassword = $user->getPassword();                                                        
                             
                             if ($inputPassword === $savedPassword){
                                 $affectedRows = $this->userDao->updateLoginCount($user);                                 
                                 $session->setSession($userFromDB);
                                 $session->setCookie($data['remember']);
                                 return json_encode($userFromDB->toArray());
                                 
                             }else{
                                 return "Incorrect credentials";                                     
                             }
                         }else{
            			     $affectedRows = $this->userDao->updateUserPassword($requestUser, null);
            			     
            			     if ($affectedRows === 1){
                                    $session->setSession($userFromDB);
                                    $session->setCookie($data['remember']);
                                    return json_encode($userFromDB->toArray());
                             }
            			}							
        			}			
        	   }                                                                                                        
            }
        }
                
        $this->debug("UserController", "login", "Something went wrong when trying to login!");
        return "failed";
	}		
	
	public function logout(){
	   global $session;
	   $session->logout();

	   return "logged out";
	}	
	
	public function updateUserInfo($data){
	   global $session;
	   
	   if (isset($data)){
            $user = UserEntity::setFromPost($data);
            
            if (isset($user)){
                $userId = $user->getUserId();
                
                if ($userId == $_SESSION['userid']){ 
                    $affectedRows = $this->userDao->updateUserInfo($user);
                    
                    if ($affectedRows === 1){
                        $session->setSession($user);
                        return "success";
                    }else{
                        return "failed";   
                    }
                }
            }
        }
                
        $this->debug("UserController", "updateUserInfo", "There was no user supplied to update!");
        return "failed";
	}
	
	public function updateUserPassword($data){
	   if (isset($data)){                                                                                  
            $results = $this->userDao->getUserPassword($_SESSION['email']);
                        
            if(is_object($results)){
    			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){        			    				    
    				$userFromDB = UserEntity::setFromDB($row);								
    				$savedPassword = $userFromDB->getPassword();	
    				
    				if (isset($savedPassword)){
    				    $user = new UserEntity();
    				    $user->setSalt($userFromDB->getSalt());
    				    $user->setUserId($_SESSION['userid']);
    				    $user->setEmail($_SESSION['email']);
    				    $user->setSecurePassword($data['p']);
    				     
    				    $oldUser = new UserEntity();
    				    $oldUser->setSalt($userFromDB->getSalt());
    				    $oldUser->setSecurePassword($data['op']);
                        $oldPassword = $oldUser->getPassword();
                            
                        if ($oldPassword === $savedPassword){
                            $affectedRows = $this->userDao->updateUserPassword($user, $oldPassword);
                            
                            return $affectedRows === 1 ? "success" : "failed";
                        }
    				}
    			}                
            }
        }
                 
        $this->debug("UserController", "updateUserInfo", "There was no user supplied to update!");
        return "failed";
	}	
	
	public function resetPassword($email){
       $newPass = uniqid();
       $newPass = substr($newPass,0, 5) . "b" . substr($newPass,5);

       $user = new UserEntity();
       $user->setEmail($email);              
       $user->setSecurePassword($newPass);
       
       $success = $this->userDao->forceUpdateUserPassword($user);
       
       if ($success > 0){
           return EmailController::sendPasswordResetEmail($email, $newPass);	           
       }
       
       return "failed";
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
        return "failed";
	}		
}


if (isset($_GET['method']) && $_GET['class'] == "user"){
    $userController = new UserController($mdb2);             
    
    switch($_GET['method']){
        case 'signup':            
            echo $userController->signUp($_POST);
            break;
        case 'login':            
            echo $userController->login($_POST);
            break;
        case 'logout':            
            echo $userController->logout();
            break;    
        case 'update':            
            echo $userController->updateUserInfo($_POST);
            break;
        case 'updatepass':            
            echo $userController->updateUserPassword($_POST);
            break;
        case 'resetpass':            
            echo $userController->resetPassword($_POST['email']);
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