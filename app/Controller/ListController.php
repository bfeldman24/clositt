<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../session.php');

class ListController{		
	
	public static function writeToFile($fileName, $item){
	   $listDirectory = dirname(__FILE__) . "/../Data/Lists/";  
	   $extension = ".csv";  	   
	   
	   if (isset($fileName) && isset($item)){
	       $userInfo =  ", " . $_SESSION['userid'] . ", " . $_SERVER['REMOTE_ADDR'] . ", " . date("m/d/Y H:i:s");
	       
    	   $file = fopen($listDirectory . $fileName . $extension,"a");
           $numBytes = fwrite($file,"\n" . $item . $userInfo);
           fclose($file);  
           
           return $numBytes ? "success" : "failed";
	   }
	}				
}

if (isset($_GET['method']) && $_GET['class'] == "list"){          
    
    switch($_GET['method']){
        case 'add':            
            echo ListController::writeToFile($_POST['listName'],$_POST['item']);
            break;        
    }            
}
?>