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

#stats{
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
        <h2>User Stats</h2>        
        
        <br>
        
        <div id="loadingMask"><img src="../../css/images/loading.gif" style="height:50px;"/></div>
        
        <div id="stats"></div>        
    </div>
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php'); ?>
<?php include(dirname(__FILE__) . '/../../static/footerMeta.php'); ?>

<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
var Feedback = {
    init: function(){
        
        $.post(window.HOME_ROOT + "s/getall", function(stats){        
            $table = $("<table>").attr("id","stats").addClass("table table-striped table-hover table-bordered table-condensed table-responsive");
             $table.append(
    	          $("<tr>").append(
    	              $("<th>").html("UserId")
    	          ).append(
    	              $("<th>").html("Name")
    	          ).append(
    	              $("<th>").html("IP")
    	          ).append(
    	              $("<th>").html("Action")
    	          ).append(
    	              $("<th>").html("Sku")
    	          ).append(
    	              $("<th>").html("Closetid")
    	          ).append(
    	              $("<th>").html("Detail")
    	          ).append(
    	              $("<th>").html("Info")
    	          ).append(
    	              $("<th>").html("Timestamp")
    	          )
    	      );
        
            

		     for(var i=0; i < stats.length; i++){
    			     
        		      $table.append(
        		          $("<tr>").append(
        		              $("<td>").html(stats[i]["userid"])
        		          ).append(
        		              $("<td>").html(stats[i]["name"])
        		          ).append(
        		              $("<td>").html(stats[i]["ip"])
        		          ).append(
        		              $("<td>").html(stats[i]["action"])
        		          ).append(
        		              $("<td>").html(stats[i]["sku"])
        		          ).append(
        		              $("<td>").html(stats[i]["closetid"])
        		          ).append(
        		              $("<td>").html(stats[i]["detail"])
        		          ).append(
        		              $("<td>").html(stats[i]["info"])
        		          ).append(
        		              $("<td>").html(stats[i]["timestamp"])
        		          )
        		      );
		     }				
    		
    		
    		$("#stats").append($table);
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
