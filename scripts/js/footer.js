var footer = {
    init: function(){
        
    }  
};

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

$('#signinModal').on('shown', function () {
    $("#loginModalTab-inputEmail").focus();
})

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

function showSigninModal(){
    $("#signinModal").modal('show');   
}

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