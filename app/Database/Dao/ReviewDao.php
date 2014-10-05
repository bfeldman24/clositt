<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/AbstractDao.php');

class ReviewDao extends AbstractDao {             	
	
	public function addReview($review, $userid){
	    $sql = "INSERT INTO " .REVIEWS. 
	           " (".PRODUCT_SKU.",".USER_ID.",".REVIEW_COMMENT.",".REVIEW_STATUS.",".REVIEW_DATE.")".
                " VALUES (?,?,?,1,NOW())";
        
        $sku = $review->getSku();
        $comment = $review->getReview();
        
		$paramTypes = array('text','integer','text');		
		$params = array($sku, $userid, $comment);		
		return $this->update($sql, $params, $paramTypes, "3987239423");
	}
	
	public function removeReview($review, $userid){
	    $sql = "UPDATE " .REVIEWS. 
	           " SET ".REVIEW_STATUS." = 2 ".
                " WHERE ".PRODUCT_SKU." = ? AND ".USER_ID." = ? AND ".REVIEW_DATE." = ?";
        
        $sku = $review->getSku();
        $date = $review->getDate(); // YYYY-MM-DD HH:MI:SS        
        
		$paramTypes = array('text','integer','timestamp');
		$params = array($sku, $userid, $date);		
		return $this->update($sql, $params, $paramTypes, "0072397362");
	}
	
	public function getReviews($sku){
	    $sql = "SELECT r.".PRODUCT_SKU.",u.".USER_NAME.",r.".REVIEW_COMMENT.",r.".REVIEW_RATING.",r.".REVIEW_DATE. 
	           " FROM ".REVIEWS . " r " .
	           " INNER JOIN " . USERS . " u ON u.".USER_ID." = r.".USER_ID.
                " WHERE r.".PRODUCT_SKU." = ? AND r." . REVIEW_STATUS . " = 1 " . 
                " ORDER BY r." . REVIEW_DATE . " DESC";        
        
		$paramTypes = array('text');		
		$params = array($sku);		
		return $this->getResults($sql, $params, $paramTypes, "0987491237642");
	}
	
	public function getAllReviews(){
	    $sql = "SELECT r.".PRODUCT_SKU.",u.".USER_NAME.",r.".REVIEW_COMMENT.",r.".REVIEW_RATING.",r.".REVIEW_DATE. 
	           " FROM ".REVIEWS . " r " .
	           " INNER JOIN " . USERS . " u ON u.".USER_ID." = r.".USER_ID.               
               " ORDER BY r.".PRODUCT_SKU.", r." . REVIEW_DATE . " DESC";        
        
		return $this->getResults($sql, array(), array(), "983740233");
	}		
}
?>