<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');

class ListController{		
	private static $listDirectory = null;  
	private static $extension = ".csv";  	   
	
	public static function init(){
	   if (!isset(self::$listDirectory)){
            self::$listDirectory = dirname(__FILE__) . "/../Data/Lists/"; 
	   }  
	}
	
	public static function writeToFile($fileName, $item){
	   self::init();
	   
	   if (isset($fileName) && isset($item)){
	       $userInfo =  ", " . $_SESSION['userid'] . ", " . $_SERVER['REMOTE_ADDR'] . ", " . date("m/d/Y H:i:s");
	       
    	   $file = fopen(self::$listDirectory . $fileName . self::$extension,"a");
           $numBytes = fwrite($file,"\n" . $item . $userInfo);
           fclose($file);  
           
           return $numBytes ? "success" : "failed";
	   }
	}
	
	public static function readFile($fileName){
	   self::init();
	   
	   if (isset($fileName)){	       
    	   $lineArray = file(self::$listDirectory . $fileName . self::$extension);           
           return $lineArray;
	   }
	   
	   return null;
	}					
}
?>