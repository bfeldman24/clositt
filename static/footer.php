<footer class="clositt-theme">
	<div id="footer-wrapper">
		<div class="center footer-item">Clositt Inc &copy; 2014</div>
		<div class="footer-item"><a href="/contact-us.php">Contact Us</a></div>
		<div class="footer-item"><a href="/terms-of-service.php">Terms</a></div>
		<div class="last footer-item"><a href="/shout-outs.php">Shout Outs</a></div>
		
		<?php
		if((isset($_GET['ben']) && $_GET['ben'] != "") || (isset($_GET['eli']) && $_GET['eli'] != "")){
		?>
		<div class="last footer-item"><a href="/scripts/admin/php/productSpider.php" style="margin: 0 5px;">Upload</a></div>
		<?php } ?>						
	</div>
	
	<div class="feedback">
	   <div class="feedback-maximize">
    	   <div class="feedback-popup">
        	  <textarea class="feedback-textarea" rows="3" placeholder="What can we do better?"></textarea>
    	  </div>
    	  <div class="arrow-down"></div>
    	  <button class="feedback-submit-btn btn btn-mini" type="button">Submit</button>
    	  <div class="feedbackMinimize"><div class="minimize">-</div></div>
	  </div>
	  <div class="feedback-minimized" style="display:none;">
	      <button class="feedback-minimized-btn btn btn-success btn-mini" type="button">Feedback</button> 
	  </div>
	</div>
</footer>


<!-- Modal -->
<div id="signinModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display:none;">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3 id="myModalLabel">Log in or Sign up</h3>
    </div>
    <div class="modal-body">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#loginModalTab" data-toggle="tab">Log in</a></li>
            <li><a href="#signupModalTab" data-toggle="tab">Sign Up</a></li>
        </ul>
      	
      	<div class="tab-content">
      	    <div id="loginModalTab" class="login-form tab-pane active">
        		<form id="signin" class="form-horizontal" action="clositt.php">
        			<h3 class="account">Got an Account? Log in.</h3>
        			<div id="signinModalEmail">            			                         			  
        			    <input type="text" id="loginModalTab-inputEmail" placeholder="Email" class="inputBox" />
        			</div>
        			<div id="password">	
        				<input type="password" id="loginModalTab-inputPassword" placeholder="Password" class="inputBox" />		
        			</div>		   		
        			<div>	        			    
        			    <div class="forgotpass">Forgot Password?</div>
        			</div>
        		</form> 
        	</div> 	
        
        	<div id="signupModalTab" class="signup-form tab-pane">
        		<form id="signup-form" class="form-horizontal" action="clositt.php">
        			<h3 class="account">New to Clositt? Sign up.</h3>
        			<div id="signinModalName">
        			   <input type="text" id="signupModalTab-inputName" placeholder="Full Name" class="inputBox" />
        			</div>
        			<div id="signup-email">
        			   <input type="text" id="signupModalTab-inputEmail" placeholder="Email" class="inputBox" />
        			</div>
        			<div id="signinModalPassword">	
        			    <div class="input-prepend">                            
                            <input type="password" id="signupModalTab-inputPassword" placeholder="Password" class="signup-password">
                        </div>
                        <div class="input-append">
                            <input type="password" id="signupModalTab-inputPassword2" placeholder="Confirm" class="signup-password">
                        </div>
        			</div>		   		        			
        		</form> 
        	</div>
      	</div>
    </div>
    <div class="modal-footer">
        <button type="submit" id="signupModalLoginButton" class="btn btn-success">Login</button>
    </div>
</div>	

<!-- Forgot Password Modal -->
<div id="forgotPassModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display:none;">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
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

<?php echo CLOSITT_JS; ?>

<script type="text/javascript">
$(document).ready(function() {
    firebase.init();
    Messenger.init();       
});

$(".feedback .feedback-submit-btn").on("click",function(e){
	e.preventDefault();
	$(e.currentTarget).addClass("disabled").text("Submitting...");

	var feedbackTextArea = $(e.currentTarget).parents(".feedback").find(".feedback-textarea");
	var message = feedbackTextArea.val().trim();
	
	if(message.length > 0){
	    var feedback = { e: firebase.email, n: firebase.username, i: firebase.userid, s: "CLOSITT FEEDBACK", m: message };
	   
		$.post("/app/email.php", feedback, function(data) {
			if(data == "success"){
				Messenger.success("Thanks for your feedback!");

				delete feedback.s;
				firebase.$.child("feedback").push(feedback);
				feedbackTextArea.val("");				
			}else{
				Messenger.error("There was a problem sending your feedback. Please try again.");	
			}
			
			$(e.currentTarget).removeClass("disabled").text("Submit");
		});
	}else{
		Messenger.error("Type your feedback into the input!");	
	}
	
	return false;
});

$(".feedbackMinimize").on("click", function(e){
    var feedbackPopup = $(e.currentTarget).parents(".feedback");
    feedbackPopup.find(".feedback-maximize").hide('fade');
    feedbackPopup.find(".feedback-minimized").show('fade');
});

$(".feedback-minimized-btn").on("click", function(e){
    var feedbackPopup = $(e.currentTarget).parents(".feedback");
    feedbackPopup.find(".feedback-maximize").show('fade');
    feedbackPopup.find(".feedback-minimized").hide('fade');
});

$("#subheader-myclositt").on('click', function(e){
    if (firebase.isLoggedIn){
        $("#subheader-myclositt").off('click');
    }else{
        e.preventDefault();
        Messenger.error("We'd love to show you your Clositt, but first you need to sign in.");
        $("#signinModal").modal('show');
        return false;
    } 
});

$('#signinModal a[data-toggle="tab"]').on('shown', function (e) {     
    if($(e.target).attr("href") == "#loginModalTab"){
        $("#signupModalLoginButton").text("Login");
    }else{
        $("#signupModalLoginButton").text("Sign Up");   
    }        
})

$('#loginModalTab-inputPassword, #signupModalTab-inputPassword2, #signupModalTab-inputPassword').keyup(function(e) {
    e.preventDefault();	 
    
    // on enter
    if(e.keyCode == 13) {        
        submitSigninModal();
    }
    
    return false;
});


$("#signupModalLoginButton").on("click",function(event){
	event.preventDefault();
	submitSigninModal();	 	 	 	
	return false;
});

function submitSigninModal(){
    if ($('#signinModal li.active a[data-toggle="tab"]').attr("href") == "#loginModalTab"){
            if($('#loginModalTab-inputPassword').val().length > 5){
     
         		var email = $("#loginModalTab-inputEmail").val();
         		var password = $("#loginModalTab-inputPassword").val();
         		var remember = false;		
         					  	
         		sessionStorage.goToClositt = true;			  	
         	  	firebase.login(email,password,remember);		    
         	  	$("#signupModalLoginButton").addClass("disabled").text("Logging in...");
         	}else{
         		Messenger.info("Login information is incorrect");	
         	} 
	       
	 }else{	 	 
	        var valid = false;
	      
	        
            if($('#signupModalTab-inputPassword').val().length > 5 && $('#signupModalTab-inputPassword2').val().length > 5){
                    if($('#signupModalTab-inputPassword2').val() == $('#signupModalTab-inputPassword').val()){                   
                            valid = true;                    
                    }else{					              	
                            Messenger.error("Passwords do NOT match!");                     
                    }
            }else{
                    Messenger.error("Passwords do NOT match!");        
            }
          
          	if(valid){
          		var email = $("#signupModalTab-inputEmail").val();
          		var password = $("#signupModalTab-inputPassword").val();
          		var remember = false;
          		var name = $("#signupModalTab-inputName").val();
          		var username = $("#signupModalTab-inputUsername").val();		
          	
          	    sessionStorage.goToClositt = true;
          		firebase.signup(email, password,remember,name, username);
          		$("#signupModalLoginButton").addClass("disabled").text("Signing up...");
          	}else{
          		console.log("invalid");	
          	}
	 }
}

$(".forgotpass").on("click", function(e){
   e.preventDefault(); 
   
   var email = $("#inputEmail").val();
   
   if (email == null){
        email = $("#loginModalTab-inputEmail").val();
   }
   
   if (email != null){
        $("#forgotPasswordEmail").val(email);
   }
   
   $(".modal").modal('hide');
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

</script>

<script type="text/javascript">
  var vglnk = { api_url: '//api.viglink.com/api',
                key: 'ace9fa11ba4e122d7318924968832a6d' };

  (function(d, t) {
    var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
    s.src = ('https:' == document.location.protocol ? vglnk.api_url :
             '//cdn.viglink.com/api') + '/vglnk.js';
    var r = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r);
  }(document, 'script'));
</script>
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-39518320-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
