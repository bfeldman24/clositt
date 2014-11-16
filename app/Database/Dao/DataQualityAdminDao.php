<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/AbstractDao.php');

class DataQualityAdminDao extends AbstractDao {     
    
    /*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    1 .Lots of duplicate scrapes at the same time in HistoricalProducts
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function duplicateScrapesInHistoricalProducts(){        				
		$sql = "select sku,updatedOn,count(1) as count " .
               "from HistoricalProducts " .
               "group by sku,updatedOn " .
               "having count(1) > 1 " .
               "order by count(1) asc " .
               "limit " . QUERY_LIMIT;							        
		
		return $this->getResults($sql, array(), array(), "0129730127");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    2 . Weird price change to 9999.99 in HistoricalPrices these sku dont exist in the products table
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function largePricesInHistoricalProducts(){						
		$sql = "select * " .
               "from HistoricalPrices " .
               "order by newprice desc " .
               "limit " . QUERY_LIMIT;			        
		
		return $this->getResults($sql, array(), array(), "01297301272");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    3. Duplicate data/counting links/ different categories same product
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function duplicateLinks(){						
		$sql = "select link,count(1) as count" .
               "from Products " .
               "group by link " .
               "Having count(1) > 1 " .
               "limit " . QUERY_LIMIT;							        
		
		return $this->getResults($sql, array(), array(), "01297301273");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    4. Product table has category data with imporper tab and new_line fomatting
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function categoriesWithTabsAndNewLineCharacters(){						
		$sql = "select * " .
               "from Products " .
               "where category LIKE '\n%' or category LIKE '%\t%' " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301274");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    4b. Product table has name data with imporper tab and new_line fomatting
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function productsWithTabsAndNewLineCharacters(){						
		$sql = "select * " .
               "from Products " .
               "where name LIKE '\n%' or name LIKE '%\t%' " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301275");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    5. Query to look for anything over 20,000 - arbitrary call by me after looking up the max value in products
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function largePrices(){						
		$sql = "select * " .
               "from Products " .
               "where price > 10000 " .
               "order by price desc " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301276");
	}					
	
    /*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    5b. Query to look for anything under $5 - arbitrary call by me after looking up the min value in products
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function smallPrices(){						
		$sql = "select * " .
               "from Products " .
               "where price < 3 " .
               "order by price desc " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301277");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    6. Query to for skus whos price has increased by more than 50% since they were to stored in HProd to Prod
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function largePriceChange(){						
		$sql = "select p.sku, p.price, hp.price as hp_price, hp.sku as hp_sku " .
               "from HistoricalProducts hp " .
               "inner join Products p ON p.sku = hp.sku " .
               "where p.price > ((hp.price*.5)+hp.price) or hp.price > ((p.price*.5)+p.price) " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301278");
	}
		
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    7. Query to find products that are in shekels
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function productsInShekels(){						
		$sql = "select * " .
               "from Products " .
               "where link like '%en-il%' " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301279");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    7. Query to find products with empty strings
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function productsWithEmptyStrings(){						
		$sql = "select * " .
               "from Products " .
               "where sku = '' OR store = '' OR category = '' OR name ='' OR link = '' OR image = '' OR price = '' " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301279");
	}
	
	/*
	:::::::::::::::::::::::::::::::::::::::::::::::::
    8. Query to find products with that are not clothes
    :::::::::::::::::::::::::::::::::::::::::::::::::                		
	*/
    public function productsThatAreNotClothes(){						
		$sql = "select * " .
               "from Products " .
               "where LOWER(name) REGEXP '^(socks|goggle|hat|bag|glasses|belt|tie|necklace|watch|glove)' " .
               "limit " . QUERY_LIMIT;
		
		return $this->getResults($sql, array(), array(), "01297301280");
	}
}
?>