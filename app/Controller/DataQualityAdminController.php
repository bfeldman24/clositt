<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/DataQualityAdminDao.php');
require_once(dirname(__FILE__) . '/../Model/ProductEntity.php');
require_once(dirname(__FILE__) . '/../View/ProductView.php');
require_once(dirname(__FILE__) . '/Debugger.php');


class DataQualityAdminController extends Debugger {
	private $dataQualityAdminDao = null;
	
	public function __construct(){
		$this->dataQualityAdminDao = new DataQualityAdminDao();
	}						
	
	public function get($queryNumber){
	   $queryName = null;
	   $queryDesc = null;
	   $useTable = false;
	   
	   switch($queryNumber){
            case 1:
                $queryName = "duplicateScrapesInHistoricalProducts";
                $queryDesc = "Lots of duplicate scrapes at the same time in HistoricalProducts";
                $useTable = true;
                break;
            case 2:
                $queryName = "largePricesInHistoricalProducts";
                $queryDesc = "Weird large price change in HistoricalPrices";
                $useTable = true;
                break;
            case 3:
                $queryName = "duplicateLinks";
                $queryDesc = "Duplicate data/counting links/ different categories same product";
                $useTable = true;
                break;
            case 4:
                $queryName = "categoriesWithTabsAndNewLineCharacters";
                $queryDesc = "Product table has category data with imporper tab and new_line fomatting";
                break;
            case 5:
                $queryName = "productsWithTabsAndNewLineCharacters";
                $queryDesc = "Product table has name data with imporper tab and new_line fomatting";
                break;
            case 6:
                $queryName = "largePrices";
                $queryDesc = "Query to look for anything over 10,000 - arbitrary call by me after looking up the max value in products";
                break;
            case 7:
                $queryName = "smallPrices";
                $queryDesc = "Query to look for anything under $3 - arbitrary call by me after looking up the min value in products";
                break;
            case 8:
                $queryName = "largePriceChange";
                $queryDesc = "Query to for skus whos price has increased by more than 50% since they were to stored in HProd to Prod";
                $useTable = true;
                break;   
            case 9:
                $queryName = "productsInShekels";
                $queryDesc = "Query to find products that are in shekels";
                break;   
            case 10:
                $queryName = "productsWithEmptyStrings";
                $queryDesc = "Query to find products with empty strings";
                $useTable = true;
                break;     
            case 11:
                $queryName = "productsThatAreNotClothes";
                $queryDesc = "Query to find products with that are not clothes";
                break;     
	   }
	   
	   if (isset($queryName) && $queryName != ""){
	       $results = array();
	       $results['queryDesc'] = $queryDesc;	
	       
	       if ($useTable){
	           $results['products'] = $this->getQATable($queryName);
	       }else{       
	           $results['products'] = $this->getQAProducts($queryName);
	       }
	       
	       return json_encode($results);
	   }
	}
	
	private function getQATable($queryName){
        $searchResults = '';
        $tableHeaders = '';
        	    				      
        $reflectionMethod = new ReflectionMethod('DataQualityAdminDao', $queryName);
        $results = $reflectionMethod->invoke($this->dataQualityAdminDao);	    				      
		
		if(is_object($results)){			    
		  	 
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
			    $searchResults .= "<tr>";
			    
			    if (strlen($tableHeaders) <= 0){
			         $tableHeaders = "<tr>";
			         foreach ($row as $field => $value){
                          $tableHeaders .= "<th>";
                          $tableHeaders .= $field;
                          $tableHeaders .= "</th>";
      			     }
      			     $tableHeaders .= "</tr>";
			    }
			    
			    foreach ($row as $value){
                    $searchResults .= "<td>";
                    $searchResults .= $value;
                    $searchResults .= "</td>";
			    }
			    
			    $searchResults .= "</tr>";
			}
		}
		
		$classes = "table table-striped table-hover table-bordered table-condensed table-responsive";
		$searchResults = '<table class="'.$classes.'">'.$tableHeaders.$searchResults.'</table>';
	
		return $searchResults;
	}
	
	private function getQAProducts($queryName){
        $searchResults = '';
        	    				      
        $reflectionMethod = new ReflectionMethod('DataQualityAdminDao', $queryName);
        $results = $reflectionMethod->invoke($this->dataQualityAdminDao);	    				      
		
		if(is_object($results)){		 
			while($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){	
			    $productEntity = new ProductEntity();						
				ProductEntity::setProductFromDB($productEntity, $row);
				$searchResults .= ProductView::getProductGridTemplate($productEntity, false);
			}
		}
	
		return $searchResults;
	}								   
}

?>