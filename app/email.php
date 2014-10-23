<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);
//ini_set("log_errors", 1);

require_once(dirname(__FILE__) . '/session.php');
require_once(dirname(__FILE__) . '/Controller/ListController.php');

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
        $to = 'eli@clositt.com';               
        $emailSubject = 'CLOSITT: ' . $subject;
        
        $emailMessage = "Name: " . $name . "\r\n" . 
                        "Clositt Id: " . $id . "\r\n" . 
        				"Email: " . $email . "\r\n" . 
        				"Message: " . $message . "\r\n"; 
        				
        $headers = "From: Clositt Team <Eli@Clositt.com> \r\n" .
        		    'Reply-To: '. $email . "\r\n" .
        		    'Bcc: bfeldman24@gmail.com' . "\r\n";
        	
       // Log feedback 		    
       if ($subject == "CLOSITT FEEDBACK"){
            ListController::writeToFile("feedback",$message.",".$email.",".$name.",".$id);
       } 		    
        
        if(mail($to, $emailSubject, $emailMessage, $headers, "-fEli@Clositt.com")){                                    
        	return "success";	
        }else{
        	return "failed";	
        }
    }
    
    public static function shareProduct($to, $username, $message, $link, $product, $store){
                
        if (isset($_SESSION['name'])){
            $username = $_SESSION['name'];
        }
        
        if (isset($username)){
            $emailSubject = $username . " shared an outfit with you from Clositt.com";
        }else{
            $emailSubject = "Someone shared an outfit with you from Clositt.com";       
        }
        
        $message = '<p>' . $message . '</p>';
        $message .= "<br /><br /><p>";
        
        if (isset($store) && trim($store) != ""){
            $message .= "Check out this outfit from " . $store;       
        }else{
            $message .= "Check out my clositt";       
        }
        
        $message .= ':';
        
        if (isset($product)){
            $message .= ' <a href="'.$link.'">'.$product.'</a><p>';       
        }else{
            $message .= ' <a href="'.$link.'">'.$link.'</a></p>';       
        }
        
        if (isset($username)){
            $message .= "<br /><br /><p>From,<br />" . $username . "</p>";   
        }
        
        $message = '<!DOCTYPE HTML><html><head></head><body style="font-family: \'Open Sans\',​sans-serif"><div><div style="width: 100%; margin: 0 0 10px 0; padding-left: 5px; border-top: 5px solid #66ccff; max-height: 70px;"><img src="http://clositt.com/css/images/logo.png" /></div><br /><br />'.$message.'</div></body></html>';
        
        
        $sender = "Clositt <Eli@Clositt.com>";   
        if (isset($_SESSION['email'])){
            $sender = $_SESSION['email'];
            
            if (isset($username)){
                $sender = $username . " <" . $sender . ">";    
            }
        }
        				
        $headers = "From: Clositt <Eli@Clositt.com> \r\n" .
        		    "Reply-To: " . $sender. " \r\n" .
        		    "Bcc: bfeldman24@gmail.com" . "\r\n" .
        		    "MIME-Version: 1.0\r\n" .
        		    "Content-Type: text/html; charset=ISO-8859-1\r\n";
        
        
        if (isset($_SESSION['shareProductCount'])){
            $_SESSION['shareProductCount']++;
        }else{
            $_SESSION['shareProductCount'] = 1;   
        }
        
        if ($_SESSION['shareProductCount'] > 25){
            return "failed";   
        }                      
        
        // Log it
        $user = '';	    
	    if (isset($_SESSION['userid'])){
	       $user = $_SESSION['userid'];  
	    }
        
        if(mail($to, $emailSubject, $message, $headers, "-fEli@Clositt.com")){                                        	    
            ListController::writeToFile("share", $to.",".$user.",".$link);              
        	return "success";	
        }else{
            ListController::writeToFile("shareFailed", $to.",".$user.",".$link);  
        	return "failed";	
        }
    } 
    
    
    public static function sendPasswordResetEmail($email, $tempPassword){           
        
        $emailMessage = "Hello!\n\n" .
                      "It looks like you've forgotten your password. No sweat.\n\n" .
                      "Here's what to do:\n" .
                      "1) Login to Clositt.com with this temporary password: $tempPassword \n" .
                      "2) Once you login, go to your clositt page and click on the 'Account' link in the top right corner.\n" .
                      "3) Change your password ('old password' means the temporary one).\n\n" .
                      "Note: your temporary password will expire in 24 hours:\n\n" .
                      "Now just head to www.clositt.com and you should be all set. \n\n" .
                      "Happy Shopping!! \n\n" .
                      "- Clositt Support Ninjas";
                         
        $emailSubject = 'Clositt Password Reset';
                				
        $headers = "From: info@clositt.com \r\n" .
        		    "Reply-To: eli@clositt.com \r\n" .
        		    "Bcc: bfeldman24@gmail.com \r\n";        	
        
        if(mail($email, $emailSubject, $emailMessage, $headers, "-fEli@Clositt.com")){                                    
        	return "success";	
        }else{
        	return "failed";	
        }
    }
    
    
    
    public static function sendHtmlEmail($email, $from, $subject, $message){           
                                                                        				
        $headers = "From: ".$from." \r\n" .
        		    "Reply-To: ".$from." \r\n" .
        		    "Bcc: bfeldman24@gmail.com \r\n" .
        		    "MIME-Version: 1.0\r\n" .
        		    "Content-Type: text/html; charset=ISO-8859-1\r\n"; 		    
        
        if(mail($email, $subject, $message, $headers)){                                    
        	return "success";	
        }else{
        	return "failed";	
        }
    }  
}



if (isset($_REQUEST['t']) && !isset($_POST['router'])){
    $email = $_REQUEST['e'];
    $messageType = $_REQUEST['t'];
    
    if (!isset($_SESSION['emailCount'])){
        $_SESSION['emailCount'] = 1;
    }else{
        $_SESSION['emailCount'] = $_SESSION['emailCount'] + 1;
    }
    
    if ($_SESSION['welcomeEmail'] != $_SERVER['REMOTE_ADDR'] && $_SESSION['emailCount'] < 25){
    
        if ($messageType == "welcomeMessage"){
            if (isset($email) && strpos($email,'@') > 0){
                echo EmailController::sendWelcomeMessage($email);    
            }
        
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
