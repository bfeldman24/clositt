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
	    var feedback = {t: "feedback", e: session.email, n: session.username, i: session.userid, s: "CLOSITT FEEDBACK", m: message };
	   
		$.post(window.HOME_ROOT + "app/email.php", feedback, function(data) {
			if(data == "success"){
				Messenger.success("Thanks for your feedback!");
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
    if (session.isLoggedIn){
        $("#subheader-myclositt").off('click');
    }else{
        e.preventDefault();
        Messenger.error("We'd love to show you your Clositt, but first you need to sign in.");
        $("#loginSignupModal").modal('show');        
        return false;
    } 
});

$('#loginSignupModal').on('shown.bs.modal', function(e){
    $("#loginModalTab-inputEmail").focus();
});

$('#loginModalTab-inputPassword, #signupModalTab-inputPassword2, #signupModalTab-inputPassword').keyup(function(e) {
    e.preventDefault();	 
    
    // on enter
    if(e.keyCode == 13) {        
        submitSigninModal();
    }
    
    return false;
});


$("#signupModalSubmit, #loginModalSubmit").on("click",function(event){
	event.preventDefault();
	submitSigninModal();	 	 	 	
	return false;
});

$(".showLoginTab").on("click", function(event){
    $('#loginModalTabBtn').tab('show');
});

$(".showSignupTab").on("click", function(event){
    $('#signupModalTabBtn').tab('show');
});

function submitSigninModal(){
    if ($('#loginSignupModal li.active a[data-toggle="tab"]').attr("href") == "#loginModalTab"){
            if($('#loginModalTab-inputPassword').val().length > 5){
     
         		var email = $("#loginModalTab-inputEmail").val();
         		var password = $("#loginModalTab-inputPassword").val();
         		var remember = true;		
         					  	
         		sessionStorage.goToClositt = true;			  	
         	  	session.login(email,password,remember);		             	  	
         	}else{
         		Messenger.info("Login information is incorrect");	
         	} 
	       
	 }else{	 	 
	        var valid = false;
	      
	        
            if($('#signupModalTab-inputPassword').val().length > 5){                    
                valid = true;                    
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
          		session.signup(email, password,remember,name, username);
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
        	  
		$.post(window.HOME_ROOT + "u/resetpass", {email: email}, function(data) {
			if(data == "success"){
				Messenger.success('We just sent you an email to reset your password.');
                Messenger.success('Please check that email and follow its instructions. Thanks!');
			}else{
				Messenger.error("Sorry. There was an error sending you a reset password email!");                
                Messenger.error("Please contact us to reset your password.");
			}			
		});
    }else{
        Messenger.error("Please enter a valid email address!");
    }
});