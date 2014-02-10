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

	<div id= "contentContainer">
        	<div id="topBanner"> <span id="bannerText">Clositt is the best way to find, compare, and share, clothing from dozens of retailers <br> and help you find EXACTLY what you are looking for.</span>
        	</div>
        	 
        	<div id="leftContainer" class="homeGrid">
        		<div class="login-form">
        			<form id="signin" class="form-horizontal" action="clositt.php">
        				<h1 class="account">Got an Account? Sign in.</h1>
            			<div id="email">            			                         			  
            			    <input type="text" id="inputEmail" placeholder="Email" class="inputBox" />
            			</div>
        				<div id="password">	
        					<input type="password" id="inputPassword" placeholder="Password" class="inputBox" />		
        				</div>		   		
        				<div>	
        				    <button type="submit" id="loginButton" class="button submitButton">Login</button>
        				    <div class="forgotpass">Forgot Password?</div>
        				</div>
        			</form> 
        		</div> 	
        	
        		<div class="signup-form">
        			<form id="signup-form" class="form-horizontal" action="clositt.php">
        				<h1 class="account">Sign Up</h1>
        				<div id="signup-name">
            			   <input type="text" id="signup-inputName" placeholder="Full Name" class="inputBox" />
            			</div>
            			<div id="signup-email">
            			   <input type="text" id="signup-inputEmail" placeholder="Email" class="inputBox" />
            			</div>
        				<div id="signup-password">	
        				    <div class="input-prepend">                            
                                <input type="password" id="signup-inputPassword" placeholder="Password" class="signup-password">
                            </div>
                            <div class="input-append">
                                <input type="password" id="signup-inputPassword2" placeholder="Confirm" class="signup-password">
                            </div>
        				</div>		   		
        				<div>	
        				    <button type="submit" id="signupButton" class="button submitButton">Signup</button>
        				</div>
        			</form> 
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
	
	
<!-- Modal -->
<div id="forgotPassModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display:none;">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
        <h3 id="myModalLabel">Forgot Password</h3>
    </div>
    <div class="modal-body">
        <p>Please enter your email address so we can send you an email to reset your password:</p>
        <input type="text" id="forgotPasswordEmail" placeholder="Email" class="inputBox" />        
    </div>
    <div class="modal-footer">
        <button id="resetPassButton" class="btn btn-success">Reset My Password</button>
    </div>
</div>	
	
<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">
function loggedIn(){	
	
	firebase.$.child("Auth/Token").on('value',function(snapshot){	
			var token = snapshot.val();			
			
			$.post("app/auth.php", { auth: token, user: firebase.userid }, function(data) {
				if(data == "success"){					
				    location.href = "<?php echo HOME_ROOT; ?>";
				}
			});
		});
}

$("#signin").on("submit",function(event){
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


$("#signup-form").on("submit",function(event){
	 event.preventDefault();
	 var valid = false;
	 
     if($('#signup-inputPassword').val().length > 5 && $('#signup-inputPassword2').val().length > 5){
             if($('#signup-inputPassword2').val() == $('#signup-inputPassword').val()){                   
                     valid = true;                    
             }else{					              	
                     Messenger.error("Passwords do NOT match!");                     
             }
     }else{
             Messenger.error("Passwords do NOT match!");        
     }

	if(valid){
		var email = $("#signup-inputEmail").val();
		var password = $("#signup-inputPassword").val();
		var remember = $("#remember").is(':checked');
		var name = $("#signup-inputName").val();
		var username = $("#signup-inputUsername").val();		
	
		firebase.signup(email, password,remember,name, username);
	}else{
		console.log("invalid");	
	}
	
	return false;
});

$(".forgotpass").on("click", function(e){
   e.preventDefault(); 
   
   var email = $("#inputEmail").val();
   
   if (email != null){
        $("#forgotPasswordEmail").val(email);
   }
   
   $("#forgotPassModal").modal('show');
});

$("#resetPassButton").on("click", function(e){
    e.preventDefault();
    var email = $("#forgotPasswordEmail").val();
    
    if (email != null && email.indexOf("@") > 0){
        $("#forgotPassModal").modal('hide');
        
        firebase.authClient.sendPasswordResetEmail(email, function(error, success) {
            
            
          if (error) {
                Messenger.error("Sorry. There was an error sending you a reset password email!");                
                Messenger.error("Please contact us to reset your password.");
          }else{
                Messenger.success('We just sent you an email to reset your password.');
                Messenger.success('Please check that email and follow its instructions. Thanks!');
          }
        });
    }else{
        Messenger.error("Please enter a valid email address!");
    }
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
