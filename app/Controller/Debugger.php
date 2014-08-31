<?php
require_once(dirname(__FILE__) . '/../session.php');

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
	public function debug($class, $method = "", $msg = ""){
	    
		$message = "DEBUG: ($class->$method) $msg";		
		$this->log($message);
	}
	
	/**
	* Appends the sql error to the end of the file ($this->file)
    */		
	public function error($class, $method = "", $msg = ""){
	    
		$message = "ERROR: ($class->$method) $msg";		
		$this->log($message);
	}	
	
	/**
	* Appends the sql error to the end of the file ($this->file)
    */		
	public function warning($class, $method = "", $msg = ""){
	    
		$message = "WARNING: ($class->$method) $msg";		
		$this->log($message);
	}	
	
	/**
	* Appends the sql error to the end of the file ($this->file)
    */		
	public function log($msg){
		if (DEBUG){
			$fileName = null;
			$message = "\n" . date("m/d/y h:i:s") . " - " . $msg;
		
			if(isset($this->debugLog) && $this->debugLog != null){
				$fileName = $this->debugLog;
			}else{	
				$fileName = dirname(__FILE__) . "/../Logs/Debugger" . date("-Y-m-d") . ".txt";	
			}

			$file = fopen($fileName,"a");
			fwrite($file, $message);
			fclose($file);
		}
	}
}
?>
