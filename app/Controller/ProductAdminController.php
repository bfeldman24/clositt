<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/ProductAdminDao.php');
require_once(dirname(__FILE__) . '/../Elastic/ElasticDao.php');
require_once(dirname(__FILE__) . '/../Model/SpiderLinkEntity.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');
require_once(dirname(__FILE__) . '/../Model/ProductCriteria.php');
require_once(dirname(__FILE__) . '/../Model/SpiderLinkEntity.php');
require_once(dirname(__FILE__) . '/ProductController.php');
require_once(dirname(__FILE__) . '/Debugger.php');


class ProductAdminController extends Debugger {
	private $productAdminDao = null;
	private $productDao = null;
	private $debug = false;
	private $productController = null;
	
	public function __construct(){
		$this->productAdminDao = new ProductAdminDao();
		$this->productDao = new ProductDao();
		$this->productController = new ProductController();
	}
	
	public function getSpiderLinks(){	    	           
        $spiderLinks = array();	    			      
		$results = $this->productAdminDao->getSpiderLinks();
		
		if(is_object($results)){
		 
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
			    $spiderLink = new SpiderLinkEntity();						
				SpiderLinkEntity::setSpiderLinkFromDB($spiderLink, $row);
				
				$store = $spiderLink->getStore();
				$cust = $spiderLink->getCustomer();				
				$cat = $spiderLink->getCategory();				
				
				if (!isset($spiderLinks[$store]) || !is_array($spiderLinks[$store])){
				    $spiderLinks[$store] = array();
				}
				
				if (!isset($spiderLinks[$store][$cust]) || !is_array($spiderLinks[$store][$cust])){
				    $spiderLinks[$store][$cust] = array();
				}				
				
				$spiderLinks[$store][$cust][$cat] = $spiderLink->toArray();
			}
		}				
	
		return json_encode($spiderLinks);  
	}
	
	public function updateSpiderStatus($criteria){
	   if (isset($criteria) && is_array($criteria)){
	       $results = $this->productAdminDao->updateSpiderStatus($criteria);	       
	       return $results === 1 ? "success" : "failed";	              
	   }else{
	       return "Nothing to update";   
	   }
	}
	
	public function addSpiderLinks($criteriaList){
	   if (isset($criteriaList) && is_array($criteriaList)){
	       $successfullyAdded = 0;
	       
	       foreach ($criteriaList as $criteria) {    
	           if (isset($criteria) && is_array($criteria)){
	               $successfullyAdded += $this->productAdminDao->addSpiderLink($criteria);
	           }
	       }	       
	       
	       return $successfullyAdded;	              
	   }else{
	       return "Nothing to add";   
	   }
	}
	
	public function addSpiderLink($criteria){
	   if (isset($criteria) && is_array($criteria)){
	       $results = $this->productAdminDao->addSpiderLink($criteria);	       
	       return $results == 1 ? "success" : "failed";	              
	   }else{
	       return "Nothing to add";   
	   }
	}		
		
	public function updateSpiderLink($criteria){
	   if (isset($criteria) && is_array($criteria)){
	       $results = $this->productAdminDao->updateSpiderLink($criteria);	       
	       return $results == 1 ? "success" : "failed";	              
	   }else{
	       return "Nothing to add";   
	   }
	}
		
	public function removeSpiderLink($criteria){
	   if (isset($criteria) && is_array($criteria)){
	       return $this->productAdminDao->removeSpiderLink($criteria);	               
	   }else{
	       return "Nothing to add";   
	   }
	}
	
	public function removeUncategorizedProducts(){
	   return $this->productAdminDao->removeUncategorizedProducts();	               
	}
    
    public function addAdminProducts($products, $isLastInBatch){
        $results = array();
        /// echo " 3) addAdminProducts. ";
        	
		// 1) insert products to temp table
		// 2) into historical prices table (do join to get all exisiting products where the price has changed)
		// 3) update existing products (links?, images?, name?, PRICE) (from #2) (do join to get all exisiting products??? (necessary))					
		// 4) insert all new products (do left join to get all new products)	
		// 5) insert all categories/tags into Tags table

        $results['numProducts'] = count((array)$products);
		if(isset($products) && is_array($products) && count((array)$products) > 0){	
            // echo " 4) products are set. ";
            
            $this->createShortLinks($products);

			// Clear temp table
			$start = microtime();
			$clearProducts = $this->productAdminDao->clearTempProducts($products);
			$results['clearProductsTime'] = microtime() - $start;
			$results['clearProducts'] = $clearProducts;	
			$this->debug("ProductAdminController", "addAdminProducts", "clearProductsTime = " . $results['clearProductsTime']);				
			$this->debug("ProductAdminController", "addAdminProducts", "clearProducts = " . $results['clearProducts']);				
						
			if ($clearProducts){
			    // echo " 5) truncate table. "; 
			      			
         		// Step 1         		
         		$start = microtime();
         		$numberOfTempProducts = $this->productAdminDao->addTempProducts($products);			  
         		
         		if(is_numeric($numberOfTempProducts) && $numberOfTempProducts > 0){
         			// echo " 6) Inserted temp Products: " . $numberOfTempProducts;
         			$results['tempProductsTime'] = microtime() - $start;
                    $results['tempProducts'] = $numberOfTempProducts;   
                    $this->debug("ProductAdminController", "addAdminProducts", "tempProductsTime = " . $results['tempProductsTime']);				
        			$this->debug("ProductAdminController", "addAdminProducts", "tempProducts = " . $results['tempProducts']);                 

                    // Step 2
                    $start = microtime();
         			$saveHistoricalPricesResults = $this->productAdminDao->saveHistoricalPrices();
         			// echo " 7) Save Historical Prices: " . $saveHistoricalPricesResults;
         			$results['historicalPricesTime'] = microtime() - $start;
         			$results['historicalPrices'] = $saveHistoricalPricesResults;
         			$this->debug("ProductAdminController", "addAdminProducts", "historicalPricesTime = " . $results['historicalPricesTime']);				
        			$this->debug("ProductAdminController", "addAdminProducts", "historicalPrices = " . $results['historicalPrices']);          			         			
    
                    // Step 3
                    $start = microtime();
         			$updateExistingProducts = $this->productAdminDao->updateExistingProducts();
         			// echo " 8) Update Existing Products: " . $updateExistingProducts;
                    $results['updatedTime'] = microtime() - $start;
         			$results['updated'] = $updateExistingProducts;
         			$this->debug("ProductAdminController", "addAdminProducts", "updatedTime = " . $results['updatedTime']);				
        			$this->debug("ProductAdminController", "addAdminProducts", "updated = " . $results['updated']);         			
         			
         			// Step 4
         			$start = microtime();
         			$addNewProductsResults = $this->productAdminDao->addNewProducts();         		
         			// echo " 9) Added New Products: " . $addNewProductsResults;   
         			$results['newTime'] = microtime() - $start;
         			$results['new'] = $addNewProductsResults;
         			$this->debug("ProductAdminController", "addAdminProducts", "newTime = " . $results['newTime']);				
        			$this->debug("ProductAdminController", "addAdminProducts", "new = " . $results['new']);
         			
         			// Step 5
         			if ($isLastInBatch){
             			$start = microtime();
             			$updatedProductStatus = $this->productAdminDao->setMissingProductsToNotAvailable($products);
                        // echo " 11) Update Products Statuses: " . $updatedProductStatus;
                        $results['updatedStatusTime'] = microtime() - $start;
                        $results['updatedStatus'] = $updatedProductStatus;
                        $this->debug("ProductAdminController", "addAdminProducts", "updatedStatusTime = " . $results['updatedStatusTime']);				
            			$this->debug("ProductAdminController", "addAdminProducts", "updatedStatus = " . $results['updatedStatus']);
         			}
         		}
			}
		}else{
		  // echo "not validated";
		  // echo " 1)" . isset($products) ;
		  // echo " 2)" . is_object($products);
		  // echo " 3)" . count((array)$products) ; 
		}
	
		return $results;
	}
		
	public function getTotalProductsCount(){
	   $result = $this->productAdminDao->getTotalProductsCount();	    
	   return $result->fetchOne();
	}
	
	public function getBrowsePages(){
	   $maxpages = 301;
	   $limit = 50;
	   $page = 0;	   	   
	   
	   // WOMEN
	   $criteria = new ProductCriteria();	   
	   $criteria->setCustomers(array("women"));	   	   
	   
	   $results = $this->productController->getProducts($criteria, $page, $limit, true);     	   	   
	   $data = json_decode($results, true);
	   
	   while (!empty($data) && $page < $maxpages){	       	       
    	   $file = fopen(dirname(__FILE__) . "/../Data/Browse/w-".$page.".json","w");
           fwrite($file, $results);                       
           fclose($file);
           
           echo "WOMEN $page<br> ";                     
           $page++;
           $results = $this->productController->getProducts($criteria, $page, $limit, true);     	   	   
	       $data = json_decode($results, true);           
	   }
	   
	   // MEN
	   $page = 0;
	   $criteria = new ProductCriteria();	   
	   $criteria->setCustomers(array("men"));	   	   
	   
	   $results = $this->productController->getProducts($criteria, $page, $limit, true);     	   	   
	   $data = json_decode($results, true);
	   
	   while (!empty($data) && $page < $maxpages){	       	       
    	   $file = fopen(dirname(__FILE__) . "/../Data/Browse/m-".$page.".json","w");
           fwrite($file, $results);                       
           fclose($file);
           
           echo "MEN $page<br> ";                     
           $page++;
           $results = $this->productController->getProducts($criteria, $page, $limit, true);     	   	   
	       $data = json_decode($results, true);           
	   }	   	 
	   
	   // BOTH
	   $page = 0;
	   $criteria = new ProductCriteria();	   	   	   	   
	   
	   $results = $this->productController->getProducts($criteria, $page, $limit, true);     	   	   
	   $data = json_decode($results, true);
	   
	   while (!empty($data) && $page < $maxpages){	       	       
    	   $file = fopen(dirname(__FILE__) . "/../Data/Browse/b-".$page.".json","w");
           fwrite($file, $results);                       
           fclose($file);
           
           echo "BOTH $page<br> ";                     
           $page++;
           $results = $this->productController->getProducts($criteria, $page, $limit, true);     	   	   
	       $data = json_decode($results, true);           
	   }  
	}				
	
	public function getNonLiveProducts($page, $limit){	    
	           
        $searchResults = array();
	    		
		if(isset($page) && isset($limit)){	
		      
			$results = $this->productAdminDao->getNonLiveProducts($page, $limit);
			
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
	
	public function deleteUnwantedProducts(){
	   echo "Removing Unwanted Products... \n";
	   $results = $this->productAdminDao->deleteUnwantedProducts();
	   echo "Removed $results Products!";
	}
	
	public function updateAllShortLinks(){
	   echo "Updating Short Links";
	   echo "<br>Getting Products.";
	   $products = array(); 
	   $results = $this->productAdminDao->getProductsForUpdatingShortLinks(0, 5000);
	   
	   if(is_object($results)){
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
			    $productEntity = new ProductEntity();				
				ProductEntity::setProductFromDB($productEntity, $row);				
				$products[] = $productEntity;				
			}
	   }
	     
	   if(count($products) > 0){	                    
	        echo "<br>Creating Short Links.";
            $this->createShortLinks($products);
            //print_r($products);
            echo "<br>Updating Short Links.";
            return $this->productAdminDao->updateAllShortLinks($products);
	   }else{
	       echo "<br>No products to update! ";   
	   }  
	   
	   return "DID NOT UPDATE SHORT LINKS";
	} 
	
	private function createShortLinks(&$products){
	   $links = array();
	   $b=0;
	   
	   foreach($products as $sku => $p){
	       	       
	       if ($p instanceof ProductEntity){
	           $shortlink = str_replace(" ", "-", $p->getStore()) . "-" . str_replace(" ", "-", $p->getCategory()) . "-" . str_replace(" ", "-", $p->getName());	
	       }else if (isset($p['s'])){	       
	           $shortlink = str_replace(" ", "-", $p['o']) . "-" . str_replace(" ", "-", $p['a']) . "-" . str_replace(" ", "-", $p['n']);	
	       }else{   
	           $shortlink = str_replace(" ", "-", $p['company']) . "-" . str_replace(" ", "-", $p['category']) . "-" . str_replace(" ", "-", $p['name']);	
	       }
	       
	       $shortlink = strtolower($this->cleanUrl($shortlink));	
	       	       
	       if(in_array($shortlink, $links)){
	           $count = 2;
	           
	           while(in_array($shortlink. "-" . $count, $links)){
	               $count++;            
	           }
	           
	           $shortlink .= "-" . $count;	           
	       }
	       	       
	       $b++;	       	       
	       
	       // manual override:
	       $shortlink .= "-" . rand(0,100000);
	       
	       $links[] = $shortlink;	     
	       
	       if ($p instanceof ProductEntity){
	           $products[$sku]->setShortLink($shortlink);	       	   
	       }else if (isset($p['s'])){ 
	           $products[$sku]['sl'] = $shortlink;	       	    
	       }else{
	           $products[$sku]['shortlink'] = $shortlink;	       	    
	       }
	   }  
	}	
	
	public function getProductDetailCount(){
	   $status = array();	    			      
	   $notScrapedCount = $this->productAdminDao->getProductDetailCount(); 
		
	   if(is_object($notScrapedCount)){		 
            $status[] = $notScrapedCount->fetchOne();
	   }
	   
	   $scrapedCount = $this->productAdminDao->getTotalLiveProductsCount(); 
		
	   if(is_object($scrapedCount)){
            $status[] = $scrapedCount->fetchOne();
	   }	   
	
	   return json_encode($status);
	}
	
	public function getStoreProductCount($getOnlyLiveProducts){    			      	   	   
	    $stores = array();	    
	    $results = $this->productAdminDao->getStoreProductCount($getOnlyLiveProducts); 	
	   	   
    	if(is_object($results)){
    	 
    		while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
                $stores[$row[PRODUCT_STORE]] = $row['count'];
    		}    		
    	}
	   		   	   		     
	    return json_encode($stores);
	}
	
	public function getSpiderStats(){
	    $stores = array();	    
	    $results = $this->productAdminDao->getSpiderStats(); 	
	   	   
    	if(is_object($results)){
    	 
    		while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
                $stores[$row[SPIDER_STORE]] = array('total' => $row['total'], 'broken' => $row['broken']);
    		}    		
    	}
	   		   	   		     
	    return json_encode($stores);
	}
	
	public function getNextProductDetailUrls($stores, $limit = 1){	  
	    if ($stores == null || !isset($stores) || !is_array($stores)){
	       return "No Stores";  
	    }
	    
	    $results = $this->productAdminDao->getNextProductDetailUrls($stores, $limit);
		$searchResults = array();
		
		if(is_object($results)){
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){
			    $productEntity = new ProductEntity();
				ProductEntity::setProductFromDB($productEntity, $row);
				$searchResults[] = $productEntity->toArray();
			}
		}
		
		return json_encode($searchResults);
	}
	
	public function saveProductDetails($criteria){
	   
	   if (isset($criteria) && is_array($criteria)){
	       $results = $this->productAdminDao->saveProductDetails($criteria);	       
	       return is_numeric($results) && $results > 0 ? "success" : "failed";	              
	   }else{
	       return "Nothing to add";   
	   }
	}
	
	public function hideProductFromBrowsing($skus){
	   if (!isset($skus) || !is_array($skus))
	   {
	       return "Missing info. Can't proceed";   
	   }
	   
	   $affectedRows = $this->productAdminDao->hideProductFromBrowsing($skus);  
	   return $affectedRows > 0 ? "success" : "failed";
	}
	
	private function convertResultsToArray($results){
	   $arr = array();
	   
	   if(is_object($results)){
			while($field = $results->fetchOne()){	
				$arr[] = $field;
			}
	   }  
	   
	   return $arr;
	}
	
	// Returns a url stripped of any characters that are not allowed in urls
	private function cleanUrl($url) {
      $url = preg_replace('~[^\\pL0-9_]+~u', '-', $url);
      $url = trim($url, "-");
      $url = iconv("utf-8", "us-ascii//TRANSLIT", $url);
      $url = strtolower($url);
      $url = preg_replace('~[^-a-z0-9_]+~', '', $url);
      return $url;
   }
   
}

?>