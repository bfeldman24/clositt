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
	
	public function getAll(){
        $sql = "SELECT s.".USER_ID . "," .
                      "s.".USER_IP . "," .
                      "s.".STATS_SESSION_ID . "," .
                      "s.".STATS_ACTION . ", " .
                      "s.".PRODUCT_SKU.",".
                      "s.".CLOSET_ID.",".
                      "s.".STATS_DETAIL.",".
                      "s.".STATS_INFO . ", " .
                      "s.".STATS_TIMESTAMP .", ".
                      "u.".USER_NAME.", ".
                      "u.".USER_EMAIL .
               " FROM ".STATS. " s" .
               " LEFT JOIN " . USERS . " u ON u.".USER_ID." = s." . USER_ID .
               " ORDER BY ".STATS_TIMESTAMP." Desc LIMIT 500";
		
		$paramTypes = array();
        $params = array();
        
        return $this->getResults($sql, $params, $paramTypes, "768768996");        
	}
}
?>