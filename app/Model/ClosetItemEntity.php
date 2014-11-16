<?php
require_once(dirname(__FILE__) . '/BaseEntity.php');
require_once(dirname(__FILE__) . '/ProductEntity.php');

// JAVASCRIPT Closet
define("JS_CLOSET_ITEM_ID","id");
define("JS_CLOSET_ITEM_NAME","title");
define("JS_CLOSET_ITEM_PRICE_ALERTS","alert");
define("JS_CLOSET_ITEM_USER_ID","owner");
define("JS_CLOSET_ITEM_SKU","item");
define("JS_CLOSET_ITEM_IMAGE","cache");
define("JS_CLOSET_ITEM_PRODUCT","reference");

class ClosetItemEntity {

    // Closet reference
	private $closetId;
	private $closetName;
	private $priceAlerts;
	
	private $userId;
	private $sku;
	private $image;
	private $product;
	
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
	
	public function getPriceAlerts() {
		return $this->priceAlerts;
	}
	public function setPriceAlerts($priceAlerts) {
		if(isset($priceAlerts)){
			$this->priceAlerts = $priceAlerts;
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
	
	public function getProduct() {
		return $this->product;
	}
	public function setProduct($product) {
		if(isset($product)){
			$this->product = $product;
		}
	}					
	
		
	/**** ************************** ****/
		
	public static function setFromDB($row){         
		$closetItemEntity = new ClosetItemEntity();
	
		$closetItemEntity->setClosetId(BaseEntity::getDBField($row, CLOSET_ID));
		$closetItemEntity->setClosetName(BaseEntity::getDBField($row, CLOSET_NAME));			
		$closetItemEntity->setPriceAlerts(BaseEntity::getDBField($row, CLOSET_PRICE_ALERTS));			
		$closetItemEntity->setUserId(BaseEntity::getDBField($row, CLOSET_USER_ID));
		$closetItemEntity->setSku(BaseEntity::getDBField($row, CLOSET_ITEM_SKU));
		$closetItemEntity->setImage(BaseEntity::getDBField($row, CLOSET_ITEM_IMAGE));	
		
		$product = new ProductEntity();
		ProductEntity::setProductFromDB($product, $row);		
		$closetItemEntity->setProduct($product);
		
		return $closetItemEntity;
	}		
	
	public static function setFromPost($row){
		$closetItemEntity = new ClosetItemEntity();
		
		$closetItemEntity->setClosetId(BaseEntity::getPostField($row, JS_CLOSET_ITEM_ID));
		$closetItemEntity->setClosetName(BaseEntity::getPostField($row, JS_CLOSET_ITEM_NAME));			
		$closetItemEntity->setPriceAlerts(BaseEntity::getPostField($row, JS_CLOSET_ITEM_PRICE_ALERTS));			
		$closetItemEntity->setUserId(BaseEntity::getPostField($row, JS_CLOSET_ITEM_USER_ID));
		$closetItemEntity->setSku(BaseEntity::getPostField($row, JS_CLOSET_ITEM_SKU));
		$closetItemEntity->setImage(BaseEntity::getPostField($row, JS_CLOSET_ITEM_IMAGE));	    
				    
		return $closetItemEntity;
	}
	
	public function toArray(){
		$closetItemArray = array();	
		
		$closetItemArray[JS_CLOSET_ITEM_ID] = $this->getClosetId();
		$closetItemArray[JS_CLOSET_ITEM_NAME] = $this->getClosetName();
		$closetItemArray[JS_CLOSET_ITEM_PRICE_ALERTS] = $this->getPriceAlerts();
		$closetItemArray[JS_CLOSET_ITEM_USER_ID] = $this->getUserId();
		$closetItemArray[JS_CLOSET_ITEM_SKU] = $this->getSku();
		$closetItemArray[JS_CLOSET_ITEM_IMAGE] = $this->getImage();
		
		$product = $this->getProduct();		
		if (isset($product)){
		  $closetItemArray[JS_CLOSET_ITEM_PRODUCT] = $product->toArray();
		}
		
		foreach ($closetItemArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($closetItemArray[$key]);
			}
		}
		
		return $closetItemArray;
	}	    		
}
?>