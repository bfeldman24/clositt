<?php require_once(dirname(__FILE__) . '/app/session.php'); ?>
<!DOCTYPE>
<html>
<head>

<link href="<?php echo HOME_ROOT; ?>lib/css/joyride-2.1.css" rel="stylesheet">
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<style type="text/css">
    #main-content {  
        padding: 10px 0px 80px;
    }

    #brand-fixed-background {
        display: block;
    }

</style>
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>
<div id="main-content" class="container main-container" style="margin-top:80px">
	<h1><span id="user-closet-title"></span></h1>
	
	<?php if(!isset($_GET['user'])){ ?>	                 
           
           <ul id="closet-settings" class="nav pull-right">                              	
        	 		<li class="dropdown">
        			<a href="#" class="dropdown-toggle" data-toggle="dropdown">
        				<!--<i class="minicon-single settings-minicon"></i> -->
        				<img src="css/images/menu.png" class="clositt-menu-icon"/>
        			</a>
        			<ul class="dropdown-menu dropdown-menu-right">
        			     <li class="menu-settings"><a  onclick="closetPresenter.showSettings()"><i class="icon-pencil"></i> Edit</a></li>
                         <li class="menu-cancel" style="display:none;"><a onclick="closetPresenter.showSettings()"><i class="icon-remove"></i> Cancel</a></li>
                         <li class="menu-save" style="display:none;"><a onclick="closetPresenter.saveClosets()"><i class="icon-ok"></i> Save</a></li>                  
        			</ul>
        		</li>	              	
            </ul>
                  

		    <div id="closet-share" data-toggle="tooltip" data-placement="left" title="Share it!">
    		      <img class="social-people-icon" src="css/images/social/social-people.png" />
    		</div>
    		<div id="social-btns" class="social-btns" style="display:none;"></div>				
        
	<?php } ?>

	<div id="closet-list"></div>
	<br /><br /><br /><br />
</div>
<div id="page-mask" style="display:none;"></div>
<div id="product-module" style="display:none;"></div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>
<script src="<?php echo HOME_ROOT; ?>lib/js/jquery.joyride-2.1.js"></script>

<div id="closetId" style="display:none;"><?php echo $_GET['user'];?></div>

<!-- Joyride Content -->
<ol id="joyRideTipContent">
    <li data-class="closetNameHeader" data-text="Next" class="custom">
        <h2>Your Clositt </h2>
        <p>Welcome to YOUR Clositt! This is where you keep stuff you like. We've already created a Clositt for you to get you started. Feel free to create as many Clositts as you'd like.</p>
    </li>
    <li data-class="carousel-left" data-button="Next" data-options="tipLocation:right;">
        <h2>Scrolling</h2>
        <p>Click on the arrows to scroll through your Clositt.</p>
    </li>
    <li data-class="social-people-icon" data-button="Next" data-options="tipLocation:left;">
        <h2>Share</h2>
        <p>Share your Clositt with anyone by clicking here.</p>
    </li>    
    <li data-id="closet-settings" data-button="Next" data-options="tipLocation:left;">
        <h2>Edit</h2>
        <p>You can delete items from your Clositt, or change your Clositt names by clicking here.</p>
    </li>    
    <li data-id="subheader-trending" data-button="Finish" >
        <h2>Let me Shop!</h2>
        <p>You can get back to shopping by clicking here.</p>
    </li>    
</ol>


<script type="text/javascript">

<?php if(isset($_GET['user'])){ ?>
    $(document).ready(function(){
        pagePresenter.enableLazyLoading = false;     
        closetPresenter.setUser(<?php echo $_GET['user']; ?>);
        pagePresenter.init();    
        //productPresenter.populateStore(closetPresenter.init);
        closetPresenter.init();        	
        productPagePresenter.init();	
        reviewsPresenter.init();
     });
<?php }else{ ?>
    function userDataReady(user){    
        pagePresenter.enableLazyLoading = false;
        pagePresenter.init();    
        //productPresenter.populateStore(closetPresenter.init);
        closetPresenter.init();     
        productPagePresenter.init();
        reviewsPresenter.init();       
        $("#subheader-myclositt").addClass("active");                
    }        
<?php } ?>

function loggedOut(){
	location.href = "<?php echo HOME_ROOT . 'signup.php'; ?>";
}

function startClosittTour(){
    if(firebase.loginCount <= 3){
        
        if (localStorage.myClositt == undefined || localStorage.myClositt == null){
            localStorage.myClositt = 1;   
        }        
        
        if (localStorage.myClositt < 5){
        	$('#joyRideTipContent').joyride({
                autoStart : true,                  
                modal:true,
                expose: false,
                preStepCallback : function (index, tip) {
                  if (index == 0) {
                    $(tip).find(".joyride-close-tip").text("Skip Tour");
                  }
                }
            });
        }
    			
    	localStorage.myClositt++;
    }
}

$(".joyride-start").click(function(e){
    startClosittTour();
});    


</script>

</body>
</html>
