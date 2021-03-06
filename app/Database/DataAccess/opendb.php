<?php
require_once('MDB2.php');

function mdb2_connect() {

	require_once(dirname(__FILE__) . '/../../../configs/clositt-config.php');	
	
	$options = array(
	    'portability' => MDB2_PORTABILITY_ALL,
	);
	
	// uses MDB2::factory() to create the instance
	// and also attempts to connect to the host
	$mdb2 = MDB2::connect($dsn,$options);
	$PEAR = new PEAR();
	
	if ($PEAR->isError($mdb2)) {
	    require_once(dirname(__FILE__) . '/../../Controller/Debugger.php');
	    $debugger = new Debugger();       
	    $debugger->error("MDB2", "mdb2_connect", $mdb2->getMessage() . ', ' . $mdb2->getDebugInfo());
	    define('IS_DB_CONNECTED', false);
	    
	    return null;	    
	    //die($mdb2->getMessage() . ', ' . $mdb2->getDebugInfo());
	}
	
	define('IS_DB_CONNECTED', true);	
	
	return $mdb2;

}

?>
