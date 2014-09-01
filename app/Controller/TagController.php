<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/AbstractDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');

class TagController extends AbstractDao{		
	
	public function addTag($tag){
		
		if(isset($tag) && is_array($tag) && count($tag) == 2){	
			
			$updatedTags = $this->tryUpdateTagDao($tag);									
			
			if(is_numeric($updatedTags) && $updatedTags > 0){
				return "success";
			}else{
			    $insertedTags = $this->addNewTagDao($tag);	
			    
			    if(is_numeric($insertedTags) && $insertedTags > 0){
				    return "success";
			    }
			}
		}
	
		return false;
	}
	
	public function addTags($tags){	
	   
		if(isset($tags) && is_array($tags) && count($tags) > 0){	
		
			$results = $this->addTagsDao($tags);			
		
			if(is_numeric($results) && $results > 0){
				return "success";
			}
		}
	
		return false;
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
	 
	    $sql = "INSERT INTO " . TAGS . 
	           " VALUES (?, ?, ?)";	           	           
        
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
	
	public function addTagsFromFile($tagFile){
	    // Get Tags from file    
        $file = fopen($tagFile, 'r');
        $tagsJson = fread($file, filesize($tagFile));
        fclose($file);
        $tags = json_decode($tagsJson, true);  
        
        $tagArray = array();
        $i=0;
        
        foreach ($tags as $tagName => $products){
            foreach ($products['items'] as $sku => $count){
                 $tagName = ucwords(strtolower($tagName));
                 $tagName = preg_replace('/\s+/', '', $tagName);
                 
                 $i++;                          
                 $insertArray = array();
                 $insertArray[] = $tagName;
                 $insertArray[] = $sku;
                 $insertArray[] = $count;
                 
                 $tagArray[] = $insertArray;  
            }
        }
        
        $result = $this->addTags($tagArray);
        echo "DONE: " . $i . ") " . $result;
        return $result;
	}
	
	public function getPotentialTags(){
	   $sql = "SELECT ". PRODUCT_NAME. " FROM " . PRODUCTS . " LIMIT 10000";
	   $results = $this->getResults($sql, array(), array(), "128723424");
	   $ignore = array("a","is","to","with","and","the","about");
	   
	   $potentialTags = array();
	   
	   if(is_object($results)){
		 
			while($name = $results->fetchOne()){	
                $words = explode(" ", strtolower($name));
                
                for($i=0; $i < count($words); $i++){
                    if (!in_array(ucfirst($words[$i]),$potentialTags) && 
                        !in_array($words[$i],$ignore) && 
                        ctype_alpha($words[$i])){
                        $potentialTags[] = ucfirst($words[$i]);
                    }   
                }                
			}
		}
		
		sort($potentialTags);
		
		for($i=0; $i < count($potentialTags); $i++){
		  echo $potentialTags[$i] . ",";
		}	
		
		return '';	 
	}
	
	public function populateTagsBasedOnExistingTags(){
	   $sql = "SELECT DISTINCT ". TAG_STRING. " FROM " . TAGS;
	   $results = $this->getResults($sql, array(), array(), "2383294");	   	   
	   
	   $insertSQL = "INSERT INTO " . TAGS . 
	           " (" . TAG_STRING . "," .
                      PRODUCT_SKU . "," .
                      TAG_COUNT . ", " .
                      TAG_DATE_ADDED . ", " .
                      TAG_GROUP_ID . ")" .
	           "SELECT ?, sku, 1, NOW(), " .
	           "(SELECT COALESCE((SELECT ".TAG_GROUP_ID." FROM ".TAGS." WHERE ".TAG_STRING." = ? LIMIT 1), 1)), " .
               " FROM " . PRODUCTS .
               " WHERE LOWER(".PRODUCT_NAME.") LIKE '%?%' OR LOWER(".PRODUCT_DETAILS.") LIKE '%?%'";
	   
	   $insertSTMT = $this->db->prepare($insertSQL, array('text','text','text'), MDB2_PREPARE_MANIP);
	   
	   if(is_object($results)){		 
			while($tag = $results->fetchOne()){	                                    
                try {                                                
                    if(DEBUG){
                        $tagParams = print_r($tag, true);
            			$this->debug("239847293" ,$insertSTMT . " (" . $tagParams . ")" );
            		}
                    
                    $results = $insertSTMT->execute($tag, $tag, $tag, $tag);
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                    print_r($results);
                }                    
			}
	   }
        
       $insertSQL->free();        		
	}
}


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['method'])){
    $tagController = new TagController($mdb2);                  
    
    if ($_GET['method'] == 'addFromFile'){
         $tagResults = $tagController->addTagsFromFile("../Data/clothies-tags-export.json");
    
    }else if ($_GET['method'] == 'add' && isset($_POST['tag']) && isset($_POST['sku'])){                        
        $_POST['tag'] = ucwords(strtolower($_POST['tag']));
        $_POST['tag'] = preg_replace('/\s+/', '', $_POST['tag']);
        
        $tagResults = $tagController->addTag($_POST);
        
    }else if ($_GET['method'] == 'getpotentialtags'){                                        
        $tagResults = $tagController->getPotentialTags($_POST);
        
    }

    
    print_r($tagResults);
}

?>