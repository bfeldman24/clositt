<?php require_once(dirname(__FILE__) . '/../app/session.php'); ?>
<!DOCTYPE HTML>
<html>
<head>
<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Monoton|Roboto+Slab|Roboto"/>
<link type="text/css" rel="stylesheet" href="css/WelcomeV2-style.css"/>
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="mainContainer">

	<div id= "row">
    	<div class="col-xs-12 col-sm-10 col-sm-offset-1"> 
    	   <div id="topBanner" >
        	   <span id="bannerText">Shout Outs</span>
    	   </div>
    	</div>
   </div>     	
   
   <div id= "row">     	 
    	<div class="homeGrid col-xs-12 col-sm-4 col-sm-offset-1">
    		<div id="leftContainer" class="homeGrid">
        		<div id="goback">
        			<p>A special thanks to <a href="http://www.webalys.com/minicons">Minicons Free Vector Icons Pack</a>, <a href="http://glyphicons.com/">Glyphicons</a>, <a href="https://www.iconfinder.com/iconsets/pictype-free-vector-icons">Timothy Miller</a>, and <a href="http://ionicons.com/">Ionicons</a> for the creative icons!</a>        			
        		</div>        	
        	</div>	
    	</div>
    	
    	<div class="homeGrid hidden-xs col-sm-6"> 
    	    <div id="rightBanner">
        		<h1 class="stop">STOP SEARCHING...</h1>
        		<h1 class="start">START FINDING</h1>
        		<div id="bannerImage"><img src="<?php echo HOME_ROOT; ?>css/images/Hangers_Fullsize.jpg" /></div>
    		</div>
    	</div>
    </div>
</div>
	
<?php include(dirname(__FILE__) . '/static/footer.php');   ?>

</body>
</html>