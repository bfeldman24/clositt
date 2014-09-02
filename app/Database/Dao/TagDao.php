<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/AbstractDao.php');

class TagDao extends AbstractDao {             	
	
	public function getUniqueTags(){
	   $sql = "SELECT DISTINCT " . TAG_STRING . 
				" FROM " . TAGS . " t " .
				" LEFT JOIN " . PRODUCTS . " p ON p." . PRODUCT_SKU . " = t." . PRODUCT_SKU .
				" WHERE " . TAG_APPROVED . " = 0 " .
				" AND p." . PRODUCT_STATUS . " = 1 " . 			
				" ORDER BY " . TAG_STRING;
        
		$paramTypes = array();		
		$params = array();		
		return $this->getResults($sql, $params, $paramTypes, "2342837429");
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
	
	
	public function tryUpdateTagDao($tag){
	   if(!isset($tag) || !is_array($tag)){
			$this->logWarning("128763192","Nothing to add!");
			return false; 
		}
	 
	    $sql = "UPDATE " . TAGS . 
	           " SET " . TAG_COUNT  . " = " . TAG_COUNT . " + 1 " . 
	           " WHERE " . TAG_STRING . " = :tag AND " . PRODUCT_SKU . " = :sku";
        
        $stmt = $this->db->prepare($sql, array('text','text'), MDB2_PREPARE_MANIP);
                
        try {
            if($this->debug){
                $tagParams = print_r($tag, true);
    			$this->logDebug("127129321" ,$sql . " (" . $tagParams . ")" );
    		}
            
            $affected = $stmt->execute($tag);
            $stmt->free();
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n\n";
            print_r($tag);
        }       
        
        if($this->debug){            
            $a = print_r($affected, true);
			$this->logDebug("affected update" ,$a);
		} 
        
        return $affected;
	}
	
	
	public function addNewTagDao($tag){
	    $insertArray = array();
        $insertArray[] = $_POST['tag'];
        $insertArray[] = $_POST['sku'];
        $insertArray[] = 1;
        
        $tagArray = array();
        $tagArray[] = $insertArray;
        
        return $this->addTagsDao($tagArray);	     
	}
	
	
	public function addTagsDao($tags){
	    if(!isset($tags) || !is_array($tags)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . TAGS . " (".TAG_STRING.",".PRODUCT_SKU.",".TAG_COUNT.",".
	                                       TAG_STATUS.",".TAG_APPROVED.",".TAG_DATE_ADDED.") " . 
	           " VALUES (?, ?, ?, 1, 0, NOW())";	           	           
        
        $stmt = $this->db->prepare($sql, array('text','text','integer'), MDB2_PREPARE_MANIP);
        
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
}
?>