<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/TagDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');

class TagController{	
    private $tagDao = null;
	
	public function __construct(){
		$this->tagDao = new TagDao();
	}
		
	public function addTag($tag){
		
		if(isset($tag) && is_array($tag) && count($tag) == 2){	
		    $tag['tag'] = ucwords(strtolower($tag['tag']));
            $tag['tag'] = preg_replace('/\s+/', '', $tag['tag']);		  
			
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
	    if (!isset($tagFile)){
	       return;  
	    }
	   
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
	
	public function getTagListToPopulateTags(){	   
	    $tagsListFile = dirname(__FILE__) . '/../Data/tags.csv';	    	    			      
		$TAG = 0;
		$GROUP = 1;
		$SYN = 2;
		$EXCL = 3;
		
		ini_set("auto_detect_line_endings", true); // fixes issue with not reading line endings from file saved by a Mac
		$tags = file($tagsListFile);		
		echo "Found " . count($tags) . " tags! ";
		
		if (count($tags) <= 1){
		      print_r($tags);
		      return;
		} 
		
		// add all groups that don't already exist
		$tagGroups = array();
		for ($i=1; $i < count($tags); $i++){
		  $tagParts = explode(",", strtolower($tags[$i]));
		  $group = ucwords($tagParts[$GROUP]);
		  
		  if (!in_array($group, $tagGroups)){
		         $tagGroups[] = $group;
		  }   
		}      
		$this->tagDao->addTagGroups($tagGroups);
		      
		// get mapping from group name to group id
		$results = $this->tagDao->getAllTagGroups();
		$tagGroupMapping = array();
		if(is_object($results)){
		 
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
			     $tagGroupMapping[stripslashes($row[TAG_GROUP_NAME])] = $row[TAG_GROUP_ID];
			}
		}		
		
		$affectedRows = 0;
		for ($i=1; $i < count($tags); $i++){
		      
		      $tagParts = explode(",", strtolower($tags[$i]));
		      $tag = $tagParts[$TAG];
		      $group = ucwords($tagParts[$GROUP]);
		      $synonyms = $tagParts[$SYN];
		      $this->enrichSynonyms($tag, $synonyms);
		      $excludes = $tagParts[$EXCL];		      		      
		      
		      // Get groupId or default to 1
		      if (isset($tagGroupMapping[$group])){		          
		          $groupid = $tagGroupMapping[$group];
		      }else{
		          $groupid = 1;
		      }
		      
		      $result = $this->tagDao->populateTagsBasedOnExistingTag($tag, $groupid, $synonyms, $excludes);              
		      
		      if (is_numeric($result)){
		          $affectedRows += $result;
		      }
		}
									
		return $affectedRows;
	}	
	
	private function enrichSynonyms($tag, &$synonyms){
	    if (!isset($tag)){
	       return;   
	    }
	   
	    $tagNoSpaces = str_replace(" ", "-",$tag);                          
        
        if (isset($synonyms) && trim($synonyms) != ""){
            $synonyms .= "|";
        }else{
            $synonyms = "";   
        }
        
        $synonyms .= $tag;
    	              
        // remove trailing es
        if (substr($tag,strlen($tag)-2) == "es"){
          	$synonyms .= "|" . substr($tag,0,strlen($tag)-2);
          
          	if ($tag != $tagNoSpaces){
          		$synonyms .= "|" . substr($tagNoSpaces,0,strlen($tagNoSpaces)-2);
          	}
        }
        
        if (substr($tag,strlen($tag)-1) == "s"){
            // remove trailing s
        	$synonyms .= "|" . substr($tag,0,strlen($tag)-1);
        
        	if ($tag != $tagNoSpaces){
        		$synonyms .= "|" . substr($tagNoSpaces,0,strlen($tagNoSpaces)-1);
        	}
        }                
    
        if ($tag != $tagNoSpaces){                      
          	$synonyms .= "|" . $tagNoSpaces;
        }                 
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
	
	public function replaceTag($criteria){
	   if (!isset($criteria) || 
	       !isset($criteria['sku']) || strlen($criteria['sku']) < 3 || 
	       !isset($criteria['tag']) || strlen($criteria['tag']) < 3 ||
	       !isset($criteria['replacement']) || strlen($criteria['replacement']) < 3){
	       return "Missing info. Can't proceed";
	   }  
	   
	   $affectedRows = $this->tagDao->replaceTag($criteria['sku'], $criteria['tag'], $criteria['replacement']); 
	   return $affectedRows > 0 ? "success" : "failed";
	}
	
	public function getProductsForTag($tags, $page, $getOnlyUnapprovedTags){
	   if (isset($tags)){
	       if (!isset($getOnlyUnapprovedTags)){
	           $getOnlyUnapprovedTags = true;   
	       }
	       
	       if (!isset($page)){
	           $page = 0;   
	       }
	       	       
	       if(is_array($tags)){ 
          	    list($tag) = $tags;
      	    }else{
      	         $tag = $tags;
      	    }
	       
	       $results = $this->tagDao->getProductsForTag($tag, $page, $getOnlyUnapprovedTags);	       
	       	       
	       if(is_object($results)){
	           $products = array();
	           
    			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){
    			    $productEntity = new ProductEntity();
    				ProductEntity::setProductFromDB($productEntity, $row);
    				$products[] = $productEntity->toArray();
    			}
    			
    			return json_encode(array("products" => $products));
    		}
	   }
	   
	   return null;
	}		
}

?>