<?php 
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(dirname(__FILE__) . '/../app/session.php'); 
require_once(dirname(__FILE__) . '/../app/Controller/FilterController.php');

$cookieName = "hasVisited";
if(!isset($_COOKIE[$cookieName])){
    setcookie($cookieName, "true", time() + 31104000, "/"); //expires in about 360 days
    header("Location: " . ABOUT_PAGE);
    die();
}

$filterController = new FilterController();              
$filters = $filterController->getHtmlFilters();
$homepage = true;
?>		
<!DOCTYPE HTML>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<link rel="stylesheet" href="<?php echo HOME_ROOT; ?>lib/css/shepherd-theme-arrows.css" />
<style type="text/css">
.shepherd-element.shepherd-theme-arrows.shepherd-transparent-text .shepherd-text {
    color: #3b744f; 
}

.shepherd-element.shepherd-theme-arrows .shepherd-content {
    width: 300px;
    max-width: 100%; 
}

.shepherd-element.shepherd-theme-arrows .shepherd-content a {
    color: inherit; 
}

.shepherd-element.shepherd-theme-arrows .shepherd-content footer .shepherd-buttons li .shepherd-button {
    background: #55a892; 
}

.shepherd-element{
    z-index: 99999;   
}
</style>
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
                
                <?php                    
                    require_once(dirname(__FILE__) . '/../app/Controller/ProductController.php'); 
                    $productController = new ProductController();                    
                    $browseData = array();                    
                    $browseData['page'] = rand(0,300);                                        
                                        
                    if (isset($_COOKIE['customer'])) {
                        $browseData['customer'] = substr($_COOKIE['customer'], 0, 1);                        
                    }else{                        
                        $browseData['customer'] = "b";   
                    }
                    
                    $browseResults = $productController->getProductsHtml(array(), $browseData, 25, true);
                    $browseProducts = json_decode($browseResults, true);
                    print_r($browseProducts['products']);                    
                ?>
                    
            </div>            
        </div>
    </section>
    
    <div id="product-loader" class="loader"><i class="icon-svg5"></i></div>
    
    <?php include(dirname(__FILE__) . '/static/footer.php');   ?>
</div>

<?php include(dirname(__FILE__) . '/static/footerMeta.php');   ?>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/shepherd.min.js"></script>

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
	
	
	<?php 
    if (isset($_GET['login'])){
        if ($_GET['login'] == "signup"){
               ?>
                    $("#getstarted").trigger("click");
               <?php
        }else if ($_GET['login'] == "login"){
               ?>
                    $(".login").first().trigger("click");
               <?php
        } 
    }
    ?>
});


function loggedIn(){       
	closetFormPresenter.init();			
}

function loggedOut(){
    closetFormPresenter.init();
}








var ShepherdTour = {    
    init: function() {
        $(document).on("click",".startTour", ShepherdTour.setupShepherd);
        
        if (document.cookie == null || document.cookie.indexOf("tutorial=") < 0){
            document.cookie="tutorial=true; expires=Thu, 31 Dec 9999 12:00:00 UTC";
            ShepherdTour.setupShepherd();
        }else{
            gridPresenter.enableLazyLoading = true;   
        }
    },
    
    setupShepherd: function() {
        var shepherd;    
        
        var outfit = $(".outfit").eq(2);
        outfit.addClass("sheperd-outfit");
        outfit.find(".addToClosittDropdown").addClass("sheperd-outfit-clositt-btn");
        $("#loginBtns li").first().addClass("sheperd-myclositts-btn");        
        
        shepherd = new Shepherd.Tour({
            defaults: {
                classes: 'shepherd-theme-arrows',
                showCancelLink: false,
                scrollTo: false
            }
        });
        
        shepherd.addStep('welcome', {
            title: 'Welcome to Clositt!',
            text: ['Let us show you around.'],
            classes: 'shepherd-theme-arrows',            
            buttons: [
                {
                    text: 'Skip Tour',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.cancel
                }, {
                    text: 'Let\'s go',
                    action: function(){                    
                        pagePresenter.scrollTo(225);
                        shepherd.next();   
                    },
                    classes: 'btn-clositt-theme'
                }
            ]
        });
        
        shepherd.addStep('start', {
            title: 'Start Here',
            text: ['Use the filters to sort through 1000\'s of items with just a couple clicks. <br><br>You can sort by store, price, color, material & more'],
            attachTo: '.womenfilter top',
            classes: 'shepherd-theme-arrows',            
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Next',
                    action: function(){                    
                        pagePresenter.scrollTo($(".sheperd-outfit").offset().top - 100); 
                        shepherd.next();   
                    },
                    classes: 'btn-clositt-theme'
                }
            ]
        });
        
        shepherd.addStep('start', {
            title: 'Start Here',
            text: ['Use the filters to sort through 1000\'s of items with just a couple clicks. <br><br>You can sort by store, price, color, material & more'],
            attachTo: '.womenfilter top',
            classes: 'shepherd-theme-arrows',            
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: shepherd.back
                }, {
                    text: 'Next',
                    action: function(){                    
                        pagePresenter.scrollTo($(".sheperd-outfit").offset().top - 100); 
                        shepherd.next();   
                    },
                    classes: 'btn-clositt-theme'
                }
            ]
        });                    
        
        shepherd.addStep('foundone', {
            title: 'Show the Filters',
            text: 'You can click this button to show or hide the filters at any time while you are scrolling.',
            attachTo: '.sheperd-outfit-clositt-btn left',
            classes: ' shepherd-theme-arrows',
            scrollTo: false,
            advanceOn: '.sheperd-outfit-clositt-btn click',
            buttons: [
                {
                    text: 'Back',
                    classes: 'shepherd-button-secondary',
                    action: function(){
                        pagePresenter.scrollTo($(".nav-filter.pricefilter").offset().top - 400); 
                        shepherd.back();   
                    }
                }, {
                    text: 'Next',
                    action: function(){                    
                        outfit.find(".addToClosittDropdown").addClass("open");                         
                        shepherd.next();   
                    },
                    classes: 'btn-clositt-theme'
                }
            ]
        });                
        
        shepherd.addStep('yourclositts', {
          title: 'Your Clositts',
          text: 'You can view and manage all of your Clositts here. <br><br>You can also add price alerts, and share your Clositts with friends.',
          attachTo: '.sheperd-myclositts-btn bottom',
          classes: ' shepherd-theme-arrows',
          scrollTo: false,
          buttons: [
            {
                text: 'Back',
                classes: 'shepherd-button-secondary',
                action: function(){
                    pagePresenter.scrollTo($(".sheperd-outfit").offset().top - 75); 
                    shepherd.back();   
                }
            }, {
                text: 'Done',
                action: shepherd.next,
                classes: 'btn-clositt-theme'
            }
          ]
        });
        
        Shepherd.once('complete', function(){
            gridPresenter.enableLazyLoading = true;    
        });
        
        Shepherd.once('cancel', function(){
            gridPresenter.enableLazyLoading = true;    
        });
        
        shepherd.start();
    }
}

ShepherdTour.init();
</script>

</body>
</html>