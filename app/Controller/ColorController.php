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
			
			if(is_numeric($results) && $results > 0){
				return "success";
			}else{
			     print_r($results);
			}
		}
	
		return "failed";
	}
	
	public function addColorsDao($colors){
	    if(!isset($colors) || !is_array($colors)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . COLORS . 
	           " VALUES (?, ?, ?)";
        
        $stmt = $this->db->prepare($sql);
        
        $affected = 0;
        
        if ($colors['colors'] == null){
            foreach ($colors as $color) {            
                try {                
                    $affected += $stmt->execute($color);
                } catch (Exception $e) {
                    echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                    print_r($row);
                }
            }
        }else{
            foreach ($colors['colors'] as $color => $products) {            
                foreach ($products as $sku => $percent) {   
                    try {                
                        $affected += $stmt->execute(array($color, $sku, $percent));
                    } catch (Exception $e) {
                        echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                        print_r($row);
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
	
	public function getColorsDao(){
	   $limit = 1000;					
		
		$sql = "SELECT " . PRODUCT_SKU . "," . PRODUCT_IMAGE .				
				" FROM " . PRODUCTS . " p " .
				" WHERE NOT EXISTS(SELECT 1 FROM " . COLORS . " c WHERE c." . PRODUCT_SKU . " = p." . PRODUCT_SKU . ")".
				" LIMIT ?";								
        
		$paramsTypes = array('integer');		
		$params = array($limit);
		
		return $this->getResults($sql, $params, $paramTypes, "1238123");
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
        $results = $colorController->addColors($colors);
    }
    
    print_r($results);
}

?>