<!DOCTYPE>
<html>
<head>
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
<?php include(dirname(__FILE__) . '/../../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Reviews</h2>        
    
    <br>
    
    <div id="loadingMask"><img src="../../../css/images/loading.gif" style="height:50px;"/></div>
    
    <table id="reviews" class="table table-striped table-hover table-bordered table-condensed table-responsive"></table>                                        
</div>

<?php include(dirname(__FILE__) . '/../../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
var Feedback = {
    init: function(){
        firebase.$.child("reviews").once('value', function(reviews){
            
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
    
			 reviews.forEach(function(product){
			     product.forEach(function(review){
      			     
          		      $("#reviews").append(
          		          $("<tr>").append(
          		              $("<td>").html(review.child("name").val())
          		          ).append(
          		              $("<td>").html(review.child("date").val())
          		          ).append(
          		              $("<td>").html(review.child("sku").val())
          		          ).append(
          		              $("<td>").html(review.child("rating").val())
          		          ).append(
          		              $("<td>").html(review.child("comment").val())
          		          )
          		      );
			     });				
    		});	
    		
    		$("#loadingMask").remove();
		});
    }
};

$(document).ready(function(){
   Feedback.init();
});
</script>
</body>
</html>
