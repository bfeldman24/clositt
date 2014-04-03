<?php require_once(dirname(__FILE__) . '/app/session.php'); ?>		
<!DOCTYPE>
<html>
<head>

<link href="<?php echo HOME_ROOT; ?>lib/css/joyride-2.1.css" rel="stylesheet">
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		

</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>
<div class="jumboSplash">
    <div class="mainSplash">
        <div class="splashSearch row">
            <div class="search col-xs-10 col-xs-offset-1 col-sm-7 col-sm-offset-3" id="Search">
            	<form id="search-form">
            		<div class="form-search input-append">
            		    <div id="seach-bar-icon"><img src="css/images/Search.png" /></div>
            			<input id="search-bar" placeholder="Search" class="search-query" />
            			<button id="search-clear-btn" style="display:none;" class="close">&times;</button>
            			<div id="search-bar-sort-block">
            			   <span>Sory By:</span>
                   		   <select id="search-bar-sort">
                               <option value="relevance" selected="selected">Relevance</option>
                               <option value="mostpopular">Most Popular</option>
                               <option value="mostdiscussed">Most Discussed</option>
                               <option value="pricelowtohigh">Price (low to high)</option>
                               <option value="pricehightolow">Price (high to low)</option>
                           </select>                    
                      </div>
            		</div>
            		<input type="submit" style="display:none;" />
            	</form>
            </div>
        </div>
        <div class="splashText hidden-xs">Stop <br class="hidden-xs"/>Searching.<br /><span class="splashTextHightlight">Start Finding.</span></div>        
    </div>
    <div class="subSplashInfo row hidden-xs">
        <div class="splashInfoBlock splashSearch col-sm-2 col-sm-offset-3 ">
            <div class="splashInfoIcon splashSearchIcon"></div>
            <div class="spashInfoHeader splashSearchHeader">SEARCH</div>
            <div class="spashInfoText splashSearchText hidden-xs">Take the hassle out of searching multiple sites to find what you want.</div>
        </div>
        <div class="splashInfoBlock splashBrowse col-sm-2 ">
            <div class="splashInfoIcon splashBrowseIcon"></div>
            <div class="spashInfoHeader splashBrowseHeader">BROWSE</div>
            <div class="spashInfoText splashBrowseText">Browse items by trends, occasions, and outfits.</div>
        </div>
        <div class="splashInfoBlock splashSave col-sm-2">
            <div class="splashInfoIcon splashSaveIcon"></div>
            <div class="spashInfoHeader splashSaveHeader">COLLECT</div>
            <div class="spashInfoText splashSaveText hidden-xs">Collect items you like in your Clositt and share them with friends.</div>
        </div>
    </div>
    <div class="row">
        <div class="splashInfoTagLine col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 text-center">Clositt Makes Searching for Clothes as Fun as Buying Clothes</div>
    </div>
</div>


<div id="left-nav" style="display:none;"></div>

<div id="wrapper">
    <?php /* ?>    
    <div id="center-featured">
        Check out our <a href="shopping-guide.php">Shopping Guide</a>
    </div>
    <?php */ ?>
    
    <div id="main-content" class="container main-container">
        <div id="loadingMainContent"><img src="css/images/loading.gif"/></div>
        <div class="row">
            <div class="hidden-xs col-sm-3">
                <div id="filter-float-container">
                    <div id="filter-float" style="display:none;" ></div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-9">
                <div id="product-grid" class="row"></div>
            </div>
        </div>
    </div>
</div>

<br><br><br><br>
<div id="scroll-to-top" class="clositt-theme" style="display:none;"><i class="icon-white icon-arrow-right"></i></div>
<div id="page-mask" style="display:none;"></div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>
<script src="<?php echo HOME_ROOT; ?>lib/js/jquery.joyride-2.1.js"></script>

<!-- Modal -->
    <div class="modal fade" id="welcomeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
               <h3 class="modal-title">Welcome to Clositt</h3>
          </div>
          <div class="modal-body">
                <p>Clositt is the best way to discover, share, and compare clothing online.</p>
      
              	<p>We make <p2 style="color:green;font-weight:bold;">shopping</p2> online for clothes, as fun as <p2 style="color:green; font-weight:bold;">buying</p2> clothes.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default" onclick="window.location.href='signup.php'">Login or Sign Up</button>
		    <button class="btn btn-success joyride-start" data-dismiss="modal" aria-hidden="true">Take the Tour</button>
		    <button class="btn btn-info" data-dismiss="modal" aria-hidden="true">Let me Shop!</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

<!-- End Modal -->

<div id="review-mask"></div>


<!-- Joyride Content -->
<ol id="joyRideTipContent">
    <li data-id="search-bar" data-text="Next" class="custom">
        <h2>Search </h2>
        <p>You can search for EVERTYHING! Find your favorite product, style, or price. Go wild!</p>
    </li>
    <li data-id="filter-float" data-button="Next" data-options="tipLocation:right;tipAnimation:fade">
        <h2>Filter</h2>
        <p>Narrow down the products to find exactly what you are looking for!</p>
    </li>
    <li data-id="filter-toggle" data-button="Next" data-options="tipLocation:right">
        <h2>Filter</h2>
        <p>Hide the filter when you are not using it.</p>
    </li> 
    <li data-id="joyride-item-addToClositt" data-button="Next" data-options="tipLocation:right">
        <h2>Add to Your Clositt</h2>
        <p>Save and organize the products you find on Clositt! Once saved, go to the MyClositt link at the top of the page.</p>
    </li>
    <li data-id="joyride-item-showComments" data-button="Next"  data-options="tipLocation:bottom">
        <h2>Comments and Reviews</h2>
        <p>See what people are saying about this product and add your own review</p>
    </li>
    <li data-id="joyride-item-addToWishList" data-button="Next"  data-options="tipLocation:bottom">
        <h2>Add to Your WishList</h2>
        <p>Add this product to your wish list so people can know what you want.</p>
    </li>
    <li data-id="joyride-item-shareOutfitBtn" data-button="Next"  data-options="tipLocation:left">
        <h2>Share</h2>
        <p>Send this product to your friends to find out what they think about it.</p>
    </li>
    <li data-id="subheader-myclositt" data-button="Close and Start Shopping!"  data-options="tipLocation:bottom">
        <h2>My Clositt</h2>
        <p>Go to your Clositt to view and organize the products that you have saved.</p>
    </li>
</ol>

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
	
	$('#filter-float').perfectScrollbar({
        wheelSpeed: 20,
        wheelPropagation: false
    });   
    
    $(".toggle-filter-nav").removeClass("hidden").addClass("visible-xs");         
});

$(".toggle-filter-nav").click(function(el){
    var filterParent = $("#filter-float-container").parent();         	      
    
    
    if (filterParent.hasClass("hidden-xs")){       
        filterPresenter.pauseRefresh = true;
         
        filterParent.hide();                
        filterParent.removeClass("hidden-xs").show();
        $("#wrapper").css("left","100%");
    }else{
        filterPresenter.pauseRefresh = false;
        filterPresenter.refreshIfNeeded();
        
        $("#wrapper").css("left","auto");        
        filterParent.hide();
        filterParent.addClass("hidden-xs").show();  
        
        if (filterPresenter.needsRefresh){
            pagePresenter.scrollTo(100);      
        }        
    }
});


$(".joyride-start").click(function(e){
    $('#joyRideTipContent').joyride({
          autoStart : true,
          preStepCallback : function (index, tip) {
          if (index == 0) {
            var $item = $("#product-grid .item:nth-child(2)").first();
            $item.find(".addToClosetBtn img").attr("id","joyride-item-addToClositt");
            $item.find(".showComments i").attr("id","joyride-item-showComments");
            $item.find(".addToWishList i").attr("id","joyride-item-addToWishList");
            $item.find(".shareOutfitBtn img").attr("id","joyride-item-shareOutfitBtn");          
          } else if (index == 2){
            $(tip).css("margin-left","-70px").css("margin-top","30px");
            
            $('body,html').animate({
    			scrollTop: 0
    		}, 800);
            
            $("#product-grid .item:nth-child(2)").first().find(".overlay").addClass("alwaysVisible").show();                        
          } else if (index == 3){
              $(tip).css("margin-top","-25px");
          } else if (index == 4 || index == 5){
              $(tip).css("margin-left","-30px");
          } else if (index == 6){
             $(tip).css("margin-top","-25px"); 
          }          
        },
        postRideCallback : function (index, tip) {
            $("#product-grid .item:nth-child(2)").first().find(".overlay").removeClass("alwaysVisible").hide();                        
        },       
        modal:true,
        expose: false
        });
});

function showWelcomeModal(){
     if(firebase.loginCount <= 3){
	    if (localStorage.welcomeClositt == undefined || localStorage.welcomeClositt == null){
	       localStorage.welcomeClositt = 1;  
	    }
	   
	    if (localStorage.welcomeClositt < 5){
		  $('#welcomeModal').modal();			
	    }
	    
	    localStorage.welcomeClositt++;	
	}   
}

function loggedIn(){       
    showWelcomeModal();
	closetFormPresenter.getClosetInfo();			
}

function loggedOut(){
    showWelcomeModal();
}

function contactUs(){
	location.href = "contact-us.php";	
}
</script>

</body>
</html>
