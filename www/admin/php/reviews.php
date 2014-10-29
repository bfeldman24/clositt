<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
?>
<style type="text/css">
body{
	font-size:16px;	
	line-height: 1.42857;
}

h2 {
    font-size: 30px;
}

h1, .h1, h2, .h2, h3, .h3 {
    margin-bottom: 10px;
    margin-top: 20px;
}

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
    color: inherit;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
}

th{
 font-weight: bold;   
}

#mainContent{
  padding: 20px;      
}

li{
    list-style: decimal outside none;   
}

#reviews{
    margin-bottom: 50px;   
}

.user{
    font-weight: bolder;   
}
</style>

</head>
<body>
<div class="wrapper">
    <?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
    <div id="mainContent">
        <a href="#" name="top"></a>
        <h2>Reviews</h2>        
        
        <br>
        
        <div id="loadingMask"><img src="../../css/images/loading.gif" style="height:50px;"/></div>
        
        <table id="reviews" class="table table-striped table-hover table-bordered table-condensed table-responsive"></table>                                        
    </div>
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php'); ?>
<?php include(dirname(__FILE__) . '/../../static/footerMeta.php'); ?>

<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
var Feedback = {
    init: function(){
        
        $.post(window.HOME_ROOT + "r/getall", function(reviews){        
            
             $("#reviews").append(
    	          $("<tr>").append(
    	              $("<th>").html("User")
    	          ).append(
    	              $("<th>").html("Date")
    	          ).append(
    	              $("<th>").html("SKU")
    	          ).append(
    	              $("<th>").html("Rating")
    	          ).append(
    	              $("<th>").html("Comment")
    	          )
    	      );
    
			 for (var sku in reviews){
			     for(var i=0; i < reviews[sku].length; i++){
      			     
          		      $("#reviews").append(
          		          $("<tr>").append(
          		              $("<td>").html(reviews[sku][i]["n"])
          		          ).append(
          		              $("<td>").html(reviews[sku][i]["d"])
          		          ).append(
          		              $("<td>").html(reviews[sku][i]["s"])
          		          ).append(
          		              $("<td>").html(reviews[sku][i]["r"])
          		          ).append(
          		              $("<td>").html(reviews[sku][i]["c"])
          		          )
          		      );
			     }				
    		}
    		
    		$("#loadingMask").remove();
		}, "json");
    }
};

$(document).ready(function(){
   Feedback.init();
});
</script>
</body>
</html>
