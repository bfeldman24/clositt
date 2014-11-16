<?php
require_once(dirname(__FILE__) . '/BaseEntity.php');

// JAVASCRIPT Closet
define("JS_USER_ID","id");
define("JS_USER_NAME","n");
define("JS_USER_EMAIL","e");
define("JS_USER_PASSWORD","p");
define("JS_USER_CONFIRM_PASSWORD","cp");
define("JS_USER_ALERT_FREQUENCY","f");

class UserEntity {

	private $userId;
	private $name;
	private $email;	
	private $password;
	private $confirmPassword;
	private $priceAlertFrequency;
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
		
	public function getPriceAlertFrequency() {
		return $this->priceAlertFrequency;
	}
	public function setPriceAlertFrequency($priceAlertFrequency) {
		if(isset($priceAlertFrequency)){
			$this->priceAlertFrequency = $priceAlertFrequency;
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
	     $firstPass = $this->getPassword();
	     
	     if (isset($firstPass)){
	           $passInfo = password_get_info($firstPass);	           	           
	           return password_hash($password, $passInfo['algo'], $passInfo['options']);
	     }     
	     
	     return password_hash($password, PASSWORD_DEFAULT);	     
	}				
			
		
	public static function setFromDB($row){         
		$userEntity = new UserEntity();	
		
		$userEntity->setUserId(BaseEntity::getDBField($row, USER_ID));				
		$userEntity->setName(BaseEntity::getDBField($row, USER_NAME));
		$userEntity->setEmail(BaseEntity::getDBField($row, USER_EMAIL));
		$userEntity->setPassword(BaseEntity::getDBField($row, USER_PASS));
		$userEntity->setPriceAlertFrequency(BaseEntity::getDBField($row, USER_ALERT_FREQUENCY));
		$userEntity->setCookie(BaseEntity::getDBField($row, USER_COOKIE));
		
		return $userEntity;
	}		
	
	public static function setFromPost($row, $userEntity = null){
	    if (!isset($userEntity)){
	       $userEntity = new UserEntity();
	    }
	   
        if (is_object($userEntity) && get_class($userEntity) == "UserEntity"){		            
            
    		$userEntity->setUserId(BaseEntity::getPostField($row, JS_USER_ID));            
    		$userEntity->setName(BaseEntity::getPostField($row, JS_USER_NAME));
    		$userEntity->setEmail(BaseEntity::getPostField($row, JS_USER_EMAIL));
    		$userEntity->setPassword($userEntity->secure(BaseEntity::getPostField($row, JS_USER_PASSWORD)));
    		$userEntity->setPriceAlertFrequency(BaseEntity::getPostField($row, JS_USER_ALERT_FREQUENCY));

    		$confirm = BaseEntity::getPostField($row, JS_USER_CONFIRM_PASSWORD);    		
    		if (isset($confirm)){
    		  $userEntity->setConfirmPassword($userEntity->secure($confirm));			
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
		$userArray[JS_USER_ALERT_FREQUENCY] = $this->getPriceAlertFrequency();
		
		foreach ($userArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($userArray[$key]);
			}
		}
		
		return $userArray;
	}	    		
}
?>