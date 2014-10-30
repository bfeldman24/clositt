<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class StatsDao extends AbstractDao {             			
	
    public function add($userid, $ip, $session, $action, $sku, $closetid, $detail, $info){
	     if(!isset($userid) && !isset($ip)){
			$this->logWarning("23234983","No user to add stats!");
			return false; 
		}
		
		if(!isset($action)){
			$this->logWarning("09812340123","No action to add stats!");
			return false; 
		}
	 
	    $sql = "INSERT INTO " . STATS . 
	           " (" . USER_ID . "," .
                      USER_IP . "," .
                      STATS_SESSION_ID . "," .
                      STATS_ACTION . ", " .
                      PRODUCT_SKU.",".
                      CLOSET_ID.",".
                      STATS_DETAIL.",".
                      STATS_INFO . ", " .
                      STATS_TIMESTAMP . ")" .
	           " VALUES(?,?,?,?,?,?,?,?,NOW())";        
        
        $params = array($userid, $ip, $session, $action, $sku, $closetid, $detail, $info);
        $paramTypes = array('integer','text','text','text','text','integer','text', 'text');
        return $this->update($sql, $params, $paramTypes, "239847203");
	}			
}
?>