<?php
require_once('vendor/autoload.php'); //should be placed on non public path in php.ini
require_once(dirname(__FILE__) . '/../globals.php');
require_once(dirname(__FILE__) . '/../Model/ProductCriteria.php');

class ElasticDao{

	private $client = null;
    private $index = "products"; //this will be an alias that always has current index
    private $fields = array('name.partial','name','store^2','storetokenized','tag^2','tag.partial^2','color1', 'color2');

	public function __construct(){
		$this->client = new Elasticsearch\Client();
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

		$searchParams = $this->buildQuery($criteria, $pageNumber, $numResultsPage);
        $results = array();

        try {
            $retDoc = $this->client->search($searchParams);
        }
        catch(Exception $e){
            //TODO log error here
        }

		if (is_array($retDoc)){
			foreach ($retDoc['hits']['hits'] as $hit) {
				$doc = $hit['_source'];
                $doc['score'] = $hit['_score'];
				array_push($results, $doc);
			}
		}

		return $results;
	}


    private function buildQuery($criteria, $pageNumber, $numResultsPage ){

        $start = $pageNumber * $numResultsPage;

        //TODO CONFIGS!!!
        $searchParams['index'] = $this->index;


        $customer = array('term'=>array('customer'=>$criteria->getCustomers()));
        //TODO fix so the filter and the indexing both use same analyzer. For now
        //just turn to lower case bc on indexing every thing gets lowercase treatment
        $category = array('terms'=>array('tag'=>array_map('strtolower', $criteria->getCategories())));
        $color = array('term'=>array('color'=>array_map('strtolower', $criteria->getColors())));
        $store = array('terms'=>array('store'=>array_map('strtolower', $criteria->getCompanies())));

        $price = array();

        if($criteria->getMinPrice()){
            $price['price']['gte'] = $criteria->getMinPrice();
        }

        if($criteria->getMaxPrice()){
            $price['price']['lte'] = $criteria->getMaxPrice();
        }

        $filters = array();

        if(empty($price)==false){
            array_push($filters, array('range'=>$price));
        }

        if( $criteria->getCompanies()){
            array_push($filters, $store);
        }

        if( $criteria->getCustomers()){
            array_push($filters, $customer);
        }

        if( $criteria->getCategories()){
            array_push($filters, $category);
        }

        if( $criteria->getColors()){
            array_push($filters, $color);
        }

        if(empty($filters)==false){
            $baseFilter = array('and'=>$filters);
        }

        $query = array();
        if($criteria->getSearchString()){
            $query['multi_match']['fields'] = $this->fields;
            $query['multi_match']['query'] = $criteria->getSearchString();
            $query['multi_match']['type'] = "cross_fields";
        }

        $searchParams['body']['query']['filtered'] = array(
            "filter" => $baseFilter,
            "query" =>$query
        );

        $searchParams['body']['from']=$start;
        $searchParams['body']['size']=$numResultsPage;




        return $searchParams;
    }
}

?>