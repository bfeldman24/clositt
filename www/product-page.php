<?php 
require_once(dirname(__FILE__) . '/../app/session.php'); 
require_once(dirname(__FILE__) . '/../app/Controller/ProductController.php');


$product = "Sorry we could not find the product that you were looking for!";
if (isset($_GET['s'])){
    $productController = new ProductController($mdb2);
    
    //echo "Method: " . $_GET['method'];                
    //echo "<br>Param: " . $_GET['paramA'];      
    //echo "<br>Criteria: " . print_r($_POST, true);                
        
    $product = $productController->getProduct($_GET['s']);        
    $product = json_decode($product);  
    
    $similarProducts = $productController->getSimilarProducts($_GET['s'], 4); 
    $similarProducts = json_decode($similarProducts);  
}
?>
<!DOCTYPE>
<html>
<head>
<title><?= $product->o ?>: <?= $product->n ?>. Found on Clositt.com</title>
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<style type="text/css">
body{
    background: none repeat scroll 0 0 #FAFAFA;
    min-height: 1150px;
}

h2 {
    font-size: 21px;
    font-weight: lighter;
    line-height: 40px;
    margin: 20px 0 0;
}

hr {
 margin: 4px 0;   
}

#product-page-content{
    margin-top: 75px;   
    margin-bottom: 75px;
}

#product-page-content .review-float{
    position: relative;
}

.productPageContainer{
    background-color: #FFFFFF;
    border: 1px solid #CBCBCB;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);           
    padding: 20px;
    min-height: 335px;
    margin-bottom: 20px;
}

.productPageActions{
    max-width: 300px;
}

.productPageActions .productPageBuy,.productPageActions .productPageClositt,.productPageActions .productPageTagitt{
        border: 1px solid #CBCBCB;   
}

.productPageContent{
    background: transparent;   
}

.productPageComments .product-comments .review-form, .productPageComments .product-comments ul.review-comments {
    background: none repeat scroll 0 0 #E6E6E6 !important;
    border-left: 5px solid #E6E6E6;
    border-right: 5px solid #E6E6E6;
}

.productPageComments {
    background: none repeat scroll 0 0 rgba(0, 0, 0, 0);
    border: medium none;
}

.productPageComments {
    cursor: default; 
    margin: 20px -26px -32px;
}

.productPageComments .review-form {
    width: 100%;    
}

.productPageComments ul.review-comments {
    width: 100%;
}

.productPageComments .review-float {    
    border-left: 1px solid #CBCBCB;
    border-bottom: 1px solid #CBCBCB;
    border-right: 1px solid #CBCBCB;
}

.productPageComments .product-comments .review-rating {
    left: auto;
}

.productPageClosittCount {
    margin-top: -40px;
    position: relative;
    right: 0;
    text-align: right;
}

.productPageComments ul.review-comments {
    border-bottom: 5px solid #E6E6E6;
}

#similar{
    margin: 0 auto;
    text-align: center;
}

.similar-item{
    display: inline-block;
    margin: 5px;
    vertical-align: top;
    width: 120px;      
}

.similar-item .title{
    margin-top:5px;   
    font-size: 12px;
    line-height: 15px;  
    text-align: center;         
}

.similar-item a{
    color: black;       
}

#brand-fixed-background {
    display: block;
}

.see-whats-trending, .see-whats-trending:hover, .see-whats-trending:active {
    color: inherit;
    text-decoration: none; 
    font-size: 25px;
    text-align: center;   
}

.see-whats-trending div{
    background: none repeat scroll 0 0 #FFFFFF;
    border: 1px solid #CBCBCB;
    height: 135px;
    line-height: 30px;
    margin-bottom: 5px;
    padding: 40px 10px 0;
    position: relative;    
}

.see-whats-trending div:hover{
    background: none repeat scroll 0 0 #F5F5F5;
</style>
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>	
    <?php         
        $shortLink = substr($product->l, 0, strpos($product->l, ".com") + 4);
        
        if (strpos($shortLink, "://") >= 0){
            $shortLink = substr($shortLink, strpos($shortLink, "://") + 3);
        }
        
        if (strpos($shortLink, "www.") >= 0){
            $shortLink = substr($shortLink, strpos($shortLink, "www.") + 4);

        }else if (strpos($shortLink, "www1.") >= 0){
            $shortLink = substr($shortLink, strpos($shortLink, "www1.") + 5);
        }
     ?>
     
<div id="product-page-content" class="row">
     <div class="productPageContainer item col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1" pid="<?= $product->s ?>">        
		<div class="productPageTop">				
		    <div class="row">
    		    <div class="productPageImage picture col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-0">				
    		        <a class="productPagePicture" target="_blank" href="<?= $product->l ?>">
    		            <img src="<?= $product->i ?>" onerror="return pagePresenter.handleImageNotFound(this)" />	
    		        </a>
    			</div>
			
			<div class="productPageContent col-xs-10 col-sm-4">
				<div class="productPageDesc">
				    <br />				
				    <div class="productPageName"><?= $product->n ?></div>
    				
    				<div class="productPagePrice"><?= $product->p ?></div>
    				
    				<div class="productPageStore"><?= $product->o ?></div>
				</div>        				        				
			</div>
			</div>
		</div>
		
		<div class="productPageMiddle ">		
		    <?php /*		
		    <div class="productPageRating">
		        <span class="review-average-stars"></span>
		        <span class="review-average"></span>
			</div>
			*/ ?>
			
			<div class="productPageClosittCount"><img class="productPageHanger" src="/css/images/hanger-icon.png" /> <?= $product->cc ?>				
			</div>
		</div>	      	
		
		<div class="productPageComments">
            <div class="product-comments"></div>
        </div>								
	</div>
			
    <div class="productPageActions col-xs-8 col-xs-offset-2 col-sm-3 col-sm-offset-1">
        	
        <a class="see-whats-trending" href='../' class="btn btn-success see-whats-trending">
    		<div>See What Else is Trending on Clositt</div>
		</a> 	
        				    				
	    <a class="productPageBuyLink" target="_blank" href="<?= $product->l ?>"><div class="productPageBuy"><img src="/css/images/cart-empty.png" /><span>SHOP IT</span><br><span class="productPageBuySiteName">on <?= $shortLink ?></span>				
		</div></a>
		
		<div class="productPageClositt"><img class="productPageHanger" src="/css/images/hanger-icon.png" /> <span>CLOSITT</span>
		    <div class="addToClosetForm" style="display:none;"></div>
		</div>
		
		<div class="productPageTagitt"><img src="/css/images/price-tag.png" /> <span>TAGITT</span>	   
		    <div class="addTagForm" style="display:none;"></div>         				    
		</div>			
		
		<div id="similar">
            <h2>Similar Products</h2>
            <hr />
            <div class="similarProducts">
                <?php 
                    foreach($similarProducts as $similarItem){ 
                ?>
                    <div class="similar-item">
                        <a href="<?= $similarItem->sl ?>"><img src="<?= $similarItem->i ?>" /></a>        
                        <div class="title"><a href="<?= $similarItem->sl ?>"><?= $similarItem->n ?></a></div>
                    </div>                  
                <?php  
                    }
                ?>
            </div>
        </div>	
	</div>							
</div>	
				       


<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">

$(document).ready(function(){   
    pagePresenter.enableLazyLoading = false;    
    pagePresenter.init();	
    productPagePresenter.init();	
    reviewsPresenter.init();
    tagPresenter.init();
    gridEvents.init();    
    reviewsPresenter.populateProductPageReview($("#product-page-content"), "<?= $product->s ?>");
});

function loggedIn(){
	closetFormPresenter.getClosetInfo();
}

</script>

</body>
</html>
