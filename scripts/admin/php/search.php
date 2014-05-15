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
    <hr>
    
    <div id="main-workspace" style="display:none;"></div>    
    <div id="sample-grid-container"><div id="product-grid"></div></div>
    <a href="#top" id="clear">Clear Results</a>
    <a href="#top" id="gototop">Go To Top</a>    
</div>


<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
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

	var rand = Math.floor(Math.random() * 3) + 1;
	var shadow = "";
	if(rand == 1){
		shadow = 'shadow';	
	}		
		 			
	//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
	var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
	   var html ='<div class="outfit item '+shadow+'" '+attr+' pid="'+id+'" data-url="'+shortlink+'">';
			html +='<a class="productPage" target="_blank"><div class="picture"><img data-src="' + image + '" src="../../../css/images/loading.gif"  onerror="return pagePresenter.handleImageNotFound(this)"/></div></a>';			
			html += '<div class="bottom-block">';
			    html +='<div class="companyName">' + company + '</div>';
				html +='<div class="price">' +  price + '</div>';
			html += '</div>';
			
			html +='<div class="overlay">';
				html +='<div class="topleft">';										
					html +='<div class="shareOutfitBtn" data-toggle="tooltip" data-placement="left" title="Share it!"><img class="social-people-icon" src="css/images/social/social-people.png" /></div>';						 
				html += '</div>';
				html += '<div class="social-btns" style="display:none;"></div>';
				html +='<div class="topright">';										
					html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Clositt"><img class="hanger-icon" src="css/images/hanger-icon.png" /><i class="icon-plus-sign hanger-plus"></i></div>';
				html += '</div>';
				html +='<div class="bottom">';						    					    
				    html += '<div class="productActions" >';					    
				       html += '<span data-toggle="tooltip" data-placement="top" data-animation="false" title="Add to Wish List" class="addToWishList"><i class="icon-gift"></i></span>';
				       html += '<span data-toggle="tooltip" data-placement="top" data-animation="false" title="Show Comments" class="showComments numReviews"><span class="counter" >'+reviewCount+'</span><i class="icon-comment"></i></span>';
				       html += '<span data-toggle="tooltip" data-placement="top" data-animation="false" title="Added to '+closetCount+' Clositt'+closetCountPlural+'" class="numClosets"><span class="counter">'+closetCount+'</span><i class="icon-hanger"></i></span>';
				    html += '</div>';									
				    
				    if(feedOwner != null && feedCloset != null){
				       html += '<div class="productSubHeader" >';
   				            html += '<div class="outfitFeedOwner"><span class="outfitOwner">'+feedOwner+'\'s</span><span>&nbsp;\"'+feedCloset+'\" clositt</span></div>';
					    html += '</div>';  
				    }
				    					    					
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
