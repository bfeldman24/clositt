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
				" p." . PRODUCT_CLOSITT_COUNT . ", " .
				" p." . PRODUCT_SHORT_LINK . 
				" FROM " . PRODUCTS . " p ";
		
		if (substr_count($productId, "-") <= 1){
		     $sql .= " WHERE p." . PRODUCT_SKU . " = ? ";
		}else{
		     $sql .= " WHERE p." . PRODUCT_SHORT_LINK . " = ? ";
		}					 								
		
		$paramsTypes = array('text');		
		$params = array($productId);	
		return $this->getResults($sql, $params, $paramTypes, "3248272");
	}  
	
	public function getProducts($page, $limit){					
		$offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 " . 
				" LIMIT ? OFFSET ?";								
        
		$paramsTypes = array('integer','integer');		
		$params = array($limit, $offset);
		
		return $this->getResults($sql, $params, $paramTypes, "2309842");
	}  
	
	public function getSimilarProducts($productId, $limit){		
		if(!isset($productId) || strlen($productId) <= 2){
			$this->logWarning("12415123","ID is null");
			return false; 
		}
		
		if (!isset($limit) || $limit <= 0){
		      $limit = 10;
		}
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS . " p " .
				" INNER JOIN (SELECT " . PRODUCT_STORE . ", " . PRODUCT_CUSTOMER . ", " . PRODUCT_CATEGORY . 
				" FROM " . PRODUCTS;
		
              		if (substr_count($productId, "-") <= 1){
              		     $sql .= " WHERE " . PRODUCT_SKU . " = ? )";
              		}else{
              		     $sql .= " WHERE " . PRODUCT_SHORT_LINK . " = ? )";
              		}	
		
		$sql .=	" AS item ON p.".PRODUCT_STORE." = item.".PRODUCT_STORE .
		               " AND p.".PRODUCT_CUSTOMER." = item.".PRODUCT_CUSTOMER .
		               " AND p.".PRODUCT_CATEGORY." = item." . PRODUCT_CATEGORY;       
		               
        if (substr_count($productId, "-") <= 1){
		     $sql .= " WHERE p." . PRODUCT_SKU . " <> ? ";
		}else{
		     $sql .= " WHERE p." . PRODUCT_SHORT_LINK . " <> ? ";
		}		               
		
		$sql .= " AND p." . PRODUCT_STATUS . " = 1 ";
		               
		$sql .= " LIMIT ?";								
        
		$paramsTypes = array('text','text','integer');		
		$params = array($productId, $productId, $limit);
		
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
		$tagWeight = .1;
		
		//Validate that there is at least one valid filter set
		if(!isset($criteria)){
			$this->logWarning("12876319","Criteria is null");
			return false; 
		}

		$start = $pageNumber * $numResultsPerPage;
		$params = array();
		$paramTypes = array();
		
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
				" p." . PRODUCT_CLOSITT_COUNT . ", " .				
				" p." . PRODUCT_SHORT_LINK . 
				" FROM " . PRODUCTS . " p "; 				

        if ($criteria->getColors() != null){
            $sql .= " INNER JOIN " . COLORS . " c  ON c." . PRODUCT_SKU . " = p." . PRODUCT_SKU;
        }

		$filterSql = "p." . PRODUCT_STATUS . " = 1 ";		
		$this->addCriteriaToSql($filterSql, $criteria->getCompanies(), "p." . PRODUCT_STORE, $params, $paramTypes);	
		$this->addCriteriaToSql($filterSql, $criteria->getCategories(), "p." . PRODUCT_CATEGORY, $params, $paramTypes);	
		$this->addCriteriaToSql($filterSql, $criteria->getCustomers(), "p." . PRODUCT_CUSTOMER, $params, $paramTypes);	
		$this->addCriteriaToSql($filterSql, $criteria->getColors(), "c." . COLORS_COLOR, $params, $paramTypes);				
		
		// MIN PRICE
		if ($criteria->getMinPrice() != null){			
			$filterSql .= " AND p." . PRODUCT_PRICE . " >= ? ";
			$params[] = $criteria->getMinPrice();
			$paramTypes[] = 'integer';
		}			
		
		// MAX PRICE
		if ($criteria->getMaxPrice() != null){			
			$filterSql .= " AND p." . PRODUCT_PRICE . " <= ? ";
			$params[] = $criteria->getMaxPrice();
			$paramTypes[] = 'integer';
		}	
		
		// SERACH TAGS
		$searchTags = $criteria->getTags();
		$hasTags = $searchTags != null && count($searchTags) > 0 && $searchTags[0] != null && $searchTags[0] != "";
		
		if ($hasTags){
    			$filterSql .= " AND (";
    			
    			// Name matches tags
    			$filterSql .= " Match(p.".PRODUCT_NAME.") Against (?) ";
    			$params[] = implode(" ",$criteria->getTags());
    			$paramTypes[] = 'text';
    			
    			// Remove if there is a performance hit  
    			// Name regex matches tags
    			$filterSql .= " OR p.".PRODUCT_NAME." REGEXP ? ";                
    			$params[] = implode("|",$criteria->getTags());
    			$paramTypes[] = 'text';
    			
    			// Remove if there is a performance hit  
    			// Tags exist
    			$filterSql .= " OR EXISTS(SELECT 1" .
                            " FROM " . TAGS .
                            " WHERE ".TAG_STRING." IN (" .
                            $this->convertCriteriaToQueryParameters($criteria->getTags(), $params, $paramTypes) .
                            ") AND SKU = p.".PRODUCT_SKU.")";                
                            
                $filterSql .= " ) ";            
        }						

        // WHERE CLAUSE
		if($filterSql && trim($filterSql) != ""){
			$sql .= " WHERE " . $filterSql;
		}

        // 
        $orderby = "";        
        if ($criteria->getColors() != null){
            $orderby .= " + c." . COLORS_PERCENT;
        }
        
        if ($hasTags){
            $orderby .= " + Match(p.".PRODUCT_NAME.") Against (?)";
            $params[] = implode(" ",$criteria->getTags());
			$paramTypes[] = 'text';
            
		    $orderby .= " + (SELECT COALESCE( SUM(".TAG_COUNT.") * " . $tagWeight . ", 0)" .
                            " FROM " . TAGS .
                            " WHERE ".TAG_STRING." IN (" .
                            $this->convertCriteriaToQueryParameters($criteria->getTags(), $params, $paramTypes) .
                            ") AND SKU = p.".PRODUCT_SKU.")";                            
		}
                
        if ($orderby != ""){            
            // remove first +
            $orderby = substr($orderby, strpos($orderby, "+ ") + 2);
            
            $sql .= " ORDER BY " . $orderby . " DESC";
        }

		$sql .= " LIMIT " . $numResultsPerPage . " OFFSET " . $start;

		return $this->getResults($sql, $params, $paramTypes, "3248272");

	}

	private function addCriteriaToSql(&$sql, $criteria, $columnName, &$params, &$paramTypes){
		if(is_array($criteria)){            
            $sql .= " AND " . $columnName . " IN (" .                                               
                    $this->convertCriteriaToQueryParameters($criteria, $params, $paramTypes) . 
                    ")";
		}
	}		
	
	private function convertCriteriaToQueryParameters($criteria, &$params, &$paramTypes){
	    $sql = "";
	    
	    if(is_array($criteria)){ 
    	    foreach ($criteria as $value){	
                 $sql .= "?,";		
    		     $params[] = $value;
    		     $paramTypes[] = 'text';
            }
            
            // remove trailing comma
            $sql = substr($sql, 0, strlen($sql) -1);
	    }
        
        return $sql;
	}
}
?>