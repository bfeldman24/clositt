<?php
// JAVASCRIPT Closet
define("JS_REVIEW_SKU","s");
define("JS_REVIEW_USER_ID","u");
define("JS_REVIEW_USER_NAME","n");
define("JS_REVIEW_COMMENT","c");
define("JS_REVIEW_RATING","r");
define("JS_REVIEW_DATE","d");

class ReviewEntity {

	private $sku;
	private $userId;
	private $userName;
	private $review;
	private $rating;
	private $date;
	
	public function getSku() {
		return $this->sku;
	}
	public function setSku($sku) {
		if(isset($sku)){
			$this->sku = $sku;
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
	
	public function getUserName() {
		return $this->userName;
	}
	public function setUserName($userName) {
		if(isset($userName)){
			$this->userName = $userName;
		}
	}
	
	public function getReview() {
		return $this->review;
	}
	public function setReview($review) {
		if(isset($review)){
			$this->review = $review;
		}
	}	
	
	public function getRating() {
		return $this->rating;
	}
	public function setRating($rating) {
		if(isset($rating)){
			$this->rating = $rating;
		}
	}	
	
	public function getDate() {
		return $this->date;
	}
	public function setDate($date) {
		if(isset($date)){
			$this->date = $date;
		}
	}						
	
		
	/**** ************************** ****/
		
	public static function setFromDB($row){         
		$reviewEntity = new ReviewEntity();
				
		$reviewEntity->setSku(stripslashes($row[PRODUCT_SKU]));
		$reviewEntity->setUserId(stripslashes($row[USER_ID]));
		$reviewEntity->setUserName(stripslashes($row[USER_NAME]));
		$reviewEntity->setReview(stripslashes($row[REVIEW_COMMENT]));
		$reviewEntity->setRating(stripslashes($row[REVIEW_RATING]));
		$reviewEntity->setDate(stripslashes($row[REVIEW_DATE]));
		
		return $reviewEntity;
	}		
	
	public static function setFromPost($row){
		$reviewEntity = new ReviewEntity();
		
		$reviewEntity->setSku(trim($row[JS_REVIEW_SKU]));
		$reviewEntity->setUserId(trim($row[JS_REVIEW_USER_ID]));
		$reviewEntity->setUserName(trim($row[JS_REVIEW_USER_NAME]));
		$reviewEntity->setReview(trim($row[JS_REVIEW_COMMENT]));
		$reviewEntity->setRating(trim($row[JS_REVIEW_RATING]));
		$reviewEntity->setDate(trim($reviewEntity->formatDateAsString($row[JS_REVIEW_DATE])));

		return $reviewEntity;
	}
	
	public function toArray(){
		$reviewArray = array();	
		
		$reviewArray[JS_REVIEW_SKU] = $this->getSku();
		$reviewArray[JS_REVIEW_USER_ID] = $this->getUserId();
		$reviewArray[JS_REVIEW_USER_NAME] = $this->getUserName();
		$reviewArray[JS_REVIEW_COMMENT] = $this->getReview();
		$reviewArray[JS_REVIEW_RATING] = $this->getRating();
		$reviewArray[JS_REVIEW_DATE] = $this->formatDateAsString($this->getDate());
		
		foreach ($reviewArray as $key => $value){
			if(!isset($value) || $value == ""){
				unset($reviewArray[$key]);
			}
		}
		
		return $reviewArray;
	}	
	
	private function formatDateAsString($dateTime){
		if($dateTime == null || $dateTime == ""){
			return null;
		}else{
			date_default_timezone_set("EST"); // YYYY-MM-DD HH:MI:SS
			return date('Y-m-d H:i:s', strtotime($dateTime));
		}
	}    		
}
?>