<?php
require_once(dirname(__FILE__) . '/globals.php');
require_once(dirname(__FILE__) . '/Database/DataAccess/opendb.php');
require_once(dirname(__FILE__) . '/Controller/SessionController.php');

if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.' . DOMAIN, 0);
	session_start();
}

$mdb2 = mdb2_connect();
$session = new SessionController($mdb2);
$session->checkSession(); 

?>