<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../email.php');
require_once(dirname(__FILE__) . '/../Model/UserEntity.php');
require_once(dirname(__FILE__) . '/../Database/Dao/UserDao.php');
require_once(dirname(__FILE__) . '/Debugger.php');
require_once(dirname(__FILE__) . '/ClosetController.php');


class UserController extends Debugger {	
	private $userDao = null;

	public function __construct(){
		$this->userDao = new UserDao();
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

                    $user->setUserId($lastInsertId);
                    $session->setSession($user, true);
                    $session->setCookie($data['remember']);
                    
                    EmailController::sendWelcomeMessage($user->getEmail());    
                    
                    // Create default Closet   
                    $defaultCloset = array();
                    $defaultCloset['id'] = -1;
                    $defaultCloset['title'] = "80's are back!";
                    $defaultCloset['owner'] = $lastInsertId;
                    $defaultCloset['item'] = 'sh372747380';
                    $defaultCloset['cache'] = '//cdn.shopify.com/s/files/1/0234/5963/products/2014-10-22_21.27.14_large.jpg?v=1414780995';                    
                    
                    $closetController = new ClosetController();
                    $closetController->createNewClosetAndAddItems($defaultCloset);
                    
                    $defaultCloset['item'] = 'sh369594921';
                    $defaultCloset['cache'] = '//cdn.shopify.com/s/files/1/0234/5963/products/IMG_0125_large.jpg?v=1412793706';
                    $closetController->createNewClosetAndAddItems($defaultCloset);
                    
                    $defaultCloset['item'] = 'sh378130880';
                    $defaultCloset['cache'] = '//cdn.shopify.com/s/files/1/0234/5963/products/IMG_9480_large.jpeg?v=1414463803';
                    $closetController->createNewClosetAndAddItems($defaultCloset);
                                                            
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
        				$savedHashedPassword = $userFromDB->getPassword();	
        				$inputedPassword = $data['p'];
        				
        				if (isset($savedHashedPassword)){
        				    
                             if (isset($inputedPassword) && password_verify($inputedPassword, $savedHashedPassword)){
                                 $affectedRows = $this->userDao->updateLoginCount($requestUser);                                 
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
	   
	    // Log stats
		require_once(dirname(__FILE__) . '/StatsController.php');		
		StatsController::add('Logged Out');

	   return "logged out";
	}	
	
	public function updateUserInfo($data){
	   global $session;
	   $results = array();
	   
	   if (isset($data)){
            $user = UserEntity::setFromPost($data);
            
            if (isset($user)){
                $userId = $user->getUserId();
                                                
                if ($userId == $_SESSION['userid']){ 
                    $affectedRows = 0;
                    
                    // Update user password                    
                    if (!empty($data['op']) && !empty($data['p'])){
                        $results['p'] = $this->updateUserPassword($data);                        
                    }
                    
                    // Update user name and price alerts                      
                    if (!empty($data['n']) || !empty($data['f'])){
                        $affectedRows = $this->userDao->updateUserInfo($user);
                        $results['u'] = $affectedRows === 1 ? "success" : "failed";
                        
                        if ($results['u'] == "success"){
                            $session->setSession($user);
                        }
                    }                    
                    
                    return json_encode($results);
                }
            }
        }
                
        $this->debug("UserController", "updateUserInfo", "There was no user supplied to update!");
        $results['f'] = "error";
        return json_encode($results);
	}
	
	public function updateUserPassword($data){
	   if (isset($data) && isset($data['id'])){
	        $userId = $data['id'];
	        
	        if ($userId == $_SESSION['userid']){	                                                                                            
                $results = $this->userDao->getUserPassword($_SESSION['email']);
                            
                if(is_object($results)){
        			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){        			    				    
        				$userFromDB = UserEntity::setFromDB($row);								
        				$savedHashedPassword = $userFromDB->getPassword();	
        				
        				if (isset($savedHashedPassword)){    				        				     
                            $oldPassword = $data['op'];                        
                                                        
                            if (password_verify($oldPassword, $savedHashedPassword)){
                                $user = new UserEntity();
            				    $user->setUserId($_SESSION['userid']);
            				    $user->setEmail($_SESSION['email']);
            				    $user->setSecurePassword($data['p']);
                                
                                $affectedRows = $this->userDao->updateUserPassword($user, $savedHashedPassword);
                                
                                return $affectedRows === 1 ? "success" : "failed";
                            }
        				}
        			}                
                }
	        }
        }
                 
        $this->debug("UserController", "updateUserInfo", "There was no user supplied to update!");
        return "error";
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
	
	public function getAllUserInfo(){ 
        $userResult = $this->userDao->getAllUserInfo();
        $users = array();
        
        if(is_object($userResult)){
			while($row = $userResult->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
				$users[] = $row;
			}			
	   }
	   	   
	   return $users;
	}	
	
	public function getUserName($data, $json = true){
	    if (isset($data)){
	        if (is_array($data)){
                $user = UserEntity::setFromPost($data);
                
                if (isset($user)){
                    $userId = $user->getUserId();                
                }

	        }else if (is_numeric($data)){
	            $userId = $data;
	        }
	                    
            if (isset($userId)){             
                
                $userResult = $this->userDao->getUserInfo($userId);
                $userName = null;
                
                if(is_object($userResult)){
        			if($row = $userResult->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
        				$userName = $row[USER_NAME];								
        			}			
        	   }
        	   	   
        	   if ($json){
        		  return stripslashes(json_encode(array("name" => $userName)));
        	   }else{
        	      return $userName;
        	   }                                
            }
        }
                
        $this->debug("UserController", "getUserName", "There was no user supplied to update!");
        return "failed";
	}		
}
?>