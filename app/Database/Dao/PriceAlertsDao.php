<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class PriceAlertsDao extends AbstractDao {			
		
	public function getPriceAlerts(){
	   
	   $sql = "SELECT p." . PRODUCT_SKU.", " .
	                "hp.".HISTORICAL_OLD_PRICE.", " .
	                "hp.".HISTORICAL_NEW_PRICE.", " .
	                "hp.".HISTORICAL_DATE.", " .
	                "c." . CLOSET_USER_ID.", " .
	                "c." . CLOSET_ID.", " .
	                "c.".CLOSET_NAME.", " .	                
	                "p.".PRODUCT_NAME.", " .
	                "p.".PRODUCT_STORE.", " .
	                "p.".PRODUCT_PRICE.", " .
	                "p.".PRODUCT_IMAGE.", " .
	                "p.".PRODUCT_SHORT_LINK. 
                " FROM " . CLOSET_ITEMS . " ci " .               
                " INNER JOIN " . CLOSETS . " c ON c.".CLOSET_ID." = ci.".CLOSET_ID .                
                " INNER JOIN " . PRODUCTS . " p ON p.".PRODUCT_SKU." = ci.".CLOSET_ITEM_SKU .
                " INNER JOIN " . HISTORICAL_PRICES . " hp ON hp.".PRODUCT_SKU." = ci.".PRODUCT_SKU.
                " WHERE " .                    
                    " ci." . CLOSET_ITEM_STATUS . " = 1 AND " .
                    " hp." . HISTORICAL_DATE . " > date(now()) " . 
                " ORDER BY hp." . HISTORICAL_DATE;
		
		$paramTypes = array();		
		$params = array();
		
		return $this->getResults($sql, $params, $paramTypes, "23849237492");
	}			
}
?>
