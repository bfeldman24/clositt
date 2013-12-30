<?php
//require_once(dirname(__FILE__) . '/../Dao/ValidateSessionDao.php');
require_once(dirname(__FILE__) . '/opendb.php');
//$date = gmdate("'Y-m-d'");
$mdb2 = mdb2_connect();

/*
$session = new ValidateSession($db);

$timeout = 3600; //3600 seconds = 1 hour

// If Session is not set do nothing
//If session was set, but has now timed out			
if ((isset($_SESSION['active']) && $_SESSION['active']) && time() - $_SESSION['time'] > $timeout){ 	
	session_defaults();
	$_SESSION['time'] = -1;
}

// Session Timed Out 
if (isset($_SESSION['time']) && $_SESSION['time'] < 0){ 	
	header( 'Location: ' . WELCOME_PAGE . '?timeout=true' ) ;
}
// Not Logged in
else if(!isset($_SESSION['active']) || !$_SESSION['active']){
	header( 'Location: ' . WELCOME_PAGE ) ;
}else{
	$_SESSION['time'] = time(); // reset the idle time of the session
}
*/


?>