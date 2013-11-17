<?php require_once(dirname(__FILE__) . '/scripts/php/session.php'); ?>
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
	<h1><span id="user-closet-title"></span></h1>
	
	<?php if(!isset($_GET['user'])){ ?>
		<div id="closet-settings"><i class="minicon-single settings-minicon"></i></div>
		<div id="closet-share"><i class="minicon-single share-freeiconsweb"></i></div>
	<?php } ?>

	<div id="closet-list"></div>
</div>


<?php include(dirname(__FILE__) . '/static/footer.php');   ?>
<div id="closetId" style="display:none;"><?php echo $_GET['user'];?></div>
<script type="text/javascript">
<?php if(isset($_GET['user'])){ ?>
$(document).ready(function(){     
    productPresenter.initCloset(<?php echo $_GET['user']; ?>);			
 });
<?php }else{ ?>
function userDataReady(user){    
    pagePresenter.init();    
    productPresenter.populateStore(closetPresenter.init);        
}
<?php } ?>

function loggedOut(){
	location.href = "<?php echo HOME_ROOT; ?>";
}


$("#subheader-navbar li a").removeClass();
$('#subheader-navbar li a[href="clositt.php"]').addClass("active");
</script>

</body>
</html>
