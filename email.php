<?php

$email = $_REQUEST['e'];
$name = $_REQUEST['n'];
$id = $_REQUEST['i'];
$subject = $_REQUEST['s'];
$message = $_REQUEST['m'];

// TODO VALIDATION

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

?>