<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/TagDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');

class TagController{	
    private $tagDao = null;
	
	public function __construct(&$mdb2){
		$this->tagDao = new TagDao($mdb2);
	}
	
	
	public function addTag($tag){
		
		if(isset($tag) && is_array($tag) && count($tag) == 2){	
			
			$updatedTags = $this->tagDao->tryUpdateTagDao($tag);									
			
			if(is_numeric($updatedTags) && $updatedTags > 0){
				return "success";
			}else{
			    $insertedTags = $this->tagDao->addNewTagDao($tag);	
			    
			    if(is_numeric($insertedTags) && $insertedTags > 0){
				    return "success";
			    }
			}
		}
	
		return false;
	}
	
	public function addTags($tags){	
	   
		if(isset($tags) && is_array($tags) && count($tags) > 0){	
		
			$results = $this->tagDao->addTagsDao($tags);			
		
			if(is_numeric($results) && $results > 0){
				return "success";
			}
		}
	
		return false;
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
	   $results = $this->tagDao->getPotentialTags();
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
	
	public function getUniqueTags(){	   
	    $tags = array();	    			      
		$results = $this->tagDao->getUniqueTags(); 
		
		if(is_object($results)){
		 
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){				    
				$tags[stripslashes($row[TAG_STRING])] = array("unapproved" => $row["unapproved"], "approved" => $row[TAG_APPROVED]);
			}
		}
	
		return json_encode($tags);
	}
	
	public function removeTag($criteria){
	   if (!isset($criteria) || !isset($criteria['sku']) || strlen($criteria['sku']) < 3 || !isset($criteria['tag']) || strlen($criteria['tag']) < 3){
	       return "Missing info. Can't proceed";   
	   }  
	   
	   $criteria['skus'] = array($criteria['sku']);
	   return $this->removeTags($criteria);
	}
	
	public function removeTags($criteria){
	   if (!isset($criteria) || !isset($criteria['skus']) || !is_array($criteria['skus']) || !isset($criteria['tag']) || strlen($criteria['tag']) < 3){
	       return "Missing info. Can't proceed";   
	   }  
	   
	   $affectedRows = $this->tagDao->removeTags($criteria['skus'], $criteria['tag']); 
	   return $affectedRows > 0 ? "success" : "failed";
	}
	
	public function approveTags($criteria){
	   if (!isset($criteria) || !isset($criteria['skus']) || !is_array($criteria['skus']) || !isset($criteria['tag']) || strlen($criteria['tag']) < 3){
	       return "Missing info. Can't proceed";   
	   }  
	   
	   $affectedRows = $this->tagDao->approveTags($criteria['skus'], $criteria['tag']); 
	   return $affectedRows > 0 ? "success" : "failed";
	}	
}


if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $tagController = new TagController($mdb2);                  
    
    if(DEBUG){
        switch($_GET['method']){
            case 'addFromFile':   
                $tagResults = $tagController->addTagsFromFile("../Data/clothies-tags-export.json");
                break;        
            case 'getpotentialtags':   
                $tagResults = $tagController->getPotentialTags($_POST);
                break;
            case 'getuniquetags':
                $tagResults = $tagController->getUniqueTags();    
                break;
            case 'removetag':
                $tagResults = $tagController->removeTag($_POST);   
                break;             
            case 'removetags':
                $tagResults = $tagController->removeTags($_POST);   
                break;         
            case 'approvetags':
                $tagResults = $tagController->approveTags($_POST);   
                break;  
        }       
    }else{
        switch($_GET['method']){
           case 'add':   
               $_POST['tag'] = ucwords(strtolower($_POST['tag']));
               $_POST['tag'] = preg_replace('/\s+/', '', $_POST['tag']);
               
               $tagResults = $tagController->addTag($_POST);
               break;        
       }   
    } 
    
    print_r($tagResults);
}

?>