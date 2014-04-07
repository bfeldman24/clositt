<?php
require_once(dirname(__FILE__) . '/../globals.php');
require_once(dirname(__FILE__) . '/../Database/DataAccess/check-login.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ProductDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');
require_once(dirname(__FILE__) . '/../Model/ProductCriteria.php');
require_once(dirname(__FILE__) . '/../View/ProductTemplate.php');


class ProductController {	
	private $productDao = null;
	
	public function __construct(&$mdb2){
		$this->productDao = new ProductDao($mdb2);
	}
	
	public function getProduct($sku){
	
		$productEntity = new ProductEntity();		
		
		if(isset($sku) && strlen($sku) > 2){	
			
			$results = $this->productDao->getProduct($sku);						
			
			if(is_object($results)){
				if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){					    				
					ProductEntity::setProductFromDB($productEntity, $row);
				}
			}
		}
	
	    //ProductTemplate::getProductGridTemplate($productEntity);	    
        return json_encode($productEntity->toArray());
	}
	
	public function getProducts($productCrit, $page, $limit, $random = false){
	    $searchResults = array();
	    		
		if(isset($page) && isset($limit)){	
		      
			$results = $this->productDao->getProducts($productCrit, $page, $limit, $random);
			
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

	public function getFilteredProducts($criteria, $pageNumber, $numResultsPage){
			
		$results = $this->productDao->getProductsWithCriteria($criteria, $pageNumber, $numResultsPage);
		$searchResults = array();
		
		if(is_object($results)){
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){
			    $productEntity = new ProductEntity();
				ProductEntity::setProductFromDB($productEntity, $row);
				//ProductTemplate::getProductGridTemplate($productEntity);
				$searchResults[] = $productEntity->toArray();
			}
		}
		
		return json_encode($searchResults);
	}
}


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['method'])){
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
        $product = $productController->getFilteredProducts($productCrit, $_GET['page'], QUERY_LIMIT);
    
    }else if ($_GET['method'] == 'cc' && isset($_POST['sku'])){     	   	    
        $product = $productController->updateClosittCounter($_POST['sku']);
    }else if ($_GET['method'] == 'rc' && isset($_POST['sku'])){                        	     	   	    
        $product = $productController->updateCommentCounter($_POST['sku']);
    }
    
    
    print_r($product);     
}


?>