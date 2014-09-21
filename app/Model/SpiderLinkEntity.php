<?php
require_once(dirname(__FILE__) . '/BaseEntity.php');

// JAVASCRIPT Products
define("JS_SPIDER_STORE","company");
define("JS_SPIDER_CUSTOMER","customer");
define("JS_SPIDER_CATEGORY","category");
define("JS_SPIDER_LINK","link");
define("JS_SPIDER_TAGS","tags");
define("JS_SPIDER_COUNT","count");
define("JS_SPIDER_STATUS","status");
define("JS_SPIDER_LAST_SAVED", "lastSaved");

class SpiderLinkEntity {

	private $store;
	private $customer;
	private $category;
	private $link;
	private $tags;
	private $count;		
	private $status;
	private $lastSaved;	
	
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
	
	public function getLink() {
		return $this->link;
	}
	public function setLink($link) {
		if(isset($link)){
			$this->link = $link;
		}
	}
	
	public function getTags() {
		return $this->tags;
	}
	public function setTags($tags) {
		if(isset($tags)){
			$this->tags = $tags;
		}
	}		
	
	public function getCount() {
		return $this->count;
	}
	public function setCount($count) {
		if(isset($count)){
			$this->count = $count;
		}
	}
	
	public function getStatus() {
		return $this->status;
	}
	public function setStatus($status) {
		if(isset($status)){
			$this->status = $status;
		}
	}
	
	public function getLastSaved() {
		return $this->lastSaved;
	}
	public function setLastSaved($lastSaved) {
		if(isset($lastSaved)){
			$this->lastSaved = $lastSaved;
		}
	}		
	
		
	/**** ************************** ****/
		
	public static function setSpiderLinkFromDB($spiderEntity, $row){         
		if (is_object($spiderEntity) && get_class($spiderEntity) == "SpiderLinkEntity"){
			$spiderEntity->setStore(BaseEntity::getDBField($row, SPIDER_STORE));
			$spiderEntity->setCustomer(BaseEntity::getDBField($row, SPIDER_CUSTOMER));
			$spiderEntity->setCategory(BaseEntity::getDBField($row, SPIDER_CATEGORY));
			$spiderEntity->setLink(BaseEntity::getDBField($row, SPIDER_LINK));
			$spiderEntity->setTags(BaseEntity::getDBField($row, SPIDER_TAGS));
			$spiderEntity->setCount(BaseEntity::getDBField($row, SPIDER_COUNT));
			$spiderEntity->setStatus(BaseEntity::getDBField($row, SPIDER_STATUS));	
			$spiderEntity->setLastSaved(BaseEntity::getDBField($row, SPIDER_LAST_SAVED));	
		}
	}		
	
	public static function setSpiderLinkFromPost($row){
		$spiderEntity = new SpiderLinkEntity();
		
		$spiderEntity->setStore(BaseEntity::getPostField($row, JS_SPIDER_STORE));
		$spiderEntity->setCustomer(BaseEntity::getPostField($row, JS_SPIDER_CUSTOMER));
		$spiderEntity->setCategory(BaseEntity::getPostField($row, JS_SPIDER_CATEGORY));
		$spiderEntity->setLink(BaseEntity::getPostField($row, JS_SPIDER_LINK));
		$spiderEntity->setTags(BaseEntity::getPostField($row, JS_SPIDER_TAGS));
		$spiderEntity->setCount(BaseEntity::getPostField($row, JS_SPIDER_COUNT));
		$spiderEntity->setStatus(BaseEntity::getPostField($row, JS_SPIDER_STATUS));	
		$spiderEntity->setLastSaved(BaseEntity::getPostField($row, JS_SPIDER_LAST_SAVED));
				    
		return $spiderEntity;
	}
	
	public function toArray(){
		$spiderArray = array();	
		
		$spiderArray[JS_SPIDER_STORE] = $this->getStore();
		$spiderArray[JS_SPIDER_CUSTOMER] = $this->getCustomer();
		$spiderArray[JS_SPIDER_CATEGORY] = $this->getCategory();
		$spiderArray[JS_SPIDER_LINK] = $this->getLink();
		$spiderArray[JS_SPIDER_TAGS] = $this->getTags();
		$spiderArray[JS_SPIDER_COUNT] = $this->getCount();
		$spiderArray[JS_SPIDER_STATUS] = $this->getStatus();	
		$spiderArray[JS_SPIDER_LAST_SAVED] = $this->formatDateAsString($this->getLastSaved());
		
		foreach ($spiderArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($spiderArray[$key]);
			}
		}
		
		return $spiderArray;
	}	    
	
	private function formatDateAsString($dateTime){
		if($dateTime == null || $dateTime == ""){
			return null;
		}else{
			date_default_timezone_set("EST");
			return date('m/d/Y h:i A', strtotime($dateTime));
		}
	}	
}
?>