<?php
require_once(dirname(__FILE__) . '/BaseEntity.php');

// JAVASCRIPT Closet
define("JS_CLOSET_ID","id");
define("JS_CLOSET_USER_ID","owner");
define("JS_CLOSET_NAME","title");
define("JS_CLOSET_PERMISSION","status");
define("JS_CLOSET_PRICE_ALERTS","alert");

class ClosetEntity {

	private $closetId;
	private $userId;
	private $name;
	private $permission;
	private $priceAlerts;
	
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
	
	public function getPriceAlerts() {
		return $this->priceAlerts;
	}
	public function setPriceAlerts($priceAlerts) {
		if(isset($priceAlerts)){
			$this->priceAlerts = $priceAlerts;
		}
	}	
	
						
	
		
	/**** ************************** ****/
		
	public static function setClosetFromDB($closetEntity, $row){         
		if (is_object($closetEntity) && get_class($closetEntity) == "ClosetEntity"){
			$closetEntity->setClosetId(BaseEntity::getDBField($row, CLOSET_ID));
			$closetEntity->setUserId(BaseEntity::getDBField($row, CLOSET_USER_ID));
			$closetEntity->setName(BaseEntity::getDBField($row, CLOSET_NAME));
			$closetEntity->setPermission(BaseEntity::getDBField($row, CLOSET_PERMISSION));
			$closetEntity->setPriceAlerts(BaseEntity::getDBField($row, CLOSET_PRICE_ALERTS));
		}
	}		
	
	public static function setClosetFromPost($row){
		$closetEntity = new ClosetEntity();
		
		$closetEntity->setClosetId(BaseEntity::getPostField($row, JS_CLOSET_ID));
		$closetEntity->setUserId(BaseEntity::getPostField($row, JS_CLOSET_USER_ID));
		$closetEntity->setName(BaseEntity::getPostField($row, JS_CLOSET_NAME));
		$closetEntity->setPermission(BaseEntity::getPostField($row, JS_CLOSET_PERMISSION));
		$closetEntity->setPriceAlerts(BaseEntity::getPostField($row, JS_CLOSET_PRICE_ALERTS));			    
				    
		return $closetEntity;
	}
	
	public function toArray(){
		$closetArray = array();	
		
		$closetArray[JS_CLOSET_ID] = $this->getClosetId();
		$closetArray[JS_CLOSET_USER_ID] = $this->getUserId();
		$closetArray[JS_CLOSET_NAME] = $this->getName();
		$closetArray[JS_CLOSET_PERMISSION] = $this->getPermission();
		$closetArray[JS_CLOSET_PRICE_ALERTS] = $this->getPriceAlerts();
		
		foreach ($closetArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($closetArray[$key]);
			}
		}
		
		return $closetArray;
	}	    		
}
?>