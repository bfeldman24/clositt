<?php
require_once(dirname(__FILE__) . '/BaseEntity.php');

class ProductCriteria{

	private $companies;
	private $customers;
	private $categories;
	private $colors;
	private $tags;
	private $searchString;
	private $minPrice;
	private $maxPrice;
    private $fieldWeightings;
    private $queryType;

	//Getters and Setters
	public function getCompanies() {
		return $this->companies;
	}
	public function setCompanies($companies) {
		if(isset($companies)){
			$this->companies = $companies;
		}
	}

	public function getCustomers() {
		return $this->customers;
	}
	public function setCustomers($customers) {
		if(isset($customers)){
			$this->customers = $customers;
		}
	}

	public function getCategories() {
		return $this->categories;
	}
	public function setCategories($categories) {
		if(isset($categories)){
			$this->categories = $categories;
		}
	}

	public function getColors() {
		return $this->colors;
	}
	public function setColors($colors) {
		if(isset($colors)){
			$this->colors = $colors;
		}
	}


	public function getTags() {
		return $this->tags;
	}
	public function setTags($tags) {
		if(isset($tags)){
			$this->tags = $tags;
		}
	}

	public function getSearchString() {
		return $this->searchString;
	}
	public function setSearchString($searchString) {
		if(isset($searchString)){
			$this->searchString = $searchString;
		}
	}

	public function getMinPrice() {
		return $this->minPrice;
	}
	public function setMinPrice($minPrice) {
		if(isset($minPrice)){
			$this->minPrice = $minPrice;
		}
	}
	
	public function getMaxPrice() {
		return $this->maxPrice;
	}
	public function setMaxPrice($maxPrice) {
		if(isset($maxPrice)){
			$this->maxPrice = $maxPrice;
		}
	}

    public function getFieldWeightings() {
        return $this->fieldWeightings;
    }
    public function setFieldWeightings($fieldWeightings) {
        if(isset($fieldWeightings)){
            $this->fieldWeightings = $fieldWeightings;
        }
    }

    public function getQueryType() {
        return $this->queryType;
    }
    public function setQueryType($queryType) {
        if(isset($queryType)){
            $this->queryType = $queryType;
        }
    }

    public function isEmpty(){
        return  !isset($this->maxPrice) &&
        !isset($this->minPrice) &&
        !isset($this->searchString) &&
        !isset($this->tags) &&
        !isset($this->colors) &&
        !isset($this->categories) &&
        !isset($this->customers) &&
        !isset($this->companies);
    }

    public static function setCriteriaFromPost($row){
		$productCriteria = new ProductCriteria();
		
		$productCriteria->setCompanies(BaseEntity::getPostField($row, 'company'));				
		$productCriteria->setCustomers(BaseEntity::getPostField($row, 'customer'));		
        $productCriteria->setColors(BaseEntity::getPostField($row, 'colors'));		
		$productCriteria->setSearchString(BaseEntity::getPostField($row, 'searchTerm'));		
    	$productCriteria->setMinPrice(BaseEntity::getPostField($row, 'abovePrice'));
    	$productCriteria->setMaxPrice(BaseEntity::getPostField($row, 'belowPrice'));
    	$productCriteria->setCategories(ProductCriteria::convertArrayToCamelCase(BaseEntity::getPostField($row, 'category')));
    	$productCriteria->setTags(ProductCriteria::convertArrayToCamelCase(BaseEntity::getPostField($row, 'tags')));		

        $weightings = array();        
        $weightings['tags'] = BaseEntity::getPostField($row, 'tagWeight');
        $weightings['store'] = BaseEntity::getPostField($row, 'storeWeight');
        $weightings['color'] = BaseEntity::getPostField($row, 'colorWeight');
        $weightings['title'] = BaseEntity::getPostField($row, 'titleWeight');

        $productCriteria->setFieldWeightings($weightings);        
        $productCriteria->setQueryType(BaseEntity::getPostField($row, 'queryType'));

		return $productCriteria;
	}	
	
	private static function convertArrayToCamelCase($arr){
	    if (!isset($arr)){
	       return null;  
	    }
	   
	    for ($i=0; $i < count($arr); $i++){
        	$arr[$i] = ProductCriteria::toCamelCase($arr[$i]);
        }  
        
        return $arr;
	}
	
	private static function toCamelCase($str){
	       if (!isset($str)){
    	       return null;  
    	   }
	   
	       $str = ucwords(strtolower($str));
           //$str = preg_replace('/\s+/', '', $str); 
           return trim($str);
	}
}

?>