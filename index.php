<?php require_once(dirname(__FILE__) . '/app/session.php'); ?>		
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		

</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="left-nav" style="display:none;"></div>

<div id="wrapper">

    <div class="search" id="Search">
      	<form id="search-form">
      		<div class="form-search input-append">
      		    <div id="seach-bar-icon"><img src="css/images/Search.png" /></div>
      			<input id="search-bar" placeholder="Start your search here (ex. Women's Sweaters Under $100)" class="input-xxlarge search-query" />
      			<button id="search-clear-btn" style="display:none;" class="close">&times;</button>
      			<div id="search-bar-sort-block">
      			   <span>Sory By:</span>
         		   <select id="search-bar-sort">
                     <option value="relevance" selected="selected">Relevance</option>
                     <option value="mostpopular">Most Popular</option>
                     <option value="mostdiscussed">Most Discussed</option>
                     <option value="pricelowtohigh">Price (low to high)</option>
                     <option value="pricehightolow">Price (high to low)</option>
                   </select>                    
                </div>
      		</div>
      		<input type="submit" style="display:none;" />
      	</form>
    </div>
    
    <div id="center-featured">
        Check out our <a href="shopping-guide.php">Shopping Guide</a>
    </div>
    
    <div id="main-content" class="container main-container">
        <div id="loadingMainContent"><img src="css/images/loading.gif"/></div>
        <div id="product-grid"></div>
    </div>
</div>

<br><br><br><br>
<div id="filter-toggle" class="clositt-theme">Show Filter</div>
<div id="filter-float" style="display:none;"></div>
<div id="scroll-to-top" class="clositt-theme" style="display:none;"><i class="icon-white icon-arrow-right"></i></div>
<div id="page-mask" style="display:none;"></div>
<div id="product-module" style="display:none;"></div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>

<!-- Modal -->
    <div class="modal" id="welcomeModal" style="display:none;">
	    <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3>Welcome to Clositt</h3>
		</div>
		<div class="modal-body">
		    <p>Welcome to Clositt, the best way to discover, share, and compare clothing online.
Looking for something specific? Use the filter on the left or the search bar to narrow down what you are looking for. 
Browse the homepage to see the latest trends and styles from your favorite stores.
Once you find something you like, just click on the hanger icon and add it to your Clositt.</p><br>

	<p>Got questions or feedback? Let us know: <a href="mailto:info@clositt.com">info@clositt.com</a></p>

		</div>
		<div class="modal-footer">		    
		    <button class="btn btn-success" onclick='contactUs()'>Contact Us</button>
		    <button class="btn" data-dismiss="modal" aria-hidden="true">Get Started!</button>
	    </div>
    </div>
<!-- End Modal -->

<div id="review-mask"></div>

<script type="text/javascript">
$(document).ready(function() {
	if(localStorage.welcomeClosit == undefined){
		$('#welcomeModal').modal();
		localStorage.welcomeClosit = "true";
	}
	
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

function loggedIn(){
	closetFormPresenter.getClosetInfo();
}

function contactUs(){
	location.href = "contact-us.php";	
}
</script>

</body>
</html>
