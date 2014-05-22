<?php
require_once(dirname(__FILE__) . '/globals.php');

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
    ($_SESSION['welcomeEmail'] != $_SERVER['REMOTE_ADDR'] || true)){
    
    $emailSubject = 'Welcome To Clositt!';    
    $emailMessage = "Welcome to Clositt! \r\n \r\n" .                                        
                    "We're happy that you're giving Clositt a try. \r\n \r\n" . 
                    "We are dedicated to making shopping online fun and easy. And we're constantly working on getting better. We are still in beta, so if you have any question or suggestions, please let us know. You can email the founder directly here: Eli@Clositt.com \r\n \r\n" .
                    "Happy shopping, and we look forward to hearing from you. \r\n \r\n" .
                    "-Clositt Team";
    				
    $headers = "From: Clositt Team <Eli@Clositt.com> \r\n" .
    		    "Reply-To: Eli@Clositt.com \r\n" .
    		    'Bcc: ben@clositt.com, eli@clositt.com' . "\r\n";
    		        
    if(mail($email, $emailSubject, $emailMessage, $headers)){
    	$_SESSION['welcomeEmail'] = $_SERVER['REMOTE_ADDR'];
    	echo "success";	    	
    }else{
    	echo "failed";	
    }
    
}else{
    $to = 'eli@clositt.com';
    
    $emailSubject = 'CLOSITT CONTACT FORM: ' . $subject;
    
    $emailMessage = "Name: " . $name . "\r\n" . 
                    "Clositt Id: " . $id . "\r\n" . 
    				"Email: " . $email . "\r\n" .
    				"Subject: " . $subject . "\r\n" . 
    				"Message: " . $message . "\r\n"; 
    				
    $headers = 'From: '. $email . "\r\n" .
    		    'Reply-To: '. $email . "\r\n" .
    		    'Bcc: ben@clositt.com' . "\r\n";
    		    
    
    if(mail($to, $emailSubject, $emailMessage, $headers)){
    	echo "success";	
    }else{
    	echo "failed";	
    }
}

?>
