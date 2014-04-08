<?php
require_once(dirname(__FILE__) . '/../Database/DataAccess/check-login.php');
require_once(dirname(__FILE__) . '/../Database/Dao/AbstractDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');
require_once(dirname(__FILE__) . '/../View/ProductTemplate.php');
require_once(dirname(__FILE__) . '/../../scripts/admin/php/colorExtract/colorInspector.php');   

class ColorController extends AbstractDao{		
	
	public function addColors($colors){	
		
		if(isset($colors) && is_array($colors) && count($colors) > 0){	
			
			$results = $this->addColorsDao($colors);
			//$results2 = $this->addHasColorsDao($colors);			
			
			if(is_numeric($results) && $results > 0){
				return "success";
			}else{
			     print_r($results);
			     //print_r($results2);
			}
		}
	
		return "failed";
	}
	
	public function addColorsDaoOLD($colors){
	    if(!isset($colors) || !is_array($colors)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . COLORS . 
	           " VALUES (?, ?, ?, NOW())";
        
        $stmt = $this->db->prepare($sql);
        
        $affected = 0;
        
        if ($colors[0] != null){
            foreach ($colors as $color) {            
                try {                
                    echo "COLOR:";
                    print_r($colors);
                    $affected += $stmt->execute($color);
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n\n";                    
                }
            }
        }else if ($colors['colors'] != null){
            foreach ($colors['colors'] as $color => $products) {            
                foreach ($products as $sku => $percent) {   
                    try {                
                        echo " [COLOR: $color, SKU: $sku, PERCENT: $percent] ";
                        $affected += $stmt->execute(array($color, $sku, $percent));
                    } catch (Exception $e) {
                        echo 'Caught exception: ',  $e->getMessage(), "\n\n";                        
                    }
                }
            }
        }else{
            print_r($colors);   
        }
        
        return $affected;
	}
	
	public function addColorsDao($colors){
	    if(!isset($colors) || !is_array($colors)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "UPDATE " . PRODUCTS . 
	           " SET " . PRODUCT_COLOR_ONE . " = ?," .
	                     PRODUCT_COLOR_ONE_PERCENT . " = ?," .
	                     PRODUCT_COLOR_TWO . " = ?," .
	                     PRODUCT_COLOR_TWO_PERCENT . " = ? " .
	           " WHERE " . PRODUCT_SKU . " = ? ";
        
        $stmt = $this->db->prepare($sql);
        
        $colorMappingSql = "INSERT INTO " . COLOR_MAPPING . " (" . COLOR_MAPPING_COLOR .")" .
                           " VALUES (?)";
        
        $colorMappingStmt = $this->db->prepare($colorMappingSql);
        
        $affected = 0;
        
        if ($colors[0] != null){
            foreach ($colors as $color) {            
                try {                                    
                    print_r($colors);
                    $affected += $stmt->execute($color);
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n\n";                    
                }
            }
        }else if ($colors['colors'] != null){
            foreach ($colors['colors'] as $sku => $products) { 
                
                $colorParams = array();
                foreach ($products as $color => $percent) {   
                    $colorParams[] = $color;       
                    $colorParams[] = $percent;                                            
                }
                
                while (count($colorParams) < 4){
                    $colorParams[] = "error";       
                    $colorParams[] = -1;
                }
                
                $colorParams[] = $sku;
                
                try {                
                    print_r(json_encode($colorParams));
                    $affected += $stmt->execute($colorParams);
                    $colorMappingStmt->execute($colorParams[0]);
                    $colorMappingStmt->execute($colorParams[2]);
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n\n";                        
                }
            }
        }else{
            print_r($colors);   
        }
        
        return $affected;
	}
	
	public function addHasColorsDao($colors){
	    if(!isset($colors) || !is_array($colors)){
			$this->logWarning("32522343","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . HAS_COLOR . 
	           " VALUES (?, NOW())";
        
        $stmt = $this->db->prepare($sql);
        
        $affected = 0;
        
        if ($colors['colors'] != null){
            foreach ($colors['colors'] as $color => $products) {            
                foreach ($products as $sku => $percent) {   
                    try {                
                        echo " [COLOR: $color] ";
                        $affected += $stmt->execute(array($sku));
                    } catch (Exception $e) {
                        echo 'Caught exception: ',  $e->getMessage(), "\n\n";                        
                    }
                }
            }
        }
        
        return $affected;
	}

	public function addColorsFromFile($colorFile){
	    // Get Products from file    
        $file = fopen($colorFile, 'r');
        $colorsJson = fread($file, filesize($colorFile));
        fclose($file);
        $colors = json_decode($colorsJson, true);  
        
        $colorArray = array();
        $i=0;
        
        foreach ($colors as $colorName => $products){
            foreach ($products as $sku => $percent){
                 
                 $i++;                          
                 $insertArray = array();
                 $insertArray[] = $colorName;
                 $insertArray[] = $sku;
                 $insertArray[] = $percent;
                 
                 $colorArray[] = $insertArray;  
            }
        }
        
        $result = $this->addColors($colorArray);
        echo "DONE: " . $i . ") " . $result;
        return $result;
	}
	
	public function getColors(){
	    $searchResults = array();
	    		      
		$results = $this->getColorsDao();
		
		if(is_object($results)){
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){					
				$searchResults[stripslashes($row[PRODUCT_SKU])] = stripslashes($row[PRODUCT_IMAGE]);
			}
		}
	
		return $searchResults;
	}
	
	public function getColorsDaoOLD(){			
		
		$sql = "SELECT p." . PRODUCT_SKU . ", p." . PRODUCT_IMAGE .				
				" FROM " . PRODUCTS . " p " .
				" LEFT JOIN ". HAS_COLOR . " c ON c." . PRODUCT_SKU . " = p." . PRODUCT_SKU .				
				" WHERE p." . PRODUCT_STATUS . " IN (1,4) " .
				" AND ISNULL(c." . PRODUCT_SKU . ") " . 				
				" LIMIT 100";														
        
		$paramsTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "12381232");
	}
	
	public function getColorsDao(){			
		
		$sql = "SELECT p." . PRODUCT_SKU . ", p." . PRODUCT_IMAGE .				
				" FROM " . PRODUCTS . " p " .				
				" WHERE p." . PRODUCT_STATUS . " IN (1,2,3,4) " .
				" AND ISNULL(p." . PRODUCT_COLOR_ONE . ") " .
				" AND ISNULL(p." . PRODUCT_COLOR_TWO . ") " .
				" LIMIT 100";														
        
		$paramsTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "1238123");
	}
	
	public function getColorMapping(){
	    $searchResults = array();
	    		      
		$results = $this->getColorMappingDao();
		
		if(is_object($results)){
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){					
				$searchResults[stripslashes($row[COLOR_MAPPING_COLOR])] = stripslashes($row[COLOR_MAPPING_PARENT]);
			}
		}
	
		return $searchResults;
	}
	
	public function getColorMappingDao(){			
		
		$sql = "SELECT " . COLOR_MAPPING_COLOR . ", " . COLOR_MAPPING_PARENT .				
				" FROM " . COLOR_MAPPING .				
				" WHERE " . COLOR_STATUS . " = 2 " .
				" LIMIT 100";														
        
		$paramsTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "5645432");
	}
	
	public function saveColorMapping($colors){

	   if(isset($colors) && is_array($colors) && count($colors) > 0){	

			$results = $this->saveColorMappingDao($colors);			
			
			if(is_numeric($results) && $results > 0){
				return "success";
			}else{
			     print_r($results);
			}
		}
	
		return "failed";
	}
	
	public function saveColorMappingDao($colors){			
		
		if(!isset($colors) || !is_array($colors)){
			$this->logWarning("35237245","Nothing to add!");
			return false; 
		}
		
	 
	    $sql = "UPDATE " . COLOR_MAPPING . 
	           " SET " . COLOR_MAPPING_PARENT . " = :parent , " .
	                     COLOR_MAPPING_NAME . " = :name , " .
	                     COLOR_MAPPING_BRIGHTNESS . " = :brightness , " .
	                     COLOR_MAPPING_SATURATION . " = :saturation , " .
	                     COLOR_MAPPING_DESCRIPTION . " = :description , " .
	                     COLOR_STATUS . " = 1 " .	           
	           " WHERE " . COLOR_MAPPING_COLOR . " = :color ";
        
        $stmt = $this->db->prepare($sql);
        
        $affected = 0;        
        
        foreach ($colors as $color => $attributes) {            
            try {                
                $affected += $stmt->execute($attributes);
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";                        
            }
        }        
        
        return $affected;
	}
	
	public function getColorMappingCount(){	    		      
		$results = $this->getColorMappingCountDao();
		
		if(is_object($results)){
			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){					
				return $row["count"];
			}
		}
	
		return -1;
	}
	
	public function getColorMappingCountDao(){					
		
		$sql = "SELECT COUNT(1) as count " .
				" FROM " . COLOR_MAPPING . " p " .				
				" WHERE " . COLOR_STATUS . " = 2 ";
        
		$paramsTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "342934962");
	}
	
	public function getColorsCount(){	    		      
		$results = $this->getColorsCountDao();
		
		if(is_object($results)){
			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){					
				return $row["count"];
			}
		}
	
		return -1;
	}
	
	public function getColorsCountDao(){					
		
		$sql = "SELECT COUNT(1) as count " .
				" FROM " . PRODUCTS . " p " .				
				" WHERE NOT ISNULL(p." . PRODUCT_COLOR_ONE . ") " .
				" AND NOT ISNULL(p." . PRODUCT_COLOR_TWO . ") ";
        
		$paramsTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "322832");
	}
	
	public function correctColor($sku, $oldColor, $newColor = null){	      	       
	      
	      if ($newColor == null || trim($newColor) == "" || $newColor == "none"){
	           $result = $this->removeColorDao($sku, $oldColor); 
	      }else{
	           $this->clearOtherColorsDao($sku, $oldColor);
	           $result = $this->correctColorDao($sku, $oldColor, $newColor);
	      }
	      
	      return $result;
	}
	
	public function clearOtherColorsDao($sku, $oldColor){
	    $sql = "DELETE FROM " . COLORS . 
        	  " WHERE " . PRODUCT_SKU . " = ? AND " . 
        	              COLORS_COLOR . " <> ?";                   
              
       if($this->debug){		    
			$this->logDebug("239846293" ,$sql );
		}
        
        $paramTypes = array('text', 'text');
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
                            
        try {                                     
            $affectedRows = $stmt->execute(array($sku, $oldColor));
        } catch (Exception $e) {
            $this->logError("2349823496", 'Caught exception: ' .  $e->getMessage() . "\n\n");
        }
        
        return $affectedRows; 
	}
	
	public function removeColorDao($sku, $oldColor){
	    $sql = "DELETE FROM " . COLORS . 
        	  " WHERE " . PRODUCT_SKU . " = ? AND " . 
        	              COLORS_COLOR . " = ?";                   
              
       if($this->debug){		    
			$this->logDebug("1234231242" ,$sql );
		}
        
        $paramTypes = array('text', 'text');
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
                            
        try {                                     
            $affectedRows = $stmt->execute(array($sku, $oldColor));
        } catch (Exception $e) {
            $this->logError("1224235322", 'Caught exception: ' .  $e->getMessage() . "\n\n");
        }
        
        return $affectedRows; 
	}
	
	public function correctColorDao($sku, $oldColor, $newColor){
	    $sql = "UPDATE " . COLORS . 
	           " SET " . COLORS_COLOR . " = ?, " . COLORS_PERCENT . " = 50 " .
        	   " WHERE " . PRODUCT_SKU . " = ? AND " . 
        	              COLORS_COLOR . " = ?";                   
              
       if($this->debug){		    
			$this->logDebug("98237493" ,$sql );
		}
        
        $paramTypes = array('text', 'text', 'text');
        $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
        $affectedRows = 0;
                            
        try {                                     
            $affectedRows = $stmt->execute(array($newColor, $sku, $oldColor));
        } catch (Exception $e) {
            $this->logError("1224235322", 'Caught exception: ' .  $e->getMessage() . "\n\n");
        }
        
        return $affectedRows; 
	}
}
     
if( isset($_GET['method']) ){
    $colorController = new ColorController($mdb2);                  
    
    if ($_GET['method'] == 'addFromFile'){
         $results = $colorController->addColorsFromFile("../Data/clothies-colors-export.json"); 
    }else if ($_GET['method'] == 'add' && isset($_POST['color']) && isset($_POST['sku'])){
                
        $insertArray = array();
        $insertArray[] = $_POST['color'];
        $insertArray[] = $_POST['sku'];
        $insertArray[] = 1;
        $colorArray = array();
        $colorArray[] = $insertArray; 
        
        $results = $colorController->addColors($colorArray);
    }else if ($_GET['method'] == 'get'){
            $unprocessedColors = $colorController->getColors();                           
            $colors = ColorInspector::processImageColors($unprocessedColors, 2);                    
            print_r(json_encode($colors));
            
            $results = $colorController->addColors($colors);            
            print_r($results);
            
    }else if ($_GET['method'] == 'getmappings'){
            $colors = $colorController->getColorMapping();                                                   
            print_r(json_encode($colors));            
    
    }else if ($_GET['method'] == 'createmappings'){
            $colors = $colorController->getColorMapping();
            $mappings = ColorInspector::getClosestColors($colors);
            print_r(json_encode($mappings));                              
    
    }else if ($_GET['method'] == 'savemappings' && isset($_POST['colors'])){
            $results = $colorController->saveColorMapping($_POST['colors']);                             
    
    }else if ($_GET['method'] == 'getmappingcount'){
            $results = $colorController->getColorMappingCount();                             
    
    }else if ($_GET['method'] == 'testImage'){                          
            $images = array();
            $images['TestProduct'] = $_GET['i'];
            $colors = ColorInspector::processImageColors($images, 2);                  
            print_r(json_encode($colors));
            
    }else if ($_GET['method'] == 'count'){
            $colorCount = $colorController->getColorsCount();                                      
            print_r($colorCount);
    
    }else if ($_GET['method'] == 'correct' && isset($_POST['sku']) && isset($_POST['oldColor'])){
        
        if ($_SESSION['isAdmin']){
            $results = $colorController->correctColor($_POST['sku'], $_POST['oldColor'], $_POST['newColor']);
        }else{
            $results = 'Not Authorized! ';
        }
    }
    
    print_r($results);
}

?>