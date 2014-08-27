<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class ClosetDao extends AbstractDao {
		
	public function createNewCloset($user, $closet){
        $sql = "INSERT INTO ".CLOSETS." (".CLOSET_USER_ID.", ".CLOSET_NAME.", ".CLOSET_PERMISSION.", ".CLOSET_LAST_UPDATED.", ".CLOSET_CREATED_ON.") " .
                " VALUES (?,?,1,NOW(),NOW())";	   
		
		$name = $closet->getName();
		$paramTypes = array('integer', 'text');
        $params = array($user, $name);
        
        return $this->update($sql, $params, $paramTypes, "21983619264");
	}
	
	public function updateCloset($user, $closet){
	    $sql = "UPDATE ".CLOSETS.
	           " SET ".CLOSET_NAME." = ?, ".CLOSET_PERMISSION." = ?, ".CLOSET_LAST_UPDATED." = NOW() " .  
                " WHERE " . CLOSET_ID . " = ? AND " . CLOSET_USER_ID . " = ?";	   
		
		$closetId = $closet->getClosetId();
		$name = $closet->getName();
		$permission = $closet->getPermission();
		
		$paramTypes = array('text', 'integer', 'integer', 'integer');
        $params = array($name, $permission, $closetId, $user);
        
        return $this->update($sql, $params, $paramTypes, "29864921");
	}
	
	public function deleteCloset($user, $closetId){
	   $sql = "UPDATE ".CLOSETS.
	           " SET ".CLOSET_PERMISSION." = 3 , ".CLOSET_LAST_UPDATED." = NOW() " . 
                " WHERE " . CLOSET_ID . " = ? AND " . CLOSET_USER_ID . " = ?";	   
		
		$closetId = $closet->getClosetId();
		
		$paramTypes = array('integer', 'integer');
        $params = array($closetId, $user);
        
        return $this->update($sql, $params, $paramTypes, "29864921");
	}
	
	public function addItemToCloset($user, $closetItem){
	   $sql = "INSERT INTO ".CLOSET_ITEMS." (".CLOSET_ID.", ".CLOSET_USER_ID.", ".CLOSET_ITEM_SKU.", ".CLOSET_ITEM_IMAGE.", ".CLOSET_ITEM_STATUS.", ".CLOSET_LAST_UPDATED.", ".CLOSET_ITEM_DATE_ADDED.") " .
                " VALUES (?,?,?,?,1,NOW(),NOW())";	   
		
		$closetId = $closetItem->getClosetId();
		$sku = $closetItem->getSku();
		$image = $closetItem->getImage();
		
		$paramTypes = array('integer', 'integer', 'text', 'text');
        $params = array($closetId, $user, $sku, $image);
        
        return $this->update($sql, $params, $paramTypes, "39847293234");
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
	   $sql = "SELECT " . CLOSET_ID.", ".CLOSET_USER_ID.", ".CLOSET_NAME.", ".CLOSET_PERMISSION. 
                " FROM " . CLOSETS .
                " WHERE " . CLOSET_USER_ID . " = ? " .
                " ORDER BY " . CLOSET_ID.", ".CLOSET_NAME;							       
		
		$paramsTypes = array('integer');		
		$params = array($userId);
		
		return $this->getResults($sql, $params, $paramTypes, "29387201642");
	}
	
	public function getAllClosetItems($owner, $isPrivate){
	   $sql = "SELECT i." . CLOSET_ID.", c.".CLOSET_NAME.", i.".CLOSET_USER_ID.", i.".CLOSET_ITEM_SKU.", i.".CLOSET_ITEM_IMAGE. 
                " FROM " . CLOSET_ITEMS . " i " .
                " INNER JOIN " . CLOSETS . " c ON c.".CLOSET_ID." = i.".CLOSET_ID .
                " WHERE i." . CLOSET_USER_ID . " = ? AND c." . CLOSET_PERMISSION . " <= ? " .
                " ORDER BY " . CLOSET_ID;							       
		
		$permission = $isPrivate ? 2 : 1;
		
		$paramsTypes = array('integer','integer');		
		$params = array($owner, $permission);
		
		return $this->getResults($sql, $params, $paramTypes, "98763565478");
	}	
}
?>
