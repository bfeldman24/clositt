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

#feedback{
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
    <br><h2>Feedback</h2>        
    
    <br>
    <ul id="feedback"><li id="loadingMask"><img src="../../../css/images/loading.gif" style="height:50px;"/></li></ul>                                       
</div>

<?php include(dirname(__FILE__) . '/../../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
var Feedback = {
    init: function(){
        firebase.$.child("feedback").once('value', function(feedback){
			 feedback.forEach(function(comment){
			      var user = '';
			      
			      if (comment.hasChild("e")){
			         user = "<span class='user'>" + comment.child("e").val() + ")</span> ";  
			      }
			     
    		      $("#feedback").append(
    		          $("<li>").html(user + comment.child("m").val())    		          
    		      );				
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
