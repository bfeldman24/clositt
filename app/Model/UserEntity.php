<?php
// JAVASCRIPT Closet
define("JS_USER_ID","id");
define("JS_USER_NAME","n");
define("JS_USER_EMAIL","t");
define("JS_USER_PASSWORD","p");
define("JS_USER_CONFIRM_PASSWORD","cp");

class UserEntity {

	private $userId;
	private $name;
	private $email;	
	private $password;
	private $confirmPassword;
	private $salt;
	
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
			$this->email = $email;
		}
	}
	
	public function getPassword() {
		return $this->password;
	}
	public function setPassword($password) {
		if(isset($password)){
			$this->password = $this->secure($password);
		}
	}
	
	public function getConfirmPassword() {
		return $this->confirmPassword;
	}
	public function setConfirmPassword($confirmPassword) {
		if(isset($confirmPassword)){
			$this->confirmPassword = $this->secure($confirmPassword);
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
	
	private function secure($password){
	     $delimiter = "!^}";
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
		$userEntity->setUserId(stripslashes($row[USER_ID]));
		$userEntity->setName(stripslashes($row[USER_NAME]));
		$userEntity->setEmail(stripslashes($row[USER_EMAIL]));
		$userEntity->setSalt(stripslashes($row[USER_SALT]));
		$userEntity->setPassword(stripslashes($row[USER_PASS]));
		
		return $userEntity;
	}		
	
	public static function setFromPost($row){
		$userEntity = new UserEntity();
		
		$userEntity->setUserId(trim($row[JS_USER_ID]));
		$userEntity->setName(trim($row[JS_USER_NAME]));
		$userEntity->setEmail(trim($row[JS_USER_EMAIL]));
		$userEntity->setPassword(trim($row[JS_USER_PASSWORD]));
		$userEntity->setConfirmPassword(trim($row[JS_USER_CONFIRM_PASSWORD]));			    
				    
		return $userEntity;
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