<?php
require_once(dirname(__FILE__) . '/../session.php');
require_once(dirname(__FILE__) . '/../Database/Dao/StatsDao.php');

class StatsController{	        
    private static $statsDao = null;  	   
	
	public static function init(){
	   if (!isset(self::$statsDao)){
            self::$statsDao = new StatsDao();
	   }  
	}
    
    public static function addItemAction($action, $sku = null){	
        return self::add($action, null, null, $sku);        
    }
    	
	public static function add($action, $detail = null, $info = null, $sku = null){	
		self::init();
		
		if(isset($action) && trim($action) != ""){	
			
			$session = session_id();
			$results = self::$statsDao->add($_SESSION['userid'], $_SERVER['REMOTE_ADDR'], $session, $action, $sku, $detail, $info);
			
			if(is_numeric($results) && $results > 0){
				return "success";
			}
		}
	
		return "failed";
	}					
}
?>