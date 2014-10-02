<?php
require_once('vendor/autoload.php'); //should be placed on non public path in php.ini
require_once(dirname(__FILE__) . '/../globals.php');
require_once(dirname(__FILE__) . '/../Model/ProductCriteria.php');

class ElasticDao{

	private $client = null;
    private $index = "products"; //this will be an alias that always has current index
    //private $fields = array('name.partial','name','store','tag','tag.partial','color', 'color2');
    private $fields = array('name.partial','name','store','category', 'details','customer', 'color', 'color2');
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
        $products = array();
        $facets = array();

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



		return array('products'=>$products, 'facets' => $facets);
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
        $fields = array();

        if($criteria->getSearchString()){

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

        $queryType =$criteria->getQueryType();
        if (empty($queryType) || $queryType=="querystring"){
            $searchParams['body']['query']['query_string'] = array( "query" => $criteria->getSearchString() ,"fields" => $fields);
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
}

?>