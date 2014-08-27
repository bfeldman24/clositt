<?php
// JAVASCRIPT Closet
define("JS_CLOSET_ID","id");
define("JS_CLOSET_USER_ID","owner");
define("JS_CLOSET_NAME","title");
define("JS_CLOSET_PERMISSION","status");

class ClosetEntity {

	private $closetId;
	private $userId;
	private $name;
	private $permission;
	
	public function getClosetId() {
		return $this->closetId;
	}
	public function setClosetId($closetId) {
		if(isset($closetId)){
			$this->closetId = $closetId;
		}
	}
	
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
	
	public function getPermission() {
		return $this->permission;
	}
	public function setPermission($permission) {
		if(isset($permission)){
			$this->permission = $permission;
		}
	}						
	
		
	/**** ************************** ****/
		
	public static function setClosetFromDB($closetEntity, $row){         
		if (is_object($closetEntity) && get_class($closetEntity) == "ClosetEntity"){
			$closetEntity->setClosetId(stripslashes($row[CLOSET_ID]));
			$closetEntity->setUserId(stripslashes($row[CLOSET_USER_ID]));
			$closetEntity->setName(stripslashes($row[CLOSET_NAME]));
			$closetEntity->setPermission(stripslashes($row[CLOSET_PERMISSION]));
		}
	}		
	
	public static function setClosetFromPost($row){
		$closetEntity = new ClosetEntity();
		
		$closetEntity->setClosetId(trim($row[JS_CLOSET_ID]));
		$closetEntity->setUserId(trim($row[JS_CLOSET_USER_ID]));
		$closetEntity->setName(trim($row[JS_CLOSET_NAME]));
		$closetEntity->setPermission(trim($row[JS_CLOSET_PERMISSION]));			    
				    
		return $closetEntity;
	}
	
	public function toArray(){
		$closetArray = array();	
		
		$closetArray[JS_CLOSET_ID] = $this->getClosetId();
		$closetArray[JS_CLOSET_USER_ID] = $this->getUserId();
		$closetArray[JS_CLOSET_NAME] = $this->getName();
		$closetArray[JS_CLOSET_PERMISSION] = $this->getPermission();
		
		foreach ($closetArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($closetArray[$key]);
			}
		}
		
		return $closetArray;
	}	    		
}
?>