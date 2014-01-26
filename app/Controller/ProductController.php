<?php
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
	
		return $productEntity;
	}
    
    public function addProducts($products){	
		
		if(isset($products) && is_array($products) && count($products) > 0){	
			
			$results = $this->productDao->addProducts($products);			
			
			if(is_numeric($results) && $results > 0){
				return true;
			}
		}
	
		return false;
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
			
			$productEntity = new ProductEntity();		
			$results = $this->productDao->getProductsWithCriteria($criteria, $pageNumber, $numResultsPage);
			
			if(is_object($results)){
				while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){
					ProductEntity::setProductFromDB($productEntity, $row);
					ProductTemplate::getProductGridTemplate($productEntity);
				}
			}
	}
}


if (isset($_GET['demo'])){
	echo "demo";
    $productController = new ProductController($mdb2);
    $product = $productController->getProduct('g918150002');
    ProductTemplate::getProductGridTemplate($product);
}

if (isset($_GET['test_get_page'])){
	echo "test_get_page";
    $productController = new ProductController($mdb2);
    
    $productCrit = new ProductCriteria();
	//$productCrit->setCompanies(array('Gap'));	
	$productCrit->setCategories(array('Sweaters'));	
    $product = $productController->getFilteredProducts($productCrit, 1, 10);

}


?>