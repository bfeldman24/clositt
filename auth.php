<?php
if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.clothies.bprowd.com', 0);
	session_start();
}

if(isset($_POST['auth'])){
	if($_POST['auth'] == "@!#kjc919238hkfj~@#$`2398welkejd!@#$*SD)kjhas"){
		$_SESSION['userid'] = 4;
		echo "success";
	}else{
		echo "unauthorized";
	}	
}
?>