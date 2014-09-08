<?php
require_once(dirname(__FILE__) . '/../../globals.php');
require_once(dirname(__FILE__) . '/../TableConstants.php');

class AbstractDao{
	public $db = null; // PEAR::MDB2 pointer
	public $debug = DEBUG; // prints sql statements
	public $info = false; // prints sql statements
	private $sqlErrorLog = null;	
	
	
	public function __construct(&$db) {
	    $sqlErrorLog = dirname(__FILE__) . "/../../Logs/sqlErrorLog";
		$this->sqlErrorLog = $sqlErrorLog . date("-Y-m-d") . ".txt";
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
		    $parameterTypes = print_r($paramTypes, true);
			$this->logDebug($errorCode ,$sql . " (" . $parameters . "), (".$parameterTypes.")" );
		}
		
		$results = $stmt->execute($params);
		$stmt->free();
		
		$PEAR = new PEAR();
		if ($PEAR->isError($results)) {
			$this->logError($errorCode ,$results->getMessage(),$sql);
		    return false;
		}
		
		if (!is_object($results) ) {
			$this->logWarning($errorCode ,"Query did not return any results!");
		    return false;
		}
		
		return $results;
	}
	
	
	/**
	 * Insert or update query
     *
     * @param $sql - (string) sql query 
     * @param $params - (array) an array of parameters to replace the '?' in the query string
     * @param $paramTypes - (array) the types of the respective parameters
     * @param $errorCode - (string) the error code with which to identify the query in the log file
     */
	public function update($sql, $params, $paramTypes, $errorCode){
	    						
		if($this->debug){
		    $parameters = print_r($params, true);
		    $parameterTypes = print_r($paramTypes, true);
			$this->logDebug($errorCode ,$sql . " (" . $parameters . "), (".$parameterTypes.")" );
		}		
		
		$stmt = $this->db->prepare($sql, $paramTypes, MDB2_PREPARE_MANIP);
            
        try {              
             $affectedRows = $stmt->execute($params);
             
        } catch (Exception $e) {
            $this->logError($errorCode ,$e->getMessage(), $sql);
            return false;
        }         		
		
		$PEAR = new PEAR();
		if ($PEAR->isError($affectedRows)) {
		    $_SESSION['errors'] = $errorCode . " - error";
			$this->logError($errorCode ,$affectedRows->getMessage(),$sql);
		    return false;
		}
		
		if (!isset($affectedRows)){
			$this->logWarning($errorCode ,"Query did not work correctly!");
		    return false;
		}
		
		$stmt->free();
		
		return $affectedRows;
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
