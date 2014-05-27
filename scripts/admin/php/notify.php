<?php


require_once(dirname(__FILE__) . '/../../../app/globals.php');

if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.' . DOMAIN, 0);
	session_start();
}

$message = $_POST['message'];

if (isset($message)){
    $to = 'bfeldman24@gmail.com';    
    $emailSubject = 'Product Script Results';
        
    if (!is_array($message)){
        $emailMessage = $message . "\r\n"; 
    }else{
        $emailMessage = "";
        
        for($i = 0; $i < count($message); $i++){
            $emailMessage .= $message[$i] . "\r\n"; 
        }
    }
    				
    $headers = 'From: '. $to . "\r\n";    		    
    
    if(mail($to, $emailSubject, $emailMessage, $headers)){
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
