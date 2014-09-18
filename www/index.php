<?php 
require_once(dirname(__FILE__) . '/../app/session.php'); 
require_once(dirname(__FILE__) . '/../app/Controller/FilterController.php');

$filterController = new FilterController($mdb2);              
$filters = $filterController->getHtmlFilters();
?>		
<!DOCTYPE>
<html>
<head>

<link href="<?php echo HOME_ROOT; ?>lib/css/joyride-2.1.css" rel="stylesheet">
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		

</head>
<body>

<div class="wrapper">
    <?php include(dirname(__FILE__) . '/static/header.php');   ?>    
    <section id="slider">
        <div class="sliderwrap">    
            <div id="layerslider" style="width: 100%; height: 620px;">
                <div class="ls-slide" data-ls="transition2d:5;">
                    <img src="<?php echo HOME_ROOT; ?>new/images/homeslider.jpg" class="ls-bg" alt="Slide background" />
                </div>    
                <div class="ls-slide" data-ls="transition2d:5;timeshift:-1000;">
                    <img src="<?php echo HOME_ROOT; ?>new/images/homeslider1.jpg" class="ls-bg" alt="Slide background" />
                </div>    
            </div>
        </div>
    </section>
    
    <?php print_r($filters); ?>
    
    <section id="items">
        <div class="container">
            <div class="row box-row"></div>
        </div>
    </section>
    
    <div class="loader"><i class="icon-svg5"></i></div>
    
    <?php include(dirname(__FILE__) . '/static/footer.php');   ?>
</div>

<?php include(dirname(__FILE__) . '/static/footerMeta.php');   ?>

<script type="text/javascript">
$(document).ready(function() {	
	
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
</script>

</body>
</html>