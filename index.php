<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		

</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="left-nav" style="display:none;"></div>

<div id="wrapper">
	<div id="main-content" class="container main-container"><div id="loadingMainContent"><img src="css/images/loading.gif"/></div></div>
</div>

<div id="right-nav">
	<div class="btn-group" data-toggle="buttons-radio" id="gridType">
	    <button type="button" class="btn" value="normalGrid"><i class="icon-th-large"></i></button>
	    <button type="button" class="btn" value="randomGrid"><i class="icon-th"></i></button>
    </div>
</div>

<br><br><br><br>
<div id="filter-float" style="display:none;">
<br><br><br><br>
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



<script src="/scripts/js/gridPresenter.js"></script>
<script src="/scripts/js/productPresenter.js"></script>
<script src="/scripts/js/closetPresenter.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	if(sessionStorage.welcomeClosit == undefined){
		$('#welcomeModal').modal();
		sessionStorage.welcomeClosit = "true";
	}
	gridPresenter.init();
	productPresenter.init();	
	filterPresenter.init();	
	tagPresenter.init();
	$("#tagSearch").show();	
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