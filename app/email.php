<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);
//ini_set("log_errors", 1);


class EmailController{
    
    public static function sendWelcomeMessage($email){
                
        $emailSubject = 'Welcome To Clositt!';    
        $emailMessage = "Welcome to Clositt! \r\n \r\n" .                                        
                        "We're happy that you're giving Clositt a try. \r\n \r\n" . 
                        "We are dedicated to making shopping online fun and easy. And we're constantly working on getting better. We are still in beta, so if you have any question or suggestions, please let us know. You can email the founder directly here: Eli@Clositt.com \r\n \r\n" .
                        "Happy shopping, and we look forward to hearing from you. \r\n \r\n" .
                        "-Clositt Team";
        				
        $headers = "From: Clositt Team <Eli@Clositt.com> \r\n" .
        		    "Reply-To: Eli@Clositt.com \r\n" .
        		    'Bcc: bfeldman24@gmail.com, eli@clositt.com' . "\r\n";
        		        
        if(mail($email, $emailSubject, $emailMessage, $headers, "-fEli@Clositt.com")){
        	$_SESSION['welcomeEmail'] = $_SERVER['REMOTE_ADDR'];
        	return "success";	    	
        }else{
        	return "failed";	
        }
    }
    
    public static function sendContactForm($name, $id, $email, $subject, $message){
        //$to = 'eli@clositt.com';
        $to = 'ben@clositt.com';
        
        $emailSubject = 'CLOSITT CONTACT FORM: ' . $subject;
        
        $emailMessage = "Name: " . $name . "\r\n" . 
                        "Clositt Id: " . $id . "\r\n" . 
        				"Email: " . $email . "\r\n" .
        				"Subject: " . $subject . "\r\n" . 
        				"Message: " . $message . "\r\n"; 
        				
        $headers = "From: Ben@clositt.com \r\n" .
        		    'Reply-To: '. $email . "\r\n" .
        		    'Bcc: bfeldman24@gmail.com' . "\r\n";
        		    
        
        if(mail($to, $emailSubject, $emailMessage, $headers, "-fEli@Clositt.com")){
        	return "success";	
        }else{
        	return "failed";	
        }
    }   
}



if (isset($_REQUEST['e']) && isset($_REQUEST['t'])){
    $email = $_REQUEST['e'];
    $messageType = $_REQUEST['t'];
    
    if (isset($email) && strpos($email,'@') > 0 && ($_SESSION['welcomeEmail'] != $_SERVER['REMOTE_ADDR'])){
    
       if ($messageType == "welcomeMessage"){
            echo EmailController::sendWelcomeMessage($email);    
        
        }else{
            $name = $_REQUEST['n'];
            $id = $_REQUEST['i'];
            $subject = $_REQUEST['s'];
            $message = $_REQUEST['m'];
    
            echo EmailController::sendContactForm($name, $id, $email, $subject, $message);
        }
    }
}

?>
