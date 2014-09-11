<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/AbstractDao.php');

class TagDao extends AbstractDao {             	
	
	public function getUniqueTags(){								
		$sql = "SELECT " . TAG_STRING . ", " .
                " COUNT(CASE WHEN t." . TAG_APPROVED . " <> 1 THEN 1 END) unapproved, " .
                " COUNT(CASE WHEN t." .TAG_APPROVED . " = 1 THEN 1 END) " . TAG_APPROVED .
                " FROM ". TAGS . " t " .
                " LEFT JOIN " . PRODUCTS . " p ON p." . PRODUCT_SKU . " = t." . PRODUCT_SKU .
                " WHERE p.".PRODUCT_STATUS." = 1 " .
                " GROUP BY ". TAG_STRING .
                " ORDER BY ". TAG_STRING;
        
		return $this->getResults($sql, array(), array(), "2342837429");
	}	
		
	
	public function removeTags($skus, $tag){
	   if (!isset($skus) || $skus == null || !is_array($skus) || count($skus) <= 0 || $tag == null){
	       return -1;   
	   }
	   
	   $sql = "UPDATE " . TAGS .       	  
              " SET " . TAG_STATUS . " = 2 ," .
                        TAG_APPROVED . " = 1, " .
                        TAG_DATE_APPROVED . " = NOW() " . 
              " WHERE " . TAG_STRING . " = ? ";
                            
       if($this->debug){		    
            $sku = print_r($skus, true);
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

        return $this->update($sql, $params, $paramTypes, "21847293");
	}
	
	
	public function approveTags($skus, $tag){
	   if (!isset($skus) || $skus == null || !is_array($skus) || count($skus) <= 0 || $tag == null){
	       return -1;   
	   }
	   
	   $sql = "UPDATE " . TAGS .       	  
              " SET " . TAG_APPROVED . " = 1, " .
                        TAG_DATE_APPROVED . " = NOW() " . 
              " WHERE " . TAG_STRING . " = ? ";
                            
       if($this->debug){
            $skusString = print_r($skus, true);
			$this->logDebug("238479232" ,$sql . " { $skusString , $tag } ");
		}
        
        $params = array($tag);
        $paramTypes = array('text'); 
        $skuPlaceholders = '';               
        
        foreach ($skus as $sku) {    
            $params[] = $sku;
            $paramTypes[] = 'text';  
            
            if ($skuPlaceholders != ''){
                $skuPlaceholders .= ",";   
            }
            
            $skuPlaceholders .= "?";                      
        }
        
        $sql .= " AND " . PRODUCT_SKU . " IN (" . $skuPlaceholders . ")";       
        
        return $this->update($sql, $params, $paramTypes, "1823749234");
	}	
	
	
	public function tryUpdateTagDao($tag){
	   if(!isset($tag) || !is_array($tag)){
			$this->logWarning("128763192","Nothing to add!");
			return false; 
		}
	 
	    $sql = "UPDATE " . TAGS . 
	           " SET " . TAG_COUNT  . " = " . TAG_COUNT . " + 1 " . 
	           " WHERE " . TAG_STRING . " = :tag AND " . PRODUCT_SKU . " = :sku";
        
        $paramTypes = array('text','text');
        return $this->update($sql, $tag, $paramTypes, "98237492");                
	}
	
	
	public function addNewTagDao($tag){
	    $insertArray = array();
        $insertArray[] = $_POST['tag'];
        $insertArray[] = $_POST['sku'];
        $insertArray[] = $_POST['tag'];
        
        $tagArray = array();
        $tagArray[] = $insertArray;
        
        return $this->addTagsDao($tagArray);	     
	}
	
    public function addTagsForNewProducts($products){
	     if(!isset($products) || !is_array($products)){
			$this->logWarning("1249871324","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT IGNORE INTO " . TAGS . 
	           " (" . TAG_STRING . "," .
                      PRODUCT_SKU . "," .
                      TAG_COUNT . ", " .
                      TAG_STATUS.",".
                      TAG_APPROVED.",".
                      TAG_DATE_ADDED . ", " .
                      TAG_GROUP_ID . ")" .
	           " SELECT  ?, ?, 1,1,0, NOW()," .
	           " (SELECT COALESCE((SELECT ".TAG_GROUP_ID." FROM ".TAGS." WHERE ".TAG_STRING." = ? LIMIT 1), 1))";
        
        if($this->debug){		    
			$this->logDebug("2135232" ,$sql );
		}
        
        $stmt = $this->db->prepare($sql);
        $affectedRows = 0;
        foreach ($products as $sku => $product) {
            foreach ($product['tags'] as $tag) {    
                try {   
                    //print_r($value);                                           
                    $affectedRows = $stmt->execute(array($tag, $sku, $tag));
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                }
            }
        }
        
        return $affectedRows;
	}
	
	
	public function addTagsDao($tags){
	    if(!isset($tags) || !is_array($tags)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT IGNORE INTO " . TAGS . 
	           " (" . TAG_STRING . "," .
                      PRODUCT_SKU . "," .
                      TAG_COUNT . ", " .
                      TAG_STATUS.",".
                      TAG_APPROVED.",".
                      TAG_DATE_ADDED . ", " .
                      TAG_GROUP_ID . ")" .
	           " SELECT  ?, ?, 1,1,0, NOW()," .
	           " (SELECT COALESCE((SELECT ".TAG_GROUP_ID." FROM ".TAGS." WHERE ".TAG_STRING." = ? LIMIT 1), 1))";	           	           
        
        $stmt = $this->db->prepare($sql, array('text','text','text'), MDB2_PREPARE_MANIP);
        
        foreach ($tags as $tag) {            
            try {                                                
                if($this->debug){
                    $tagParams = print_r($tag, true);
        			$this->logDebug("12712931" ,$sql . " (" . $tagParams . ")" );
        		}
                
                $results = $stmt->execute($tag);
                $stmt->free();
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                print_r($row);
            }
        }
        
        if($this->debug){        
            $r = print_r($results, true);    
			$this->logDebug("affected results" ,$r);
		} 
        
        return $results;
	}
	
	public function getPotentialTags(){
	    $sql = "SELECT ". PRODUCT_NAME. " FROM " . PRODUCTS . " LIMIT 10000";
	    return $this->getResults($sql, array(), array(), "128723424");
	}
	
	public function addTagGroups($groups){
	   $sql = "INSERT IGNORE INTO ". TAG_GROUPS . 
	                   " (".TAG_GROUP_NAME.",".TAG_GROUP_STATUS.",".TAG_GROUP_DATE_ADDED.")".
	          " VALUES (?, 1, NOW())";
	   
	   $paramTypes = array('text');
	   
	   if($this->debug){		  
			$this->logDebug("4578774643" ,$sql);
		}		
		
		$stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
            
        for($i=0; $i < count($groups); $i++){
            try {
                  $result = $stmt->execute(array($groups[$i]));
                  
                  if (is_numeric($result)){
      		          $affectedRows += $result;
      		      }
                                  
            } catch (Exception $e) {
                $this->logError($errorCode ,$e->getMessage(), $sql);
                return false;
            }         		
        }
						
		$stmt->free();		
		return $affectedRows;  
	}
	
	public function getAllTagGroups(){
	    $sql = "SELECT ". TAG_GROUP_ID . "," . TAG_GROUP_NAME. " FROM " . TAG_GROUPS;
	    return $this->getResults($sql, array(), array(), "875843567");
	}
	
	public function populateTagsBasedOnExistingTag($tag, $groupid, $synonyms, $excludes){	   
	   if (!isset($groupid)){
	       $groupid = 1;   
	   }
	   
	   $sql = "INSERT IGNORE INTO " . TAGS . 
	           " (" . TAG_STRING . "," .
                      PRODUCT_SKU . "," .
                      TAG_COUNT . ", " .
                      TAG_DATE_ADDED . ", " .
                      TAG_GROUP_ID . ")" .
	           " SELECT ?, sku, 1, NOW(), ? " .
               " FROM " . PRODUCTS .
               " WHERE (LOWER(".PRODUCT_NAME.") REGEXP ? OR LOWER(".PRODUCT_DETAILS.") REGEXP ?)";
               
       $paramTypes = array('text','integer','text','text');        
       $params = array($tag, $groupid, $synonyms, $synonyms);
               
       if (isset($excludes) && trim($excludes) != ""){
            $sql .= " AND (LOWER(".PRODUCT_NAME.") NOT REGEXP ? AND LOWER(".PRODUCT_DETAILS.") NOT REGEXP ?)";
            $paramTypes[] = "text";
            $paramTypes[] = "text";
            $params[] = $excludes;
            $params[] = $excludes;
       }
	   
	   print_r($params);
	   return $this->update($sql, $params, $paramTypes, "853299875");
    }
}
?>