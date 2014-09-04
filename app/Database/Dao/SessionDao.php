<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');


class SessionDao extends AbstractDao{
	/**
	 * Checks if a cookie exists for a user
     *
     * @param $cookie - (int) cookie ID
     * @return false if there are any sql errors
     */		
	function checkCookie($email, $cookieDB) {			
		
		$sql = "SELECT * FROM " . USERS . 
				" WHERE LOWER(" . USER_EMAIL . ") = LOWER(?) AND " . 
    				USER_COOKIE . " = ? AND " . 
    				USER_STATUS . " BETWEEN 0 AND 1";
		
		$paramTypes = array('text', 'text');		
		$params = array($email, $cookieDB);	
		
		$this->getResults($sql, $params, $paramTypes, "81276394");															
		
		if (is_object($result) ) {
			$this->_setSession($result, true);
		}
	} 
	
	
	/**
	 * Updates the cookie data, and sets cookie variable
     *
     * @return false if there are any sql errors
     */	
	function setCookie($cookie, $email){				
		$sql = "UPDATE " . USERS . 
				" SET " . USER_COOKIE . " = ? " .
				" WHERE " . USER_EMAIL . " = ?";			
		
		$paramTypes = array('text', 'text');		
		$params = array($cookieDB, $email);								
		return $this->update($sql, $params, $paramTypes, "0923459234");				
	}
	
		 	
    /**
	 * Deletes the cookie data, and sets cookie variable
     *
     * @return false if there are any sql errors
     */	
	function deleteCookie($email){				
		$sql = "UPDATE " . USERS . 
				" SET " . USER_COOKIE . " = null " .
				" WHERE " . USER_EMAIL . " = ?";			
		
		$paramTypes = array('text');		
		$params = array($email);								
		return $this->update($sql, $params, $paramTypes, "9823934234");				
	}
}


?>