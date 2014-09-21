<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   

?>
<style type="text/css">
body{
	font-size:16px;	
}

#mainContent{
  padding: 20px;      
}

#sample-grid .picture {
    border: 1px solid #CBCBCB;
    height: 270px;
    max-height: 400px;
    max-width: 300px;
    overflow: hidden;
    width: 200px;
}

.overlay{
    display: block;   
}

.overlay .middle{
    background: none repeat scroll 0 0 rgba(239, 239, 239, 0.8);
    overflow: hidden;
    position: absolute;
    top: 100px;
    width: 198px;   
}

.overlay > .bottom { 
    width: 198px;
}

.overlay > .bottom, .overlay > .topleft, .overlay > .topright { 
    left: 16px;
}


</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Dynamic Product Genie</h2> 
    <ul>
        <li><a href="http://www.freepeople.com/clothes-dresses/">http://www.freepeople.com/clothes-dresses/</a></li>
    </ul>
    <hr>
    
    <div id="sample-grid-container"><div id="sample-grid" class="row"></div></div>
    <div id="website"></div>
</div>

<!--
<div class="actionButtons">
    <a href="#addCategoryForm" style="float: right; margin-right: 10px;"><button class="btn btn-danger btn-small">Upload Form</button></a>
    <a href="#top" style="float: right; margin-right: 10px;"><button class="btn btn-danger btn-small">Top</button></a>
    <button id="selectall" class="btn btn-default btn-sm">Select All</button>
    <button id="deselectall" class="btn btn-default btn-sm">Deselect All</button>
    <button onclick="spider.testProductsFromLinks()" class="btn btn-primary btn-sm">Test Category</button>
    <button onclick="spider.testProductsFromLinks(false, true, false)" class="btn btn-primary btn-sm" tooltip="(1 store at a time)">View Sample Products</button>    
    <button onclick="actionButtons.getTotalProductCount()" class="btn btn-info btn-sm">Get Total Product Count</button>
    <button onclick="spider.testProductsFromLinks(false, false, true)" class="btn btn-success btn-sm">Save Selected</button>
    <button onclick="actionButtons.saveAll()" class="btn btn-success btn-sm">Save All</button>                
</div>
-->
<div id="loadingMask" style="display:none;" >
    <img src="../../css/images/loading.gif"/>
</div>
<div id="transparentLoadingMask" style="display:none;" >
    <img src="../../css/images/loading.gif"/>
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script src="../js/storeApi.js"></script>
<script src="../js/productSpider.js"></script>
<script type="text/javascript">
/*
javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.feld24.info/closetta/genericProductPageScraper.js';})();
*/

function scrape(data){
    
/* Add JQuery if needed */
if (typeof $ != "function"){
    var jq = document.createElement('script');
    jq.src = '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';
    document.documentElement.appendChild(jq);   
}

/* Clear */
$(data).find(".debugColor, .debugPrice").css("border","none");
$(data).find("[closestCommonParentCount]").each(function(){
    $(this).removeAttr("closestCommonParentCount"); 
});

/* Global Filter */
var imageFilter = function(){
   return $(this).attr("src") != null &&
          $(this).is(":visible") &&
          $(this).css("visibility") != "hidden" &&
          $(this).css("opacity") != 0 &&
          $(this).width() > 100 &&
          $(this).height() > 100; 
};

var imageLargeSwatchFilter = function(){
    return $(this).attr("src") != null &&
           $(this).is(":visible") &&
           $(this).width() > 100 &&
           $(this).height() > 100;  
};

var imageSwatchFilter = function(){
    return $(this).is(":visible") && 
           $(this).parents("a").length > 0 && 
           $(this).siblings("img").length <= 0 && 
           $(this).find("img").length <= 0 && 
           $(this).width() > 10 &&
           $(this).width() <= 100 &&
           $(this).height() > 10 &&
           $(this).height() <= 100;  
};

/* Functions */
function getAbsoluteUrl(url, siteRoot){
    if (url != null && 
        url.indexOf("//") < 0 && 
        url.indexOf("http") < 0 && 
        url.indexOf("www.") < 0 && 
        url.indexOf(".com") < 0 && 
        url.indexOf(".net") < 0){
    
        if (url.indexOf("/") != 0){
            url = "/" + url;   
        }        
        
        url = siteRoot + url;
    } 
    
    return url;
}

function validateProduct(product){        
    var isValid = false;
                    	        
    if (product != null &&
        product.prices != null && 
        product.image != null && 
        product.link != null && 
        product.titles != null ){
        //product.sku != null){				 
            
            return true;
            
            /*
            var price = product.price + "";
            price = parseFloat(price.replace("$",""));
	        price = parseFloat(price);
	        
	        if(isNaN(price)){       				        
		        console.log("Product ("+i+") price is not a number");           			            
	        
	        }else if(price < 3){
	          console.log("Product ("+i+") price seems too small");           			            
	        
	        }else if(price > 20000){
	          console.log("Product ("+i+") price seems too large");           			            
	            
	        }else{       			          
	            return true;	                				               				        
	        }
	        */
    }else{                                
        if (product == null){
            console.log("Product ("+i+") is null");    
            
        }else{
        
            if (product.prices == null){
                console.log("Product ("+i+") price is null");    
            }
            
            if (product.image == null){
                console.log("Product ("+i+") image is null");    
            }
            
            if (product.link == null){
                console.log("Product ("+i+") link is null");    
            }
            
            if (product.titles == null){
                console.log("Product ("+i+") name is null");    
            }
            
            if (product.sku == null){
                //console.log("Product ("+i+") sku is null");    
            }    
        }                    				                
    }

    return false;
} 


function getProductData(el, siteRoot){
    var product = {};
    
    var image = $(el).find("img").filter(imageFilter);
    product.image = image.attr("src");
    product.link = image.parents("a").first().attr("href");
    
    product.swatches = [];
    $(el).find("img").filter(imageLargeSwatchFilter).each(function(){
        product.swatches.push($(this).attr("src")); 
    });  
    
    $(el).find("img").filter(imageSwatchFilter).each(function(){
       product.swatches.push($(this).attr("src")); 
    });

    /* Name */
    var maxLetterCount = -1;
    var nameElement = $();
    
    $(el).clone().find("script").remove().end().find('a[href="'+product.link+'"]:visible').each(function(){
       var text = $(this).clone().find("*").remove().end().text().trim();
       
       if (text.length > 3 && text.length < 250){
            
            if (text.length > maxLetterCount){
                maxLetterCount = text.length;
                product.name = text.trim();
                nameElement = $(this);   
            }
       } 
    });
    
    if (product.name == null){
        $(el).clone().find("script").remove().end().find('a:visible').each(function(){
            var text = $(this).clone().find("*").remove().end().text().trim();
            
            if (text.length > 3 && text.length < 250){
            
                if (text.length > maxLetterCount){
                    maxLetterCount = text.length;
                    product.name = text.trim();
                    nameElement = $(this);   
                }
           } 
        });   
    }
    
    if (product.link == null){
        
        if (nameElement.length > 0 && nameElement.attr("href") != null){
            product.link = nameElement.attr("href");               
        
        }else if(nameElement.length > 0 && nameElement.parents("a").length > 0){
            product.link = nameElement.parents("a").first().attr("href");
               
        }else{
            $(el).clone().find("script").remove().end().find("a").each(function(){
                
                if ($(this).attr("href").indexOf("/") == 0 ||
                    $(this).attr("href").indexOf("http") == 0 || 
                    $(this).attr("href").indexOf("www") == 0){
                     
                        product.link = $(this).attr("href");
                        return false;   
                    }
            });   
        }   
    }
    
    /* Titles */
    product.titles = [];
    product.swatchTitles = [];
    if (image.attr("alt") != null && image.attr("alt") != ""){
        product.titles.push(image.attr("alt"));   
    }
    
    if (image.attr("title") != null && image.attr("title") != ""){
        product.titles.push(image.attr("title"));   
    }
    
    $(el).find("a[title]").each(function(){
        product.swatchTitles.push($(this).attr("title")); 
    });
    
    /* Prices */
    product.prices = [];
    
    $(el).find("*").each(function(){
       var priceText = $(this).clone().children().remove().end().find("scripts").remove().end().text().trim();
       
       if (priceText == "$"){
            priceText = $(this).parent().clone().find("scripts").remove().end().text().trim();
       } 
       
       if (priceText.indexOf("$") >= 0){
            priceText = priceText.trim().replace(/[^\d\.]/g, ' ').trim();
            priceText = priceText.replace(/\s+/g, ' ').trim();
            var prices = priceText.split(' ');
            
            for(var p in prices){
                var priceFloat = parseFloat(prices[p]);
                
                if (!isNaN(priceFloat) && prices.indexOf(priceFloat) < 0){
                    product.prices.push(priceFloat);
                    $(this).addClass("debugPrice");   
                }   
            }
       }
    });
    
    if (product.prices.length <= 0){
        $(el).find("*").each(function(){
            var priceText = $(this).clone().children().remove().end().text();
            
            if (priceText == "$"){
                priceText = $(this).parent().clone().find("scripts").remove().end().text().trim();
                
                priceText = priceText.replace(/[^\d\.]/g, ' ').trim();
                priceText = priceText.replace(/\s+/g, ' ').trim();
                var prices = priceText.split(' ');  
                
                for(var p in prices){
                    var priceFloat = parseFloat(prices[p]);
                    
                    if (!isNaN(priceFloat) && prices.indexOf(priceFloat) < 0){
                        product.prices.push(priceFloat);
                        $(this).addClass("debugPrice");   
                    }   
                }
                
                return false; 
            } 
        });   
    }
    
    /** Enrich Data **/
    
    
    /* Get absolute url */
    product.image = getAbsoluteUrl(product.image, siteRoot);
    product.link = getAbsoluteUrl(product.link, siteRoot);
    
    /* Color Elements for debugging and verification */
    image.addClass("debugColor").css("border","3px solid blue");
    nameElement.addClass("debugColor").css("border","3px solid orange");
    $(data).find(".debugPrice").css("border","3px solid green");
    
    return product;           
}

function getProducts(items, products, siteRoot){
    products.each(function(){
        var product = getProductData(this, siteRoot);
        
        if (validateProduct(product)){
            items.push(product);
            $(this).addClass("debugColor").css("border","3px solid black");   
        }  
    });   
}



/**********
    Start of Script
**********/
    var i = $(data).find("img").filter(imageFilter);
    
    /* count the number of repeated closest common parents */
    for (var n=1; n < i.length; n++){
        var closestCommonParent = $(data).find(i[n-1]).parents().has(i[n]).first();
        var count = closestCommonParent.attr("closestCommonParentCount");
        count = count == null ? 0 : parseInt(count);
        closestCommonParent.attr("closestCommonParentCount",count + 1);
    }    
    
    /* get the closest common parent that was found the most */
    var listing = $();
    var maxCount = -1;
    
    $(data).find("[closestCommonParentCount]").each(function(){
        var count = $(this).attr("closestCommonParentCount");
        
        if (!isNaN(count) && parseInt(count) > maxCount){
            maxCount = parseInt(count);
            listing = $(this);   
        } 
    });
    
    /* Get the first individual product */
    while (listing.find("img").filter(imageFilter).length > 1){
        
        var child = null;
        
        listing.children().has("img").each(function(){
            if ($(this).find("img").filter(imageFilter).length > 0){
                child = $(this);
                return false;   
            } 
        });   
        
        if (child == null){
            break;   
        }
        
        listing = child;
    }
    
    /* Get the common class name between siblings */
    var classNames = {};
    
    var classes = listing[0].className.split(" ");
    for (var k in classes){
        classNames[classes[k]] = 1;   
    }
    
    var maxClassCount = -1;
    var productClass = listing.tagName;
    
    listing.siblings().each(function(){
        
        if ($(this)[0].className != ""){
            classes = $(this)[0].className.split(" ");
            
            for (var k in classes){
                if (classes[k] != null && typeof classes[k] != "function"){
                    if (classNames[classes[k]] == undefined){
                        classNames[classes[k]] = 1;   
                    }else{
                        classNames[classes[k]] = classNames[classes[k]] + 1;   
                    }   
                    
                    if (classNames[classes[k]] > maxClassCount){
                        maxClassCount = classNames[classes[k]];
                        productClass = classes[k];                       
    
                    }else if(classNames[classes[k]] == maxClassCount){
                        if (classes[k].toLowerCase().indexOf("prod") >= 0 ||
                            classes[k].toLowerCase().indexOf("item") >= 0){
                                
                                maxClassCount = classNames[classes[k]];
                                productClass = classes[k];       
                            }   
                    }
                }   
            }   
        } 
    });
    
    
    /* Get Product Data */
    var items = [];
    var productSelector = $(data).find("." + productClass);
    var siteRoot = location.protocol + "//" + location.host; /* Will need to change when not using as bookmarklet */    
    getProducts(items, productSelector, siteRoot);
    console.log(items[0]);
    console.log(items.length);
    
    /* Clear debugging */
    setTimeout(function(){
        $(data).find(".debugColor, .debugPrice").css("border","none");
        $(data).find("[closestCommonParentCount]").each(function(){
            $(this).removeAttr("closestCommonParentCount"); 
        });
    }, 3000);


    return items;
}















/*


// Get cateories from homepage
var dictionary = ['shirt','pant','dresses','polo','knit','suit','blazer','coat','sweater','vest','sleepwear','swimwear', 'loungewear', 'outerwear', 'shorts', 'blouse', 'jacket', 'skirt', 'petities', 'trouser'];
var l = [];

$("body").prepend(
    $("<ul>").addClass("testList");
);

var category = new RegExp(dictionary.join("|"));

$("a").each(function(){
    var url = $(this).attr("href");
    var short = url.toLowerCase().replace(location.host, '');
    
    if (short.indexOf("javascript") < 0 && category.test(shotr)){   
        l.push(url);
        $(".testList").append(
            $("<li>").append(
                $("<a>").attr("href", url).text(url)
            )
        );
    }
});

l










// Get listing className
$("a").removeAttr("href");
$("a").removeAttr("onclick");
$(document).off("click");
$(document).on("click", "div,li,article", function(){
    e.stopPropagation();
    var c = $(this).attr("class").split(" " );
    console.log©;
    
    $("." + c[0]).css("border","3px solid blue");
    alert("." + c[0]);
    
    setTimeout(function(){
            $("." + c[0]).css("border","none");
    }, 3000);
});
*/













$(document).on("click","a", function(e){
    fetchProducts($(e.currentTarget).attr("href"));
});


function fetchProducts(url){
    $.post("webProxy.php", {u:url}, function(result){	
        
        if (result == null || result.trim() == ""){
			 console.log("webProxy returned nothing. Make sure the URL is correct and does not redirect.");    		
	         Messenger.error("Error: Could not read the product page. Check to make sure this link is still active.");	         
	         		        
	    }else{       			         								
			
			try{
			    // Get Product Data			    
			    $("#website").html(result);
			    var items = scrape($("#website"));
			    $("#website").html('');    			    			   
			    $("#website").append(
			         $("<pre>").text(JSON.stringify(items, null, "\t"))
			    );
			    
			    
			}catch(err){
			    // do nothing
			    console.log("Whoops ran into a problem: " + err);				    				    
			}
	    }
    });
}


</script>
</body>
</html>