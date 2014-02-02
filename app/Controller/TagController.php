<?php
require_once(dirname(__FILE__) . '/../Database/DataAccess/check-login.php');
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
        
        foreach ($tags as $row) {            
            try {
                
                if($this->debug){
                    $tagParams = print_r($row, true);
        			$this->logDebug("12712931" ,$sql . " (" . $tagParams . ")" );
        		}
                
                $results = $stmt->execute($row);
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
}


if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['method'])){
    $tagController = new TagController($mdb2);                  
    
    if ($_GET['method'] == 'addFromFile'){
         $tagResults = $tagController->addTagsFromFile("../Data/clothies-tags-export.json");
    
    }else if ($_GET['method'] == 'add' && isset($_POST['tag']) && isset($_POST['sku'])){                        
        $tagResults = $tagController->addTag($_POST);
        
    }
    
    print_r($tagResults);
}

?>