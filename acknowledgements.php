<?php require_once(dirname(__FILE__) . '/scripts/php/session.php'); ?>
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
        	<div id="topBanner"> <span id="bannerText">Shout Outs</span>
        	</div>
        	 
        	<div id="leftContainer" class="homeGrid">
        		<div id="goback">
        			<p>A special thanks to <a href="http://www.webalys.com/minicons">Minicons Free Vector Icons Pack</a> and <a href="http://glyphicons.com/">Glyphicons</a> for the creative icons!</a>
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