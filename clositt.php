<?php require_once(dirname(__FILE__) . '/app/session.php'); ?>
<!DOCTYPE>
<html>
<head>

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
        				<img src="css/images/menu.png"/>
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
<div id="closetId" style="display:none;"><?php echo $_GET['user'];?></div>
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


</script>

</body>
</html>
