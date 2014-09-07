<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class UserDao extends AbstractDao {
    
    public function signUp($user){
        $sql = "INSERT INTO ".USERS." (".USER_NAME.", ".USER_EMAIL.", ".USER_PASS.", ".USER_SALT.", ".
                                        USER_STATUS.", ".USER_LOGIN_COUNT.", ".USER_IP.", ".USER_LAST_SIGNED_IN.", ".USER_DATE_SIGNED_UP.") " .
                " VALUES (?,?,?,?,1,1,?,NOW(),NOW())";	   
		
		$name = $user->getName();
		$email = $user->getEmail();
		$password = $user->getPassword();
		$salt = $user->getSalt();
		$ip = $_SERVER['REMOTE_ADDR'];
		
		$paramTypes = array('text', 'text', 'text', 'text', 'text');
        $params = array($name, $email, $password, $salt, $ip);
        
        $affectedRows = $this->update($sql, $params, $paramTypes, "4872394827");	  
        
        if ($affectedRows === 1){
            $id = $this->db->lastInsertID(USERS, USER_ID);
            
            if (PEAR::isError($id)) {
                $this->logError($errorCode ,$id->getMessage(),$sql);
                return -1;
            }

            return $id;
        }        
        
        return $affectedRows;
	}
	
	public function updateLoginCount($user){	   
	    $sql = "UPDATE ".USERS.
	          " SET ".USER_LOGIN_COUNT." = ".USER_LOGIN_COUNT." + 1 , ".
	                USER_LAST_SIGNED_IN." = NOW(), " . 
	                USER_IP." = ? " .
              " WHERE ".USER_EMAIL." = ?";	   
				
		$email = $user->getEmail();
		$ip = $_SERVER['REMOTE_ADDR'];
		
		$paramTypes = array('text', 'text');
        $params = array($ip, $email);
        
        return $this->update($sql, $params, $paramTypes, "2398479234");
	}			
	
	public function updateUserPassword($user, $oldPassword){
	    $sql = "UPDATE ".USERS.
	          " SET ".USER_PASS." = ?, ".USER_SALT." = ? ".
              " WHERE ".USER_PASS." = ? AND ".USER_EMAIL." = ? AND ".USER_STATUS." = 1";	   
				
		$password = $user->getPassword();
		$salt = $user->getSalt();
		$email = $user->getEmail();
		
		$paramTypes = array('text', 'text', 'text', 'text');
        $params = array($password, $salt, $oldPassword, $email);
        
        return $this->update($sql, $params, $paramTypes, "2394829345");
	}
	
	public function forceUpdateUserPassword($user){
	    $sql = "UPDATE ".USERS.
	          " SET ".USER_PASS." = ?, ".USER_SALT." = ?, ".USER_STATUS." = 1".
              " WHERE ".USER_EMAIL." = ? ";	   
				
		$password = $user->getPassword();
		$salt = $user->getSalt();
		$email = $user->getEmail();
		
		$paramTypes = array('text', 'text', 'text');
        $params = array($password, $salt, $email);
        
        return $this->update($sql, $params, $paramTypes, "38924792");
	}
	
	public function updateUserInfo($user){
	    $sql = "UPDATE ".USERS.
	          " SET ".USER_NAME." = ?, ".USER_EMAIL." = ? ".
              " WHERE ".USER_ID." = ? AND ".USER_STATUS." = 1";	   
		
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
                " WHERE " . USER_ID . " = ? AND ".USER_STATUS." = 1";
		
		$paramTypes = array('integer');		
		$params = array($userId);
		
		return $this->getResults($sql, $params, $paramTypes, "092374902734");
	}
	
	public function getUserPassword($email){ 
        $sql = "SELECT " . USER_ID.", ".USER_EMAIL.", ".USER_NAME.", ".USER_PASS.", ".USER_SALT.
                " FROM " . USERS .
                " WHERE " . USER_EMAIL . " = ? AND ".USER_STATUS." = 1";		
		
		$paramTypes = array('text');		
		$params = array($email);
		
		return $this->getResults($sql, $params, $paramTypes, "0938402342");
	}
	
	public function doesUserExist($user){ 
        $sql = "SELECT EXISTS (SELECT 1 FROM ".USERS." WHERE ".USER_EMAIL." = ? AND ".USER_STATUS." = 1) as 'exists'";
		
		$email = $user->getEmail();
		
		$paramTypes = array('text');		
		$params = array($email);
		
		$results = $this->getResults($sql, $params, $paramTypes, "23482392");
		
		 if(is_object($results)){
			if($row = $results->fetchRow(MDB2_FETCHMODE_ASSOC)){        			    				    			    
			      return $row['exists'] === '1';
			}
		 }
		 
		 return false;
    }			
}
?>
