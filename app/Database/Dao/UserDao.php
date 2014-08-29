<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class UserDao extends AbstractDao {
    
    public function signUp($user){
        $sql = "INSERT INTO ".USERS." (".USER_NAME.", ".USER_EMAIL.", ".USER_PASS.", ".USER_SALT.", ".
                                        USER_LOGIN_COUNT.", ".USER_LAST_SIGNED_IN.", ".USER_DATE_SIGNED_UP.") " .
                " VALUES (?,?,?,?,1,NOW(),NOW())";	   
		
		$name = $user->getName();
		$email = $user->getEmail();
		$password = $user->getPassword();
		$salt = $user->getSalt();
		
		$paramTypes = array('text', 'text', 'text', 'text');
        $params = array($name, $email, $password, $salt);
        
        return $this->update($sql, $params, $paramTypes, "4872394827");	  
	}
	
	public function login($user){
	    // TODO 
	    return false;
	}			
	
	public function updateUserPassword($user){
	    $sql = "UPDATE ".USERS.
	          " SET ".USER_PASS." = ?, ".USER_SALT." = ? ".
              " WHERE ".USER_ID." = ?";	   
				
		$password = $user->getPassword();
		$salt = $user->getSalt();
		$userId = $user->getUserId();
		
		$paramTypes = array('text', 'text', 'integer');
        $params = array($name, $email, $userId);
        
        return $this->update($sql, $params, $paramTypes, "2394829345");
	}
	
	public function updateUserInfo($user){
	    $sql = "UPDATE ".USERS.
	          " SET ".USER_NAME." = ?, ".USER_EMAIL." = ? ".
              " WHERE ".USER_ID." = ?";	   
		
		$name = $user->getName();
		$email = $user->getEmail();
		$userId = $user->getUserId();
		
		$paramTypes = array('text', 'text', 'integer');
        $params = array($name, $email, $userId);
        
        return $this->update($sql, $params, $paramTypes, "234982349");
	}	
	
	public function getUserInfo($userId){ 
        $sql = "SELECT " . USER_NAME.", ".USER_EMAIL.
                " FROM " . USERS .
                " WHERE " . USER_ID . " = ? ";
		
		$paramsTypes = array('integer');		
		$params = array($userId);
		
		return $this->getResults($sql, $params, $paramTypes, "092374902734");
	}			
}
?>
