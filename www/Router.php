<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../app/session.php');

/*
echo $_GET['classCode'];
echo $_GET['method'];
echo $_GET['page'];
*/

class Router {
    
    /************************
    ***      ROUTER       ***
    *************************/
    public static function init(){
        
        if(isset($_GET['classCode']) && isset($_GET['method'])){
        
            switch($_GET['classCode']){
                case 'c':
                    Router::Color();
                    break;
                case 'cl':
                    Router::Closet();
                    break;
                case 'e':
                    Router::Email();
                    break;                 
                case 'f':                
                    Router::Filter();
                    break;    
                case 'l':
                    Router::ListController();
                    break;                                           
                case 'p':
                case 'b': 
                case 'i':
                    Router::Product();
                    break;                             
                case 'r':
                    Router::Review();
                    break;
                case 's': 
                    Router::Stats();
                    break;   
                case 't':
                    Router::Tag();
                    break;                                
                case 'u':
                    Router::User();
                    break;
                case 'admin':
                    if(ENV == "DEV" || ENV == "QA"){
                        Router::Admin();
                    }
                    break;        
            } 
        }else{
            echo "404";   
        }
    }
    
    
    /************************
    ***  USER CONTROLLER  ***
    *************************/
    public static function User(){
        require_once(dirname(__FILE__) . '/../app/Controller/UserController.php');
        $userController = new UserController();             
        
        switch($_GET['method']){
            case 'signup':            
                echo $userController->signUp($_POST);
                break;
            case 'login':            
                echo $userController->login($_POST);
                break;
            case 'logout':            
                echo $userController->logout();
                break;    
            case 'update':            
                echo $userController->updateUserInfo($_POST);
                break;
            case 'updatepass':            
                echo $userController->updateUserPassword($_POST);
                break;
            case 'resetpass':            
                echo $userController->resetPassword($_POST['email']);
                break;                   
            case 'get':            
                echo $userController->getUserInfo();
                break;
            case 'name':            
                echo $userController->getUserName($_POST);
                break;
        }                  
    }
    
 
    /************************
    *** CLOSET CONTROLLER ***
    *************************/
    public static function Closet(){
        require_once(dirname(__FILE__) . '/../app/Controller/ClosetController.php');
        $closetController = new ClosetController();             
    
        switch($_GET['method']){
            case 'create':            
                echo $closetController->createNewCloset($_POST);
                break;
            case 'update':            
                echo $closetController->updateCloset($_POST);
                break;
            case 'delete':            
                echo $closetController->deleteCloset($_POST);
                break;
            case 'add':            
                echo $closetController->addItemToCloset($_POST);
                break;
            case 'remove':            
                echo $closetController->removeItemFromCloset($_POST);
                break;
            case 'get':            
                echo $closetController->getAllClosets();
                break;            
            case 'getall':                               
                echo $closetController->getAllClosetItems($_POST, true);
                break;
        }  
    }   
    
    /************************
    *** PRODUCT CONTROLLER ***
    *************************/
    public static function Product(){ 
        require_once(dirname(__FILE__) . '/../app/Controller/ProductController.php'); 
        $productController = new ProductController();
           
        if ($_SERVER['REQUEST_METHOD'] == 'POST'){                          
            
            switch($_GET['method']){                                            
                case 'lookup':
                     $product = $productController->getProduct($_POST['sku']);   
                     print_r($product);
                     break;                                                      
                case 'search':                	
                    $product = $productController->searchElasticHtml($_POST, $_GET['page'], QUERY_LIMIT);
                    print_r($product);
                    break;
                case 'browse':                                        
                    $product = $productController->getProductsHtml($_POST, $_GET, 25, true);   
                    header('Content-Type: application/json');
                    print_r($product);
                    break;                                
            }
            
            if(ENV == "DEV" || ENV == "QA"){
               if($_GET['method'] == "searchjson"){ 	
                    $product = $productController->searchElastic($_POST, $_GET['page'], QUERY_LIMIT);
                    print_r($product);
                }
           }
            
        }else{
            if ($_GET['classCode'] == "i" && $_GET['method'] == 'image'){           
                    $image = $productController->getCachedProductImage($_GET['sku']);   
                    header('Content-Type: image/jpeg');                                                                        
                    print_r($image);
            }
        }           
    }
        
    /************************
    *** FILTER CONTROLLER ***
    *************************/
    public static function Filter(){  
        require_once(dirname(__FILE__) . '/../app/Controller/FilterController.php');
        $filterController = new FilterController();              
    
        switch($_GET['method']){
            case 'getfilters':
            case 'filters':
                $filters = $filterController->getJsonFilters();
                //$filters = $filterController->getHtmlFilters();
                print_r($filters);
                break;    
        }      
    }
    
    /************************
    ***  TAG CONTROLLER   ***
    *************************/
    public static function Tag(){  
        require_once(dirname(__FILE__) . '/../app/Controller/TagController.php');
        $tagController = new TagController();
              
        if ($_SERVER['REQUEST_METHOD'] == 'POST'){                                          
            
            if(ENV == "DEV" || ENV == "QA"){
                switch($_GET['method']){
                    case 'addFromFile':   
                        $tagResults = $tagController->addTagsFromFile("../Data/clothies-tags-export.json");
                        break;        
                    case 'getpotentialtags':   
                        $tagResults = $tagController->getPotentialTags($_POST);
                        break;
                    case 'getuniquetags':
                        $tagResults = $tagController->getUniqueTags();    
                        break;            
                    case 'removetag':
                        $tagResults = $tagController->removeTag($_POST);   
                        break;             
                    case 'removetags':
                        $tagResults = $tagController->removeTags($_POST);   
                        break;                                 
                    case 'approvetags':
                        $tagResults = $tagController->approveTags($_POST);   
                        break;  
                    case 'replacetag':
                        $tagResults = $tagController->replaceTag($_POST);   
                        break;  
                    case 'updateproducttags':
                        $tagResults = $tagController->getTagListToPopulateTags();    
                        break;
                    case 'searchunapprovedtags':
                        $tagResults = $tagController->getProductsForTag($_POST['category'], $_GET['page'], true);    
                        break;            
                }       
            }
            
            switch($_GET['method']){
                case 'add':                                           
                    $tagResults = $tagController->addTag($_POST);
                    break;        
            }        
            
            print_r($tagResults);
        }
        
    }
    
    /************************
    *** REVIEW CONTROLLER ***
    *************************/
    public static function Review(){
        require_once(dirname(__FILE__) . '/../app/Controller/ReviewController.php'); 
        
        if ($_SERVER['REQUEST_METHOD'] == 'POST'){
            $reviewController = new ReviewController();                            
            
            if(ENV == "DEV" || ENV == "QA"){
                switch($_GET['method']){
                   case 'getall':               
                       $results = $reviewController->getAllReviews();
                       break;     
               }   
            }
            
            switch($_GET['method']){
                case 'add':               
                    $results = $reviewController->addReview($_POST);
                    break;
                case 'remove':               
                    $results = $reviewController->removeReview($_POST);
                    break;
                case 'get':               
                    $results = $reviewController->getReviews($_POST);
                    break;        
            }   
                
            print_r($results);
        }   
    }
    
    /************************
    *** COLOR CONTROLLER ***
    *************************/
    public static function Color(){   
        require_once(dirname(__FILE__) . '/../app/Controller/ColorController.php');    
        $colorController = new ColorController();                  
        
        switch($_GET['method']){
            case 'addFromFile':   
                $results = $colorController->addColorsFromFile("../app/Data/clothies-colors-export.json"); 
                break;
            case 'add':                    
                $results = $colorController->addColorsFromPost($_POST);
                break;                                
            case 'get':                                
                $colorController->processColors();            
                break;                
            case 'getmappings':
                $colors = $colorController->getColorMapping();                                                   
                print_r(json_encode($colors));            
                break;                
            case 'createmappings':
                $mappings = $colorController->createColorMapping();
                $results = json_encode($mappings);
                break;                
            case 'savemappings':
                $results = $colorController->saveColorMapping($_POST['colors']);                             
                break;                        
            case 'getmappingcount':
                $results = $colorController->getColorMappingCount();                             
                break;                   
            case 'testImage':       
                $results = $colorController->testImage($_GET['i']);
                break;                            
            case 'count':
                $results = $colorController->getColorsCount();                                      
                break;                    
            case 'correct':                            
                $results = $colorController->correctColor($_POST['sku'], $_POST['oldColor'], $_POST['newColor']);                
                break;
        }
        
        if (isset($results)){
            print_r($results);
        }
    }
    
    /************************
    *** LIST CONTROLLER ***
    *************************/
    public static function ListController(){        
        require_once(dirname(__FILE__) . '/../app/Controller/ListController.php');  
    
        switch($_GET['method']){
            case 'add':            
                echo ListController::writeToFile($_POST['listName'], $_POST['item']);
                break;  
            case 'get':            
                echo ListController::readFile($_POST['listName']);
                break;        
        }            
    }
    
    /************************
    *** ADMIN CONTROLLER ***
    *************************/
    public static function Admin(){
        if(ENV != "DEV" && ENV != "QA"){
            return "500";   
        }
        
        require_once(dirname(__FILE__) . '/../app/Controller/ProductAdminController.php');  
        $productAdminController = new ProductAdminController();

        if ($_SERVER['REQUEST_METHOD'] == 'POST'){                          
            $output = null;
            
            switch ($_GET['method']){                        
                case 'update':                                          
                    $results = $productAdminController->addAdminProducts($_POST['products'], $_POST['isLastBatch']);   
                    $output = json_encode($results);   
                    break;                    
                case  'count':                                          
                    $results = $productAdminController->getTotalProductsCount();   
                    $output = print_r($results, true);        
                    break;                
                case 'updatestatus':                                               
                    $output = $productAdminController->updateSpiderStatus($_POST);    
                    break;                
                case 'addlink':
                    $output = $productAdminController->addSpiderLink($_POST);    
                    break;                
                case 'addlinks':
                    $output = $productAdminController->addSpiderLinks($_POST['links']);    
                    break;                
                case 'updatelink':
                    $output = $productAdminController->updateSpiderLink($_POST);    
                    break;                    
                case 'removelink':
                    $output = $productAdminController->removeSpiderLink($_POST);  
                    break;                                     
                case 'getnextproductdetailurls':
                    $output = print_r($productAdminController->getNextProductDetailUrls($_POST['stores'], $_GET['page']), true);    
                    break;                
                case 'saveproductdetails':
                    $output = $productAdminController->saveProductDetails($_POST);     
                    break;                   
                case 'hideproductfrombrowsing':
                    $output = $productAdminController->hideProductFromBrowsing($_POST['skus']);     
                    break; 
                case 'searchdb':   
                    $productController = new ProductController();
                    $output = $productController->getFilteredProductsFromPost($_POST, $_GET['page']);                        
                    break;
                case 'searchunapprovedtags':
                    $productController = new ProductController();
                    $output = $productController->getFilteredProductsFromPost($_POST, $_GET['page'], true);                     
                    break;  
            }
                        
            echo $output;               
                   
        }else{
            // GET METHOD    
        
            switch($_GET['method']){
                case 'updateshortlinks':                                                              
                    $results = $productAdminController->updateAllShortLinks();   
                    print_r($results);    
                    break;                        
                case 'deleteunwanted':                    
                    $productAdminController->deleteUnwantedProducts();                           
                    break;                    
                case 'getnonliveproducts' && isset($_GET['page']):             
                    $results = $productAdminController->getNonLiveProducts($_GET['page'], 50);   
                    print_r( json_encode($results) );
                    break;                
                case 'getbrowsepages':                                          
                    $productAdminController->getBrowsePages();   
                    break;                
                case 'getlinks':                                          
                    echo $productAdminController->getSpiderLinks();    
                    break;                
                case 'removeuncategorized':
                    echo $productAdminController->removeUncategorizedProducts();  
                    break;                                  
                case 'getproductdetailstatus':
                    echo $productAdminController->getProductDetailCount();  
                    break;                  
                case 'storeproductcount':
                    echo $productAdminController->getStoreProductCount(true); 
                    break;                   
                case 'storenonliveproductcount':
                    echo $productAdminController->getStoreProductCount(false); 
                    break;                   
                case 'getspiderstats':
                    echo $productAdminController->getSpiderStats();    
                    break;                     
                case 'iselastichealthy':
                    $elasticDao = new ElasticDao();
                    $isElasticHealthy = $elasticDao->isHealthy();
                    echo $isElasticHealthy ? "healthy" : "sick";
                    break;                        
            }
        }   
    }
    
    /************************
    ***  EMAIL CONTROLLER ***
    *************************/
    public static function Email(){  
        $_POST['router'] = "sent from router";
        require_once(dirname(__FILE__) . '/../app/email.php');   
    
        if ($_SERVER['REQUEST_METHOD'] == 'POST'){   
            switch($_GET['method']){
                case 'contact':                               
                    $success = EmailController::sendContactForm($_POST['n'], $_POST['i'], $_POST['e'], $_POST['s'], $_POST['m']);
                    print_r($success);
                    break;  
                case 'share':
                    $success = EmailController::shareProduct($_POST['to'], $_POST['username'], $_POST['message'], $_POST['link'], $_POST['product'], $_POST['store']);
                    print_r($success);
                    break;    
            }      
        }
    }
    
    /************************
    ***  STATS CONTROLLER ***
    *************************/
    public static function Stats(){  
        require_once(dirname(__FILE__) . '/../app/Controller/StatsController.php');   
    
        if ($_SERVER['REQUEST_METHOD'] == 'POST'){   
            switch($_GET['method']){
                case 'social':                               
                    $closet = isset($_POST['closet']) ? $_POST['closet'] : null;
                    $sku = isset($_POST['id']) ? $_POST['id'] : null;
                    $success = StatsController::add("Shared", $_POST['site'], $closet, $sku);
                    print_r($success);
                    break;
                case 'shopit':                               
                    $success = StatsController::addItemAction("Visited Store", $_POST['id']);
                    print_r($success);
                    break;    
            }      
        }
    }
}

Router::init();
?>
