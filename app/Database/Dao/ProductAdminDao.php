<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/AbstractDao.php');
require_once('Date.php');

class ProductAdminDao extends AbstractDao {     
    
    public function getSpiderLinks(){
		
		$sql = "SELECT " .
    		        SPIDER_STORE . "," .
                    SPIDER_CUSTOMER . "," .
                    SPIDER_CATEGORY . "," .
                    SPIDER_LINK . "," .
                    SPIDER_TAGS . "," .
                    SPIDER_COUNT . "," .
                    SPIDER_STATUS . "," .
                    SPIDER_LAST_SAVED .
				" FROM " . SPIDER .				
				" ORDER BY " . 
    				SPIDER_STORE . "," .
                    SPIDER_CUSTOMER . "," .
                    SPIDER_CATEGORY;							
        
		$paramTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "9348023903");
	}
	
	public function updateSpiderStatus($criteria){	   
        $sql = "UPDATE " . SPIDER .        	 
                " SET " . 
                    SPIDER_STATUS. " = :status ";
        
        $paramTypes = array('text');
        
        if (isset($criteria['count'])){
            $sql .= ", " . SPIDER_COUNT . " = :count ";        
            $paramTypes[] = 'integer';
        }    
        
        if ($criteria['status'] == 1){
            $sql .= ", " . SPIDER_LAST_SAVED . " = NOW() ";        
        }    

        $sql .= " WHERE ".SPIDER_STORE." = :store AND ".SPIDER_CUSTOMER." = :customer AND ".SPIDER_CATEGORY." = :category"; 
                                
        $paramTypes[] = 'text';
        $paramTypes[] = 'text';
        $paramTypes[] = 'text';                                                        
        
        return $this->update($sql, $criteria, $paramTypes, "92374034");
    }
        
    public function addSpiderLink($criteria){
        $sql = "INSERT INTO " . SPIDER .        	 
                "(". SPIDER_STORE . "," . 
                     SPIDER_CUSTOMER . "," . 
                     SPIDER_CATEGORY . "," . 
                     SPIDER_LINK . "," . 
                     SPIDER_TAGS . ")" .                 
                " VALUES (:store, :customer, :category, :link, :tags)";                                
        
        $paramTypes = array('text','text','text','text','text');
        return $this->update($sql, $criteria, $paramTypes, "392874293");
    }
        
    public function updateSpiderLink($criteria){
        $sql = "UPDATE " . SPIDER .        	 
                " SET " .
                    SPIDER_STORE." = :store , " .
                    SPIDER_CUSTOMER." = :customer ," .
                    SPIDER_CATEGORY." = :category ," .
                    SPIDER_LINK . " = :link ," . 
                    SPIDER_TAGS . " = :tags " .                 
                " WHERE ".SPIDER_STORE." = :oldStore AND ".SPIDER_CUSTOMER." = :oldCustomer AND ".SPIDER_CATEGORY." = :oldCategory";                                
        
        $paramTypes = array('text','text','text','text','text','text','text','text');
        return $this->update($sql, $criteria, $paramTypes, "92384729");
    }
        
    public function removeSpiderLink($criteria){
        $sql = "DELETE FROM " . SPIDER .        	                 
                " WHERE ".SPIDER_STORE." = :store AND ".SPIDER_CUSTOMER." = :customer AND ".SPIDER_CATEGORY." = :category";                                
        
        $paramTypes = array('text','text','text');
        $affected = $this->update($sql, $criteria, $paramTypes, "0239842097");        
        $affectedProducts = $this->removeSpiderLinkProducts($criteria);
        
        return $affectedProducts + $affected; 
    }
    
    public function removeSpiderLinkProducts($criteria){
        $sql = "DELETE FROM " . PRODUCTS .        	                 
                " WHERE ".PRODUCT_STORE." = :store AND ".PRODUCT_CUSTOMER." = :customer AND ".PRODUCT_CATEGORY." = :category";                                
        
        $paramTypes = array('text','text','text');
        return $this->update($sql, $criteria, $paramTypes, "2398472");
    }
    
    public function removeUncategorizedProducts(){                
        $sql = "SET SQL_SAFE_UPDATES='OFF'; ";
    
        $sql .= "DELETE p FROM " . PRODUCTS . " p " .
                " LEFT JOIN " . SPIDER . " s ON " .
                    " s.".SPIDER_STORE." = p.".PRODUCT_STORE." AND " .
                    " s.".SPIDER_CUSTOMER." = p.".PRODUCT_CUSTOMER." AND ".
                    " s.".SPIDER_CATEGORY." = p.".PRODUCT_CATEGORY . 
                " WHERE COALESCE(s.".SPIDER_STORE.", 'n') = 'n';";
                
        $sql .= " SET SQL_SAFE_UPDATES='ON'; ";        
                  
        return $this->update($sql, array(), array(), "0123984710");
    }
    
    public function clearTempProducts($products){                
        $sql = " DELETE FROM " . TEMP_PRODUCTS . 
                " WHERE ". PRODUCT_STORE . " <> ? OR " . 
                      PRODUCT_CUSTOMER . " <> ? OR " . 
                      PRODUCT_CATEGORY . " <> ?";    
        
        $paramTypes = array('text','text','text');
        list($firstProduct) = array_values($products);
        $params = array($firstProduct['company'], $firstProduct['customer'], $firstProduct['category']);
        return $this->update($sql, $params, $paramTypes, "98347223");
    }  			
	
	public function addTempProducts($products){
	    if(!isset($products) || !is_array($products)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT IGNORE INTO " . TEMP_PRODUCTS . 
	           " (" . PRODUCT_SKU . "," .
                      PRODUCT_STORE . "," . 
                      PRODUCT_CUSTOMER . "," . 
                      PRODUCT_CATEGORY . "," . 
                      PRODUCT_NAME . "," . 
                      PRODUCT_LINK . "," . 
                      PRODUCT_IMAGE . "," . 
                      PRODUCT_PRICE . "," . 
                      PRODUCT_COMMENT_COUNT . "," . 
                      PRODUCT_CLOSITT_COUNT . "," .
                      PRODUCT_SHORT_LINK . "," . 
                      PRODUCT_DATE_UPDATED . ")" .
	           " VALUES (?, ?, ?, " .
	                    "?, ?, ?, " .
	                    "?, ?, 0, " .
	                    "0, ?, NOW())";	                    	                 
        
        $paramTypes = array('text','text','text','text','text','text','text','decimal','text');
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        
        if($this->debug){		    
			$this->logDebug("128763191" ,$sql);
		}	
        
        $affectedRows = 0;
        foreach ($products as $key => $value) {
            
            try {                                         
                $params = array($value['sku'],
                                $value['company'],
                                $value['customer'],
                                $value['category'],
                                $value['name'],
                                $value['link'],
                                $value['image'],
                                $value['price'],
                                $value['shortlink']);
                
                $results = $stmt->execute($params);                                                                
                                
                if (is_numeric($results)){
                    if ($results === 0){
                        $results = 1;   
                    }
                    
                    $affectedRows += $results;
                }
                
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
        }        
        
        return $affectedRows;
	}
	
	public function addNewProducts(){	    			 	 
	    $sql = "INSERT IGNORE INTO " . PRODUCTS . 
	           " (" . PRODUCT_SKU . "," .
                      PRODUCT_STORE . "," . 
                      PRODUCT_CUSTOMER . "," . 
                      PRODUCT_CATEGORY . "," . 
                      PRODUCT_NAME . "," . 
                      PRODUCT_LINK . "," . 
                      PRODUCT_IMAGE . "," . 
                      PRODUCT_PRICE . "," . 
                      PRODUCT_COMMENT_COUNT . "," . 
                      PRODUCT_CLOSITT_COUNT . "," . 
                      PRODUCT_SHORT_LINK . "," . 
                      PRODUCT_STATUS . "," .
                      PRODUCT_RANDOM_INDEX . "," .
                      PRODUCT_DATE_UPDATED . "," .                       
                      PRODUCT_CREATED_ON . ")" .
               " SELECT " . PRODUCT_SKU . "," .
                      PRODUCT_STORE . "," . 
                      PRODUCT_CUSTOMER . "," . 
                      PRODUCT_CATEGORY . "," . 
                      PRODUCT_NAME . "," . 
                      PRODUCT_LINK . "," . 
                      PRODUCT_IMAGE . "," . 
                      PRODUCT_PRICE . "," . 
                      PRODUCT_COMMENT_COUNT . "," . 
                      PRODUCT_CLOSITT_COUNT . "," . 
                      PRODUCT_SHORT_LINK . "," . 
                      " 1 ," .
                      " RAND() ," .
                      "NOW() ," .
                      "NOW() " .
               " FROM " . TEMP_PRODUCTS . " tp ";
        
        return $this->update($sql, array(), array(), "324987239");
	}	
	
	public function updateExistingProducts(){	   	 
	   
	   //$sql = "SET SQL_SAFE_UPDATES='OFF'; ";  
	   $sql = "UPDATE IGNORE " . PRODUCTS . " p " .
        	  " INNER JOIN " . TEMP_PRODUCTS . " tp ON tp." . PRODUCT_SKU . " = p." . PRODUCT_SKU .
              " SET " .
              "p." .PRODUCT_NAME . " = tp." . PRODUCT_NAME . "," .
              "p." .PRODUCT_LINK . " = tp." . PRODUCT_LINK . "," .
              "p." .PRODUCT_IMAGE . " = tp." . PRODUCT_IMAGE . "," .
              "p." .PRODUCT_PRICE . " = tp." . PRODUCT_PRICE . "," . 
              "p." .PRODUCT_DATE_UPDATED. " = tp." . PRODUCT_DATE_UPDATED . "," .
              "p." .PRODUCT_STATUS. " = CASE WHEN p.".PRODUCT_STATUS." = 3 THEN 1 ELSE p.".PRODUCT_STATUS." END; ";               
       //$sql .= "SET SQL_SAFE_UPDATES='ON'; ";       
              
       return $this->update($sql, array(), array(), "923847293");
	}		
	
	public function saveHistoricalPrices(){				
		$sql = "INSERT INTO " . HISTORICAL_PRICES .
		       " (" . PRODUCT_SKU . "," .
		              HISTORICAL_OLD_PRICE . "," .
                      HISTORICAL_NEW_PRICE . "," .
                      HISTORICAL_DATE . ")" .		
    		   "SELECT " .
    				" tp." . PRODUCT_SKU . ", " .
    				" p." . PRODUCT_PRICE . " as " . HISTORICAL_OLD_PRICE . ", " .
    				" tp." . PRODUCT_PRICE . " as " . HISTORICAL_NEW_PRICE . ", " .    				 
    				" NOW() as " . HISTORICAL_DATE . 
    				" FROM " . TEMP_PRODUCTS . " tp " .
    				" INNER JOIN " . PRODUCTS . " p ON p." . PRODUCT_SKU . " = tp." . PRODUCT_SKU . 
    				" WHERE tp." . PRODUCT_PRICE . " <> p." . PRODUCT_PRICE;
		
		return $this->update($sql, array(), array(), "3249873");		
	}  	
	
	public function setMissingProductsToNotAvailable($products){       

	   $sql = "UPDATE " . PRODUCTS . " p " .
              " LEFT JOIN " . TEMP_PRODUCTS . " tp ON tp." . PRODUCT_SKU . " = p." . PRODUCT_SKU .
              " SET p." .PRODUCT_STATUS . " = 3 " .
              " WHERE ISNULL(tp.".PRODUCT_SKU.") AND " .
              " p.".PRODUCT_STORE." = ? AND p.".PRODUCT_CUSTOMER." = ? AND p.".PRODUCT_CATEGORY." = ? ";        
        
        $paramTypes = array('text','text','text');
		list($firstProduct) = array_values($products);
		$params = array($firstProduct['company'], $firstProduct['customer'], $firstProduct['category']);
        
        return $this->update($sql, $params, $paramTypes, "239842023");
    }
	
	public function getTotalProductsCount(){	    	   
	    $sql = "SELECT COUNT(1) FROM " . PRODUCTS;		
        return $this->getResults($sql, array(), array(), "324872");		
	}
	
	public function getTotalLiveProductsCount(){	    	   
	    $sql = "SELECT COUNT(1) as count FROM " . PRODUCTS . " WHERE status = 1";
		return $this->getResults($sql, array(), array(), "32940237");				
	}
	
	public function getNonLiveProducts($page, $limit){
	   $offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .				
				" WHERE " . PRODUCT_STATUS . " NOT IN (1,4) " .
				" ORDER BY " . PRODUCT_STATUS . 
				" LIMIT ? OFFSET ?";								
        
		$paramTypes = array('integer','integer');		
		$params = array($limit, $offset);
		
		return $this->getResults($sql, $params, $paramTypes, "24928342");
	}
	
	public function getProductsForUpdatingShortLinks($page, $limit){					
		$offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .				
				" WHERE ISNULL(" . PRODUCT_SHORT_LINK . ") " .
				" ORDER BY " . PRODUCT_STORE . ", " . PRODUCT_NAME .
				" LIMIT ? OFFSET ?";								
        
		$paramTypes = array('integer','integer');		
		$params = array($limit, $offset);
		
		return $this->getResults($sql, $params, $paramTypes, "2309842");
	}
	
	
	public function updateAllShortLinks($products, $skipNulls = true){
	   $sql = "UPDATE " . PRODUCTS .       	  
              " SET " . PRODUCT_SHORT_LINK . " = ? " . 
              " WHERE " . PRODUCT_SKU . " = ? ";
              
       if($skipNulls){        
            $sql .= " AND ISNULL(" . PRODUCT_SHORT_LINK . ")"; 
       }              
        
        $paramTypes = array('text', 'text');
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
        foreach ($products as $key => $value) {
            
            try {                         
                $params = array();
                $params[] = $value->getShortLink();
                $params[] = $value->getId();                     
                $result = $stmt->execute($params);
                
                if (is_numeric($result)){
                    $affectedRows += $result;   
                }
                
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
        }
        
        return $affectedRows;
	}
	
	public function deleteUnwantedProducts(){
	     $sql = "UPDATE " . PRODUCTS .       	  
              " SET " . PRODUCT_STATUS . " = 5 " . 
              " WHERE " . PRODUCT_SKU . " IN (SELECT " . PRODUCT_SKU . " FROM " . TAGS . " WHERE " . TAG_STRING . " IN ('delete','notclothes','remove') )";                            
        
        $this->update($sql, array(), array(), "2309823");
        
        // Closetid 155 and 146 are ben and eli's delete clositts
        $sql = "SET SQL_SAFE_UPDATES='OFF'; " .
               " UPDATE " . PRODUCTS . " p " .
               " RIGHT JOIN " . CLOSET_ITEMS . " c ON c.".PRODUCT_SKU." = p.".PRODUCT_SKU .
               " SET p.".PRODUCT_STATUS." = 5 " .
               " WHERE c.". CLOSET_ID." IN (155, 146); ".
               " SET SQL_SAFE_UPDATES='ON';";
               
        return $this->update($sql, array(), array(), "2309824");       
	}
	
	public function getCustomers(){	   
	   $sql = "SELECT DISTINCT " . PRODUCT_CUSTOMER .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_CUSTOMER;					
        
		return $this->getResults($sql, array(), array(), "2387462");
	}
	
	public function getCategories(){
	   $sql = "SELECT DISTINCT " . PRODUCT_CATEGORY . "," . PRODUCT_CUSTOMER .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_CATEGORY . "," . PRODUCT_CUSTOMER;					
        
		return $this->getResults($sql, array(), array(), "232352352");
	}
	
	public function getCompanies(){
	   $sql = "SELECT DISTINCT " . PRODUCT_STORE . "," . PRODUCT_CUSTOMER .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_STORE . "," . PRODUCT_CUSTOMER;
        
		return $this->getResults($sql, array(), array(), "98237923");
	}		
	
	public function getUniqueTags(){
	   $sql = "SELECT DISTINCT " . TAG_STRING . 
				" FROM " . TAGS . " t " .
				" LEFT JOIN " . PRODUCTS . " p ON p." . PRODUCT_SKU . " = t." . PRODUCT_SKU .
				" WHERE " . TAG_APPROVED . " = 0 " .
				" AND p." . PRODUCT_STATUS . " = 1 " . 			
				" ORDER BY " . TAG_STRING;
        
		return $this->getResults($sql, array(), array(), "2342837429");
	}	
	
	public function getProductDetailCount(){
	   $sql = "SELECT count(1) as count" .
				" FROM " . PRODUCTS .
				" WHERE status = 1 AND " . PRODUCT_DETAIL_UPDATED . " >= DATE_SUB(NOW(), INTERVAL 3 MONTH)";
        
		return $this->getResults($sql, array(), array(), "29837492");
	}	
	
	public function getNextProductDetailUrls($stores, $limit){
		if (!isset($stores) || !is_array($stores) || count($stores) <= 0){
		      return null; 
		}
		
		$sql = "SELECT " .				
    		        PRODUCT_SKU . "," .
    		        PRODUCT_STORE . "," .
    		        PRODUCT_LINK . 		        
				" FROM " . PRODUCTS .				
				" WHERE ".PRODUCT_STATUS." = 1 AND " . 
				    "(" . PRODUCT_DETAIL_UPDATED . " is null OR ".
				          PRODUCT_DETAIL_UPDATED . " < DATE_SUB(NOW(), INTERVAL 3 MONTH)" .
				    ") ";
		
		$paramTypes = array();		
		$params = array();
		$storePlaceholders = '';
		
		foreach ($stores as $store) {    
            try {   
                $params[] = $store;
                $paramTypes[] = 'text';  
                
                if ($storePlaceholders != ''){
                    $storePlaceholders .= ",";   
                }
                
                $storePlaceholders .= "?";
                      
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
        }	   
        
        $sql .= " AND ".PRODUCT_STORE." IN (" . $storePlaceholders . ")" .
				" LIMIT ?";
        
        $paramTypes[] = 'integer';		
		$params[] = $limit;     
		
		return $this->getResults($sql, $params, $paramTypes, "235252462");
	}
	
	public function saveProductDetails($criteria){	   	   
	   $sql = "UPDATE " . PRODUCTS .        	 
                " SET " .
                    PRODUCT_SUMMARY." = :summary , " .
                    PRODUCT_DETAILS." = :details ," .
                    PRODUCT_PROMOTION." = :promotion ," .
                    PRODUCT_PROMOTION_TWO . " = :promotionTwo ," .
                    PRODUCT_DETAIL_UPDATED . " = NOW() " .
                " WHERE ".PRODUCT_SKU." = :sku";                               
        
        $paramTypes = array('text','text','text','text','text');
        $product = array();
        $product['summary'] = $criteria['summary'];
        $product['details'] = $criteria['details'];
        $product['promotion'] = $criteria['promotion'];
        $product['promotionTwo'] = $criteria['promotionTwo'];
        $product['sku'] = $criteria['sku'];

        $affected = $this->update($sql, $product, $paramTypes, "2309472074");						    
        $affectedSwatches = $this->saveProductDetailSwatches($criteria);
        $affectedSizes = $this->saveProductDetailSizes($criteria);
                
        return $affected + $affectedSwatches + $affectedSizes;
	}
	
	public function saveProductDetailSwatches($criteria){	    
	   
	    if (!isset($criteria['swatches']) || 
	         $criteria['swatches'] == null || 
	         !is_array($criteria['swatches']) || 
	         count($criteria['swatches']) <= 0 || 
	         $criteria['sku'] == null){

	       return 0;   
	    }
	   
	   $sql = "INSERT INTO " . SWATCHES . 
	          " (" . PRODUCT_SKU . "," . SWATCHES_IMAGE . ")" .       	  
              " VALUES (?,?) ";                                    
        
        $paramTypes = array('text', 'text');         
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $totalAffectedRows = 0;
        
        foreach ($criteria['swatches'] as $swatch) {                            
            try {   
                $params = array($criteria['sku'], $swatch);                               
                $affectedRows = $stmt->execute($params); 
                
                if ($this->PEAR->isError($affectedRows)) {
        			$this->logError("928372923" ,$affectedRows->getMessage(),$sql);
        		    return false;
        		} 
                        
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
            
            if (is_numeric($affectedRows)){
                $totalAffectedRows += $affectedRows;
            }            
        }                        
        
        return $totalAffectedRows;
	}
	
	public function saveProductDetailSizes($criteria){
	    if (!isset($criteria['sizes']) || 
	         $criteria['sizes'] == null || 
	         !is_array($criteria['sizes']) || 
	         count($criteria['sizes']) <= 0 || 
	         $criteria['sku'] == null){

	       return 0;   
	    }
	   
	   $sql = "INSERT INTO " . SIZES . 
	          " (" . PRODUCT_SKU . "," . SIZES_SIZE . ")" .       	  
              " VALUES (?,?) ";                                    
        
        $paramTypes = array('text', 'text');         
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $totalAffectedRows = 0;
        
        foreach ($criteria['sizes'] as $size) {                            
            try {   
                $params = array($criteria['sku'], $size);                               
                $affectedRows = $stmt->execute($params); 
                
                if ($this->PEAR->isError($affectedRows)) {
        			$this->logError("65223423" ,$affectedRows->getMessage(),$sql);
        		    return false;
        		} 
                        
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
            
            if (is_numeric($affectedRows)){
                $totalAffectedRows += $affectedRows;
            }            
        }                        
        
        return $totalAffectedRows;
	}		
	
	public function getStoreProductCount($getOnlyLiveProducts){   
	    $statuses = '';
	    
	    if ($getOnlyLiveProducts){
	       $statuses = "1,2,4";   
	    }else{
	       $statuses = "3,5";
	    }   
	                    
        $sql = "SELECT " . PRODUCT_STORE . ", COUNT(1) as count FROM " . PRODUCTS .
                " WHERE " . PRODUCT_STATUS . " IN (" . $statuses . ") " .
                " GROUP BY " . PRODUCT_STORE . 
                " ORDER BY " . PRODUCT_STORE;							        
		
		return $this->getResults($sql, array(), array(), "23920342023");	   
	}
	
	public function getSpiderStats(){
                
        $sql = "SELECT " . PRODUCT_STORE . ", COUNT(1) AS  total, " . 
                "(SELECT COUNT(1) FROM " . SPIDER . " s2 WHERE s2." . SPIDER_STORE . " = s." . SPIDER_STORE . " AND s2." . SPIDER_STATUS . " = 2) as broken " .
                " FROM " . SPIDER . " s " . 
                " GROUP BY s." . SPIDER_STORE . 
                " ORDER BY broken DESC, total DESC";
		
		return $this->getResults($sql, array(), array(), "203942052718");	   
	}
	
	public function hideProductFromBrowsing($skus){	   
	   if (!isset($skus) || !is_array($skus) || count($skus) <= 0){
	       return;   
	   }
	   	   
	   $sql = "UPDATE " . PRODUCTS .        	 
              " SET " . PRODUCT_RANDOM_INDEX." = -1 ";                              
        
        $paramTypes = array();
        $params = array();        
        $skuPlaceholders = '';               
        
        foreach ($skus as $sku) {    
            $params[] = $sku;
            $paramTypes[] = 'text';  
            
            if ($skuPlaceholders != ''){
                $skuPlaceholders .= ",";   
            }
            
            $skuPlaceholders .= "?";                      
        }
        
        $sql .= " WHERE " . PRODUCT_SKU . " IN (" . $skuPlaceholders . ")"; 
        
        return $this->update($sql, $params, $paramTypes, "09874073492");						    
	}				
}
?>