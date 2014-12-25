<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class ClosetDao extends AbstractDao {
		
	public function createNewCloset($user, $closet){
        $sql = "INSERT INTO ".CLOSETS." (".CLOSET_USER_ID.", ".CLOSET_NAME.", ".CLOSET_PERMISSION.", ".
                    CLOSET_PRICE_ALERTS.",".CLOSET_LAST_UPDATED.", ".CLOSET_CREATED_ON.") " .
                " VALUES (?,?,1,'Y',NOW(),NOW()) " .
                "ON DUPLICATE KEY UPDATE ".CLOSET_PERMISSION."=1";	   
		
		$name = $closet->getName();
		$paramTypes = array('integer', 'text');
        $params = array($user, $name);
        
        $affectedRows = $this->update($sql, $params, $paramTypes, "21983619264");
        
        if ($affectedRows === 1){
            $id = $this->db->lastInsertID(CLOSETS, CLOSET_ID);
            
            if ($this->PEAR->isError($id)) {
                $this->logError($errorCode ,$id->getMessage(),$sql);
                return -1;
            }
            
            return $id;
        }
        
        return -1;
	}
	
	public function getClosetId($user, $closet){
        $sql = "SELECT ".CLOSET_ID." FROM ".CLOSETS.
               " WHERE ".CLOSET_USER_ID." = ? AND ".CLOSET_NAME." = ? ";
		
		$name = $closet->getName();
		$paramTypes = array('integer', 'text');
        $params = array($user, $name);
        
        return $this->getResults($sql, $params, $paramTypes, "8768390978");        
	}
	
	
	public function updateCloset($user, $closet){
	    $sql = "UPDATE ".CLOSETS.
	           " SET ".CLOSET_NAME." = ?, ".CLOSET_PERMISSION." = ?, ".CLOSET_PRICE_ALERTS." = ?, ".CLOSET_LAST_UPDATED." = NOW() " .  
                " WHERE ".CLOSET_ID." = ? AND ".CLOSET_USER_ID." = ? AND ".CLOSET_PERMISSION." < 3";	   
		
		$closetId = $closet->getClosetId();
		$name = $closet->getName();
		$permission = $closet->getPermission();
		$priceAlerts = $closet->getPriceAlerts();
		
		$paramTypes = array('text', 'integer', 'text', 'integer', 'integer');
        $params = array($name, $permission, $priceAlerts, $closetId, $user);
        
        return $this->update($sql, $params, $paramTypes, "29864921");
	}
	
	
	public function deleteCloset($user, $closetId){
	   $sql = "UPDATE ".CLOSETS.
	           " SET ".CLOSET_PERMISSION." = 3, ".CLOSET_PRICE_ALERTS." = 'Y', ".CLOSET_LAST_UPDATED." = NOW() " . 
                " WHERE " . CLOSET_ID . " = ? AND " . CLOSET_USER_ID . " = ?";	   		
		
		$paramTypes = array('integer', 'integer');
        $params = array($closetId, $user);
        
        $affectedClosetRows = $this->update($sql, $params, $paramTypes, "29864921");
        
        if ($affectedClosetRows === 1){
            $sql = "UPDATE ".CLOSET_ITEMS.
	           " SET ".CLOSET_ITEM_STATUS." = 2, ".CLOSET_LAST_UPDATED." = NOW() " . 
                " WHERE " . CLOSET_ID . " = ? AND " . CLOSET_USER_ID . " = ?";	   		
    		
    		$paramTypes = array('integer', 'integer');
            $params = array($closetId, $user);
            
            $this->update($sql, $params, $paramTypes, "29864921");        
        }
        
        return $affectedClosetRows;
	}
	
	
	public function addItemToCloset($user, $closetItem){
	    $sql = "INSERT INTO ".CLOSET_ITEMS." (".CLOSET_ID.", ".CLOSET_USER_ID.", ".CLOSET_ITEM_SKU.", ".CLOSET_ITEM_IMAGE.", ".CLOSET_ITEM_STATUS.", ".CLOSET_LAST_UPDATED.", ".CLOSET_ITEM_DATE_ADDED.") " .
                " VALUES (?,?,?,?,1,NOW(),NOW()) " .
                "ON DUPLICATE KEY UPDATE ".CLOSET_ITEM_STATUS."=1, ".CLOSET_LAST_UPDATED."=NOW()";	   
		
		$closetId = $closetItem->getClosetId();		
		$sku = $closetItem->getSku();
		$image = $closetItem->getImage();				
		
		$paramTypes = array('integer', 'integer', 'text', 'text');
        $params = array($closetId, $user, $sku, $image);
        
        return $this->update($sql, $params, $paramTypes, "39847293234");
	}
	
	public function addCustomItemToCloset($userId, $closetId, $img, $rawImage, $link, $page){
	    $sql = "INSERT INTO ".CLOSET_ITEMS_CUSTOM." (".CLOSET_ID.", ".CLOSET_USER_ID.",".CLOSET_ITEM_IMAGE.", ".CLOSET_ITEM_CUSTOM_RAW_IMAGE.",".CLOSET_ITEM_CUSTOM_LINK.",".CLOSET_ITEM_CUSTOM_PAGE.",".CLOSET_ITEM_STATUS.", ".CLOSET_LAST_UPDATED.", ".CLOSET_ITEM_DATE_ADDED.") " .
                " VALUES (?,?,?,?,?,?,1,NOW(),NOW()) " .
                "ON DUPLICATE KEY UPDATE ".CLOSET_ITEM_STATUS."=1, ".CLOSET_LAST_UPDATED."=NOW()";	   				
		
		$paramTypes = array('integer', 'integer', 'text', 'blob', 'text', 'text');
        $params = array($closetId, $userId, $img, $rawImage, $link, $page);
        
        return $this->update($sql, $params, $paramTypes, "39847293235");
	}
	
	
	public function removeItemFromCloset($user, $closetItem){
	    $sql = "UPDATE ".CLOSET_ITEMS.
	           " SET ".CLOSET_ITEM_STATUS." = 2 , ".CLOSET_LAST_UPDATED." = NOW() " . 
                " WHERE " . CLOSET_ID . " = ? AND " . CLOSET_USER_ID . " = ? AND " . CLOSET_ITEM_SKU . " = ?";	   
		
		$closetId = $closetItem->getClosetId();
		$sku = $closetItem->getSku();
		
		$paramTypes = array('integer', 'integer', 'text');
        $params = array($closetId, $user, $sku);
        
        return $this->update($sql, $params, $paramTypes, "293847923");
	}
	
	
	public function getAllClosets($userId){
	   $sql = "SELECT " . CLOSET_ID.", ".CLOSET_USER_ID.", ".CLOSET_NAME.", ".CLOSET_PERMISSION.", ".CLOSET_PRICE_ALERTS. 
                " FROM " . CLOSETS .
                " WHERE " . CLOSET_USER_ID . " = ? AND ".CLOSET_PERMISSION." < 3".
                " ORDER BY " . CLOSET_NAME;							       
		
		$paramTypes = array('integer');		
		$params = array($userId);
		
		return $this->getResults($sql, $params, $paramTypes, "29387201642");
	}
	
	
	public function getAllClosetItems($owner, $isPrivate){
	   $sql = "SELECT c." . CLOSET_ID.
	               ", c.".CLOSET_NAME.
	               ", c.".CLOSET_PRICE_ALERTS.
	               ", i.".CLOSET_USER_ID.
	               ", i.".CLOSET_ITEM_SKU.
	               ", COALESCE(i.".CLOSET_ITEM_IMAGE.", p.".PRODUCT_IMAGE.") AS ".CLOSET_ITEM_IMAGE.
	               ", p.".PRODUCT_NAME.
	               ", p.".PRODUCT_STORE.
	               ", p.".PRODUCT_PRICE.
	               ", p.".PRODUCT_SHORT_LINK. 
                " FROM " . CLOSETS . " c " .               
                " LEFT JOIN " . CLOSET_ITEMS . " i ON c.".CLOSET_ID." = i.".CLOSET_ID . " AND " .
                       "(isnull(i." . CLOSET_ITEM_STATUS . ") OR i." . CLOSET_ITEM_STATUS . " = 1) ". 
                " LEFT JOIN " . PRODUCTS . " p ON p.".PRODUCT_SKU." = i.".CLOSET_ITEM_SKU .
                " WHERE c." . CLOSET_USER_ID . " = ? AND c." . CLOSET_PERMISSION . " <= ? ";
                
                
        $sql .= " UNION SELECT c." . CLOSET_ID.
	               ", c.".CLOSET_NAME.
	               ", c.".CLOSET_PRICE_ALERTS.
	               ", ci.".CLOSET_USER_ID.
	               ", COALESCE(ci.".CLOSET_ITEM_SKU.", 1) AS ". CLOSET_ITEM_SKU .
	               ", COALESCE(ci.".CLOSET_ITEM_IMAGE.", ci.".CLOSET_ITEM_CUSTOM_RAW_IMAGE.",p.".PRODUCT_IMAGE.") AS ".CLOSET_ITEM_IMAGE.
	               ", p.".PRODUCT_NAME.
	               ", p.".PRODUCT_STORE.
	               ", p.".PRODUCT_PRICE.
	               ", COALESCE(p.".PRODUCT_SHORT_LINK.", ci.".CLOSET_ITEM_CUSTOM_LINK.", ci.".CLOSET_ITEM_CUSTOM_PAGE.")".
                " FROM " . CLOSETS . " c " .                               
                " LEFT JOIN " . CLOSET_ITEMS_CUSTOM . " ci ON c.".CLOSET_ID." = ci.".CLOSET_ID . " AND " .
                       "(isnull(ci." . CLOSET_ITEM_STATUS . ") OR ci." . CLOSET_ITEM_STATUS . " = 1) ".                 
                " LEFT JOIN " . PRODUCTS . " p ON p.".PRODUCT_IMAGE." = ci.".CLOSET_ITEM_IMAGE .
                " WHERE c." . CLOSET_USER_ID . " = ? AND c." . CLOSET_PERMISSION . " <= ? " .
                " ORDER BY " . CLOSET_NAME;	        
                						       
		
		$permission = $isPrivate ? 2 : 1;
		
		$paramTypes = array('integer','integer','integer','integer');		
		$params = array($owner, $permission, $owner, $permission);
		
		return $this->getResults($sql, $params, $paramTypes, "98763565478");
	}	
	
	public function saveItemImage($sku, $rawImage){
	   $sql = "INSERT IGNORE INTO ".CACHED_IMAGES." (".PRODUCT_SKU.", ".PRODUCT_IMAGE.", ".CACHED_IMAGES_DATE_ADDED.") " .
                " VALUES (?,?,NOW())";	   		
		
		$paramTypes = array('text', 'blob');
        $params = array($sku, $rawImage);
        
        return $this->update($sql, $params, $paramTypes, "34629384");
	}
}
?>
