<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../app/session.php'); 
require_once(dirname(__FILE__) . '/../app/Controller/ProductController.php');

if(!isset($productPage)){
    $productPage = false;    
    $columnSize = '';
}else{
    $columnSize = "col-sm-8 col-md-9";   
}

if (isset($_GET['s'])){
    
    if (!isset($product) || $product == null){
        $productController = new ProductController();
        
        //echo "Method: " . $_GET['method'];                
        //echo "<br>Param: " . $_GET['paramA'];      
        //echo "<br>Criteria: " . print_r($_POST, true);                
            
        $productJson = $productController->getProduct($_GET['s']);        
        $productData = json_decode($productJson);      
        
        if (!isset($productData) || !isset($productData->product) || 
            !isset($productData->product->s) || !isset($productData->product->i) || !isset($productData->product->l)){
            ?>
            
            <section id="product">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12 <?php echo $columnSize; ?>">
                            <p class="log">Sorry! It looks like that product no longer exists!</p>
                        </div>
                    </div>
                    <br />
                </div>        
            </div>
            
            <?php
            exit(1);
        } 
        
        $product = $productData->product;
    }
    
    if (false && (!isset($product->dp) || !$product->dp)){
        echo "Getting details";
        // Get Product Details   
        include(dirname(__FILE__) . '/../app/Controller/ProductDetailController.php');
    } 
    
    if ($productPage === true){
        // Similar products
        $similarProducts = $productController->getSimilarProducts($_GET['s'], 2, true);  
    }
    
    // Historical Prices
    $chartCategories = '';
    $chartValues = '';
    if(isset($productData->historicalPrices) && isset($productData->historicalPrices->dates)){
        $historicalDates = $productData->historicalPrices->dates;        
        foreach ($historicalDates as $date) {
            if ($chartCategories != ''){
                $chartCategories .= ",";    
            }
            
            $chartCategories .= "'" . $date . "'";
        }
        
        $historicalPrices = $productData->historicalPrices->prices;        
        foreach ($historicalPrices as $price) {
            if ($chartValues != ''){
                $chartValues .= ",";    
            }
            
            $chartValues .= $price;
        }   
    }
    
    // Get the abbreviatedLink
    $abbreviatedLink = substr($product->l, 0, strpos($product->l, ".com") + 4);
        
    if (strpos($abbreviatedLink, "://") !== false){
        $abbreviatedLink = substr($abbreviatedLink, strpos($abbreviatedLink, "://") + 3);
    }
    
    if (strpos($abbreviatedLink, "www.") !== false){
        $abbreviatedLink = substr($abbreviatedLink, strpos($abbreviatedLink, "www.") + 4);

    }else if (strpos($abbreviatedLink, "www1.") !== false){
        $abbreviatedLink = substr($abbreviatedLink, strpos($abbreviatedLink, "www1.") + 5);
    }
    
    // Get the product page links        
    $home = 'http://www.clositt.com/'; // DELETE THIS AND JUST ADD HOME_PAGE
    $productPageLink = rawurlencode($home . "!/" . $product->sl);
    $productPageImgLink = rawurlencode($product->i);
    $productPageDescription = rawurlencode("Found on Clositt.com");
    
}else{
    echo "Missing Data! ";           
    exit(1);
} 

?>	

<?php if (!isset($productPage) || !$productPage){ ?>
<button type="button" class="close modal_close" data-dismiss="modal"><span class="icon-times close-modal" aria-hidden="true"></span></button>
<?php } ?>

<section id="product" class="item outfit" pid="<?php echo $product->s; ?>">
    <div class="container">
        <div class="row">
            <div class="col-xs-12 <?php echo $columnSize; ?>">
                <div class="row">
                    <div class="col-xs-12 col-md-6">
                        <div class="show_product">
                            <div class="imagewrap">
                                <img id="mainProductImage" src="<?php echo $product->i; ?>">
                                <div class="product-avail">
                                    <a class="prod-type"><i class="icon-svg20"></i></a>
                                    <a class="quantity"><?php echo $product->cc; ?></a> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <div class="price_detail pull-left">
                            <h4><?php echo $product->n; ?></h4>
                            <div class="product-category clearfix">
                                <p><?php echo $product->o; ?></p>
                            </div>
                            <h1>Price: <span>$<?php echo $product->p; ?></span></h1>
                            <div class="size-color row">
                                <div class="size pull-left col-xs-7">
                                <?php 
                                    $sizes = $productData->sizes;
                                    $active = ' class="active"';
                                    if (isset($sizes)){
                                        foreach ($sizes as $size) {
                                            echo '<a'.$active.'>'.$size.'</a>';
                                            $active = '';
                                        }
                                    }
                                ?>
                                </div>
                                <div class="color pull-right col-xs-5">
                                    <h2 class="pull-left">Color</h2>
                                    <div class="pull-right">
                                    <?php 
                                        $colors = $product->co;
                                        if (isset($colors)){
                                            foreach ($colors as $hex) {
                                                echo '<a style="background: none repeat scroll 0 0 #'.$hex.';"></a>';
                                            }
                                        }
                                    ?>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <?php /* ?>
                            <div class="text">
                                <p> Detail Section </p>
                            </div>
                            <?php */ ?>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-md-6">
                        <div class="add-clositt addToClosittDropdown">
                            <a class="add-btn pull-left dropdown-toggle" data-toggle="dropdown">
                                <i class="icon-svg20"></i>Add to Clositt
                            </a>                             
                        
                            <div class="dropdown-menu create_new" role="menu">
                                <input class="pull-left addNewClosetInput" type="text" placeholder="Create New Clositt" />
                                <a class="create pull-right submitNewCloset"><i class="icon-plus"></i></a>
                                <div class="clear"></div>
                                
                                <div class="my_opt addToClosetOptions"></div>                            
                            </div>
                            
                            <a class="shop-btn pull-right" href="<?php echo $product->l; ?>">
                                <i class=" icomoon-basket-2"></i>Shop it on
                                <br />
                                <span><?php echo $abbreviatedLink ?></span> 
                            </a>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-6 clearfix">
                        <div class="likewrap pull-right social-btns">
                            <a class="socialbtn" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $productPageLink; ?>">
                                <i class="icon-svg17"></i>
                            </a>
                            <a class="socialbtn" target="_blank" href="https://twitter.com/share?url=<?php echo $productPageLink; ?>">
                                <i class="icon-svg16"></i>
                            </a>
                            <a class="socialbtn" target="_blank" href="https://plus.google.com/share?url=<?php echo $productPageLink; ?>">
                                <i class="icon-svg14"></i>
                            </a>
                            <a class="socialbtn" target="_blank" href="http://pinterest.com/pin/create/button/?url=<?php echo $productPageLink; ?>&media=<?php echo $productPageImgLink; ?>&description=<?php echo $productPageDescription; ?>">
                                <i class="icon-svg18"></i>
                            </a>
                            <a class="socialbtn email-product" target="_blank" href="#" data-url="<?php echo $product->sl; ?>">
                                <i class="icomoon-envelop"></i>
                            </a>                             		        		            
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-md-6">
                        <div class="product-slider <?php if (!isset($productData->swatches)){ echo 'hide'; } ?>" >
                        <?php 
                            $swatches = $productData->swatches;                                
                            if (isset($swatches) && count($swatches) > 0){
                                    echo '<div class="slidewrap"><a><img src="'. $product->i .'"/><i class="icon-search-plus"></i></a></div>';
                                foreach ($swatches as $image) {
                                    echo '<div class="slidewrap"><a><img src="'.$image.'"/><i class="icon-search-plus"></i></a></div>';                                
                                }
                            }
                        ?>                        
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-6">
                        <div class="price-chat <?php if (!isset($productData->historicalPrices)){ echo 'hide'; } ?>">
                            <h2><i class="icon-bar-chart-o"></i>Price Trends</h2>
                            <div id="chart-container" style="min-width: 200px; height: 160px; margin: 0 auto;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <?php if (isset($similarProducts)){ ?>
            <div class="col-xs-12 col-sm-4 col-md-3">
                <h2 class="recommended">Recommended Products</h2>
                <div class="items" class="row">
                    <?php echo $similarProducts; ?>                                                
                </div>
            </div>
            <?php } ?>
        </div>
    </div>
</section>          
       
<script type="text/javascript">

function loadChart(){ 
        
    $('#chart-container').highcharts({
        chart: {
            height: 160,
            width: $("#chart-container").width(),
            type: 'line'
        },        
        title: {
            text: ''
        },
		credits: {
            enabled: false
        },   
        xAxis: {
            categories: [<?php echo $chartCategories; ?>]
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return '$' + this.value;
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        colors: ['#67ccff', '#f455a6'],
        tooltip: {
            valuePrefix: '$',
			backgroundColor: 'rgba(0,0,0,0.75)',
			borderColor: 'rgba(0,0,0,0.75)',
			style: {
                padding: 10,
                color: '#fff'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
			enabled: false
			
        },
		exporting: {
            enabled: false
        },
        series: [{
            name: 'Price was',
            data: [<?php echo $chartValues; ?>]
        }]
    });
}

$(document).ready(function(){       
    pagePresenter.init();	
    productPagePresenter.init();	
    socialPresenter.init();
    //reviewsPresenter.init(); 
    //reviewsPresenter.populateProductPageReview($("#product-page-content"), "<?php echo $product->s ?>");      
    
    $(document).on("click", ".slidewrap>a", function(e){
        
        var $clickedImg = $(e.currentTarget).find("img").first();                      
        
        if ($clickedImg.length > 0){
            var clickedImgSrc = $clickedImg.attr("src");
            
//            var mainImgSrc = $("#mainProductImage").first().attr("src");
            $("#mainProductImage").first().attr("src", clickedImgSrc);
//            $clickedImg.attr("src", mainImgSrc);
            
            <?php if ($productPage === true){ ?>    
                pagePresenter.scrollTo($("#mainProductImage").position().top);        
            <?php } ?>
        }
    });
    
    <?php if ($productPage === true){ ?>
        $("title").first().text("<?php echo $product->o . ": " . $product->n; ?>. Found on Clositt.com. ");
        $('meta[property="og:image"]').attr("content","<?php echo $product->i; ?>");
        $('meta[property="og:image:secure_url"]').attr("content","<?php echo $product->i; ?>");
        $('meta[name="twitter:image:src"]').attr("content","<?php echo $product->i; ?>");        
    <?php } ?>
    
    if ($("#productModal .product-slider .slidewrap").length > 0){
         setTimeout(function () {
            $('#productModal .product-slider').owlCarousel({
                loop: false,
                margin: 16,
                responsiveClass: true,
                items: $("#productModal .product-slider .slidewrap").length,
                nav: true				
        	});    	 
    	}, 1000);   	    	
    }
        
    setTimeout(function () {
        loadChart();
    }, 1000); 

});

function loggedIn(){
	closetFormPresenter.getClosetInfo();
} 

</script>