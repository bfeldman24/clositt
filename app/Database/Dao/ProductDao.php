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
	
	public function getProducts($criteria, $page, $limit, $random){					
		$offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 ";			
		
		$params = array();
		$paramTypes = array();
								
		if(isset($criteria)){ 
		      $customer = $criteria->getCustomers();
		      		      
		      if(is_array($customer)){
    		      $sql .= " AND " . PRODUCT_CUSTOMER . " = ? ";
    		      
    		      $params[] = $customer[0];
            	  $paramsTypes[] = 'text';
		      }
		}		
		
		if ($random){
		      $sql .= " ORDER BY RAND() ";   
		}
		
		$sql .= " LIMIT ? OFFSET ?";
		$params[] = $limit;
		$params[] = $offset;
		$paramsTypes[] = 'integer';
		$paramsTypes[] = 'integer';		
		
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
	
	public function updateClosittCounter($productId){
	    if(!isset($productId)){
			$this->logWarning("235982734","Nothing to update!");
			return false; 
		}
	 
	    $sql = "UPDATE " . PRODUCTS . 
	           " SET " . PRODUCT_CLOSITT_COUNT . " = " . PRODUCT_CLOSITT_COUNT . " + 1 " .
	           " WHERE " . PRODUCT_SKU . " = ?";
        
        $paramTypes = array('text');
        $params = array($productId);
        
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
            
        try {
            $affected = $stmt->execute($params);
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            print_r($params);
        }
        
        return $affected;
	}
	
	public function updateCommentCounter($productId){
	     if(!isset($productId)){
			$this->logWarning("2359842","Nothing to update!");
			return false; 
		}
	 
	    $sql = "UPDATE " . PRODUCTS . 
	           " SET " . PRODUCT_COMMENT_COUNT . " = " . PRODUCT_COMMENT_COUNT . " + 1 " .
	           " WHERE " . PRODUCT_SKU . " = ?";
        
        $paramTypes = array('text');
        $params = array($productId);
        
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
            
        try {
            $affected = $stmt->execute($params);
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            print_r($params);
        }
        
        return $affected;
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

        $searchTags = $criteria->getTags();
		$hasTags = $searchTags != null && count($searchTags) > 0 && $searchTags[0] != null && $searchTags[0] != "";
		$categories = $criteria->getCategories();
		
		if (is_array($categories) && is_array($searchTags)){
            $tags = array_merge($categories, $searchTags);
		}else if (is_array($categories)){
            $tags = $categories;
		}else if(is_array($searchTags)){
            $tags = $searchTags;
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
        
        if ($categories != null || $hasTags){
            $sql .= " INNER JOIN " . TAGS . " t  ON t." . PRODUCT_SKU . " = p." . PRODUCT_SKU;            	
        }        

		$filterSql = "p." . PRODUCT_STATUS . " = 1 ";		
		$this->addCriteriaToSql($filterSql, $criteria->getCompanies(), "p." . PRODUCT_STORE, $params, $paramTypes);	
		$this->addCriteriaToSql($filterSql, $tags, "t." . TAG_STRING, $params, $paramTypes);
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
		if ($hasTags){
    			$filterSql .= " AND (";
    			
    			// Name matches tags
    			$filterSql .= " Match(p.".PRODUCT_NAME.") Against (?) ";
    			$params[] = implode(" ",$searchTags);
    			$paramTypes[] = 'text';
    			
    			// Remove if there is a performance hit  
    			// Name regex matches tags
    			$filterSql .= " OR p.".PRODUCT_NAME." REGEXP ? ";                
    			$params[] = implode("|",$searchTags);
    			$paramTypes[] = 'text';
    			
    			// Remove if there is a performance hit  
    			// Tags exist
    			$filterSql .= " OR EXISTS(SELECT 1" .
                            " FROM " . TAGS .
                            " WHERE ".TAG_STRING." IN (" .
                            $this->convertCriteriaToQueryParameters($searchTags, $params, $paramTypes) .
                            ") AND SKU = p.".PRODUCT_SKU.")";                
                            
                $filterSql .= " ) ";            
        }						

        // WHERE CLAUSE
		if($filterSql && trim($filterSql) != ""){
			$sql .= " WHERE " . $filterSql;
		}
		
		// GROUP BY 
		if ($categories || $hasTags){
		
		    if (count($tags) > 1){		  
    		    $sql .= " GROUP BY t." . PRODUCT_SKU;
                $sql .= " HAVING COUNT(t.".PRODUCT_SKU.") = ?";                
                
                $params[] = count($tags);
        		$paramTypes[] = 'integer';
		    }
		}

        // 
        $orderby = "";        
        if ($criteria->getColors() != null){
            $orderby .= " + c." . COLORS_PERCENT;
        }
        
        if ($hasTags){
            $orderby .= " + Match(p.".PRODUCT_NAME.") Against (?)";
            $params[] = implode(" ", $searchTags);
			$paramTypes[] = 'text';
            
		    $orderby .= " + (SELECT COALESCE( SUM(".TAG_COUNT.") * " . $tagWeight . ", 0)" .
                            " FROM " . TAGS .
                            " WHERE ".TAG_STRING." IN (" .
                            $this->convertCriteriaToQueryParameters($searchTags, $params, $paramTypes) .
                            ") AND SKU = p.".PRODUCT_SKU.")";                            
		}
                
        if ($orderby != ""){            
            // remove first +
            $orderby = substr($orderby, strpos($orderby, "+ ") + 2);
            
            $sql .= " ORDER BY " . $orderby . " DESC";
        }

		$sql .= " LIMIT ? OFFSET ? ";
		
		$params[] = $numResultsPerPage;
		$paramTypes[] = 'integer';
		$params[] = $start;
		$paramTypes[] = 'integer';

		return $this->getResults($sql, $params, $paramTypes, "3248272");

	}

	private function addCriteriaToSql(&$sql, $criteria, $columnName, &$params, &$paramTypes){
		if(is_array($criteria)){   
		    
		    if (count($criteria) > 1){		           
                $sql .= " AND " . $columnName . " IN (" .                                               
                        $this->convertCriteriaToQueryParameters($criteria, $params, $paramTypes) . 
                        ")";
		    }else{
    		    $sql .= " AND " . $columnName . " = " .                                               
                        $this->convertCriteriaToQueryParameters($criteria, $params, $paramTypes);
		    }
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