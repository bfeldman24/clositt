<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');
require_once('Date.php');

define("TEMP_PRODUCTS", "TempProducts");

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
                      PRODUCT_DATE_UPDATED . ")" .
	           " VALUES (:sku, :company, :customer, " .
	                    ":category, :name, :link, " .
	                    ":image, :price, 0, " .
	                    "0, NOW())";	                    	          
        
        if($this->debug){		    
			$this->logDebug("873242" ,$sql );
		}
        
        $stmt = $this->db->prepare($sql);
        $affectedRows = 0;
        foreach ($products as $key => $value) {
            
            try {                                              
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
}
?>