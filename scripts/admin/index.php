<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   

?>
<style type="text/css">
body{
	font-size:16px;	
}

#mainContent{
  padding: 20px;      
}

ul>li>a{
    color: #666;
    text-decoration: none;   
}

ul>li{
    list-style: katakana outside none;   
}
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Links</h2>   
    
    <hr>
    <br/>
    <ul>
        <li><a href="php/productSpider.php">Product Listing Spider</a></li>
        <li><a href="php/productDetailSpider.php">Product Detail Spider</a></li>
        <li><a href="php/search.php">Search Testing</a></li>
        <li><a href="php/tags.php">Tag Adminstration</a></li>
        <li><a href="php/colorProcessor.php">Color Processor</a></li>
        <li><a href="php/storeProductCount.php">Store Product Count</a></li>
        <li><a href="php/onlineUsers.php">Online Users</a></li>
    </ul>
    
    <br><br><br>        
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php');   ?>
</body>
</html>
