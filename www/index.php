<?php 
require_once(dirname(__FILE__) . '/../app/session.php'); 
require_once(dirname(__FILE__) . '/../app/Controller/FilterController.php');

$filterController = new FilterController();              
$filters = $filterController->getHtmlFilters();
?>		
<!DOCTYPE HTML>
<html>
<head>

<link href="<?php echo HOME_ROOT; ?>lib/css/joyride-2.1.css" rel="stylesheet">
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<link href="<?php echo HOME_ROOT; ?>new/css/flexslider.css" rel="stylesheet" />

</head>
<body>

<div class="wrapper">
    <?php include(dirname(__FILE__) . '/static/header.php');   ?>    
     <section id="slider">
        <div class="sliderwrap"> 
            <h1>find it on clositt</h1>
            <h2>Search, Browse and Collect your favorite clothes</h2>
            <a class="started" href="#top"><i class="icon-angle-right"></i> GET STARTED NOW</a>
                
		<a class="nextstep" id="top" href="#top"></a>
        
        </div>
    </section>
        
    <?php print_r($filters); ?>
    
    <section class="items">
        <div class="container">
           
            <div id="product-grid" class="row box-row">
                <div class="col-xs-12 col-sm-8 col-md-7">
                    <div class="flexslider">
                        <ul class="slides">
                            <li>
                                <img src="<?php echo HOME_ROOT; ?>new/images/popupslider.jpg" />
                            </li>
                            <li>
                                <img src="<?php echo HOME_ROOT; ?>new/images/popupslider.jpg" />
                            </li>
                            <li>
                                <img src="<?php echo HOME_ROOT; ?>new/images/popupslider.jpg" />
                            </li>
                        </ul>
                    </div>
                </div> 
                    
            </div>
            
        </div>
    </section>
    
    <div id="product-loader" class="loader"><i class="icon-svg5"></i></div>
    
    <?php include(dirname(__FILE__) . '/static/footer.php');   ?>
</div>

<?php include(dirname(__FILE__) . '/static/footerMeta.php');   ?>

<script type="text/javascript">
	
  $(window).load(function() {
    $('.flexslider').flexslider({
      animation: "slide"
    });
  });    

</script>


<script type="text/javascript">
$(document).ready(function() {	
	
	pagePresenter.init();
	productPagePresenter.init();
	gridPresenter.init();
	productPresenter.init();
	socialPresenter.init();	
	filterPresenter.init();	
	tagPresenter.init();
	searchController.init();	
	reviewsPresenter.init();
	closetFormPresenter.initNotLoggedIn();	             
});


function loggedIn(){       
	closetFormPresenter.init();			
}
</script>

</body>
</html>