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
				" p." . PRODUCT_COLOR_ONE . ", " .
				" p." . PRODUCT_COLOR_TWO . ", " .
				" p." . PRODUCT_COMMENT_COUNT . ", " .
				" p." . PRODUCT_CLOSITT_COUNT . ", " .
				" p." . PRODUCT_SHORT_LINK . ", " .
				" p." . PRODUCT_DETAIL_UPDATED . ", " .
				" p." . PRODUCT_STATUS . 
				" FROM " . PRODUCTS . " p ";
		
		if (substr_count($productId, "-") <= 1){
		     $sql .= " WHERE p." . PRODUCT_SKU . " = ? ";
		}else{
		     $sql .= " WHERE p." . PRODUCT_SHORT_LINK . " = ? ";
		}					 								
		
		$paramTypes = array('text');		
		$params = array($productId);	
		return $this->getResults($sql, $params, $paramTypes, "3248272");
	}  
	
	public function getProducts($criteria, $page, $limit, $random){					
		$offset = $page * $limit;
		
		$sql = "SELECT * " .				
				" FROM " . PRODUCTS .
				" WHERE " . PRODUCT_STATUS . " = 1 AND " . PRODUCT_RANDOM_INDEX . " > 0 ";			
		
		$params = array();
		$paramTypes = array();
								
		if(isset($criteria)){ 
		      $customer = $criteria->getCustomers();
		      		      
		      if(is_array($customer)){
    		      $sql .= " AND " . PRODUCT_CUSTOMER . " = ? ";
    		      
    		      $params[] = $customer[0];
            	  $paramTypes[] = 'text';
		      }
		}		
		
		if ($random){
		      $sql .= " ORDER BY " . PRODUCT_RANDOM_INDEX;   
		}
		
		$sql .= " LIMIT ? OFFSET ?";
		$params[] = $limit;
		$params[] = $offset;
		$paramTypes[] = 'integer';
		$paramTypes[] = 'integer';		
		
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
        
		$paramTypes = array('text','text','integer');		
		$params = array($productId, $productId, $limit);
		
		return $this->getResults($sql, $params, $paramTypes, "2309842");
	}
	
	public function getHistoricalPrices($productId){
		if(!isset($productId) || strlen($productId) <= 2){
			$this->logWarning("3287629","ID is null");
			return false; 
		}				
		
		$sql = "SELECT " .
				"h." . PRODUCT_SKU . ", " .
				"h." . HISTORICAL_OLD_PRICE . ", " .				
				"h." . HISTORICAL_NEW_PRICE . ", " .
				"h." . HISTORICAL_DATE . ", " .
				"p." . PRODUCT_CREATED_ON .  				
				" FROM " . HISTORICAL_PRICES . " h " . 
				" INNER JOIN " . PRODUCTS . " p ON p.". PRODUCT_SKU . " = h. " . PRODUCT_SKU;
		
		if (substr_count($productId, "-") <= 1){
		     $sql .= " WHERE h." . PRODUCT_SKU . " = ? ";
		}else{
		     $sql .= " WHERE p." . PRODUCT_SHORT_LINK . " = ? ";
		}
		
		$sql .= " ORDER BY h." . HISTORICAL_DATE;					 								
		
		$paramTypes = array('text');		
		$params = array($productId);	
		return $this->getResults($sql, $params, $paramTypes, "876594567");
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
        return $this->update($sql, $params, $paramTypes, "2359827342");
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
        return $this->update($sql, $params, $paramTypes, "2359827342");
	}		
	
	public function getCachedProductImage($sku){
	   $sql = "SELECT " . PRODUCT_IMAGE . " FROM " . CACHED_IMAGES . " WHERE " . PRODUCT_SKU . " = ?";  
	   
	   $paramTypes = array('text');
	   $params = array($sku);
	   
	   return $this->getResults($sql, $params, $paramTypes, "12389124003");
	}			

	/**
	*
	* @param $criteria - object with filter criteria
	* @param $pageNumber - when paginating, which page is being requested
	* @param $numResultsPerPage - how many results to return per page
	**/
	public function getProductsWithCriteria($criteria, $pageNumber, $numResultsPerPage, $tagAdmin = false){
		$tagWeight = .5;
		
		//Validate that there is at least one valid filter set
		if(!isset($criteria)){
			$this->logWarning("12876319","Criteria is null");
			return false; 
		}

        $searchTags = $criteria->getTags();
        $searchString = $criteria->getSearchString();
        $hasSearchString = $searchString != null && trim($searchString) != "";
		$hasTags = $searchTags != null && count($searchTags) > 0 && $searchTags[0] != null && $searchTags[0] != "";
		$categories = $criteria->getCategories();				

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

        $filterSql = "p." . PRODUCT_STATUS . " = 1 ";
        
        if ($criteria->getColors() != null){
            $sql .= " LEFT JOIN " . COLOR_MAPPING . " c  ON c.status = 1 AND c." . COLOR_MAPPING_COLOR . " = p." . PRODUCT_COLOR_ONE;                                                
            $sql .= " LEFT JOIN " . COLOR_MAPPING . " c2  ON c2.status = 1 AND c2." . COLOR_MAPPING_COLOR . " = p." . PRODUCT_COLOR_TWO;
            
            $filterSql .= " AND CASE WHEN NOT ISNULL(c." . COLOR_MAPPING_PARENT . ") THEN c." .COLOR_MAPPING_PARENT . 
                                   " ELSE c2." .COLOR_MAPPING_PARENT .
                                   " END ";
                           
            $colors = $criteria->getColors();                       
            if (count($colors) > 1){		           
                $filterSql .= " IN (" . $this->convertCriteriaToQueryParameters($colors, $params, $paramTypes) . ")";
		    }else{
    		    $filterSql .= " = " . $this->convertCriteriaToQueryParameters($colors, $params, $paramTypes);
		    }                       
        }
        
        if ($categories != null){
            $sql .= " INNER JOIN " . TAGS . " ct  ON ct." . PRODUCT_SKU . " = p." . PRODUCT_SKU . " AND ct." . TAG_STATUS . " = 1 ";                                                          
            
            if ($tagAdmin){
                $sql .= " AND ct." . TAG_APPROVED . " = 0 ";    
            }
            
            $this->addCriteriaToSql($sql, $categories, "ct." . TAG_STRING, $params, $paramTypes);
        }        
        
        if($hasTags){
            $sql .= " LEFT JOIN " . TAGS . " t  ON t." . PRODUCT_SKU . " = p." . PRODUCT_SKU . " AND t." . TAG_STATUS . " = 1 ";             
            
            if ($tagAdmin){
                $sql .= " AND t." . TAG_APPROVED . " = 0 ";    
            }
            
            $this->addCriteriaToSql($sql, $searchTags, "t." . TAG_STRING, $params, $paramTypes);
        }
				
		$this->addCriteriaToSql($filterSql, $criteria->getCompanies(), "p." . PRODUCT_STORE, $params, $paramTypes);			
		$this->addCriteriaToSql($filterSql, $criteria->getCustomers(), "p." . PRODUCT_CUSTOMER, $params, $paramTypes);										
		
		// SEARCH STRING
        if ($hasSearchString){ 
    			
    			// Name matches tags
    			$filterSql .= " AND Match(p.".PRODUCT_NAME.") Against (?) ";
    			$params[] = $searchString;
    			$paramTypes[] = 'text';    			    			    			                                        
        }				         						
        
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

        // WHERE CLAUSE
		if($filterSql && trim($filterSql) != ""){
			$sql .= " WHERE " . $filterSql;
		}
		
		// GROUP BY 
		if ($categories != null){
		
		    if (count($categories) > 1){		  
    		    $sql .= " GROUP BY ct." . PRODUCT_SKU;
                $sql .= " HAVING COUNT(ct.".PRODUCT_SKU.") = ?";                
                
                $params[] = count($categories);
        		$paramTypes[] = 'integer';
		    }
		}
		
		if ($hasTags){
		
		    if (count($searchTags) > 1){		  
    		    $sql .= " GROUP BY t." . PRODUCT_SKU;
                $sql .= " HAVING COUNT(t.".PRODUCT_SKU.") = ?";                
                
                $params[] = count($searchTags);
        		$paramTypes[] = 'integer';
		    }
		}
		
		// ORDER BY (colors) 
		$orderby = "";              
        if ($criteria->getColors() != null){
            $orderby .= " CASE WHEN NOT ISNULL(p." . PRODUCT_COLOR_ONE . ")" .
                                    " THEN c." . COLOR_MAPPING_BRIGHTNESS .
                                " ELSE c2." . COLOR_MAPPING_BRIGHTNESS . " END DESC, ";
                                
            $orderby .= " + CASE WHEN NOT ISNULL(p." . PRODUCT_COLOR_ONE . ")" .
                                    " THEN p." . PRODUCT_COLOR_ONE_PERCENT .
                                " ELSE p." . PRODUCT_COLOR_TWO_PERCENT . " END DESC";
        }

        // ORDER BY (search string)        
        if ($hasSearchString){ 
		    $orderby .= " + Match(p.".PRODUCT_NAME.") Against (?) DESC";
            $params[] = $searchString;
			$paramTypes[] = 'text';            		                            
		}        
                
        // ORDER BY (categories)
        if ($categories != null){                        
		    $orderby .= " + ( COALESCE( ct.".TAG_COUNT.", 0) * " . $tagWeight . ") DESC";		    
		}			
        
        // ORDER BY (tags)
        if ($hasTags){                        
		    $orderby .= " + ( COALESCE(t.".TAG_COUNT.", 0) * " . $tagWeight . ") DESC";		    		    		    
		}							
                
        if ($orderby != ""){            
            // remove first +
            $orderby = preg_replace('/\+/', '', $orderby, 1);
            
            $sql .= " ORDER BY " . $orderby;
        }

		$sql .= " LIMIT ? OFFSET ? ";
		
		$params[] = $numResultsPerPage;
		$paramTypes[] = 'integer';
		$params[] = $start;
		$paramTypes[] = 'integer';

		return $this->getResults($sql, $params, $paramTypes, "32482723");

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
	
	public function getProductSwatches($sku){
	    if (!isset($sku) || trim($sku) == ""){
	       return "Missing Data";   
	    }
	   
	    $sql = "SELECT ".SWATCHES_IMAGE." FROM ".SWATCHES." WHERE ".PRODUCT_SKU." = ?";
		
		$paramTypes = array('text');
		$params = array($sku);
		return $this->getResults($sql, $params, $paramTypes, "75853789");	
	}
	
	public function getProductSizes($sku){
	    if (!isset($sku) || trim($sku) == ""){
	       return "Missing Data";   
	    }
	   
	    $sql = "SELECT ".SIZES_SIZE." FROM ".SIZES." WHERE ".PRODUCT_SKU." = ?";
		
		$paramTypes = array('text');
		$params = array($sku);
		return $this->getResults($sql, $params, $paramTypes, "23985792");	
	}		
}
?>
