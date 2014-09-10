<?php
require_once(dirname(__FILE__) . '/AbstractDao.php');

class FilterDao extends AbstractDao {
		
	public function getFilters(){
        $sql = "SELECT " . FILTER_TYPE.", ".FILTER_VALUE.", ".FILTER_SUBVALUE.", ".FILTER_CUSTOMER . 
                " FROM " . FILTERS .
                " WHERE " . FILTER_STATUS . " = 1 " .
                " ORDER BY " . FILTER_TYPE.", ".FILTER_VALUE.", ".FILTER_SUBVALUE.", ".FILTER_CUSTOMER;							       
		
		return $this->getResults($sql, array(), array(), "9812364012");	     
	}	
		
    public function updateCompanyFilters(){
	   $sql = "INSERT INTO ".FILTERS." (".FILTER_TYPE.", ".FILTER_VALUE.", ".FILTER_CUSTOMER.", ".FILTER_STATUS.", ".FILTER_DATE.") " .
                "SELECT DISTINCT 'company', p.".PRODUCT_STORE.", p.".PRODUCT_CUSTOMER.", 1, NOW() " .
                "FROM ".PRODUCTS." p " .
                "LEFT JOIN ".FILTERS." f on f.".FILTER_TYPE." = 'company' AND f.".FILTER_VALUE." = p.store AND f.".FILTER_CUSTOMER." = p.customer " .
                "WHERE p.".PRODUCT_STATUS." = 1 AND ISNULL(f.".FILTER_VALUE.") ";
	   
	   return $this->update($sql, array(), array(), "394923334");
	}	
}
?>
