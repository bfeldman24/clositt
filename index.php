<?php require_once(dirname(__FILE__) . '/scripts/php/session.php'); ?>		
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
      			<input id="search-bar" placeholder="Start your search here! (ex. Black Party Dress)" class="input-xxlarge search-query" />
      			<button id="search-clear-btn" style="display:none;" class="close">&times;</button>
      		</div>
      		<input type="submit" style="display:none;" />
      	</form>
    </div>
    
    <div id="main-content" class="container main-container">
        <div id="loadingMainContent"><img src="css/images/loading.gif"/></div>
        <div id="product-grid"></div>
    </div>
</div>

<br><br><br><br>
<div id="filter-toggle" class="clositt-green">Show Filter</div>
<div id="filter-float" style="display:none;"></div>
<div id="review-float" style="display:none;">
	<ul id="review-comments">
		
	</ul>
	<div id="review-form">
		<textarea id="review-add-comment" rows="3" placeholder="Add a Review..."></textarea>
		<div id="review-rating">
			<i class="review-star star-large-empty" star="1"></i>
			<i class="review-star star-large-empty" star="2"></i>
			<i class="review-star star-large-empty" star="3"></i>
			<i class="review-star star-large-empty" star="4"></i>
			<i class="review-star star-large-empty" star="5"></i>
			<span id="review-average" class="label label-info">0</span>	
		</div>	
		<button id="review-add-btn" class="btn btn-success" type="button">Add Review</button>
	</div>
</div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>

<!-- Modal -->
    <div class="modal" id="welcomeModal" style="display:none;">
	    <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3>Welcome to Clositt</h3>
		</div>
		<div class="modal-body">
		    <p>Welcome to Clositt, the best way to discover, share, and compare clothing online.
Looking for something specific? Click the magnifying glass on the lower left corner to open the filter menu.
Or you can simply browse to homepage to see the latest trends and styles from your favorite stores.
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


<script src="<?php echo HOME_ROOT; ?>scripts/js/pagePresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/gridPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/gridEvents.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/productPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/filterPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/tagPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/searchController.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/reviewsPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/closetPresenter.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	if(localStorage.welcomeClosit == undefined){
		$('#welcomeModal').modal();
		localStorage.welcomeClosit = "true";
	}
	
	pagePresenter.init();
	gridPresenter.init();
	productPresenter.init();	
	filterPresenter.init();	
	tagPresenter.init();
	searchController.init();
	reviewsPresenter.init();		
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
