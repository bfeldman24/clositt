<?php

class ProductCriteria{

	private $companies;
	private $customers;
	private $categories;
	private $colors;
	private $tags;
	private $searchString;
	private $minPrice;
	private $maxPrice;

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


}

?>