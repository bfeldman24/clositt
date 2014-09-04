<?php
require_once(dirname(__FILE__) . '/app/globals.php');

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
<link type="text/css" rel="stylesheet" href="css/WelcomeV2-style.css"/>
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="mainContainer">

	<div id= "row">
        	<div class="col-xs-12 col-sm-10 col-sm-offset-1"> 
        	   <div id="topBanner" >
            	   <span id="bannerText">Clositt is the best way to find, compare, and share, clothing from dozens of retailers and help you find EXACTLY what you are looking for.</span>
        	   </div>
        	</div>
   </div>     	
   
   <div id= "row">     	 
    	<div class="homeGrid col-xs-12 col-sm-4 col-sm-offset-1">
    		<div class="login-form">
    			<form id="signin" action="clositt.php">
    				<h1 class="account">Got an Account? Sign in.</h1>
        			<div id="email">            			                         			  
        			    <input type="text" id="inputEmail" placeholder="Email" class="inputBox form-control" />
        			</div>
    				<div id="password">	
    					<input type="password" id="inputPassword" placeholder="Password" class="inputBox form-control" />		
    				</div>		   		
    				<div>	
    				    <button type="submit" id="loginButton" class="button submitButton center-block">Login</button>
    				    <div class="forgotpass">Forgot Password?</div>
    				</div>
    			</form> 
    		</div> 	
    	
    		<div class="signup-form">
    			<form id="signup-form" action="clositt.php">
    				<h1 class="account">Sign Up</h1>
    				<div id="signup-name">
        			   <input type="text" id="signup-inputName" placeholder="Full Name" class="inputBox form-control" />
        			</div>
        			<div id="signup-email">
        			   <input type="text" id="signup-inputEmail" placeholder="Email" class="inputBox form-control" />
        			</div>
    				<div id="signup-password">	                            
                            <input type="password" id="signup-inputPassword" placeholder="Password" class="signup-password form-control">
                            <input type="password" id="signup-inputPassword2" placeholder="Confirm" class="signup-password form-control">
    				</div>		   		
    				<div>	
    				    <button type="submit" id="signupButton" class="button submitButton center-block">Signup</button>
    				</div>
    			</form> 
    		</div> 	
    	</div>
    	
    	<div class="homeGrid hidden-xs col-sm-6"> 
    	    <div id="rightBanner">
        		<h1 class="stop">STOP SEARCHING...</h1>
        		<h1 class="start">START FINDING</h1>
        		<div id="bannerImage"><img src="<?php echo HOME_ROOT; ?>css/images/Hangers_Fullsize.jpg" /></div>
    		</div>
    	</div>
    </div>
</div>
	
	
<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">
function loggedIn(){							
    location.href = window.HOME_ROOT;
}

$("#signin").on("submit",function(event){
	 event.preventDefault();

     if($('#inputPassword').val().length > 5){

		var email = $("#inputEmail").val();
		var password = $("#inputPassword").val();
		var remember = $("#remember").is(':checked');		
					  	
	  	session.login(email,password,remember);		    
	}else{
		Messenger.info("Login information is incorrect");	
		return false;
	}		
});


$("#signup-form").on("submit",function(event){
	 event.preventDefault();
	 var valid = false;
	 
     if($('#signup-inputPassword').val().length >= 7 && $('#signup-inputPassword2').val().length >= 7){
             if($('#signup-inputPassword2').val() == $('#signup-inputPassword').val()){                   
                     valid = true;                    
             }else{					              	
                     Messenger.error("Passwords do NOT match!");                     
             }
     }else{
             Messenger.error("Passwords must be at least 7 characters long!");        
     }

	if(valid){
		var email = $("#signup-inputEmail").val();
		var password = $("#signup-inputPassword").val();
		var remember = $("#remember").is(':checked');
		var name = $("#signup-inputName").val();
		var username = $("#signup-inputUsername").val();		
	
		session.signup(email, password,remember,name, username);
	}else{
		console.log("invalid");	
	}
	
	return false;
});

$("#waitinglist").on("submit",function(event){
	event.preventDefault();
    firebase.addToWaitingList($("#joinEmail").val(), waitingListCallback);
    
    return false;   
});

function waitingListCallback(success){
    if(success){
        $("#joinEmail").val("");
    }
}

</script>
</body>
</html>
