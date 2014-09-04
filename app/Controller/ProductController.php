<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ProductDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');
require_once(dirname(__FILE__) . '/../Model/ProductCriteria.php');
require_once(dirname(__FILE__) . '/../View/ProductTemplate.php');
require_once(dirname(__FILE__) . '/../Elastic/ElasticDao.php');
require_once(dirname(__FILE__) . '/ListController.php');

class ProductController {	
	private $productDao = null;
	private $elasticDao = null;
	public function __construct(&$mdb2){
		$this->productDao = new ProductDao($mdb2);
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
				
				if (isset($productResults['product']) && $productResults['product'] != null){
    				$historicalResults = $this->productDao->getHistoricalPrices($sku);
    				
    				if(is_object($historicalResults)){
    				    $historicalPrices = array();
    				    $historicalPrices['dates'] = array();
    				    $historicalPrices['prices'] = array();
    				    
        				while($row = $historicalResults->fetchRow(MDB2_FETCHMODE_ASSOC)){	
        				    
        				    if (count($historicalPrices['dates']) == 0){        				        
            				    $historicalPrices['dates'][] = "< " . date_format(date_create(stripslashes($row[HISTORICAL_DATE])), "M jS Y");
        				    }	
        				    
        				    $historicalPrices['dates'][] = $firstDatePrefix . date_format(date_create(stripslashes($row[HISTORICAL_DATE])), "M jS Y");
                                				    
        				    if (count($historicalPrices['prices']) == 0 || 
        				            $historicalPrices['prices'][count($historicalPrices['prices']) - 1] != 
        				            stripslashes($row[HISTORICAL_OLD_PRICE])){ 
        				                    
          					     $historicalPrices['prices'][] = stripslashes($row[HISTORICAL_OLD_PRICE]);
        				    }
        				    
          					$historicalPrices['prices'][] = stripslashes($row[HISTORICAL_NEW_PRICE]);
          				}
          				          				
          				$productResults['historicalPrices'] = $historicalPrices;
    				}
				}
			}
		}
	
	    //ProductTemplate::getProductGridTemplate($productEntity);	    
        return json_encode($productResults);
	}
	
	public function getProducts($productCrit, $page, $limit, $random = false){
	    $searchResults = array();
	    $searchResults['products'] = array();
	    		
		if(isset($page) && isset($limit)){	
		      
			$results = $this->productDao->getProducts($productCrit, $page, $limit, $random);
			
			if(is_object($results)){
				while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
				    $productEntity = new ProductEntity();						
					ProductEntity::setProductFromDB($productEntity, $row);
					$searchResults['products'][] = $productEntity->toArray();
				}
			}
		}
	
		return json_encode($searchResults);
	}
	
	public function getSimilarProducts($productId, $limit){
	   $searchResults = array();
	    		
		if(isset($productId) && isset($limit)){	
		      
			$results = $this->productDao->getSimilarProducts($productId, $limit);
			
			if(is_object($results)){
				while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
				    $productEntity = new ProductEntity();						
					ProductEntity::setProductFromDB($productEntity, $row);
					$searchResults[] = $productEntity->toArray();
				}
			}
		}
	
		return json_encode($searchResults);
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
	
	public function addProductsFromFile($productFile){
	    // Get Products from file    
        $file = fopen($productFile, 'r');
        $productsJson = fread($file, filesize($productFile));
        fclose($file);
        $products = json_decode($productsJson, true);  
        
        $productArray = array();
        $i =0;
        
        foreach ($products as $sku => $product){
             $i++;
             $insertArray = array();
             $insertArray[] = $sku;
             $insertArray[] = $product['o'];
             $insertArray[] = $product['u'];
             $insertArray[] = $product['a'];
             $insertArray[] = $product['n'];
             $insertArray[] = $product['l'];
             $insertArray[] = $product['i'];
             $insertArray[] = $product['p'];
             $insertArray[] = 0;
             $insertArray[] = 0;
                          
             $productArray[] = $insertArray;  
        }
        
        $result = $this->addProducts($productArray);
        echo "DONE: " . $i . ") " . $result;
        return $result;
	}

	public function getFilteredProducts($criteria, $pageNumber, $numResultsPage, $tagAdmin = false){
						
		$results = $this->productDao->getProductsWithCriteria($criteria, $pageNumber, $numResultsPage, $tagAdmin);
		$searchResults = array();
		$searchResults['products'] = array();
		
		if(is_object($results)){
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){
			    $productEntity = new ProductEntity();
				ProductEntity::setProductFromDB($productEntity, $row);
				//ProductTemplate::getProductGridTemplate($productEntity);
				$searchResults['products'][] = $productEntity->toArray();
			}
		}
		
		return json_encode($searchResults);
	}

	public function searchElastic($criteria, $pageNumber, $numResultsPage){

        //check if elastic is healthy. If not, do old style search on DB
        $elasticHealthy = false;
        try{
           $elasticHealthy = $this->elasticDao->isHealthy();
        }
        catch(Exception $e){
            //TODO log errors here
        }

        if(!$elasticHealthy){
            return $this->getFilteredProducts($criteria, $pageNumber, $numResultsPage);
        }

        $results = $this->elasticDao->getProductsWithCriteria($criteria, $pageNumber, $numResultsPage);

        $items = $results['products'];
        $products = array();

		if(is_array($items)){
			foreach ($items as $hit) {
				
			    $productEntity = new ProductEntity();
				ProductEntity::setProductFromElastic($productEntity, $hit);
				$products[] = $productEntity->toArray();
			}
		}
		
		if ($pageNumber == 0){
		  ListController::writeToFile("searchTerms",$criteria->getSearchString());
		}

        $facets = $results['facets'];

        $results = array('products'=>$products, 'facets' => $facets);
		return json_encode($results);
	}
}


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['method']) && $_GET['class'] == "products"){
    $productController = new ProductController($mdb2);              
    
    if ($_GET['method'] == 'lookup' && isset($_POST['sku'])){
         $product = $productController->getProduct($_POST['sku']);   
    
    }else if ($_GET['method'] == 'browse' && isset($_GET['page']) && isset($_GET['customer'])){
        $productCrit = ProductCriteria::setCriteriaFromPost($_POST);
        
        if (!isset($_POST['customer'])){        
            if ($_GET['customer'] == 'w'){
                $customer = array();
                $customer[] = 'women';          
                         
            }else if ($_GET['customer'] == 'm'){
                $customer = array();
                $customer[] = 'men';                   
            }
            
            $productCrit->setCustomers($customer);
        }
        
        $product = $productController->getProducts($productCrit, $_GET['page'], QUERY_LIMIT, true);   
        
    }else if ($_GET['method'] == 'search' && isset($_POST) && isset($_GET['page'])){      
    	$productCrit = ProductCriteria::setCriteriaFromPost($_POST);
        $product = $productController->searchElastic($productCrit, $_GET['page'], QUERY_LIMIT);
    }
    
    if (isset($product) && $product != null){
        print_r($product);     
    }
}


?>