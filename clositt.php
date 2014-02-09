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
	<h1><span id="user-closet-title"></span></h1>
	
	<?php if(!isset($_GET['user'])){ ?>	                 
           
           <ul id="closet-settings" class="nav pull-right">                              	
        	 		<li class="dropdown">
        			<a href="#" class="dropdown-toggle" data-toggle="dropdown">
        				<i class="minicon-single settings-minicon"></i>							
        			</a>
        			<ul class="dropdown-menu dropdown-menu-right">
        			     <li class="menu-settings"><a class="menu-settings"><i class="icon-pencil"></i> Edit</a></li>
                         <li class="disabled"><a class="menu-save"><i class="icon-ok"></i> Save</a></li>                  
        			</ul>
        		</li>	              	
            </ul>
           
            <!--
            <div class="navbar navbar-static" id="navbar-example">
              <div class="navbar-inner">
                <div style="width: auto;" class="container">                                    
                  <ul class="nav pull-right">
                    <li class="dropdown open" id="fat-menu">
                      <a data-toggle="dropdown" class="dropdown-toggle" role="button" id="drop3" href="#">Dropdown 3 <b class="caret"></b></a>
                      <ul aria-labelledby="drop3" role="menu" class="dropdown-menu">
                        <li role="presentation"><a href="#" tabindex="-1" role="menuitem">Action</a></li>
                        <li role="presentation"><a href="#" tabindex="-1" role="menuitem">Another action</a></li>
                        <li role="presentation"><a href="#" tabindex="-1" role="menuitem">Something else here</a></li>
                        <li class="divider" role="presentation"></li>
                        <li role="presentation"><a href="#" tabindex="-1" role="menuitem">Separated link</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            -->            

		    <div id="closet-share" data-toggle="tooltip" data-placement="left" title="Share it!">
    		      <img class="social-people-icon" src="css/images/social/social-people.png" />
    		</div>
    		<div id="social-btns" class="social-btns" style="display:none;"></div>				
        
	<?php } ?>

	<div id="closet-list"></div>
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
