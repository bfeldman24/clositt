<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');
require_once('Date.php');

class ProductDao extends AbstractDao {
	
	public function getProduct($productId){
		if(!isset($productId) || strlen($productId) <= 2){
			$this->logWarning("12876319","ID is null");
			return false; 
		}				
		
		$sql = "SELECT " .
				" p." . PRODUCT_SKU . ", " .
				" p." . PRODUCT_STORE . ", " .				
				" p." . PRODUCT_CUSTOMER . ", " .
				" p." . PRODUCT_CATEGORY . ", " .
				" p." . PRODUCT_NAME . ", " .
				" p." . PRODUCT_LINK . ", " .
				" p." . PRODUCT_IMAGE . ", " .
				" p." . PRODUCT_PRICE . ", " .
				" p." . PRODUCT_COMMENT_COUNT . ", " .
				" p." . PRODUCT_CLOSITT_COUNT .
				" FROM " . PRODUCTS . " p " . 				
				" WHERE p." . PRODUCT_SKU . " = ? ";
		
		$paramsTypes = array('text');		
		$params = array($productId);	
		return $this->getResults($sql, $params, $paramTypes, "3248272");
	}            			
	
	public function addProducts($products){
	    if(!isset($products) || !is_array($products)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . PRODUCTS . 
	           " VALUES (?, ?, ?, " .
	                    "?, ?, ?, " .
	                    "?, ?, ?, " .
	                    "?, NOW())";
        
        $stmt = $this->db->prepare($sql);
        foreach ($products as $row) {
            
            try {
                $stmt->execute($row);
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                print_r($row);
            }
        }
        
        return $results;
	}		
}
?>