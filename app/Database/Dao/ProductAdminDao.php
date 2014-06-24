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
                    SPIDER_CATEGORY;;								
        
		$paramsTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "9348023903");
	}
	
	public function updateSpiderStatus($criteria){	   
        $sql = "UPDATE " . SPIDER .        	 
                " SET " . 
                    SPIDER_STATUS. " = :status ";
        
        if (isset($criteria['count'])){
            $sql .= ", " . SPIDER_COUNT . " = :count ";        
        }    
        
        if ($criteria['status'] == 1){
            $sql .= ", " . SPIDER_LAST_SAVED . " = NOW() ";        
        }    

        $sql .= " WHERE ".SPIDER_STORE." = :store AND ".SPIDER_CUSTOMER." = :customer AND ".SPIDER_CATEGORY." = :category"; 
                                
        if($this->debug){		    
			$this->logDebug("92374034" , $sql);
		}
        
        $stmt = $this->db->prepare($sql);
        $affected =  $stmt->execute($criteria);                                   		
		
		if (PEAR::isError($affected)) {
			$this->logError("2383294" ,$affected->getMessage(),$sql);
		    return false;
		}	        
        
        return $affected; 
    }
        
    public function addSpiderLink($criteria){
        $sql = "INSERT INTO " . SPIDER .        	 
                "(". SPIDER_STORE . "," . 
                     SPIDER_CUSTOMER . "," . 
                     SPIDER_CATEGORY . "," . 
                     SPIDER_LINK . "," . 
                     SPIDER_TAGS . ")" .                 
                " VALUES (:store, :customer, :category, :link, :tags)";
                                
        if($this->debug){		    
			$this->logDebug("392874293" , $sql);
		}
        
        $stmt = $this->db->prepare($sql);
        $affected = $stmt->execute($criteria);                                   		
		
		if (PEAR::isError($affected)) {
			$this->logError("9438519" ,$affected->getMessage(),$sql);
		    return false;
		}	        
        
        return $affected; 
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
                                
        if($this->debug){		    
			$this->logDebug("92384729" , $sql);
		}
        
        $stmt = $this->db->prepare($sql);
        $affected = $stmt->execute($criteria);                                   		
		
		if (PEAR::isError($affected)) {
			$this->logError("29384691" ,$affected->getMessage(),$sql);
		    return false;
		}	        
        
        return $affected; 
    }
        
    public function removeSpiderLink($criteria){
        $sql = "DELETE FROM " . SPIDER .        	                 
                " WHERE ".SPIDER_STORE." = :store AND ".SPIDER_CUSTOMER." = :customer AND ".SPIDER_CATEGORY." = :category";
                                
        if($this->debug){		    
			$this->logDebug("2342352" , $sql);
		}
        
        $stmt = $this->db->prepare($sql);
        $affected =  $stmt->execute($criteria);                                   		
		
		if (PEAR::isError($affected)) {
			$this->logError("230472" ,$affected->getMessage(),$sql);
		    return false;
		}	        
        
        $affectedProducts = $this->removeSpiderLinkProducts($criteria);
        return $affectedProducts + $affected; 
    }
    
    public function removeSpiderLinkProducts($criteria){
        $sql = "DELETE FROM " . PRODUCTS .        	                 
                " WHERE ".PRODUCT_STORE." = :store AND ".PRODUCT_CUSTOMER." = :customer AND ".PRODUCT_CATEGORY." = :category";
                                
        if($this->debug){		    
			$this->logDebug("2398472" , $sql);
		}
        
        $stmt = $this->db->prepare($sql);
        $affected =  $stmt->execute($criteria);                                   		
		
		if (PEAR::isError($affected)) {
			$this->logError("2374629" ,$affected->getMessage(),$sql);
		    return false;
		}	        
        
        return $affected; 
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
                                
        if($this->debug){		    
			$this->logDebug("0123984710" , $sql);
		}
                                        		
        $affected = $this->db->exec($sql);
		
		if (PEAR::isError($affected)) {
			$this->logError("123087410" ,$affected->getMessage(),$sql);
		    return false;
		}	        
        
        return $affected;
    }
    
    public function clearTempProducts($products){
        $sql = "DELETE FROM " . TEMP_PRODUCTS . 
                " WHERE ". PRODUCT_STORE . " <> ? OR " . 
                      PRODUCT_CUSTOMER . " <> ? OR " . 
                      PRODUCT_CATEGORY . " <> ?";                                        
        
        $stmt = $this->db->prepare($sql);
        $affectedRows = 0;
        list($firstProduct) = array_values($products);
        
        if($this->debug){		                
            $prod = print_r($firstProduct, true);
			$this->logDebug("98347223" ,$sql . " (" . $prod.")" );
		}
            
        try {                                          
            $affectedRows = $stmt->execute(array($firstProduct['company'], $firstProduct['customer'], $firstProduct['category']));
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
        }        
		
		if (PEAR::isError($result)) {
			$this->logError("98347223" ,$result->getMessage(),$sql);
		    return false;
		}				
		
		return true;
    }  			
	
	public function addTempProducts($products){
	    if(!isset($products) || !is_array($products)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . TEMP_PRODUCTS . 
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
	           " VALUES (:sku, :company, :customer, " .
	                    ":category, :name, :link, " .
	                    ":image, :price, 0, " .
	                    "0, :shortlink, NOW())";	                    	          
        
        if($this->debug){		    
			$this->logDebug("873242" ,$sql );
		}
        
        $stmt = $this->db->prepare($sql);
        $affectedRows = 0;
        foreach ($products as $key => $value) {
            
            try {   
                //print_r($value);    
                unset($value['tags']);                                       
                $affectedRows += $stmt->execute($value);
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
        }
        
        return $affectedRows;
	}
	
	public function addNewProducts(){			 
	 
	    $sql = "INSERT INTO " . PRODUCTS . 
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
               " FROM " . TEMP_PRODUCTS . " tp " .
			   " WHERE " . PRODUCT_SKU . " NOT IN ( SELECT " . PRODUCT_SKU . " FROM " . PRODUCTS . " ) ";	           
        
        if($this->debug){		    
			$this->logDebug("324987239" ,$sql );
		}
        
		$affected =& $this->db->exec($sql);                                		
		
		if (PEAR::isError($affected)) {
			$this->logError("324987239" ,$affected->getMessage(),$sql);
		    return false;
		}	
        
        return $affected;
	}	
	
	public function updateExistingProducts(){
	   $sql = "UPDATE " . PRODUCTS . " p " .
        	  " INNER JOIN " . TEMP_PRODUCTS . " tp ON tp." . PRODUCT_SKU . " = p." . PRODUCT_SKU .
              " SET " .
              "p." .PRODUCT_NAME . " = tp." . PRODUCT_NAME . "," .
              "p." .PRODUCT_LINK . " = tp." . PRODUCT_LINK . "," .
              "p." .PRODUCT_IMAGE . " = tp." . PRODUCT_IMAGE . "," .
              "p." .PRODUCT_PRICE . " = tp." . PRODUCT_PRICE . "," . 
              "p." .PRODUCT_DATE_UPDATED. " = tp." . PRODUCT_DATE_UPDATED . "," .
              "p." .PRODUCT_STATUS. " = CASE WHEN p.".PRODUCT_STATUS." = 3 THEN 1 ELSE p.".PRODUCT_STATUS." END";               
              
       if($this->debug){		    
			$this->logDebug("923847293" ,$sql );
		}
        
		$affected =& $this->db->exec($sql);                                		
		
		if (PEAR::isError($affected)) {
			$this->logError("923847293" ,$affected->getMessage(),$sql);
		    return false;
		}	        
        
       return $affected;       
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
		
		if($this->debug){		    
			$this->logDebug("3249873" ,$sql );
		}
        
		$affected =& $this->db->exec($sql);                                		
		
		if (PEAR::isError($affected)) {
			$this->logError("3249873" ,$affected->getMessage(),$sql);
		    return false;
		}	
		
		return $affected;
	}  
	
	public function addTagsForNewProducts($products){
	     if(!isset($products) || !is_array($products)){
			$this->logWarning("1249871324","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . TAGS . 
	           " (" . TAG_STRING . "," .
                      PRODUCT_SKU . "," .
                      TAG_COUNT . ")" .
	           " VALUES ( ?, ?, 1 )";	                    	          
        
        if($this->debug){		    
			$this->logDebug("2135232" ,$sql );
		}
        
        $stmt = $this->db->prepare($sql);
        $affectedRows = 0;
        foreach ($products as $sku => $product) {
            foreach ($product['tags'] as $tag) {    
                try {   
                    //print_r($value);                                           
                    $affectedRows += $stmt->execute(array($tag, $sku));
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                }
            }
        }
        
        return $affectedRows;
	}
	
	public function setMissingProductsToNotAvailable($products){       

	   $sql = "UPDATE " . PRODUCTS . " p " .
              " LEFT JOIN " . TEMP_PRODUCTS . " tp ON tp." . PRODUCT_SKU . " = p." . PRODUCT_SKU .
              " SET p." .PRODUCT_STATUS . " = 3 " .
              " WHERE ISNULL(tp.".PRODUCT_SKU.") AND " .
              " p.".PRODUCT_STORE." = ? AND p.".PRODUCT_CUSTOMER." = ? AND p.".PRODUCT_CATEGORY." = ? ";        
              
       if($this->debug){		    
			$this->logDebug("09867746" ,$sql );
		}
		
		$stmt = $this->db->prepare($sql);
		list($firstProduct) = array_values($products);
            
        try {                                          
            $affectedRows = $stmt->execute(array($firstProduct['company'], $firstProduct['customer'], $firstProduct['category']));
            
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
        }        		                
        
       return $affected;
	}
	
	public function getTotalProductsCount(){
	    $sql = "SELECT COUNT(1) FROM " . PRODUCTS;
		
		if($this->debug){		    
			$this->logDebug("324872" ,$sql );
		}		
				
		$result =& $this->db->query($sql);
		
		if (PEAR::isError($result)) {
			$this->logError("324872", $result->getMessage(),$sql);
		    return false;
		}
		
		return $result;
	}
	
	public function getTotalLiveProductsCount(){
	    $sql = "SELECT COUNT(1) as count FROM " . PRODUCTS . " WHERE status = 1";
		
		if($this->debug){		    
			$this->logDebug("2398429" ,$sql );
		}		
				
		$result =& $this->db->query($sql);
		
		if (PEAR::isError($result)) {
			$this->logError("23482", $result->getMessage(),$sql);
		    return false;
		}
		
		return $result;
	}
	
	public function getNonLiveProducts($page, $limit){
	   $offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .				
				" WHERE " . PRODUCT_STATUS . " NOT IN (1,4) " .
				" ORDER BY " . PRODUCT_STATUS . 
				" LIMIT ? OFFSET ?";								
        
		$paramsTypes = array('integer','integer');		
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
        
		$paramsTypes = array('integer','integer');		
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
              
       if($this->debug){		    
			$this->logDebug("235235" ,$sql );
		}
        
        $paramTypes = array('text', 'text');
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
        foreach ($products as $key => $value) {
            
            try {                         
                $params = array();
                $params[] = $value->getShortLink();
                $params[] = $value->getId();                     
                $affectedRows += $stmt->execute($params);
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
                            
       if($this->debug){		    
			$this->logDebug("2309823" ,$sql );
		}
        
        $params = array();
        $paramTypes = array();
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
                 
        try {                              
            $affectedRows = $stmt->execute($params);
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
        }     
        
        return $affectedRows;
	}
	
	public function getCustomers(){	   
	   $sql = "SELECT DISTINCT " . PRODUCT_CUSTOMER .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_CUSTOMER;					
        
		$paramsTypes = array();		
		$params = array();		
		return $this->getResults($sql, $params, $paramTypes, "2387462");
	}
	
	public function getCategories(){
	   $sql = "SELECT DISTINCT " . PRODUCT_CATEGORY . "," . PRODUCT_CUSTOMER .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_CATEGORY . "," . PRODUCT_CUSTOMER;					
        
		$paramsTypes = array();		
		$params = array();		
		return $this->getResults($sql, $params, $paramTypes, "232352352");
	}
	
	public function getCompanies(){
	   $sql = "SELECT DISTINCT " . PRODUCT_STORE . "," . PRODUCT_CUSTOMER .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_STORE . "," . PRODUCT_CUSTOMER;
        
		$paramsTypes = array();		
		$params = array();		
		return $this->getResults($sql, $params, $paramTypes, "98237923");
	}	
	
	public function getUniqueTags(){
	   $sql = "SELECT DISTINCT " . TAG_STRING . 
				" FROM " . TAGS . " t " .
				" LEFT JOIN " . PRODUCTS . " p ON p." . PRODUCT_SKU . " = t." . PRODUCT_SKU .
				" WHERE " . TAG_APPROVED . " = 0 " .
				" AND p." . PRODUCT_STATUS . " = 1 " . 			
				" ORDER BY " . TAG_STRING;
        
		$paramsTypes = array();		
		$params = array();		
		return $this->getResults($sql, $params, $paramTypes, "2342837429");
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
		
		$paramsTypes = array();		
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
        
        $paramsTypes[] = 'integer';		
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
                                
        if($this->debug){		    
			$this->logDebug("239875203" , $sql);
		}
        
        $stmt = $this->db->prepare($sql);
        
        $product = array();
        $product['summary'] = $criteria['summary'];
        $product['details'] = $criteria['details'];
        $product['promotion'] = $criteria['promotion'];
        $product['promotionTwo'] = $criteria['promotionTwo'];
        $product['sku'] = $criteria['sku'];
        
        $affected = $stmt->execute($product);                                   		
		
		if (PEAR::isError($affected)) {
			$this->logError("2309472074" ,$affected->getMessage(),$sql);
		    return false;
		}	    
						    
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
                            
       if($this->debug){	
            $swatches = print_r($criteria['swatches'], true);	    
			$this->logDebug("98327492" ,$sql . " { " .$criteria['sku']. " , $swatches } ");
		}
        
        
        $paramTypes = array('text', 'text');         
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $totalAffectedRows = 0;
        
        foreach ($criteria['swatches'] as $swatch) {                            
            try {   
                $params = array($criteria['sku'], $swatch);                               
                $affectedRows = $stmt->execute($params); 
                
                if (PEAR::isError($affected)) {
        			$this->logError("928372923" ,$affectedRows->getMessage(),$sql);
        		    return false;
        		} 
                        
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
            
            $totalAffectedRows += $affectedRows;
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
                            
       if($this->debug){	
            $sizes = print_r($criteria['sizes'], true);	    
			$this->logDebug("939482942" ,$sql . " { " .$criteria['sku']. " , $sizes } ");
		}
        
        
        $paramTypes = array('text', 'text');         
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $totalAffectedRows = 0;
        
        foreach ($criteria['sizes'] as $size) {                            
            try {   
                $params = array($criteria['sku'], $size);                               
                $affectedRows = $stmt->execute($params); 
                
                if (PEAR::isError($affected)) {
        			$this->logError("65223423" ,$affectedRows->getMessage(),$sql);
        		    return false;
        		} 
                        
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
            
            $totalAffectedRows += $affectedRows;
        }                        
        
        return $totalAffectedRows;
	}
	
	public function removeTags($skus, $tag){
	   if (!isset($skus) || $skus == null || !is_array($skus) || count($skus) <= 0 || $tag == null){
	       return -1;   
	   }
	   
	   $sql = "UPDATE " . TAGS .       	  
              " SET " . TAG_STATUS . " = 2 ," .
                        TAG_APPROVED . " = 1 " . 
              " WHERE " . TAG_STRING . " = ? ";
                            
       if($this->debug){		    
			$this->logDebug("92864192401" ,$sql . " { $sku , $tag } ");
		}
        
        $params = array($tag);
        $paramTypes = array('text'); 
        $skuPlaceholders = '';               
        
        foreach ($skus as $sku) {    
            try {   
                $params[] = $sku;
                $paramTypes[] = 'text';  
                
                if ($skuPlaceholders != ''){
                    $skuPlaceholders .= ",";   
                }
                
                $skuPlaceholders .= "?";
                      
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
        }
        
        $sql .= " AND " . PRODUCT_SKU . " IN (" . $skuPlaceholders . ")"; 

        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
                 
        try {                              
            $affectedRows = $stmt->execute($params);
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
        }     
        
        return $affectedRows;
	}
	
	public function approveTags($skus, $tag){
	   if (!isset($skus) || $skus == null || !is_array($skus) || count($skus) <= 0 || $tag == null){
	       return -1;   
	   }
	   
	   $sql = "UPDATE " . TAGS .       	  
              " SET " . TAG_APPROVED . " = 1 " . 
              " WHERE " . TAG_STRING . " = ? ";
                            
       if($this->debug){
			$this->logDebug("238479232" ,$sql . " { $sku , $tag } ");
		}
        
        $params = array($tag);
        $paramTypes = array('text'); 
        $skuPlaceholders = '';               
        
        foreach ($skus as $sku) {    
            try {   
                $params[] = $sku;
                $paramTypes[] = 'text';  
                
                if ($skuPlaceholders != ''){
                    $skuPlaceholders .= ",";   
                }
                
                $skuPlaceholders .= "?";
                      
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            }
        }
        
        $sql .= " AND " . PRODUCT_SKU . " IN (" . $skuPlaceholders . ")";       
        
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
                 
        try {                              
            $affectedRows = $stmt->execute($params);
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
        }     
        
        return $affectedRows;
	}
}
?>