<?php
if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.clothies.bprowd.com', 0);
	session_start();
}

$_SESSION['userid'] = 0;
?>
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="signup">

<h3>Clositt.com is an exclusive site. You must have login credentials to continue</h3>
<br><br>
    

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
	    <div class="control-group" style="margin: auto; width: 400px;">
		    <button type="submit" class="btn btn-primary">Authorize</button>
		    </div>
	    </div>
    </form>
</div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">
function loggedIn(){	
	
	firebase.$.child("Auth/Token").on('value',function(snapshot){	
			var token = snapshot.val();			
			
			$.post("auth.php", { auth: token }, function(data) {
				if(data == "success"){
					Messenger.info("You are now authorized to enter the site.");
				}else{
					Messenger.info("Not Authorized");
				}
			});
		});
}

$("form").on("submit",function(event){
	 event.preventDefault();
	 var valid = false;

     if($('#inputPassword').val().length > 5){
             valid = true;                    
     }else{     		 
             Messenger.error("Login information is incorrect!");        
     }

	if(valid){
		var email = $("#inputEmail").val();
		var password = $("#inputPassword").val();
		var remember = $("#remember").is(':checked');		
					  	
	  	firebase.login(email,password,remember);		    
	}else{
		Messenger.info("Not Authorized");	
		return false;
	}		
});

</script>
</body>
</html>