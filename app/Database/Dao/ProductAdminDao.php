<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');
require_once('Date.php');

class ProductAdminDao extends AbstractDao {     
    
    public function clearTempProducts(){
        $sql = "TRUNCATE TABLE " . TEMP_PRODUCTS;
        
        if($this->debug){		    
			$this->logDebug("98347223" ,$sql );
		}
        
		$result =& $this->db->exec($sql);                                		
		
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
                      PRODUCT_STATUS . "," .
                      PRODUCT_DATE_UPDATED . ")" .
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
                      " 4 ," .
                      "NOW()" .
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
              "p." .PRODUCT_PRICE . " = tp." . PRODUCT_PRICE;        
              
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
	
	public function getProductsForUpdatingShortLinks($page, $limit){					
		$offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .				
				" WHERE COALESCE(" . PRODUCT_SHORT_LINK . ",'null') = 'null' " .
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
            $sql .= " AND COALESCE(" . PRODUCT_SHORT_LINK . ",'null') = 'null'"; 
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
	   $sql = "SELECT DISTINCT " . PRODUCT_CATEGORY .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_CATEGORY;					
        
		$paramsTypes = array();		
		$params = array();		
		return $this->getResults($sql, $params, $paramTypes, "232352352");
	}
	
	public function getCompanies(){
	   $sql = "SELECT DISTINCT " . PRODUCT_STORE .
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " .
				" ORDER BY " . PRODUCT_STORE;					
        
		$paramsTypes = array();		
		$params = array();		
		return $this->getResults($sql, $params, $paramTypes, "98237923");
	}		
}
?>