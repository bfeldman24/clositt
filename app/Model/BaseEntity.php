<?php
class BaseEntity {
    
	public static function getField($row, $field){
	   if (isset($row[$field])){
	       return trim(stripslashes($row[$field]));      
	   }
	   
	   return null;
	}				
}
?>