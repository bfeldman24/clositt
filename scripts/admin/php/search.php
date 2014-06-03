<!DOCTYPE>
<html>
<head>
<title>Search Admin</title>

<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../../static/meta.php');   
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
                <option value="multimatch">Multi Match</option>
                <option value="querystring">Query String</option>
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
    <div id="sample-grid-container"><div id="product-grid"></div></div>
    <a href="#top" id="clear">Clear Results</a>
    <a href="#top" id="gototop">Go To Top</a>    
</div>


<?php echo CLOSITT_JS; ?>
<script type="text/javascript">


    searchController.searchBarSubmit = function(el){
        el.preventDefault();

        var search ={};
        search.searchTerm = $( "#search-bar" ).val().trim();
        search.tagWeight =  $( "#tags-weight").val().trim();
        search.colorWeight =  $( "#colors-weight").val().trim();
        search.storeWeight =  $( "#store-weight").val().trim();
        search.titleWeight =  $( "#title-weight").val().trim();
        search.queryType = $( "#search-type").val().trim();
        searchController.isSearchActive = true;
        searchController.hasMoreProducts = true

        $.post(window.HOME_ROOT + "p/search/0", search, function( products ) {

                if( Object.keys(products).length > 0){
                    $("#product-grid").children().remove();
                    gridPresenter.lazyLoad(products);
                } else {
                    alert("No products found!");
                }
            }
            , "json" // remove this if you don't want to return the data in json format
        );
    };

$(document).ready(function() {
    searchController.isSearchActive = true;
    firebase.init();
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

productPresenter.getProductTemplate = function(product){
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
    var explainUrl = window.HOME_ROOT + 'scripts/admin/php/explain.php?sku=' + id + '&query=' + encodeURIComponent($( "#search-bar" ).val()).replace("#","").trim();
    var colors = product.co;

	var rand = Math.floor(Math.random() * 3) + 1;
	var shadow = "";
	if(rand == 1){
		shadow = 'shadow';	
	}		
		 			
	//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
	var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
	   var html ='<div class="outfit item '+shadow+'" '+attr+' pid="'+id+'" data-url="'+shortlink+'">';
			html +='<a target="_blank" href=' + explainUrl +  '>' +
                '<div class="picture"><img data-src="' + image + '" src="../../../css/images/loading.gif"  onerror="return pagePresenter.handleImageNotFound(this)"/></div></a>';
			html += '<div class="bottom-block">';
			    html +='<div class="companyName">' + company + '</div>';
				html +='<div class="price">' +  price + '</div>';
			html += '</div>';
			
			html +='<div class="overlay">';

					html +='<div class="bottom">';
				    html += '<div class="productActions" >';					    
				    html += 'Score= ' + score;
                    html += '</div>';

                    if(category !=undefined){
                        html += '<div class="productActions" >';
                        html += 'Tags = ' + category ;
                        html += '</div>';
                    }

                    html += '<div class="productActions" >';
                    html += 'Colors = ' + colors;
                    html += '</div>';

					//html +='<div class="companyName">' + company + '</div>';
					//html +='<div class="price">' +  price + '</div>';
					html +='<div class="name">' + name + '</div>';
				html += '</div>';
				html += '<div class="product-comments"></div>';
				html += '<div class="addToClosetForm" style="display:none;"></div>';
			html += '</div>';
			html += '<div class="clear"></div>';				
		html +='</div>';
		
	return $(html);
};
</script>

</body>
</html>
