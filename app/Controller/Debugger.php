<?php
// LOGGING
define('DEBUG_LOG', dirname(__FILE__) . "/../Logs/Debugger");

class Debugger{		
    private $debugLog;
    
    public function __construct() {
        $this->debugLog = DEBUG_LOG . date("-Y-m-d") . ".txt";
    }	
	
	/**
	* Appends the sql error to the end of the file ($this->file)
    */		
	public function debug($class, $method, $msg){
	    
		$message = "($class->$method) $msg";		
		$this->debugger($message);
	}
	
	/**
	* Appends the sql error to the end of the file ($this->file)
    */		
	public function debugger($msg){
		$message = "\n" . date("m/d/y h:i:s") . " - " . $msg;
		
		$file = fopen($this->debugLog,"a");
		fwrite($file, $message);
		fclose($file);
	}
}
?>