<?php
require_once(dirname(__FILE__) . '/app/globals.php');

if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.' . DOMAIN, 0);
	session_start();
}

$email = $_REQUEST['e'];
$name = $_REQUEST['n'];
$id = $_REQUEST['i'];
$subject = $_REQUEST['s'];
$message = $_REQUEST['m'];
$messageType = $_REQUEST['t'];

// TODO VALIDATION
if ($messageType == "welcomeMessage" && 
    isset($email) && 
    strpos($email,'@') > 0 && 
    $_SESSION['welcomeEmail'] != $_SERVER['REMOTE_ADDR']){
    
    
    $emailSubject = 'Welcome To Clositt!';    
    $emailMessage = "Thanks for signing up for Clositt.com! \r\n \r\n" . 
                    "Now that you have an account go get shopping! We want to customize the site for you so if you have any questions or suggestions for us please don't hesitate to email us at info@clositt.com"; 
    				
    $headers = "From: info@clositt.com \r\n" .
    		    "Reply-To: info@clositt.com \r\n" .
    		    'Bcc: bfeldman24@gmail.com' . "\r\n";
    		        
    if(mail($email, $emailSubject, $emailMessage, $headers)){
    	$_SESSION['welcomeEmail'] = $_SERVER['REMOTE_ADDR'];
    	echo "success";	    	
    }else{
    	echo "failed";	
    }
    
}else{
    $to = 'eliyahurosen@gmail.com';
    
    $emailSubject = 'CLOSITT CONTACT FORM: ' . $subject;
    
    $emailMessage = "Name: " . $name . "\r\n" . 
                    "Clositt Id: " . $id . "\r\n" . 
    				"Email: " . $email . "\r\n" .
    				"Subject: " . $subject . "\r\n" . 
    				"Message: " . $message . "\r\n"; 
    				
    $headers = 'From: '. $email . "\r\n" .
    		    'Reply-To: '. $email . "\r\n" .
    		    'Bcc: bfeldman24@gmail.com' . "\r\n";
    		    
    
    if(mail($to, $emailSubject, $emailMessage, $headers)){
    	echo "success";	
    }else{
    	echo "failed";	
    }
}
?>