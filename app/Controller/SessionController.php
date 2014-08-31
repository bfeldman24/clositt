<?php
require_once(dirname(__FILE__) . '/../globals.php');
require_once(dirname(__FILE__) . '/Debugger.php');
require_once(dirname(__FILE__) . '/../Database/Dao/SessionDao.php');
require_once(dirname(__FILE__) . '/../Model/UserEntity.php');


class SessionController extends Debugger{
	private $failed = false; // failed login attempt
	private $id = 0; // the current user's id
	private $sessionDao = null;
	
	public function __construct(&$mdb2){
		$this->sessionDao = new SessionDao($mdb2);		
		$_SESSION['errors'] = '';				
	}
	
	function setSessionDefaults() {
      	$_SESSION['active'] = false;      	
      	$_SESSION['userid'] = null;
      	$_SESSION['name'] = null;
      	$_SESSION['email'] = null;
      	$_SESSION['newuser'] = false;
      	$_SESSION['remember'] = false;
      	$_SESSION['time'] = 0;
      	$_SESSION['failed'] = false;
      	$_SESSION['failedcount'] = 0;
      	$_SESSION['isAdmin'] = false;      	      	      	
      	$_SESSION['errors'] = null;
    }
    
    /**
	 * Checks if a session exists for a user
     *
     * @return false if there are any sql errors, 
     */		
	function checkSession() {				
		if (!isset($_SESSION['active']) || $_SESSION['active'] === false) {        	  
        	if (isset($_COOKIE[COOKIE_NAME]) ) {
    			$this->checkCookie($_COOKIE[COOKIE_NAME]);
    		}else{
    		    $this->logout(); 
    		}
        }				
	} 
	
	/**
	 * Checks if a cookie exists for a user
     *
     * @param $cookie - (int) cookie ID
     * @return false if there are any sql errors
     */		
	function checkCookie($cookie) {
		list($email, $cookieDB) = @unserialize(stripslashes($cookie));
		
		if (!$email || !$cookieDB){ 
			$err = "email = " . $email . "; cookieDB = " . $cookieDB . "; cookie = " . $cookie;
			$this->debugError("(checkRemember-1)",$err);
			return false; 
		}		
		
		$result = $this->sessionDao->checkCookie($email, $cookieDB);				
		
		if(is_object($results)){
			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){  
			     $user = UserEntity::setFromDB($row); 
			     $this->setSession($user);
			}
    	}		
	} 	
	
	/**
	 * Called after checkLogin
	 * Sets user session variables so user is considered logged in
     *
     * @param $user - 
     * @param $remember - (boolean) if true, set cookie
     * @param $init - (boolean) if true, set sessoin in DB
     * @return false if there are any sql errors
     */		
	function setSession($user, $newUser = null) {	
        if (!isset($user)){
            return false;   
        }	   
	   	
		$_SESSION['userid'] = $user->getUserId();
		$_SESSION['email'] = htmlspecialchars($user->getEmail());
		$_SESSION['name'] = stripslashes($user->getName());
		$_SESSION['active'] = true;
		$_SESSION['failed'] = false;
		$_SESSION['failedcount'] = 0;
		$_SESSION['time'] = time();
		$_SESSION['newuser'] = $newUser;	
		
		if(DEBUG){
			$debugger = "(" . 
						$_SESSION['userid'] . "," .
						$_SESSION['email'] . "," .
						$_SESSION['name'] . "," .
						$_SESSION['active'] . "," .
						$_SESSION['failed'] . "," .
						$_SESSION['time'] . ")";
			
			$this->log("(setSession)(userid, email, name, active, failed, time) VALUES ",$debugger);
		}	
		
		return true;
	} 
	
	
	 /**
	 * Updates the cookie data, and sets cookie variable
     *
     * @return false if there are any sql errors
     */	
	function setCookie($remember){		
	    if (!isset($remember) || $remember !== true || !isset($_SESSION['email'])){
	       return false;  
	    }	    	    
	    
		$cookieDB = md5(rand(100,10000) . COOKIE_NAME . time());
		$cookie = serialize(array($_SESSION['email'],$cookieDB)); //md5(random)		
		setcookie(COOKIE_NAME, $cookie, time() + 31104000, "/"); //expires in about 360 days
		
		$affectedRows = $this->sessionDao->setCookie($cookie, $_SESSION['email']);		
		
		return $affectedRows === 1;
	}	
	
	/**
	 * resets the session variables and logs out
     *
     */	
	function failedLogin($user){
	    $this->debug("failedLogin",$user->getEmail());
	    		
		$_SESSION['failed'] = true;
		$_SESSION['failedcount'] += 1;
		$_SESSION['errors'] = "Login information was not correct!";
		$_SESSION['email'] = $user->getEmail();
        $_SESSION['active'] = false;      	
      	$_SESSION['newuser'] = false;      	
      	$_SESSION['time'] = 0;      	
      	unset($_SESSION['userid']);

      	$this->deleteCookie();
	}		
	
	
	/**
     * deletes the cookie if it exists
     *
     */
	function deleteCookie(){
	   if ( isset($_COOKIE[COOKIE_NAME]) ) {
			setcookie(COOKIE_NAME, "", time()-3600,"/"); //delete cookie
			
			if(isset($_SESSION['email'])){
			     $this->sessionDao->deleteCookie($_SESSION['email']);
			}
	   }  
	}			 			 			 		 
						 	
	
     /**
	 * Resets all user session variables to their default values
	 * and delete a cookie if it exists
     *
     */	
	function logout(){
		$this->deleteCookie();
		$this->setSessionDefaults();		
	}
}


?>