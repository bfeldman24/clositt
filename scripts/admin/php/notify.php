<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);
//ini_set("log_errors", 1);

$message = $_POST['message'];

if (isset($message) || true){
  
    $to = "BFeldman24@gmail.com";    
    $emailSubject = "Product Script Results";
        
    if (!is_array($message)){
        $emailMessage = $message . "\r\n"; 
    }else{
        $emailMessage = "";
        
        for($i = 0; $i < count($message); $i++){
            $emailMessage .= $message[$i] . "\r\n"; 
        }
    }
    				    		    
    
    $success = mail($to, $emailSubject, $emailMessage, "From: Ben@Clositt.com");

    if($success){
    	echo "success";	
    }else{
    	echo "failed";
    	echo $to . "\r\n";
    	echo $emailSubject . "\r\n";	
    	echo $emailMessage . "\r\n";	
    	echo $headers . "\r\n";	    	    	
    }
}else{
    echo "nothing";   
}

?>
