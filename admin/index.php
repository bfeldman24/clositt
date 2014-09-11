<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../app/globals.php');
include(dirname(__FILE__) . '/../static/meta.php');   

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
    list-style: hebrew outside none;   
}
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Admin Pages</h2>   
    
    <hr>
    <br/>
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
        <li><a id="elasticHealthCheck">Elasic Health Check</a></li>
        <li style="display:none;"><a id="populateTags">Populate Tags (Careful, this takes a while)</a></li>
    </ul>
    
    <br><h2>Bookmarklets <small>(drag link to bookmark toolbar)</small></h2>   
    
    <hr>
    <br/>
    <ul>
        <li><a href="javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.feld24.info/closetta/selectors.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/admin/js/storeApi.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/admin/js/productSpider.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/admin/js/productDetailApi.js';document.body.appendChild(document.createElement('script')).src='http://www.closetta.com/scripts/js/messenger.js';})();">Product Scraping - CSS Selector Helper</a></li>
        <li><a href="javascript:(function(){document.body.appendChild(document.createElement('script')).src='http://www.feld24.info/closetta/genericProductPageScraper.js';})();">Product Scraping - Generic Scraping Script To Guess Where the Attributes are Automatically</a></li>
    </ul>
    
    <br><br><br>        
</div>

<?php include(dirname(__FILE__) . '/../static/footer.php');   ?>
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
        $.get(window.HOME_ROOT + "spider/iselastichealthy", function(health){
            alert('Elastic is ' + health);            
        });   
    }    
}    

adminPage.init();
    
</script>

</body>
</html>
