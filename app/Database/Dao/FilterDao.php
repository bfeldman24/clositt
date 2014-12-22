<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class FilterDao extends AbstractDao {
		
	public function getFilters(){
        $sql = "SELECT " . FILTER_TYPE.", ".FILTER_VALUE.", ".FILTER_SUBVALUE.", ".FILTER_SYNONYM.",".FILTER_CUSTOMER . 
                " FROM " . FILTERS .
                " WHERE " . FILTER_STATUS . " = 1 " .
                " ORDER BY " . FILTER_TYPE.", ".FILTER_VALUE.", " . 
                    "CASE WHEN ".FILTER_SUBVALUE." like 'All %' THEN 0 ELSE ".FILTER_SUBVALUE." END, ".FILTER_CUSTOMER;							       
		
		return $this->getResults($sql, array(), array(), "9812364012");	     
	}	
		
    public function updateCompanyFilters(){
       $sql = "DELETE FROM ".FILTERS.                
              " WHERE ".FILTER_TYPE." = 'company'";
	   
	   $this->update($sql, array(), array(), "3949233341"); 
        
	   $sql = "INSERT INTO ".FILTERS." (".FILTER_TYPE.", ".FILTER_VALUE.", ".FILTER_CUSTOMER.", ".FILTER_STATUS.", ".FILTER_DATE.") " .
                "SELECT DISTINCT 'company', p.".PRODUCT_STORE.", p.".PRODUCT_CUSTOMER.", 1, NOW() " .
                "FROM ".PRODUCTS." p " .
                "WHERE p.".PRODUCT_STATUS." = 1 AND p.".PRODUCT_STORE." <> '' and p.".PRODUCT_CUSTOMER." <> ''";
	   
	   return $this->update($sql, array(), array(), "394923334");
	}	
}
?>
