<!DOCTYPE>
<html>
<head>
<title>Search Admin</title>

<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../../static/meta.php');   
?>

<style type="text/css">
body{
	font-size:16px;	
}

#mainContent{
  padding: 20px;      
}

#seach-bar-icon {
    cursor: pointer;
    display: block;
    height: auto;
    left: auto;
    padding: 5px 10px;
    position: relative;
    top: auto;
    width: 100%;
    z-index: 10;
}

#gototop{
    bottom: 10px;
    position: fixed;
    right: 10px;
    z-index: 9999;   
}

#clear{
    bottom: 10px;
    position: fixed;
    left: 10px;
    z-index: 9999;      
}
</style>

</head>
<body>
<div id="mainContent">
    <a href="#" name="top" id="top"></a>
    <br>
    <div class="row">
        <div class="col-xs-12 col-sm-8">
            <input type="text" class="form-control" id="search-bar"></input>
        </div>
        <div class="col-xs-12 col-sm-4">
            <div class="btn btn-success" id="seach-bar-icon">Search</div>
        </div>
    </div>
    <hr>
    
    <div id="main-workspace" style="display:none;"></div>    
    <div id="sample-grid-container"><div id="product-grid"></div></div>
    <a href="#top" id="clear">Clear Results</a>
    <a href="#top" id="gototop">Go To Top</a>    
</div>


<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
$(document).ready(function() {
    searchController.isSearchActive = true;
    firebase.init();
    pagePresenter.init();
	productPagePresenter.init();
	gridPresenter.init();
	productPresenter.init();	
	filterPresenter.init();	
	tagPresenter.init();
	searchController.init();	
	reviewsPresenter.init();		
	colorPresenter.init();	
});		

$("#clear").click(function(el){
    searchController.clearSearch(el);
    searchController.isSearchActive = true;    
});
</script>

</body>
</html>
