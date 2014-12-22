<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../app/globals.php');
include(dirname(__FILE__) . '/../static/meta.php');   

?>
<style type="text/css">
body{
	font-size:16px;
	line-height: 1.42857;
}

h2 {
    font-size: 30px;
    font-weight: bold;
}

.mainContent {
    padding: 20px;   
}

ul {
    padding: 0 40px;   
}

ul>li{
    list-style: hebrew outside none !important;   
}

ul>li>a{
    color: #666;
    text-decoration: none;   
}
</style>

</head>
<body>
<div class="wrapper">
    <?php include(dirname(__FILE__) . '/../static/header.php');   ?>
    
    <div class="mainContent">
        <a href="#" name="top"></a>
        <br><h2>Admin Pages</h2>   
        
        <hr>
        <ul>
            <li><a href="php/productSpider.php">Product Listing Spider</a></li>
            <li><a href="php/productDetailSpider.php">Product Detail Spider</a></li>
            <li><a href="php/search.php">Search Testing</a></li>
            <li><a href="php/tags.php">Tag Adminstration</a></li>
            <li><a href="php/colorProcessor.php">Color Processor</a></li>
            <li><a href="php/storeProductCount.php">Store Product Count</a></li>
            <li><a href="php/feedback.php">Feedback</a></li>
            <li><a href="php/reviews.php">Product Reviews</a></li>
            <li><a href="php/searchTerms.php">Search Terms</a></li>
            <li><a href="php/stats.php">User Stats</a></li>
            <li><a href="php/dataQuality.php">Data Quality</a></li>
            <li><a href="php/users.php">Users</a></li>
            <li><a id="elasticHealthCheck">Elasic Health Check</a></li>
            <li style="display:none;"><a id="populateTags">Populate Tags (Careful, this takes a while)</a></li>
        </ul>
        
        <br><br><br><h2>Bookmarklets <small>(drag link to bookmark toolbar)</small></h2>   
        
        <hr>
        <ul>
            <li><a href="javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.feld24.info/closetta/selectors.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/admin/js/storeApi.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/admin/js/productSpider.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/admin/js/productDetailApi.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/scripts/js/messenger.js';})();">Product Scraping - CSS Selector Helper</a></li>
            <li><a href="javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.feld24.info/closetta/genericProductPageScraper.js';})();">Product Scraping - Generic Scraping Script To Guess Where the Attributes are Automatically</a></li>
        </ul>
        
        <br><br><br> 
    </div>       
</div>

<?php include(dirname(__FILE__) . '/../static/footer.php'); ?>
<?php include(dirname(__FILE__) . '/../static/footerMeta.php'); ?>

<script type="text/javascript">
var adminPage = {
    
    init: function(){
        $(document).on("click","#populateTags", adminPage.populateTags); 
        $(document).on("click", "#elasticHealthCheck", adminPage.isElasticHealthy);  
    },
    
    populateTags: function(){
        var start = new Date().getTime();        
        
        $.post(window.HOME_ROOT + "t/updateproducttags", function(data){
            var end = new Date().getTime();
            var milleseconds = end - start;
            var minutes = (time / 1000) / 60;
            minutes = Math.round(minutes * 100) / 100;
            alert('Execution time (mins): ' + minutes);
            
            if (data.length > 100){
                $("body").text(data);
            }else{
                console.log(data);   
            }
        });
    },
    
    isElasticHealthy: function(){
        Messenger.alert("Checking elastic health...");
        $.get(window.HOME_ROOT + "spider/iselastichealthy", function(health){
            alert('Elastic is ' + health);            
        });   
    }    
}    

$(document).ready(function(){
    adminPage.init();    
});
</script>

</body>
</html>
