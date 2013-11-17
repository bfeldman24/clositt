<?php
require_once(dirname(__FILE__) . '/globals.php');

if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.' . DOMAIN, 0);
	session_start();
}

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

	<div id= "contentContainer">
        	<div id="topBanner"> <span id="bannerText">Whoops! Looks like we cannot find the page you are looking for.</span>
        	</div>
        	 
        	<div id="leftContainer" class="homeGrid">
        		<div id="goback">
        			<h1 class="waitList">What you can do from here:</h1> <br>

        			<p><span><a onclick="window.history.back()" >Go back</a></span></p>
        			<p><span><a href="/" >Go home</a></span></p>
        			<p><span><a href="/contact-us.php" >Contact us to let us know of the problem</a></span></p>
        		</div>        	
        	</div>
        	
        	<div id="rightBanner" class="homeGrid"> 
        		<h1 class="stop">STOP SEARCHING...</h1>
        		<h1 class="start">START FINDING</h1>
        		<div id="bannerImage"></div>
        	</div>
        </div>
    </div>
</div>
	
<?php include(dirname(__FILE__) . '/static/footer.php');   ?>

</body>
</html>