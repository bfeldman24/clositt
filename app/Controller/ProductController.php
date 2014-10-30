<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ProductDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');
require_once(dirname(__FILE__) . '/../Model/ProductCriteria.php');
require_once(dirname(__FILE__) . '/../View/ProductView.php');
require_once(dirname(__FILE__) . '/../Elastic/ElasticDao.php');
require_once(dirname(__FILE__) . '/ListController.php');
require_once(dirname(__FILE__) . '/StatsController.php');
require_once(dirname(__FILE__) . '/Debugger.php');

class ProductController extends Debugger{	
	private $productDao = null;
	private $elasticDao = null;
	public function __construct(){
		$this->productDao = new ProductDao();
		$this->elasticDao = new ElasticDao();
	}
	
	public function getProduct($sku){
	    $productResults = array();
		$productEntity = new ProductEntity();		
		
		if(isset($sku) && strlen($sku) > 2){	
			
			$results = $this->productDao->getProduct($sku);						
			
			if(is_object($results)){
				if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){					    				
					ProductEntity::setProductFromDB($productEntity, $row);
					$productResults['product'] = $productEntity->toArray();
				}
			}
				
			if (isset($productResults['product']) && $productResults['product'] != null){
			    $sku = $productEntity->getId();
			 
			    // Log Stats
			    StatsController::addItemAction('Product Lookup', $sku);
			 
			    // GET SWATCHES
			    $swatchResults = $this->productDao->getProductSwatches($sku);
			    if(is_object($swatchResults)){
			         $swatches = array();
			         
			         while($image = $swatchResults->fetchOne()){
			             $swatches[] = $image;    
			         }
			         
			         $productResults['swatches'] = count($swatches) > 0 ? $swatches : null;
			    }			    			   
			    
			    // GET SIZES
    			$sizeResults = $this->productDao->getProductSizes($sku);
    			if(is_object($sizeResults)){
			         $sizes = array();
			         
			         while($size = $sizeResults->fetchOne()){
			             $sizes[] = $size;    
			         }
			         
			         $productResults['sizes'] = count($sizes) > 0 ? $sizes : null;
			    }
			 
			    // GET HISTORICAL PRICES
				$historicalResults = $this->productDao->getHistoricalPrices($sku);
				
				if(is_object($historicalResults)){
				    $historicalPrices = array();
				    $historicalPrices['dates'] = array();
				    $historicalPrices['prices'] = array();
				    
    				while($row = $historicalResults->fetchRow(MDB2_FETCHMODE_ASSOC)){	    
                            				    
    				    if (count($historicalPrices['prices']) == 0 || 
    				            $historicalPrices['prices'][count($historicalPrices['prices']) - 1] != 
    				            stripslashes($row[HISTORICAL_OLD_PRICE])){ 
    				             
    				             $historicalPrices['dates'][] = date_format(date_create(stripslashes($row[PRODUCT_CREATED_ON])), "M jS Y");
        					     $historicalPrices['prices'][] = stripslashes($row[HISTORICAL_OLD_PRICE]);
    				    }
    				    
    				    $historicalPrices['dates'][] = date_format(date_create(stripslashes($row[HISTORICAL_DATE])), "M jS Y");
    					$historicalPrices['prices'][] = stripslashes($row[HISTORICAL_NEW_PRICE]);
    				}    				    				
    				       
    				$productResults['historicalPrices'] = count($historicalPrices['dates']) > 0 ? $historicalPrices : null;		
				}
			}
		}
		    
        return json_encode($productResults);
	}	
	
	public function getProductsHtml($postData, $getData, $limit, $random = false){
	    return $this->getProducts($postData, $getData, $limit, $random, true);
	}
	
	public function getProducts($postData, $getData, $limit, $random = false, $useTemplate = false){
	    $searchResults = array();	    
	    $searchResults['products'] = $useTemplate ? '' : array();
	    
	    if (!isset($postData)){
	       return json_encode($searchResults);
	    }
	    
	    $page = 0;	    
	    if (isset($getData['page'])){
	       $page = $getData['page'];     
	    }
	    
	    $productCrit = ProductCriteria::setCriteriaFromPost($postData);
                    
        if (!isset($postData['customer'])){        
            if ($getData['customer'] == 'w'){
                $customer = array();
                $customer[] = 'women';          
                $productCrit->setCustomers($customer);               
            }else if ($getData['customer'] == 'm'){
                $customer = array();
                $customer[] = 'men';                  
                $productCrit->setCustomers($customer); 
            }                        
        }
	    		
		if(isset($page) && isset($limit)){	
		      
			$results = $this->productDao->getProducts($productCrit, $page, $limit, $random);
			
			if(is_object($results)){
				while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
				    $productEntity = new ProductEntity();						
					ProductEntity::setProductFromDB($productEntity, $row);
					
					if ($useTemplate){
					   $searchResults['products'] .= ProductView::getProductGridTemplate($productEntity);  
					}else{
					   $searchResults['products'][] = $productEntity->toArray();
					}					
				}				
			}
			
			if (isset($_SESSION['skipFirstBrowse'])){
    			// Log Stats
    			$pageStats = "p:".$page.", l:".$limit;
        		StatsController::add('Browsed', $pageStats, $productCrit->toString());			
			}else{
			     $_SESSION['skipFirstBrowse'] = true;
			}
		}
	
		return json_encode($searchResults);
	}
					
	
	public function getSimilarProducts($productId, $limit, $useTemplate = false){
	   $searchResults = $useTemplate ? '' : array();
	    		
		if(isset($productId) && isset($limit)){	
		      
			$results = $this->productDao->getSimilarProducts($productId, $limit);
			
			if(is_object($results)){
				while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
				    $productEntity = new ProductEntity();						
					ProductEntity::setProductFromDB($productEntity, $row);
					
					if ($useTemplate){
      				   $searchResults .= ProductView::getProductGridTemplate($productEntity, false, "col-xs-12");  
      				}else{
      				   $searchResults[] = $productEntity->toArray();
      				}
				}
			}
		}
	
		return  $useTemplate ? $searchResults : json_encode($searchResults);
	}
	
	public function updateClosittCounter($productId){
	     if(isset($productId) && strlen($productId) > 3){	
			$results = $this->productDao->updateClosittCounter($productId);			
			
			if(is_numeric($results) && $results > 0){
				return $results;
			}
		}
	
		return "failed";
	}
	
	public function updateCommentCounter($productId){
	     if(isset($productId) && strlen($productId) > 3){	
			
			$results = $this->productDao->updateCommentCounter($productId);			
			
			if(is_numeric($results) && $results > 0){
				return $results;
			}
		}
	
		return "failed";
	}
    
    public function addProducts($products){	
		
		if(isset($products) && is_array($products) && count($products) > 0){	
			
			$results = $this->productDao->addProducts($products);			
			
			if(is_numeric($results) && $results > 0){
				return $results;
			}
		}
	
		return "failed";
	}
	
	public function getFilteredProductsFromPost($postData, $page, $getOnlyUnapprovedTags = false){
	    if (!isset($postData)){
	       return null;  
	    }
	   
	    $productCrit = ProductCriteria::setCriteriaFromPost($postData);
                      	
        if (!$productCrit->isEmpty()){
            $products = $productController->getFilteredProducts($productCrit, $page, QUERY_LIMIT, $getOnlyUnapprovedTags);
            return print_r($products, true);
    	}
    	
    	return null;
    }
	
	public function getFilteredProducts($criteria, $pageNumber, $numResultsPage, $tagAdmin = false, $useTemplate = false){
		if (!isset($criteria)){
	       return null;  
	    }
						
		$results = $this->productDao->getProductsWithCriteria($criteria, $pageNumber, $numResultsPage, $tagAdmin);
		$searchResults = array();
		$searchResults['products'] = $useTemplate ? '' : array();
		
		if(is_object($results)){
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){
			    $productEntity = new ProductEntity();
				ProductEntity::setProductFromDB($productEntity, $row);
								
				if ($useTemplate){
				   $searchResults['products'] .= ProductView::getProductGridTemplate($productEntity);  
				}else{
				   $searchResults['products'][] = $productEntity->toArray();
				}	
			}
		}
		
		return json_encode($searchResults);
	}

    public function searchElasticHtml($data, $pageNumber, $numResultsPage){
        return $this->searchElastic($data, $pageNumber, $numResultsPage, true);
    }

	public function searchElastic($data, $pageNumber, $numResultsPage, $useTemplate = false){
	    if (!isset($data)){
	       return "no data";  
	    }	    
	    
	    if (!isset($pageNumber)){
	       $pageNumber = 0;  
	    }
	   
        $criteria = ProductCriteria::setCriteriaFromPost($data);        
        
        // Log Stats
        $pageStats = " p:" . $pageNumber . ",l:" . $numResultsPage;
		StatsController::add('Searched', $criteria->getSearchString(), $criteria->toString() . $pageStats);

        //check if elastic is healthy. If not, do old style search on DB
        $elasticHealthy = false;
        try{
           $elasticHealthy = $this->elasticDao->isHealthy();
        }
        catch(Exception $e){
            $this->error("Could not check if elastic is healthy");
        }

        if(!$elasticHealthy){
            return $this->getFilteredProducts($criteria, $pageNumber, $numResultsPage, false, $useTemplate);
        }

        $results = $this->elasticDao->getProductsWithCriteria($criteria, $pageNumber, $numResultsPage);

        $items = $results['products'];
        $products = $useTemplate ? '' : array();

		if(is_array($items)){
			foreach ($items as $hit) {
				
			    $productEntity = new ProductEntity();
				ProductEntity::setProductFromElastic($productEntity, $hit);
				
				if ($useTemplate){
				   $products .= ProductView::getProductGridTemplate($productEntity);  
				}else{
				   $products[] = $productEntity->toArray();
				}
			}
		}
		
		if ($pageNumber == 0){
            ListController::writeToFile("searchTerms", $criteria->getSearchString());
		}

        $facets = $results['facets'];

        $results = array('products'=> $products, 'facets' => $facets);                
		return json_encode($results);
	}
	
	public function getCachedProductImage($sku){
	   
	    if(isset($sku) && trim($sku) != ""){	
		      
			$result = $this->productDao->getCachedProductImage($sku);
			
			if(is_object($result)){
				$cachedImage = $result->fetchOne();
				
				if (isset($cachedImage) && is_string($cachedImage) && strlen($cachedImage) > 100){
				    $image = $cachedImage;				   
				}
			}
		}
		
		if (!isset($image)){
		   // The default image if none exists
	       $image = file_get_contents(dirname(__FILE__) . '/../../www/css/images/missing.jpg');    
		}
		
		return $image;
	}
}

?>
