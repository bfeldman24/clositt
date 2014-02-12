<?php 
require_once(dirname(__FILE__) . '/app/session.php'); 
require_once(dirname(__FILE__) . '/app/Controller/ProductController.php');


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
    background: none repeat scroll 0 0 #E6E6E6;
    min-height: 1150px;
}

#product-page-content {
    background: none repeat scroll 0 0 #FFFFFF;
    font-family: 'Roboto',sans-serif;
    height: 400px;
    left: 200px;
    padding: 20px;
    position: relative;
    text-align: center;
    top: 110px;
    width: 900px;
}

.productPageComments .product-comments .review-form, .productPageComments .product-comments ul.review-comments {
    background: none repeat scroll 0 0 #E6E6E6 !important;
    border-left: 5px solid #E6E6E6;
    border-right: 5px solid #E6E6E6;
}

.productPageComments {
    background: none repeat scroll 0 0 rgba(0, 0, 0, 0);
    border: medium none;
    min-height: 500px;
    position: relative;
}

.productPageComments {
    cursor: default;
}

.review-float {
    position: relative;
}

.productPageComments ul.review-comments {
    border-bottom: 5px solid #E6E6E6;
}

#similar{
    margin-left: 45px;  
    position: absolute;
    top: 200px; 
}

.similar-item{
    margin-bottom: 20px;
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

<a href='../' class="btn btn-success" style="border-radius: 40px; left: 35px; position: absolute; top: 110px; width: 110px;">See What Else <br> is Trending on Clositt</a> 
     
<div id="product-page-content" style="">
     <div class="productPageContainer item" pid="<?= $product->s ?>">
				<div class="productPageTop">				
				    <div class="productPageImage picture">				
				        <a class="productPagePicture" target="_blank" href="<?= $product->l ?>">
				            <img src="<?= $product->i ?>" onerror="return pagePresenter.handleImageNotFound(this)" />	
				        </a>
    				</div>
    				
    				<div class="productPageContent">
        				<div class="productPageDesc">
        				    				
        				    <div class="productPageName"><?= $product->n ?></div>
            				
            				<div class="productPagePrice"><?= $product->p ?></div>
            				
            				<div class="productPageStore"><?= $product->o ?></div>
        				</div>
        				
        				<div class="productPageActions">
        				    				
        				    <a class="productPageBuyLink" target="_blank" href="<?= $product->l ?>"><div class="productPageBuy"><img src="/css/images/cart-empty.png" /><span>SHOP IT</span><br><span class="productPageBuySiteName">on <?= $shortLink ?></span>				
            				</div></a>
            				
            				<div class="productPageClositt"><img class="productPageHanger" src="/css/images/hanger-icon.png" /> <span>CLOSITT</span>
            				    <div class="addToClosetForm" style="display:none;"></div>
            				</div>
            				
            				<div class="productPageTagitt"><img src="/css/images/price-tag.png" /> <span>TAGITT</span>	   
            				    <div class="addTagForm" style="display:none;"></div>         				    
            				</div>
        				</div>
        			</div>
				</div>
				
				<div class="productPageMiddle">				
				    <div class="productPageRating">
				        <span class="review-average-stars"></span>
				        <span class="review-average"></span>
    				</div>
    				
    				<div class="productPageOptions">				
    				</div>
				</div>
				
				<div class="productPageBottom">
				    <div class="productPageSwatches">				
    				</div>				    				    				
    				
    				<div class="productPageClosittCount"><img class="productPageHanger" src="/css/images/hanger-icon.png" /> <?= $product->cc ?>				
    				</div>
				</div>				
				
				<div class="productPageComments">
				    <div class="product-comments"></div>
				</div>
			</div>			
</div>						       

<div id="similar">
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

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">

$(document).ready(function(){   
    pagePresenter.enableLazyLoading = false;    
    pagePresenter.init();	
    productPagePresenter.init();	
    reviewsPresenter.init();
    gridEvents.init();    
    reviewsPresenter.populateProductPageReview($("#product-page-content"), "<?= $product->s ?>");
});

function loggedIn(){
	closetFormPresenter.getClosetInfo();
}

</script>

</body>
</html>
