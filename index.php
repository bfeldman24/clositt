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


<script src="scripts/js/gridPresenter.js"></script>
<script src="scripts/js/productPresenter.js"></script>
<script src="scripts/js/closetPresenter.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	gridPresenter.init();
	productPresenter.init();	
	filterPresenter.init();	
	tagPresenter.init();
});

function loggedIn(){
	closetFormPresenter.getClosetInfo();
}
</script>

</body>
</html>