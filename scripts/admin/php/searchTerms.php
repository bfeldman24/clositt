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

</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Search Terms</h2>        
    
    <br>
    <ul id="feedback"><li id="loadingMask"><img src="../../../css/images/loading.gif" style="height:50px;"/></li></ul>                                       
</div>

<?php include(dirname(__FILE__) . '/../../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script type="text/javascript">
var Feedback = {
    init: function(){
        firebase.$.child("search").once('value', function(search){
			 search.forEach(function(term){
			      			     
    		      $("#feedback").append(
    		          $("<li>").html(term.name())    		          
    		      );				
    		 
    		      var users = '';
    		      term.forEach(function(user){
    		          if (users != ''){
    		              users += " & ";    
    		          }
    		          
    		          users += user.child("user").val();
    		      });
    		               		      
    		      console.log(term.name() + "," + users); 
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
