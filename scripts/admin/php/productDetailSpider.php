<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../../static/meta.php');   
?>
<style type="text/css">
body{
	font-size:16px;	
}

h4 {
    font-weight: bold;   
    display: inline-block;
    margin: 0;
}

#mainContent{
  padding: 20px 20px 150px;     
}

input{
	margin-right:5px !important;	
}

.actionButtons{
    background: linear-gradient(to bottom, #666666 0%, #111111 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
    bottom: 30px;
    padding: 7px 5px;
    position: fixed;
    width: 100%;}

#loadingMask{
    background: none repeat scroll 0 0 rgba(70, 70, 70, 0.8);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;   
} 

#loadingMask img, #transparentLoadingMask img{
    height: 50px;
    left: 48%;
    position: fixed;
    top: 48%;
    width: 50px;   
}

.modal-body {
    text-align: left;
}

.panel{
    padding: 10px;   
}

.size{
    margin: 0 5px;   
}

#detailCount{
    color:#999;
    font-size:12pt;   
}

#productDetailOutput > .panel{
    position: relative;
}

.productDisplayIndex{
    position: absolute;
    right: 5px;
}
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Product <i>Detail</i> Genie <span id="detailCount"></span></h2>    
    <hr>        
    <div id="productDetailOutput"></div>
</div>

<div class="actionButtons">
    <button onclick="clearPage()" class="btn btn-default btn-sm">Clear Page</button>
    <button onclick="productDetailSpider.getProducts()" class="btn btn-success btn-sm">Get All Product Details</button>
    <button onclick="productDetailSpider.testProducts()" class="btn btn-success btn-sm">Test Next Product Detail</button> 
    <button onclick="productDetailSpider.togglePause()" class="btn btn-success btn-sm">Pause After Batch</button>    
</div>

<div id="loadingMask" style="display:none;" >
    <img src="../../../css/images/loading.gif"/>
</div>
<div id="transparentLoadingMask" style="display:none;" >
    <img src="../../../css/images/loading.gif"/>
</div>

<?php include(dirname(__FILE__) . '/../../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script src="../js/productDetailApi.js"></script>
<script type="text/javascript">
/***************************************
* INITIALIZE FUNCTIONS
* 
* used for setting up the page and initializing the above functions
****************************************/
$(document).ready(function(){
    // Hide the feedback popup
    $(document).find(".feedback-maximize").hide('fade');
    $(document).find(".feedback-minimized").show('fade');                                       
    
    // Initialize the functions
    Messenger.debug = true;        
});

function clearPage(){
       $("#productDetailOutput").html("");
}
        

    var productDetailSpider = {
        showData: false,
        loop: true,
        limit: 10,
        products: null,
        index: 0,    
        totalIndex: 0,    
        
        init: function(){
            $.get( window.HOME_ROOT + "spider/getproductdetailstatus", function(data){
               var detailStatus = JSON.parse(data); 
               var scraped = detailStatus[0] == null ? 0 : detailStatus[0];
               var totalLiveProducts = detailStatus[1] == null ? 0 : detailStatus[1];
                              
               $("#detailCount").append(
                    $("<span>").attr("id","numberScraped").text(scraped)
               ).append(
                    $("<span>").text("/" + totalLiveProducts)
               );
               
               console.log(scraped + " scraped product details");
               console.log(totalLiveProducts + " total live products");
            }); 
        },
        
        getProducts: function(){   
            productDetailSpider.index = 0;
            productDetailSpider.products = null;                                    
                                                         
            $.post( window.HOME_ROOT + "spider/getnextproductdetailurls/" + productDetailSpider.limit, {stores: Object.keys(productDetailApi)}, function(data){
                productDetailSpider.products = JSON.parse(data);
                productDetailSpider.getProductDetails();
            });
        },
        
        testProducts: function(){
            var store = prompt("Please enter the store to test");

            if (store==null) {
                return;   
            }
            
            var stores = [];
            stores.push(store);
                                   
            productDetailSpider.index = 0;
            productDetailSpider.products = null;                                    
                                                         
            $.post( window.HOME_ROOT + "spider/getnextproductdetailurls/" + productDetailSpider.limit, {stores: stores}, function(data){
                productDetailSpider.products = JSON.parse(data);
                productDetailSpider.getProductDetails(productDetailSpider.handleProductDetails);
            });
        },
        
        getProductDetails: function(callback){            
            if (!callback){
                callback = productDetailSpider.saveProductDetails;  
            }
            
            if (productDetailSpider.products != null && 
                productDetailSpider.products.length > 0 && 
                productDetailSpider.index < productDetailSpider.products.length){
                        
                var item = productDetailSpider.products[productDetailSpider.index];
                productDetail.getDetails(item.o, item.s, item.l, callback);
            }else{
                Messenger.info("No more products");
            }
        },
        
        saveProductDetails: function(product){

            $.post( window.HOME_ROOT + "spider/saveproductdetails", product, function(data){
                if (data == "success"){
                    Messenger.success("Saved Product Details: " + product.sku); 
                    
                    var numberScraped = $("#numberScraped").text().trim();
                    numberScraped = parseInt(numberScraped) + 1;
                    $("#numberScraped").text(numberScraped);
                      
                    productDetailSpider.index++;
                    productDetailSpider.totalIndex++;
                    productDetailSpider.handleProductDetails(product);                                        
                    
                    if (productDetailSpider.index < productDetailSpider.products.length){
                        productDetailSpider.getProductDetails();
                    }else{
                        
                        if (productDetailSpider.loop){
                            productDetailSpider.getProducts();
                        }else{
                            Messenger.info("Finished saving product details");                                                   
                        }
                    }
                }else{
                    Messenger.error("Error Saving Product Details for: " + product.sku);   
                }
            });
        },
        
        handleProductDetails: function(product){
            var $productDiv = $("<div>");
            
            if (productDetailSpider.showData){                
                $productDiv.append( $("<pre>").text(JSON.stringify(product, null, "\t")))
                
            }else{
                $productDiv.addClass("panel panel-default").append(
                    $("<div>").addClass("productDisplayIndex").append(
                        $("<span>").addClass("label label-primary").text(productDetailSpider.totalIndex)
                    )
                ).append(
                    $("<div>").append($("<h4>").html("Sku:&nbsp;")).append( $("<a>").attr("href",product.url).text(product.sku))
                ).append(
                    $("<p>").html("<h4>Details:</h4> " + product.details)
                ).append(
                    $("<div>").html("<h4>Listed Price:</h4> " + (product.originalPrice == null || product.originalPrice == "" ? "None" : "$" + product.originalPrice))
                ).append(
                    $("<div>").html("<h4>Sale Price:</h4> $" + product.price)
                ).append(
                    $("<div>").html("<h4>Promotion/ Misc:</h4> " + product.promotion)
                ).append(
                    $("<div>").html("<h4>Shipping Promotion:</h4> " + product.PromotionTwo)
                );
                
                $colors = $("<ul>");
                if (product.colors != null && product.colors.length > 0){                    
                    product.colors.forEach(function(color){
                        $colors.append(
                            $("<li>").append( 
                                $("<a>").attr("href",color.url).text(color.name).append(
                                    $("<img>").attr("src",color.img)
                                )
                            )
                        );       
                    });                    
                }
                $productDiv.append( $("<h4>").text("Related Products:") ).append($colors);                
                
                $swatches = $("<div>");
                if (product.swatches != null && product.swatches.length > 0){                    
                    product.swatches.forEach(function(swatch){
                        $swatches.append(
                            $("<img>").attr("src",swatch).addClass("swatch")
                        );       
                    });
                }
                $productDiv.append( $("<h4>").text("Swatches:") ).append($swatches);
                
                
                $sizes = $("<span>");                
                if (product.sizes != null && product.sizes.length > 0){
                    product.sizes.forEach(function(size){
                        $sizes.append(
                            $("<span>").addClass("label label-default").text(size)
                        );       
                    });
                }else{
                    $sizes.append(
                        $("<span>").addClass("label label-default size").text("No Sizes")
                    );
                }
                $productDiv.append( $("<h4>").text("Sizes:") ).append($sizes);
            }
            
            $("#productDetailOutput").prepend( $productDiv );
        },
        
        togglePause: function(e){
            if ($(e.currentTarget).hasClass("active")){
                $(e.currentTarget).removeClass("active")
                productDetailSpider.loop = false;       
            }else{
                $(e.currentTarget).addClass("active")
                productDetailSpider.loop = true;       
            }   
        }        
    };
    
    productDetailSpider.init();
</script>
</body>
</html>
