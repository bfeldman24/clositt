<?php
// JAVASCRIPT Closet
define("JS_USER_ID","id");
define("JS_USER_NAME","n");
define("JS_USER_EMAIL","e");
define("JS_USER_PASSWORD","p");
define("JS_USER_CONFIRM_PASSWORD","cp");

class UserEntity {

	private $userId;
	private $name;
	private $email;	
	private $password;
	private $confirmPassword;
	private $salt;
	private $cookie;
	
	public function getUserId() {
		return $this->userId;
	}
	public function setUserId($userId) {
		if(isset($userId)){
			$this->userId = $userId;
		}
	}
	
	public function getName() {
		return $this->name;
	}
	public function setName($name) {
		if(isset($name)){
			$this->name = $name;
		}
	}	
	
	public function getEmail() {
		return $this->email;
	}
	public function setEmail($email) {
		if(isset($email)){
			$this->email = strtolower($email);
		}
	}
	
	public function getPassword() {
		return $this->password;
	}
	public function setPassword($password) {
		if(isset($password)){
			$this->password = $password;
		}
	}
	
	public function getConfirmPassword() {
		return $this->confirmPassword;
	}
	public function setConfirmPassword($confirmPassword) {
		if(isset($confirmPassword)){
			$this->confirmPassword = $confirmPassword;
		}
	}	
	
	public function getSalt() {
		return $this->salt;
	}
	public function setSalt($salt) {
		if(isset($salt)){
			$this->salt = $salt;
		}
	}	
	
	public function getCookie() {
		return $this->cookie;
	}
	public function setCookie($cookie) {
		if(isset($cookie)){
			$this->cookie = $cookie;
		}
	}
	
	public function setSecurePassword($password){
	   $this->setPassword($this->secure($password));  
	}		
	
	private function secure($password){
	     $delimiter = "!^}";	     
	     
	     if (!isset($password)){
	        return null; 
	     }
	     
	     $salt = $this->getSalt();
	     
	     if (!isset($salt)){
    	     // Generate random salt
    	     $salt = uniqid();
    	     $this->setSalt($salt);	     
	     }
	     
	     return md5($salt . $delimiter . $password);
	}				
			
		
	public static function setFromDB($row){         
		$userEntity = new UserEntity();	
		
		if(isset($row[USER_ID])){	
		  $userEntity->setUserId(stripslashes($row[USER_ID]));
		}
		
		if(isset($row[USER_NAME])){
		  $userEntity->setName(stripslashes($row[USER_NAME]));
		}
		
		if(isset($row[USER_EMAIL])){
		  $userEntity->setEmail(stripslashes($row[USER_EMAIL]));
		}
		
		if(isset($row[USER_SALT])){
		  $userEntity->setSalt(stripslashes($row[USER_SALT]));
		}
		
		if(isset($row[USER_PASS])){
		  $userEntity->setPassword(stripslashes($row[USER_PASS]));
		}
		
		if(isset($row[USER_COOKIE])){
		  $userEntity->setCookie(stripslashes($row[USER_COOKIE]));
		}		
		
		return $userEntity;
	}		
	
	public static function setFromPost($row, $userEntity = null){
	    if (!isset($userEntity)){
	       $userEntity = new UserEntity();
	    }
	   
        if (is_object($userEntity) && get_class($userEntity) == "UserEntity"){		            
            
            if (isset($row[JS_USER_ID])){
    		  $userEntity->setUserId(trim($row[JS_USER_ID]));
            }
            
            if (isset($row[JS_USER_NAME])){
    		  $userEntity->setName(trim($row[JS_USER_NAME]));
            }
            
            if (isset($row[JS_USER_EMAIL])){
    		  $userEntity->setEmail(trim($row[JS_USER_EMAIL]));
            }
            
            if (isset($row[JS_USER_PASSWORD])){
    		  $userEntity->setPassword($userEntity->secure(trim($row[JS_USER_PASSWORD])));
            }
            
            if (isset($row[JS_USER_CONFIRM_PASSWORD])){
    		  $userEntity->setConfirmPassword($userEntity->secure(trim($row[JS_USER_CONFIRM_PASSWORD])));			
            }
    		
    		return $userEntity;
        }    
				    
		return null;
	}
	
	public function toArray(){
		$userArray = array();	
		
		$userArray[JS_USER_ID] = $this->getUserId();
		$userArray[JS_USER_NAME] = $this->getName();
		$userArray[JS_USER_EMAIL] = $this->getEmail();
		
		foreach ($userArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($userArray[$key]);
			}
		}
		
		return $userArray;
	}	    		
}
?>