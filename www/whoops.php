<?php
require_once(dirname(__FILE__) . '/../app/session.php');

$page = $_SERVER[REQUEST_URI];

if (!strpos($page, "whoops.php")){
    header( 'Location: ' . HOME_ROOT .  "whoops.php");	
}

?>
<!DOCTYPE>
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
        	   <span id="bannerText">Whoops! Looks like we cannot find the page you are looking for.</span>
    	   </div>
    	</div>
   </div>     	
   
   <div id= "row">     	 
    	<div class="homeGrid col-xs-12 col-sm-4 col-sm-offset-1">
			<div id="goback">
    			<h1 class="waitList">What you can do from here:</h1> <br>

    			<p><span><a onclick="window.history.back()" >Go back</a></span></p>
    			<p><span><a href="<?php echo HOME_ROOT; ?>" >Go home</a></span></p>
    			<p><span><a href="<?php echo CONTACT_PAGE; ?>" >Contact us to let us know of the problem</a></span></p>
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
