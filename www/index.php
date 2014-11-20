<?php 
require_once(dirname(__FILE__) . '/../app/session.php'); 
require_once(dirname(__FILE__) . '/../app/Controller/FilterController.php');

$filterController = new FilterController();              
$filters = $filterController->getHtmlFilters();
$homepage = true;
?>		
<!DOCTYPE HTML>
<html>
<head>

<link href="<?php echo HOME_ROOT; ?>lib/css/joyride-2.1.css" rel="stylesheet">
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<link href="<?php echo HOME_ROOT; ?>lib/css/flexslider.css" rel="stylesheet" />

</head>
<body>

<div class="wrapper">
    <?php include(dirname(__FILE__) . '/static/header.php');   ?>    
     <section id="slider">
        <div class="sliderwrap"> 
            <h1>find it on clositt</h1>
            <h2>Search, Browse and Collect your favorite clothes</h2>
            <a id="getstarted" class="started hidden-xs" data-toggle="modal" data-target="#loginSignupModal"><i class="icon-angle-right"></i> GET STARTED</a>
                
		<a class="nextstep go_to_top" id="top" ></a>
        
        </div>
    </section>
    
    <div style="min-height:95px">    
        <?php print_r($filters); ?>
    </div>
    
    <section class="items">
        <div class="container">           
            <div id="product-grid" class="row box-row">
            
                <?php /*
                <div class="col-xs-12 col-sm-8 col-md-7">
                    <div class="flexslider">
                        <ul class="slides">
                            <li>
                                <img src="<?php echo HOME_ROOT; ?>css/images/popupslider.jpg" />
                            </li>
                            <li>
                                <img src="<?php echo HOME_ROOT; ?>css/images/popupslider.jpg" />
                            </li>
                            <li>
                                <img src="<?php echo HOME_ROOT; ?>css/images/popupslider.jpg" />
                            </li>
                        </ul>
                    </div>
                </div> 
                */ ?>
                    
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
	filterPresenter.init();	
	pagePresenter.init();
	productPagePresenter.init();
	gridPresenter.init();
	productPresenter.init();
	socialPresenter.init();		
	tagPresenter.init();
	searchController.init();	
	reviewsPresenter.init();	
});


function loggedIn(){       
	closetFormPresenter.init();			
}

function loggedOut(){
    closetFormPresenter.init();
}
</script>

</body>
</html>