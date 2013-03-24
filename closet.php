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
<div id="main-content" class="container main-container">
	<h1><span id="user-closet-title"></span></h1>
	<div id="closet-settings"><i class="minicon-single settings-minicon"></i></div>
	<div id="closet-list"></div>
</div>


<?php include(dirname(__FILE__) . '/static/footer.php');   ?>
<script src="/scripts/js/closetPresenter.js"></script>
<script src="/scripts/js/productPresenter.js"></script>
<script type="text/javascript">
function userDataReady(user){
	$("#user-closet-title").text(user + "'s Closet");
	closetPresenter.init();
}

function loggedOut();
	location.href = "/";	
}
</script>

</body>
</html>