<?php
// JAVASCRIPT Closet
define("JS_CLOSET_ID","id");
define("JS_CLOSET_NAME","title");
define("JS_CLOSET_ITEM_USER_ID","owner");
define("JS_CLOSET_ITEM_SKU","item");
define("JS_CLOSET_ITEM_IMAGE","cache");

class ClosetItemEntity {

	private $closetId;
	private $closetName;
	private $userId;
	private $sku;
	private $image;
	
	public function getClosetId() {
		return $this->closetId;
	}
	public function setClosetId($closetId) {
		if(isset($closetId)){
			$this->closetId = $closetId;
		}
	}
	
	public function getClosetName() {
		return $this->closetName;
	}
	public function setClosetName($closetName) {
		if(isset($closetName)){
			$this->closetName = $closetName;
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
	
	public function getSku() {
		return $this->sku;
	}
	public function setSku($sku) {
		if(isset($sku)){
			$this->sku = $sku;
		}
	}	
	
	public function getImage() {
		return $this->image;
	}
	public function setImage($image) {
		if(isset($image)){
			$this->image = $image;
		}
	}					
	
		
	/**** ************************** ****/
		
	public static function setFromDB($row){         
		$closetItemEntity = new ClosetItemEntity();
	
		$closetItemEntity->setClosetId(stripslashes($row[CLOSET_ID]));
		$closetItemEntity->setClosetName(stripslashes($row[CLOSET_NAME]));			
		$closetItemEntity->setUserId(stripslashes($row[CLOSET_USER_ID]));
		$closetItemEntity->setSku(stripslashes($row[CLOSET_ITEM_SKU]));
		$closetItemEntity->setImage(stripslashes($row[CLOSET_ITEM_IMAGE]));	
		
		return $closetItemEntity;
	}		
	
	public static function setFromPost($row){
		$closetItemEntity = new ClosetItemEntity();
		
		$closetItemEntity->setClosetId(trim($row[JS_CLOSET_ID]));
		$closetItemEntity->setUserId(trim($row[JS_CLOSET_ITEM_USER_ID]));
		$closetItemEntity->setSku(trim($row[JS_CLOSET_ITEM_SKU]));
		$closetItemEntity->setImage(trim($row[JS_CLOSET_ITEM_IMAGE]));	    
				    
		return $closetItemEntity;
	}
	
	public function toArray(){
		$closetItemArray = array();	
		
		$closetItemArray[JS_CLOSET_ID] = $this->getClosetId();
		$closetItemArray[JS_CLOSET_NAME] = $this->getClosetName();
		$closetItemArray[JS_CLOSET_ITEM_USER_ID] = $this->getUserId();
		$closetItemArray[JS_CLOSET_ITEM_SKU] = $this->getSku();
		$closetItemArray[JS_CLOSET_ITEM_IMAGE] = $this->getImage();
		
		foreach ($closetItemArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($closetItemArray[$key]);
			}
		}
		
		return $closetItemArray;
	}	    		
}
?>