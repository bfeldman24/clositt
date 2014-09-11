<?php
class BaseEntity {
    
	public static function getDBField($row, $field){
	   if (isset($row[$field])){
	       
	       if (is_string($row[$field])){
	           return stripslashes($row[$field]);      
	       
	       }else {
	           return $row[$field];      
	       }
	   }
	   
	   return null;
	}
	
	public static function getPostField($row, $field){
	   if (isset($row[$field])){
	       
	       if (is_string($row[$field])){
	           return trim($row[$field]);      
	       
	       }else {
	           return $row[$field];      
	       }
	   }
	   
	   return null;
	}				
}
?>