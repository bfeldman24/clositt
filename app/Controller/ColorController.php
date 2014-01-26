<?php
require_once(dirname(__FILE__) . '/../Database/DataAccess/check-login.php');
require_once(dirname(__FILE__) . '/../Database/Dao/AbstractDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');
require_once(dirname(__FILE__) . '/../View/ProductTemplate.php');

define('COLORS', 'Colors');

class ColorController extends AbstractDao{		
	
	public function addColors($colors){	
		
		if(isset($colors) && is_array($colors) && count($colors) > 0){	
			
			$results = $this->addColorsDao($colors);			
			
			if(is_numeric($results) && $results > 0){
				return true;
			}
		}
	
		return false;
	}
	
	public function addColorsDao($colors){
	    if(!isset($colors) || !is_array($colors)){
			$this->logWarning("12876319","Nothing to add!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . COLORS . 
	           " VALUES (?, ?, ?)";
        
        $stmt = $this->db->prepare($sql);
        
        foreach ($colors as $row) {            
            try {
                $results = $stmt->execute($row);
            } catch (Exception $e) {
                echo 'Caught exception: ',  $e->getMessage(), "\n\n";
                print_r($row);
            }
        }
        
        return $results;
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
}
     

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['method'])){
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
    }
    
    print_r($results);
}

?>