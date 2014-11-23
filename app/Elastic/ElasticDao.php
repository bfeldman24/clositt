<?php
require_once('vendor/autoload.php'); //should be placed on non public path in php.ini
require_once(dirname(__FILE__) . '/../globals.php');
require_once(dirname(__FILE__) . '/../Model/ProductCriteria.php');

class ElasticDao{

	private $client = null;
    private $index = "products"; //this will be an alias that always has current index

    private $fields = array('name.partial','name','store','category', 'details','customer', 'color', 'color2');
    private $listColorsToParse = array("Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Magenta", "Violet", "Purple", "Pink", "White", "Gray", "Black", "Brown");
    private $debugger = null;

	public function __construct(){
		$this->client = new Elasticsearch\Client();
        $this->debugger = new Debugger();
	}

    public function isHealthy(){
        try{
             $health = $this->client->ping();
            return $health;
        }
        catch(Exception $e){
            //TODO report error here!
            return false;
        }

        return false;

    }

    public function explainQueryResults($sku, $searchString){

        $params['index'] = $this->index;
        $params['type']='product';
        $params['id']=$sku;


        $query = array();
        $query['multi_match']['fields'] = $this->fields;
        $query['multi_match']['query'] = $searchString;
        $query['multi_match']['type'] = "cross_fields";

        $params['body']['query']['filtered'] = array(
            "filter" => null,
            "query" =>$query
        );

        $results = $this->client->explain($params);
        return $results;
    }

	public function getProductsWithCriteria($criteria, $pageNumber, $numResultsPage){
        $parsedQuery = array();
        $searchParams = $this->buildQuery($criteria, $pageNumber, $numResultsPage, $parsedQuery);
        $products = array();
        $facets = array();

        $time_start = microtime(true);
        try {
            $retDoc = $this->client->search($searchParams);
        }
        catch(Exception $e){
            $this->debugger->log("Error occured searching ES: $e->getMessage()");
        }

		if (isset($retDoc) && is_array($retDoc)){
			foreach ($retDoc['hits']['hits'] as $hit) {
				$doc = $hit['_source'];
                $doc['score'] = $hit['_score'];
				array_push($products, $doc);
			}

            foreach($retDoc['facets'] as $key=>$value){
                $terms = array();
                foreach($value['terms'] as $term=>$termValue){
                    $terms[$termValue['term']]=$termValue['count'];
                }
                $facets[$key] = $terms;
            }
		}

        $time_end = microtime(true);
        $time = $time_end - $time_start;
        $this->debugger->log("Total time to get products was : $time");

		return array('products'=>$products, 'facets' => $facets, 'query'=>$parsedQuery);
	}

    private function buildQuery($criteria, $pageNumber, $numResultsPage, &$parsedQuery ){

        $start = $pageNumber * $numResultsPage;

        $searchParams['index'] = $this->index;

        $filters = array();

        //TODO Refactor these functions out of this DAO into a criteria builder
        $this->addPriceFilter($criteria, $filters, $parsedQuery);
        $this->addCustomerFilter($criteria, $filters, $parsedQuery);
        $this->addStoresFilter($criteria, $filters, $parsedQuery);
        $this->addColorFilter($criteria, $filters, $parsedQuery);
        $this->addTagsFilter($criteria, $filters, $parsedQuery);

        $fields = array();

        if($criteria->getSearchString()){

            //TODO clear this up. From old admin page that had weightings
            if(is_array($criteria->getFieldWeightings())){
                $userWeights = $criteria->getFieldWeightings();

                $tagBoost = !empty($userWeights['tags']) ? "^" . $userWeights['tags'] : "";
                $storeBoost = !empty($userWeights['store']) ? "^" . $userWeights['store'] : "";
                $colorBoost = !empty($userWeights['color']) ? "^" . $userWeights['color'] : "";
                $titleBoost = !empty($userWeights['title']) ? "^" . $userWeights['title'] : "";

                array_push($fields, "category" . $tagBoost);
                array_push($fields, "details");
                array_push($fields, "store" . $storeBoost);

                array_push($fields, "color" . $colorBoost) ;
                array_push($fields, "color2" . $colorBoost) ;

                array_push($fields, "name" . $titleBoost) ;
                array_push($fields, "name.partial" . $titleBoost) ;


            }
            else{
                $fields = $this->fields;
            }

        }

        $parsedQuery['SearchString'] = $criteria->getSearchString();
        $queryType =$criteria->getQueryType();
        if (empty($queryType) || $queryType=="querystring"){

            if(!empty($filters)){
                $searchParams['body']['query']['bool']['must'] = $filters;
            }

            $finalQueryString = trim($criteria->getSearchString());
            if($finalQueryString && $finalQueryString != ""){
                $searchParams['body']['query']['bool']['should']['query_string'] = array( "query" => $finalQueryString, "default_field" => "_all");
            }


        }
        else if ($queryType=="custom"){
            //if doing custom search, the fields should be specified in the query string itself.
            $searchParams['body']['query']['query_string'] = array( "query" => $criteria->getSearchString());
         }

        // setup facets
        $tags =  array('terms'=>array('field'=>'tag','size'=>10));
        $stores =  array('terms'=>array('field'=>'store','size'=>10));
        $searchParams['body']['facets'] = array('tags'=>$tags, 'stores'=>$stores);

        $searchParams['body']['from']=$start;
        $searchParams['body']['size']=$numResultsPage;

        return $searchParams;
    }

    public function updateClosittCount($sku){
        return $this->updateProduct($sku, 'closittCount');
    }

    public function updateCommentCount($sku){
        return $this->updateProduct($sku, 'commentCount');
    }

    private function updateProduct($sku, $fieldToUpdate){
        $params['index'] = $this->index;
        $params['type'] = "product";
        $params['id'] = $sku;
        $params['body']['script'] = "ctx._source." . $fieldToUpdate ."+=1";
        $response = $this->client->update($params);
        return $response;
    }

    private function addColorFilter(&$criteria, &$filters, &$parsedQuery){

        $color = array();
        if( $criteria->getColors()){
            $color =  $criteria->getColors();
        }

        $terms = explode(" ", $criteria->getSearchString());

        foreach($terms as $term){
            if($this->arrayContainsInsensitive($term, $this->listColorsToParse) && in_array($term, $color) === false){
                array_push($color, $term);
                $criteria->setSearchString(str_ireplace($color, "", $criteria->getSearchString()));
            }
        }

        if(!empty($color)){
            $colors = array('terms'=>array('color'=> array_map('strtolower', $color)));
            array_push($filters, $colors);
            $parsedQuery["Colors"] = $color;
        }
    }

    /*
     * If user has already manually added a customer type, then use that.
     * Otherwise check if the "men" or "women" is in the search term and if
     * it is then add it as a filter
     */
    private function addCustomerFilter(&$criteria, &$filters, &$parsedQuery){
        if($criteria->getCustomers() && is_array($criteria->getCustomers())){
            $customerType = $criteria->getCustomers()[0];
            $termToRemove = $customerType;
        }
        elseif( stristr($criteria->getSearchString(), "womens") !== false){
            $termToRemove = "womens";
            $customerType = "women";
        }
        elseif( stristr($criteria->getSearchString(), "mens") !== false){
            $customerType = "men";
            $termToRemove = "mens";

        }elseif( stristr($criteria->getSearchString(), "women") !== false){
            $customerType = "women";
            $termToRemove = $customerType;
        }
        elseif( stristr($criteria->getSearchString(), "men") !== false){
            $customerType = "men";
            $termToRemove = $customerType;
        }

        if(!empty($customerType)){
            $customer = array('term'=>array('customer'=>$customerType));
            array_push($filters, $customer);
            $criteria->setSearchString(str_ireplace($termToRemove, "", $criteria->getSearchString()));
            $parsedQuery["Gender"]= $customerType;
        }
    }

    private function addPriceFilter($criteria, &$filters, &$parsedQuery){
        $price = array();

        if($criteria->getMinPrice()){
            $price['price']['gte'] = $criteria->getMinPrice();
        }

        if($criteria->getMaxPrice()){
            $price['price']['lte'] = $criteria->getMaxPrice();
        }

        if(empty($price)==false){
            array_push($filters, array('range'=>$price));
        }
    }

    private function addStoresFilter(&$criteria, &$filters, &$parsedQuery){
        $storesToSearch = array();
        if($criteria->getCompanies()){
            foreach($criteria->getCompanies() as $store){
                array_push($storesToSearch, $store);
            }
        }

        $storesFromElastic = $this->getAllFromElastic('stores', 'store');
        foreach($storesFromElastic as $store){
            if(in_array($store, $storesToSearch) === false && stripos($criteria->getSearchString(), $store)!==false){
                array_push($storesToSearch, $store);
                $criteria->setSearchString(str_ireplace($store, "", $criteria->getSearchString()));
            }
        }

        if(!empty($storesToSearch)){
            $stores = array('terms'=>array('store'=> array_map('strtolower', $storesToSearch)));
            array_push($filters, $stores);
            $parsedQuery["Stores"]= $storesToSearch;
        }
    }

    private function addTagsFilter(&$criteria, &$filters, &$parsedQuery){

        $tagsToSearch = array();
        if($criteria->getTags()){
            foreach($criteria->getTags() as $tag){
                array_push($tagsToSearch, $tag);
            }
        }

        $tagsFromElastic = $this->getAllFromElastic('tags', 'tag', 'taglength','desc');
        foreach($tagsFromElastic as $tag){
            $tempTag = $tag;
            if (substr($tempTag, -1) == 's')
            {
                $tempTag = substr($tempTag, 0, -1);
            }

            if(in_array($tag, $tagsToSearch) === false){
                //first check for exact match to the tag
                if(stripos($criteria->getSearchString(), $tag) !== false){
                    array_push($tagsToSearch, $tag);
                    $criteria->setSearchString(str_ireplace($tag, "", $criteria->getSearchString()));
                }
                //Else check for tag without 's' at the end
                elseif(stripos($criteria->getSearchString(), $tempTag) !== false){
                    array_push($tagsToSearch, $tag);
                    $criteria->setSearchString(str_ireplace($tempTag, "", $criteria->getSearchString()));
                }
            }
        }

        if(!empty($tagsToSearch)){
            foreach($tagsToSearch as $tag){
                $tags = array('term'=>array('category'=>strtolower($tag)));
                array_push($filters, $tags);
            }

            $parsedQuery["Tags"]= $tagsToSearch;
        }

    }

    private function getAllFromElastic($indexName, $fieldName, $sortfield = null, $sortorder = null){
        $searchParams = array();
        $searchParams['index'] = $indexName;
        $searchParams['body']['query']['match_all']=array();
        $searchParams['body']['from']=0;
        $searchParams['body']['size']=400;
        if($sortfield != null){
            $searchParams['body']['sort']=array($sortfield=>$sortorder);
        }


        try {
            $retDoc = $this->client->search($searchParams);
        }
        catch(Exception $e){
            //TODO log error here

        }

        $items = array();
        if (isset($retDoc) && is_array($retDoc)){
            foreach ($retDoc['hits']['hits'] as $hit) {
                array_push($items, $hit['_source'][$fieldName]);
            }
        }

        return $items;
    }

    private function arrayContainsInsensitive($str, array $arr)
    {
        foreach($arr as $a) {
            if (stripos($str,$a) !== false) return true;
        }
        return false;
    }

}

?>
