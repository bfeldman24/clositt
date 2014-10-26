<!DOCTYPE>
<html>
<head>
<title>Search Admin</title>

<?php 
require_once(dirname(__FILE__) . '/../../../app/session.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
?>

<style type="text/css">
body{
	font-size:16px;	
}

#mainContent{
  padding: 20px;      
}

#seach-bar-icon {
    cursor: pointer;
    display: block;
    height: auto;
    left: auto;
    padding: 5px 10px;
    position: relative;
    top: auto;
    width: 100%;
    z-index: 10;
}

#gototop{
    bottom: 10px;
    position: fixed;
    right: 10px;
    z-index: 9999;   
}

#clear{
    bottom: 10px;
    position: fixed;
    left: 10px;
    z-index: 9999;      
}

.viewlink {
    background: none repeat scroll 0 0 #f5f5f5;
    height: 75px;
    opacity: 0.7;
    overflow: hidden;
    position: absolute;
    top: 15%;
    width: 100%;
    text-align: center;
}

.items .item .detail h4 {
    height: auto;
}

.bottom {
    background: none repeat scroll 0 0 #f0f0f0;
    font-size: 14px;
    line-height: 1.3em;
    padding: 5px;
}
</style>

</head>
<body>
<div id="mainContent">
    <a href="#" name="top" id="top"></a>
    <br>
    <div class="row">
        <div class="col-xs-12 col-sm-8">
            <input type="text" class="form-control" id="search-bar"></input>
        </div>
        <div class="col-xs-12 col-sm-4">
            <div class="btn btn-success" id="seach-bar-icon">Search</div>
        </div>
    </div>

    <!-- search type-->
    <br/>
    <div class="row">
        <div class="col-xs-12 col-sm-2 form-group">
            <label for="search-type">Search Type</label>
            <select class="form-control" id="search-type">
                <option value="querystring">Query String</option>
                <option value="custom">Custom</option>
            </select>
        </div>
        <div class="col-xs-12 col-sm-2 form-group">
            <label for="tags-weight">Weight for Tags</label>
            <input type="text" class="form-control" id="tags-weight"></input>
        </div>
        <div class="col-xs-12 col-sm-2 form-group">
            <label for="title-weight">Weight for Title</label>
            <input type="text" class="form-control" id="title-weight" ></input>
        </div>
        <div class="col-xs-12 col-sm-2 form-group">
            <label for="store-weight">Weight for store name</label>
            <input type="text" class="form-control" id="store-weight" ></input>
        </div>
        <div class="col-xs-12 col-sm-2 form-group">
            <label for="colors-weight">Weight for Colors</label>
            <input type="text" class="form-control" id="colors-weight"></input>
        </div>
    </div>
    <hr>
    
    <div id="main-workspace" style="display:none;"></div>    
    
    <section id="sample-grid-container" class="items">
        <div class="container">           
            <div id="product-grid" class="row box-row"></div>
        </div>
    </section>
    
    <a href="#top" id="clear">Clear Results</a>
    <a href="#top" id="gototop">Go To Top</a>    
</div>


<?php include(dirname(__FILE__) . '/../../static/footerMeta.php');   ?>
<?php echo CLOSITT_JS; ?>
<script type="text/javascript">


    searchController.searchBarSubmit = function(el){
        if (el){
            el.preventDefault();
        }   

        var search ={};
        search.searchTerm = $( "#search-bar" ).val().trim();
        search.tagWeight =  $( "#tags-weight").val().trim();
        search.colorWeight =  $( "#colors-weight").val().trim();
        search.storeWeight =  $( "#store-weight").val().trim();
        search.titleWeight =  $( "#title-weight").val().trim();
        search.queryType = $( "#search-type").val().trim();
        searchController.isSearchActive = true;
        searchController.hasMoreProducts = true
        searchController.criteria = search;

        $.post(window.HOME_ROOT + "p/searchjson/0", search, function( data ) {

                if( data.products.length > 0){
                    $("#product-grid").children().remove();
                    searchAdmin.lazyLoad(data);
                } else {
                    alert("No products found!");
                }
            }
            , "json" // remove this if you don't want to return the data in json format
        ); 
    };

$(document).ready(function() {
    searchController.isSearchActive = true;
    pagePresenter.init();
	productPagePresenter.init();
	gridPresenter.init();
	productPresenter.init();	
	filterPresenter.init();	
	tagPresenter.init();
	searchController.init();	
	reviewsPresenter.init();		
	colorPresenter.init();	
});		

$("#clear").click(function(el){
    searchController.clearSearch(el);
    searchController.isSearchActive = true;    
});


var searchAdmin = {
    lazyLoad: function(products){
	    if (products == null){
	        return null;
	    }	   

	    if (products.products != null){
	       products = products.products;  
	    }	               

        products.forEach(function(product){	                       
			var $html = searchAdmin.getProductTemplate(product);
            $("#product-grid").append($html);

            if ($("#product-grid .outfit").length < 30){                        
                $html.find("img[data-src]").unveil(10000);
            }else{
                $html.find("img[data-src]").unveil(200);
            }
	   });
			                   			   	   		
	   gridPresenter.alignDefaultGrid(); 
	   gridPresenter.endTask(); 
	   gridPresenter.numberOfLoadingPages--;
	},
	
	getProductTemplate: function(product){
        if (product == null || typeof(product) != "object"){      	
           return $("");
        }    
        
    	var company = product.o;
    	var audience = product.u;
    	var category = product.a;
    	var link = product.l;
    	var image = product.i;
    	var name = product.n;		
    	var reviewCount = product.rc == null ? 0 : product.rc;
    	var closetCount = product.cc == null ? 0 : product.cc;
    	var closetCountPlural = closetCount == 1 ? "" : "s"; 
    	var id = product.s;
    	var shortlink = product.sl;
    	var price = product.p == null || isNaN(product.p) ? "" : "$" + Math.round(product.p);		 	
    	var filterPrice = product.fp; 		 		
    	var feedOwner = product.owner;
    	var feedCloset = product.closet;
        var score = product.sc;
        var explainUrl = window.HOME_ROOT + 'admin/php/explain.php?sku=' + id + '&query=' + encodeURIComponent($( "#search-bar" ).val()).replace("#","").trim();
        var colors = product.co;
    
    	var rand = Math.floor(Math.random() * 3) + 1;
    	var shadow = "";
    	if(rand == 1){
    		shadow = 'shadow';	
    	}		
    	
    	var html = '<div class="col-xs-12 col-sm-4 col-md-3 col-lg-box box outfit" pid="'+id+'">' +
                '<div class="item" data-url="'+link+'">' +
                    '<div class="mainwrap">' +
                        '<div class="imagewrap">' +                                                   
                                '<img src="'+image+'" />' +
                        '</div>' +
                        '<div class="detail">' +
                            '<h4 class="productName">'+name+'</h4>' +
                            '<div>' +
                                '<span class="price pull-right">'+price+'</span>' +
                                '<p class="pull-left productStore">'+company+'</p>' +                                                            
                            '</div>' +
                            '<div class="clear"></div>' +
                        '</div>' +
                        
                        '<div class="cart_option">' +                        
                            '<div class="bottom">' +
            				        '<div class="productActions" >' +
            				            'Score = ' + score +
                                    '</div>';
            
                                    if(category != undefined){
                                            html += '<div class="productActions" style="height:auto;" >';
                                            html += 'Tags = ' + category ;
                                            html += '</div>';
                                    }
            
                                    html += '<div class="productActions" style="height:auto;">' +
                                    'Colors = ' + colors +
                                '</div>' +                                         
                        '</div>' +
                    '</div>' +
                    '<div class="hover_more"></div>' +
                '</div>' +
            '</div>';		 			
    		
    	return $(html);
    }       
}
</script>

</body>
</html>
