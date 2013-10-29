<?php
require_once(dirname(__FILE__) . '/globals.php');

if (!isset($_SESSION)) {
	//any subdomains, including "www.mydomain.com" will be included in the session. 
	session_set_cookie_params('', '/', '.' . DOMAIN, 0);
	session_start();
}

$_SESSION['userid'] = 0;
?>
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Monoton|Roboto+Slab|Roboto"/>
<link type="text/css" rel="stylesheet" href="WelcomeV2-style.css"/>
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>




<div id="mainContainer">

	<div id= "contentContainer">
	<div id="topBanner"> <span id="bannerText">Clositt is the best way to find, compare, and share, clothing from dozens of retailers <br> and help you find EXACTLY what you are looking for.</span>
	</div>
	 
	<div id="leftContainer" class="homeGrid">
		<div id="join">
			<!need to insert sign up form here>
			<h1 class="waitList">Join the wait list <br> for a Clositt account</h1> 
			<input type="text" id="joinEmail" placeholder="Sign up for Clositt" class="inputBox">
			<button type="submit" id="joinButton" class="button">Join Clositt</button
		</div>
	
		<div id="login">
			<form class="form-horizontal" action="closet.php">
				<h1 class="account">Got an Account? Signin.</h1>
			<div id="email">
			<input type="text" id="inputEmail" placeholder="Email" class="inputBox">
				</div>
					<div id="password">	
					<input type="password" id="inputPassword" placeholder="Password" class="inputBox">		
					</div>		   		
					<div>	
						 <button type="submit" id="loginButton" class="button">Login</button>
					</div>
				</div> 
		</div> 	
	</div>
	
	<div id="rightBanner" class="homeGrid"> 
		<h1 class="stop">STOP SEARCHING...</h1>
		<h1 class="start">START FINDING</h1>
		<div id="bannerImage"></div>
	</div>
</div>
</div>			 
	    </div>
    </form>
</div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">
function loggedOut(){
	Messenger.info("You are not Authorized to enter the site");
}

function loggedOutError(){
	Messenger.info("You are not Authorized to enter the site");
}

function loggedIn(){	
	
	firebase.$.child("Auth/Token").on('value',function(snapshot){	
			var token = snapshot.val();			
			
			$.post("auth.php", { auth: token, user: firebase.userid }, function(data) {
				if(data == "success"){
					Messenger.info("You are now authorized to enter the site.");
					setTimeout(function(){
						location.href = "<?php echo HOME_ROOT; ?>";
					}, 2000);
				}else{
					Messenger.info("Not Authorized");
				}
			});
		});
}

$("form").on("submit",function(event){
	 event.preventDefault();

     if($('#inputPassword').val().length > 5){

		var email = $("#inputEmail").val();
		var password = $("#inputPassword").val();
		var remember = $("#remember").is(':checked');		
					  	
	  	firebase.login(email,password,remember);		    
	}else{
		Messenger.info("Login information is incorrect");	
		return false;
	}		
});

</script>
</body>
</html>
