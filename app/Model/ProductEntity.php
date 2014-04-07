<?php
// JAVASCRIPT Products
define("JS_PRODUCT_SKU","s");
define("JS_PRODUCT_STORE","o");
define("JS_PRODUCT_CUSTOMER","u");
define("JS_PRODUCT_CATEGORY","a");
define("JS_PRODUCT_NAME","n");
define("JS_PRODUCT_LINK","l");
define("JS_PRODUCT_IMAGE","i");
define("JS_PRODUCT_PRICE","p");
define("JS_PRODUCT_COMMENT_COUNT","rc");
define("JS_PRODUCT_CLOSITT_COUNT","cc");
define("JS_PRODUCT_SHORT_LINK", "sl");

class ProductEntity {

	private $id; 
	private $store;
	private $customer;
	private $category;
	private $name;
	private $link;
	private $image;
	private $price;
	private $commentCount;		
	private $closittCount;
	private $shortLink;
	
	public function getId() {
		return $this->id;
	}
	public function setId($id) {
		if(isset($id)){
			$this->id = $id;
		}
	}
	
	public function getStore() {
		return $this->store;
	}
	public function setStore($store) {
		if(isset($store)){
			$this->store = $store;
		}
	}
	
	public function getCustomer() {
		return $this->customer;
	}
	public function setCustomer($customer) {
		if(isset($customer)){
			$this->customer = $customer;
		}
	}
	
	public function getCategory() {
		return $this->category;
	}
	public function setCategory($category) {
		if(isset($category)){
			$this->category = $category;
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
	
	public function getLink() {
		return $this->link;
	}
	public function setLink($link) {
		if(isset($link)){
			$this->link = $link;
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
	
	public function getPrice() {
		return $this->price;
	}
	public function setPrice($price) {
		if(isset($price)){
			$this->price = $price;
		}
	}
	
	public function getCommentCount() {
		return $this->commentCount;
	}
	public function setCommentCount($commentCount) {
		if(isset($commentCount)){
			$this->commentCount = $commentCount;
		}
	}
	
	public function getClosittCount() {
		return $this->closittCount;
	}
	public function setClosittCount($closittCount) {
		if(isset($closittCount)){
			$this->closittCount = $closittCount;
		}
	}
	
	public function getShortLink() {
		return $this->shortLink;
	}
	public function setShortLink($shortLink) {
		if(isset($shortLink)){
			$this->shortLink = $shortLink;
		}
	}		
	
		
	/**** ************************** ****/
		
	public static function setProductFromDB($ProductEntity, $row){         
		if (is_object($ProductEntity) && get_class($ProductEntity) == "ProductEntity"){
			$ProductEntity->setId(stripslashes($row[PRODUCT_SKU]));
			$ProductEntity->setStore(stripslashes($row[PRODUCT_STORE]));
			$ProductEntity->setCustomer(stripslashes($row[PRODUCT_CUSTOMER]));
			$ProductEntity->setCategory(stripslashes($row[PRODUCT_CATEGORY]));
			$ProductEntity->setName(stripslashes($row[PRODUCT_NAME]));
			$ProductEntity->setLink(stripslashes($row[PRODUCT_LINK]));
			$ProductEntity->setImage(stripslashes($row[PRODUCT_IMAGE]));
			$ProductEntity->setPrice(stripslashes($row[PRODUCT_PRICE]));
			$ProductEntity->setCommentCount(stripslashes($row[PRODUCT_COMMENT_COUNT]));
			$ProductEntity->setClosittCount(stripslashes($row[PRODUCT_CLOSITT_COUNT]));	
			$ProductEntity->setShortLink(stripslashes($row[PRODUCT_SHORT_LINK]));	
		}
	}		
	
	public static function setProductFromPost($row){
		$ProductEntity = new ProductEntity();
		
		$ProductEntity->setId(trim($row[JS_PRODUCT_SKU]));
		$ProductEntity->setStore(trim($row[JS_PRODUCT_STORE]));
		$ProductEntity->setCustomer(trim($row[JS_PRODUCT_CUSTOMER]));
		$ProductEntity->setCategory(trim($row[JS_PRODUCT_CATEGORY]));
		$ProductEntity->setName(trim($row[JS_PRODUCT_NAME]));
		$ProductEntity->setLink(trim($row[JS_PRODUCT_LINK]));
		$ProductEntity->setImage(trim($row[JS_PRODUCT_IMAGE]));
		$ProductEntity->setPrice(trim($row[JS_PRODUCT_PRICE]));
		$ProductEntity->setCommentCount(trim($row[JS_PRODUCT_COMMENT_COUNT]));
		$ProductEntity->setClosittCount(trim($row[JS_PRODUCT_CLOSITT_COUNT]));	
		$ProductEntity->setShortLink(trim($row[JS_PRODUCT_SHORT_LINK]));
				    
		return $ProductEntity;
	}
	
	public function toArray(){
		$ProductArray = array();	
		
		$ProductArray[JS_PRODUCT_SKU] = $this->getId();
		$ProductArray[JS_PRODUCT_STORE] = $this->getStore();
		$ProductArray[JS_PRODUCT_CUSTOMER] = $this->getCustomer();
		$ProductArray[JS_PRODUCT_CATEGORY] = $this->getCategory();
		$ProductArray[JS_PRODUCT_NAME] = $this->getName();
		$ProductArray[JS_PRODUCT_LINK] = $this->getLink();
		$ProductArray[JS_PRODUCT_IMAGE] = $this->getImage();
		$ProductArray[JS_PRODUCT_PRICE] = $this->getPrice();
		$ProductArray[JS_PRODUCT_COMMENT_COUNT] = $this->getCommentCount();
		$ProductArray[JS_PRODUCT_CLOSITT_COUNT] = $this->getClosittCount();	
		$ProductArray[JS_PRODUCT_SHORT_LINK] = $this->getShortLink();
		
		foreach ($ProductArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($ProductArray[$key]);
			}
		}
		
		return $ProductArray;
	}
	
	public static function setProductFromElastic($ProductEntity, $row){
		if (is_object($ProductEntity) && get_class($ProductEntity) == "ProductEntity"){

			//TODO store names as consts
			$ProductEntity->setId(stripslashes($row['sku']));
			$ProductEntity->setStore(stripslashes($row['store']));
			$ProductEntity->setCustomer(stripslashes($row['customer']));
			$ProductEntity->setCategory(stripslashes($row['category']));
			$ProductEntity->setName(stripslashes($row['name']));
			$ProductEntity->setLink(stripslashes($row['link']));
			$ProductEntity->setImage(stripslashes($row['image']));
			$ProductEntity->setPrice(stripslashes($row['price']));
			$ProductEntity->setCommentCount(stripslashes($row['commentCount']));
			$ProductEntity->setClosittCount(stripslashes($row['closittCount']));	
		    $ProductEntity->setShortLink(stripslashes($row['shortlink']));

		}
	}
}
?>