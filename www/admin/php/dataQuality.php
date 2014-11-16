<!DOCTYPE>
<html>
<head>
<title>Data Quality Admin</title>

<?php 
require_once(dirname(__FILE__) . '/../../../app/session.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
require_once(dirname(__FILE__) . '/../../../app/Controller/DataQualityAdminController.php'); 

/*
$dataQualityAdminController = new DataQualityAdminController();
$results = $dataQualityAdminController->get(7);        
echo $results;
*/
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

.viewlink {
    background: none repeat scroll 0 0 #f5f5f5;
    height: 75px;
    opacity: 0.7;
    overflow: hidden;
    position: absolute;
    top: 15%;
    width: 100%;
    text-align: center;
}

.bottom {
    background: none repeat scroll 0 0 #f0f0f0;
    font-size: 14px;
    line-height: 1.3em;
    padding: 5px;
}

h2 {
    color: #666;
    font-size: 32px;
    font-weight: bold;
}

h4 {
    color: #333;
    font-size: 24px;
}
</style>

</head>
<body>
<div id="mainContent">
    <a href="#" name="top" id="top"></a>
    <h2>Data Quality</h2><br />
    <div class="btn-group dataQualityBtns">
      <button type="button" class="btn btn-primary">1</button>
      <button type="button" class="btn btn-primary">2</button>
      <button type="button" class="btn btn-primary">3</button>
      <button type="button" class="btn btn-primary">4</button>
      <button type="button" class="btn btn-primary">5</button>
      <button type="button" class="btn btn-primary">6</button>
      <button type="button" class="btn btn-primary">7</button>
      <button type="button" class="btn btn-primary">8</button>
      <button type="button" class="btn btn-primary">9</button>
      <button type="button" class="btn btn-primary">10</button>
      <button type="button" class="btn btn-primary">11</button>
    </div>
    <br /><br />
    <h4 id="queryDesc"></h4>
    
    <section id="sample-grid-container" class="items">
        <div class="container">           
            <div id="product-grid" class="row box-row"></div>
        </div>
    </section>       
</div>


<?php include(dirname(__FILE__) . '/../../static/footerMeta.php');   ?>
<?php echo CLOSITT_JS; ?>
<script type="text/javascript">

var dataQualityAdmin = {    
    
    init: function(){
        $(document).on("click", ".dataQualityBtns .btn", dataQualityAdmin.getProducts);
    },
    
    getProducts: function(e){
        $(".dataQualityBtns .btn").removeClass("active");
        $(e.currentTarget).addClass("active");
        var queryNum = $(e.currentTarget).text();
        
        $.post( window.HOME_ROOT + "qa/get", {queryNumber: queryNum}, function(result){    	 			   			  
 			  if (result != null) {
 			    	$("#queryDesc").text(result.queryDesc);
 			    	$("#product-grid").html(result.products);
 			    	
 			    	if (result.products.length < 10){
 			    	   Messenger.error("No products were found", 1500);
 			    	} 			   	
			  } else {    						    						
					Messenger.error("Error: Could not get the products");
			  }
        }, "json");
    }  
};


$(document).ready(function() {
	productPagePresenter.init();
	productPresenter.init();		
	dataQualityAdmin.init();
});		
</script>

</body>
</html>
