<?php
// LOGGING
define('DEBUG',true);
define('INFO',true);
define('SQL_ERROR_LOG', dirname(__FILE__) . "/../Logs/sqlErrorLog.txt");

require_once(dirname(__FILE__) . '/../TableConstants.php');

class AbstractDao{
	var $db = null; // PEAR::MDB2 pointer
	var $date; // current date GMT
	var $sqlErrorLog = SQL_ERROR_LOG;
	var $debug = DEBUG; // prints sql statements
	var $info = false; // prints sql statements
	
	
	public function __construct(&$db) {
		$this->date = $GLOBALS['date'];
		$this->file = fopen($this->sqlErrorLog,"a");
		$this->db = $db;	
		$this->db->setErrorHandling(PEAR_ERROR_RETURN);
	}
	
	/**
	 * Gets the results of a query
     *
     * @param $sql - (string) sql query 
     * @param $params - (array) an array of parameters to replace the '?' in the query string
     * @param $paramTypes - (array) the types of the respective parameters
     * @param $errorCode - (string) the error code with which to identify the query in the log file
     */
	public function getResults($sql, $params, $paramTypes, $errorCode){
	    $stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_RESULT);				
						
		if($this->debug){
		    $parameters = print_r($params, true);
			$this->logDebug($errorCode ,$sql . " (" . $parameters . ")" );
		}
		
		$results =& $stmt->execute($params);
		$stmt->free();
		
		if (PEAR::isError($results)) {
			$this->logError($errorCode ,$results->getMessage(),$sql);
		    return false;
		}
		
		if (!is_object($results) ) {
			$this->logWarning($errorCode ,"Query did not return any results!");
		    return false;
		}
		
		return $results;
	}
	
	public function logError($errorNum, $sql = "", $msg = ""){
		$this->log("ERROR",$errorNum, $sql, $msg);	
	}
	
	public function logWarning($errorNum,  $sql = "", $msg = ""){
		$this->log("WARNING",$errorNum, $sql, $msg);	
	}
	
	public function logInfo($errorNum,  $sql = "", $msg = ""){
		$this->log("INFO",$errorNum, $sql, $msg);	
	}
	
	public function logDebug($errorNum,  $sql = "", $msg = ""){
		$this->log("DEBUG",$errorNum, $sql, $msg);	
	}
	
	 /**
	 * Disconnects the database connection
     *
     */		
	private function disconnect(){
		$this->db->disconnect();	
	}
	
	 /**
	 * Close the sql error file
     */	
	private function closefile(){
		fclose($this->file);
	}
	
	 /**
	 * Appends the sql error to the end of the file ($this->file)
     *
     * @param $errorNum - (string) unique error identifier
     * @param $sql - (string) the sql statement of the error
     * @param $msg - (string) the automoted error message by the DB or the sql paramters
     */		
	private function log($errorLevel, $errorNum, $sql = "", $msg = ""){
		$error = "\n" . date("m/d/y h:i:s") . " - " . $errorLevel . " - (". $errorNum . "[".$_SESSION['userid']."]) - " . $sql . ": " . $msg;
		fwrite($this->file,$error);
	}			
	
	private function isSetAndNotNull($val){
		return isset($val) && $val != null && trim($val) != "";	
	}			
}
?>
