<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');
require_once(dirname(__FILE__) . '/../../Model/ProductCriteria.php');
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
	
	public function getProducts($page, $limit){					
		$offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .
				" LIMIT ? OFFSET ?";								
        
		$paramsTypes = array('integer','integer');		
		$params = array($limit, $offset);
		
		return $this->getResults($sql, $params, $paramTypes, "2309842");
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

	/**
	*
	* @param $criteria - object with filter criteria
	* @param $pageNumber - when paginating, which page is being requested
	* @param $numResultsPerPage - how many results to return per page
	**/
	public function getProductsWithCriteria($criteria, $pageNumber, $numResultsPerPage){
		
		//Validate that there is at least one valid filter set
		if(!isset($criteria)){
			$this->logWarning("12876319","Criteria is null");
			return false; 
		}

		$start = $pageNumber * $numResultsPerPage;
		$params = array();
		$paramTypes = array();
		$firstClause = true;
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

		$filterSql = "";		
		$this->addCriteriaToSql($filterSql, $criteria->getCompanies(), PRODUCT_STORE, $params, $paramTypes, $firstClause);	
		$this->addCriteriaToSql($filterSql, $criteria->getCategories(), PRODUCT_CATEGORY, $params, $paramTypes, $firstClause);	
		$this->addCriteriaToSql($filterSql, $criteria->getCustomers(), PRODUCT_CUSTOMER, $params, $paramTypes, $firstClause);	
		

		if(!$firstClause){
			$sql .= " WHERE " . $filterSql;
		}

		$sql .= " LIMIT " . $numResultsPerPage . " OFFSET " . $start;

		return $this->getResults($sql, $params, $paramTypes, "3248272");

	}

	private function addCriteriaToSql(&$sql, $criteria, $columnName, &$params, &$paramTypes, &$firstClause){
		if(is_array($criteria)){
			if(!$firstClause) {
				$sql .= " AND ";
			}

			$sql .= " p." . $columnName . " in ( ? )";
			//TODO escape criteria objects here
			array_push($params, implode(",", $criteria));
			array_push($paramTypes, 'text') ;
			$firstClause = false;
		}
	}		
}
?>