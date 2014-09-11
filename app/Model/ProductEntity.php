<?php
require_once(dirname(__FILE__) . '/BaseEntity.php');

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
define("JS_PRODUCT_SCORE", "sc");
define("JS_PRODUCT_COLORS", "co");

class ProductEntity{

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
	private $score;
    private $colors;

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

    public function getScore(){
        return $this->score;
    }
    public function setScore($score) {
        if(isset($score)){
            $this->score= $score;
        }
    }

    public function getColors(){
        return $this->colors;
    }
    public function setColors($colors) {
        if(isset($colors)){
            $this->colors= $colors;
        }
    }

	/**** ************************** ****/
		
	public static function setProductFromDB($ProductEntity, $row){         
		if (is_object($ProductEntity) && get_class($ProductEntity) == "ProductEntity"){
			$ProductEntity->setId(BaseEntity::getDBField($row,PRODUCT_SKU));
			$ProductEntity->setStore(BaseEntity::getDBField($row,PRODUCT_STORE));
			$ProductEntity->setCustomer(BaseEntity::getDBField($row,PRODUCT_CUSTOMER));
			$ProductEntity->setCategory(BaseEntity::getDBField($row,PRODUCT_CATEGORY));
			$ProductEntity->setName(BaseEntity::getDBField($row,PRODUCT_NAME));
			$ProductEntity->setLink(BaseEntity::getDBField($row,PRODUCT_LINK));
			$ProductEntity->setImage(BaseEntity::getDBField($row,PRODUCT_IMAGE));
			$ProductEntity->setPrice(BaseEntity::getDBField($row,PRODUCT_PRICE));
			$ProductEntity->setCommentCount(BaseEntity::getDBField($row,PRODUCT_COMMENT_COUNT));
			$ProductEntity->setClosittCount(BaseEntity::getDBField($row,PRODUCT_CLOSITT_COUNT));	
			$ProductEntity->setShortLink(BaseEntity::getDBField($row,PRODUCT_SHORT_LINK));	
		}
	}		
	
	public static function setProductFromPost($row){
		$ProductEntity = new ProductEntity();
		
		$ProductEntity->setId(BaseEntity::getPostField($row,JS_PRODUCT_SKU));
		$ProductEntity->setStore(BaseEntity::getPostField($row,JS_PRODUCT_STORE));
		$ProductEntity->setCustomer(BaseEntity::getPostField($row,JS_PRODUCT_CUSTOMER));
		$ProductEntity->setCategory(BaseEntity::getPostField($row,JS_PRODUCT_CATEGORY));
		$ProductEntity->setName(BaseEntity::getPostField($row,JS_PRODUCT_NAME));
		$ProductEntity->setLink(BaseEntity::getPostField($row,JS_PRODUCT_LINK));
		$ProductEntity->setImage(BaseEntity::getPostField($row,JS_PRODUCT_IMAGE));
		$ProductEntity->setPrice(BaseEntity::getPostField($row,JS_PRODUCT_PRICE));
		$ProductEntity->setCommentCount(BaseEntity::getPostField($row,JS_PRODUCT_COMMENT_COUNT));
		$ProductEntity->setClosittCount(BaseEntity::getPostField($row,JS_PRODUCT_CLOSITT_COUNT));	
		$ProductEntity->setShortLink(BaseEntity::getPostField($row,JS_PRODUCT_SHORT_LINK));
				    
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
        $ProductArray[JS_PRODUCT_SCORE] = $this->getScore();
        $ProductArray[JS_PRODUCT_COLORS] = $this->getColors();
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
			$ProductEntity->setId(BaseEntity::getDBField($row, 'sku'));
			$ProductEntity->setStore(BaseEntity::getDBField($row, 'store'));
			$ProductEntity->setCustomer(BaseEntity::getDBField($row, 'customer'));
            if(is_array($row['tag'])){
                $ProductEntity->setCategory(stripslashes(implode(", ",$row['tag'])));
            }
            else{
                $ProductEntity->setCategory(BaseEntity::getDBField($row, 'tag'));
            }

            $colors = array();
            if(isset($row['color'])){
                array_push($colors, stripslashes($row['color']));
            }

            if(isset($row['color2'])){
                array_push($colors, stripslashes($row['color2']));
            }

            $ProductEntity->setColors(implode(", ", $colors));
			$ProductEntity->setName(BaseEntity::getDBField($row, 'name'));
			$ProductEntity->setLink(BaseEntity::getDBField($row, 'link'));
			$ProductEntity->setImage(BaseEntity::getDBField($row, 'image'));
			$ProductEntity->setPrice(BaseEntity::getDBField($row, 'price'));
			$ProductEntity->setCommentCount(BaseEntity::getDBField($row, 'commentCount'));
			$ProductEntity->setClosittCount(BaseEntity::getDBField($row, 'closittCount'));	
		    $ProductEntity->setShortLink(BaseEntity::getDBField($row, 'shortlink'));
            $ProductEntity->setScore(BaseEntity::getDBField($row, 'score'));
		}
	}
}
?>