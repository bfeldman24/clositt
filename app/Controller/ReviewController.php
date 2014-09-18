<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ReviewDao.php');
require_once(dirname(__FILE__) . '/../Model/ReviewEntity.php');
require_once(dirname(__FILE__) . '/ProductController.php');
require_once(dirname(__FILE__) . '/ListController.php');
require_once(dirname(__FILE__) . '/../Elastic/ElasticDao.php');

class ReviewController{	
    private $reviewDao = null;
    private $productController = null;
	
	public function __construct(){
		$this->reviewDao = new ReviewDao();
		$this->productController = new ProductController();
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
	               
	               // Update elastic count
                   $elastic = new ElasticDao();
                   $elastic->updateCommentCount($sku);
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

?>