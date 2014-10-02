<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/FilterDao.php');
require_once(dirname(__FILE__) . '/../View/FilterView.php');
require_once(dirname(__FILE__) . '/Debugger.php');


class FilterController extends Debugger {	
	private $filterDao = null;
	private $filterJsonFile = null;
	private $filterHtmlFile = null;
	private $numDaysToRefreshFilterFile = 3;

	public function __construct(){
		$this->filterDao = new FilterDao();
		$this->filterJsonFile = dirname(__FILE__) . '/../Data/filters.json';
		$this->filterHtmlFile = dirname(__FILE__) . '/../Data/filters.html';
	}
	
	public function getJsonFilters(){
	   return $this->getFilters($this->filterJsonFile);  
	}
	
	public function getHtmlFilters(){
	   return $this->getFilters($this->filterHtmlFile);  
	}
	
	private function getFilters($filePath){
	    if (!isset($filePath)){
	       return "no path";  
	    }
	   	    	   
	    $useCurrentFile = false;
	    $filters = null;
	    
	    // Check for latest modification time
	    if (file_exists($filePath)) {  	        
	       
	        // php 4 & 5 = filemtime, php 2 & 3 = fileAtime
            $lastModificationDate = filemtime($filePath);
            
            $useCurrentFile = $this->isDateWithinXNumberOfDays($lastModificationDate, $this->numDaysToRefreshFilterFile);
        }                
	    
	    // if file is up to date then return it
	    if ($useCurrentFile){	       	       
	       $filters = file_get_contents($filePath);
	       
	    }else{	       	      
	       // create new file and return that
	       $this->updateCompanyFilters();	       
	       $filters = $this->createFilterFile($filePath);
	    }
	    
	    return $filters;
	}
	
	private function updateCompanyFilters(){
	   return $this->filterDao->updateCompanyFilters();
	}
	
	private function createFilterFile($filePath){
	   if (!isset($filePath)){
	       return "no path";  
	    }
	   
	   $filterResults = $this->filterDao->getFilters();
	   $filters = array();	   	 
	   
	   if(is_object($filterResults)){
	       $tempFilters = array();
	       
			while($row = $filterResults->fetchRow(MDB2_FETCHMODE_ASSOC)){
	
			    $type = stripslashes($row[FILTER_TYPE]); 
			    $value = stripslashes($row[FILTER_VALUE]); 
			    $subvalue = stripslashes($row[FILTER_SUBVALUE]); 
			    $customer = stripslashes($row[FILTER_CUSTOMER]); 
			     
			    if (!isset($filters[$type])){
			         $filters[$type] = array();
			         $tempFilters[$type] = array();
			    }			    
			     
			    if ($subvalue == null){
			         if ($customer == null){
			             $filters[$type][] = $value;
			         }else{			             		                      
			             if (!isset($tempFilters[$type][$value])){			                 
        			         $tempFilters[$type][$value] = $customer;
        			         $filters[$type][] = array($value, $customer);
        			         
        			     }else if ($tempFilters[$type][$value] != $customer && $tempFilters[$type][$value] != "Both"){
        			         $tempFilters[$type][$value] = $customer;
        			         
        			         // update existing record's customer to Both
        			         for ($i = count($filters[$type]) - 1; $i >= 0; $i--){
        			             if ($filters[$type][$i][0] == $value){
        			                 $filters[$type][$i][1] = "Both";
        			                 break;    
        			             }    
        			         }
        			     }        			             			     
			         }
			    }else{
			        if (!isset($filters[$type][$value])){
    			         $filters[$type][$value] = array();
    			         $tempFilters[$type][$value] = array();
    			    }     			    
    			    
    			    if ($customer == null){
			             $filters[$type][$value][] = $subvalue;
			         }else{
			             if (!in_array($subvalue, $tempFilters[$type][$value])){
        			         $tempFilters[$type][$value][$subvalue] = $customer;
        			         $filters[$type][$value][] = array($subvalue, $customer);
        			     }else if ($tempFilters[$type][$value][$subvalue] != $customer && $tempFilters[$type][$value][$subvalue] != "Both"){		         
        			         $tempFilters[$type][$value][$subvalue] = $customer;
        			         
        			         // update existing record's customer to Both
        			         for ($i = count($filters[$type][$value]) - 1; $i >= 0; $i--){
        			             if ($filters[$type][$value][$i][0] == $subvalue){
        			                 $filters[$type][$value][$i][1] = "Both";
        			                 break;    
        			             }    
        			         }
        			     }          			     			                
			         }
			    }			 			    			   
			}						
	   }  	   
	   
	   $filters['price'] = array(0,50,100,150,200,250,500,1000);              

       $filters['color'] = array(       
          "Red" => "#F33",           
          "Orange" => "#F93",
          "Yellow" => "#FF0",
          "Green" => "#3C3",
          "Cyan" => "#0FF", 
          //"Teal" => "#088",
          "Blue" => "#00F",
          "Magenta" => "#F0F",
          "Violet" => "#7848C0",
          "Purple" => "#939",
          "Pink" => "#FF98bF",
          "White" => "#F0F0F0",
          "Gray" => "#999",
          "Black" => "#000",
          "Brown" => "#963"
       );

       $filterJson = stripslashes(json_encode($filters));
       $filterHtml = null;
        
       // Write filter to file
       try{        
           $file = fopen($this->filterJsonFile, 'w');           
           if ($file){
               fwrite($file, $filterJson);
               fclose($file);
               touch($this->filterJsonFile);
           }
           
           $htmlFile = fopen($this->filterHtmlFile, 'w');           
           if ($htmlFile){               
               $filterHtml = FilterView::getNavigationSection($filters);
               
               fwrite($htmlFile, $filterHtml);
               fclose($htmlFile);
               touch($this->filterHtmlFile);
           }          
           
       }catch (Exception $e) {
            echo "Whoops";
            $this->debug("FilterController", "createFilterFile", $e);				
       }

       return $this->filterHtmlFile == $filePath ? $filterHtml : $filterJson;
	}
	
    private function convertResultsToArray($results){
	   $arr = array();
	   
	   if(is_object($results)){
			while($field = $results->fetchOne()){	
				$arr[] = $field;
			}
	   }  
	   
	   return $arr;
	}

    private function isDateWithinXNumberOfDays($timestamp, $numberOfDays){
        $datediff = abs(time() - $timestamp);
        $daysDiff = floor($datediff/(60*60*24));   
        
        return $daysDiff <= $numberOfDays;
    }
}

?>