<?php require_once(dirname(__FILE__) . '/app/session.php'); ?>
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<style type="text/css">
#main-content {  padding: 10px 0px 80px;}
</style>
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>
<div id="main-content" class="container main-container" style="margin-top:80px">
	<h1><span id="static-closet-title">Clositt's Holiday Guide</span></h1>	
    <?php /* <div id="loadingMainContent"><img src="css/images/loading.gif"/></div> */ ?>
    <div id="closet-list"></div>    
</div>
<div id="page-mask" style="display:none;"></div>
<div id="product-module" style="display:none;"></div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>
<div id="closetId" style="display:none;"><?php echo $_GET['user'];?></div>
<script type="text/javascript">

$(document).ready(function(){
    closetPresenter.setUser(104);    
    pagePresenter.enableLazyLoading = false;     
    pagePresenter.init();    
    closetPresenter.init();        	
    productPagePresenter.init();	
    reviewsPresenter.init();
});

function loggedOut(){
	location.href = "<?php echo HOME_ROOT; ?>";
}


$("#subheader-navbar li a").removeClass();
$('#subheader-navbar li a[href="holiday-guide.php"]').addClass("active");
</script>

</body>
</html>
