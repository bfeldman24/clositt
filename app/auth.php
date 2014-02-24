<?php
require_once(dirname(__FILE__) . '/globals.php');

if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.' . DOMAIN, 0);
	session_start();
}

if(isset($_POST['auth'])){
	if($_POST['auth'] == "@!#kjc919238hkfj~@#$`2398welkejd!@#$*SD)kjhas"){
		$_SESSION['userid'] = $_POST['user'];
		
		if (in_array($_SESSION['userid'], $GLOBALS['ADMIN_LIST'])){
		      $_SESSION['isAdmin'] = true; 
		}
		
		echo "success";
	}else{
		$_SESSION['userid'] = 0;
		echo "unauthorized";
	}	
}else{
	$_SESSION['userid'] = 0;	
}
?>