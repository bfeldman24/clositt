<?php require_once(dirname(__FILE__) . '/scripts/php/session.php'); ?>
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

<h1>Sign Up</h1>
    
	<form class="form-horizontal">
	    <div class="control-group">
		    <label class="control-label" for="inputName">Name</label>
		    <div class="controls">		  	  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-user"></i></span>
				<input type="text" id="inputName" placeholder="Name" class="input-xlarge">
			  </div>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputUsername">Username</label>
		    <div class="controls">		  	  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-asterisk"></i></span>
				<input type="text" id="inputUsername" placeholder="www.Clositt.com/!/USERNAME" class="input-xlarge">
			  </div>
		    </div>
	    </div>
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
					<input type="password" id="inputPassword2" placeholder="Confirm Password" class="input-xlarge">
			  	</div>		   		
		    </div>
	    </div>
	    <div class="control-group">
		    <div class="controls">
		    <label class="checkbox">
		    	<input type="checkbox" id="remember"> Remember me
		    </label>
		    <button type="submit" class="btn btn-primary">Sign up</button>
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
	 
     if($('#inputPassword').val().length > 5 && $('#inputPassword2').val().length > 5){
             if($('#inputPassword2').val() == $('#inputPassword').val()){                   
                     valid = true;                    
             }else{					              	
                     Messenger.error("Passwords do NOT match!");                     
             }
     }else{
             Messenger.error("Passwords do NOT match!");        
     }

	if(valid){
		var email = $("#inputEmail").val();
		var password = $("#inputPassword").val();
		var remember = $("#remember").is(':checked');
		var name = $("#inputName").val();
		var username = $("#inputUsername").val();		
	
		firebase.signup(email, password,remember,name, username);
	}else{
		console.log("invalid");	
	}
	
	return false;
});

</script>
</body>
</html>