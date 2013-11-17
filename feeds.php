<?php require_once(dirname(__FILE__) . '/scripts/php/session.php'); ?>		
<!DOCTYPE>
<html>
<head>
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php'); ?>

<div id="left-nav" style="display:none;"></div>

<div id="wrapper">

    <div class="search" id="feedSearch" style="display:none;">
      	<form id="search-form">
      		<div class="form-search input-append">
      		    <div id="seach-bar-icon"><img src="css/images/Search.png" /></div>
      			<input id="search-bar" placeholder="Search for a user or brand" class="input-xxlarge search-query" autocomplete="off"/>
      			<button id="search-clear-btn" style="display:none;" class="close">&times;</button>      			
      		</div>
      		<input type="submit" style="display:none;" />
      	</form>
    </div>
    
    <div id="main-content" class="container main-container">
        <!-- <div id="loadingMainContent"><img src="css/images/loading.gif"/></div> -->
        <div id="feed-grid"></div>
    </div>
</div>

<br><br><br><br>

<div id="feedSettings-toggle" class="clositt-theme" style="display:none">Edit Feed</div>
<div id="feedSettings-float" style="display:none;">
</div>


<?php include(dirname(__FILE__) . '/static/footer.php');   ?>

<script src="<?php echo HOME_ROOT; ?>lib/js/typeahead.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {	
	
	pagePresenter.init();
    productPresenter.populateStore(closetSearchController.init);	
    feedPresenter.init();
    gridEvents.init();
    tagPresenter.init();	
	reviewsPresenter.init();
    window.scrollTo(0, 0);	
});

function loggedIn(){
    feedPresenter.getFeeds(feedPresenter.getItemsFromFeeds);
    $("#feedSettings-toggle").show();
    $(window).scroll(feedPresenter.handleScrollEvent);
    closetFormPresenter.getClosetInfo(); 
}

$("#subheader-navbar li a").removeClass();
$('#subheader-navbar li a[href="feeds.php"]').addClass("active");

</script>
</body>
</html>
