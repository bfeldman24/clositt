<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ReviewDao.php');
require_once(dirname(__FILE__) . '/../Model/ReviewEntity.php');
require_once(dirname(__FILE__) . '/ProductController.php');

class ReviewController{	
    private $reviewDao = null;
    private $productController = null;
	
	public function __construct(&$mdb2){
		$this->reviewDao = new ReviewDao($mdb2);
		$this->productController = new ProductController($mdb2);
	}
	
	public function addReview($review){
	   $affectedRows = -1;
	   
	   if (isset($review) && isset($_SESSION['userid'])){
	       $reviewEntity = ReviewEntity::setFromPost($review);
	       $sku = $reviewEntity->getSku();
	       
	       if (isset($sku)){
	           $affectedRows = $this->reviewDao->addReview($reviewEntity, $_SESSION['userid']);
	           
	           if ($affectedRows > 0){
	               $this->productController->updateCommentCounter($sku);   
	           }
	       }
	   }
	   
	   return $affectedRows > 0 ? "success" : "failed";
	}
	
	public function removeReview($review){
	   $affectedRows = -1;
	   
	   if (isset($review) && isset($_SESSION['userid'])){
	       $reviewEntity = ReviewEntity::setFromPost($review);
	       $sku = $reviewEntity->getSku();
	       $date = $reviewEntity->getDate();
	       
	       if (isset($sku) && isset($date)){
	           $affectedRows = $this->reviewDao->removeReview($reviewEntity, $_SESSION['userid']);
	       }
	   }
	   
	   return $affectedRows > 0 ? "success" : "failed";
	}
	
	public function getReviews($review){	
	   $reviewList = array();
	      
	   if (isset($review)){
	       $reviewEntity = ReviewEntity::setFromPost($review);
	       $sku = $reviewEntity->getSku();
	       
	       if (isset($sku)){
	           $results = $this->reviewDao->getReviews($reviewEntity);
	           
	           if(is_object($results)){
		 
        			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
        				$fetchedReview = ReviewEntity::setFromDB($row);
        				$reviewList[] = $fetchedReview->toArray();
        			}
        		}
	       }
	   }
	   
	   return json_encode($reviewList);
	}
	
	public function getAllReviews(){
	   $reviewList = array();	      	   
       $results = $this->reviewDao->getAllReviews();
        
       if(is_object($results)){
 
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
				$fetchedReview = ReviewEntity::setFromDB($row);
				$sku = $fetchedReview->getSku();
				
				if (!isset($reviewList[$sku])){
                    $reviewList[$sku] = array();
				}
				
				$reviewList[$sku][] = $fetchedReview->toArray();
			}
	   }	    
	   
	   return json_encode($reviewList);
	}		
}


if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $reviewController = new ReviewController($mdb2);                  
    
    
    if (DEBUG){
        switch($_GET['method']){
           case 'getall':               
               $results = $reviewController->getAllReviews();
               break;     
       }   
    }
    
    switch($_GET['method']){
        case 'add':               
            $results = $reviewController->addReview($_POST);
            break;
        case 'remove':               
            $results = $reviewController->removeReview($_POST);
            break;
        case 'get':               
            $results = $reviewController->getReviews($_POST);
            break;        
    }   
        
    print_r($results);
}

?>