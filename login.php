<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="signup">
<?php 
print_r($_SESSION);
?>

<h1>Login</h1>
    

	<form class="form-horizontal" action="closet.php">
	    <div class="control-group">
		    <label class="control-label" for="inputEmail">Email</label>
		    <div class="controls">		  	  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-envelope"></i></span>
				<input type="text" id="inputEmail" placeholder="Email" class="input-xlarge">
			  </div>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputPassword">Password</label>
		    <div class="controls">
		    	<div class="input-prepend">
					<span class="add-on"><i class="icon-lock"></i></span>
					<input type="password" id="inputPassword" placeholder="Password" class="input-xlarge">		
			  	</div>		   		
		    </div>
	    </div>
	    <div class="control-group">
		    <div class="controls">
		    <label class="checkbox">
		    	<input type="checkbox" id="remember"> Remember me
		    </label>
		    <button type="submit" class="btn btn-primary">Login</button>
		    </div>
	    </div>
    </form>
</div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">
function loggedIn(){
	location.href= "/closet.php";	
}

$("form").on("submit",function(event){
	 event.preventDefault();
	 var valid = false;

     if($('#inputPassword').val().length > 5){
             valid = true;                    
     }else{     		 
             Messenger.error("Passwords do NOT match!");        
     }

	if(valid){
		var email = $("#inputEmail").val();
		var password = $("#inputPassword").val();
		var remember = $("#remember").is(':checked');		
					  	
	  	firebase.login(email,password,remember);		    
	}else{
		console.log("invalid");	
		return false;
	}		
});

</script>
</body>
</html>