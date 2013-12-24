<?php
require_once(dirname(__FILE__) . '/globals.php');

if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.' . DOMAIN, 0);
	session_start();
}

class ValidateSession {
	
	private $WELCOME_PAGE = 'welcome.php';
	
	
	function session_defaults() {
		$_SESSION['userid'] = 0;
	}
	
	function checkSession(){
		if (!isset($_SESSION['userid']) || !is_numeric($_SESSION['userid']) || $_SESSION['userid'] <= 0){
			$this->unauthorized();	
		}
	}
	
	function unauthorized(){
		$this->session_defaults();
		header( 'Location: ' . HOME_ROOT .  $this->WELCOME_PAGE ) ;	
	}	
}

$session = new ValidateSession();
$session->checkSession();

?>
