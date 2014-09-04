var session = {
    userid: null,
	name: null,
	nickname: null,
	email: null,
	isLoggedIn: false,
	loginCount: -1,
	
	init: function(){	   
	   if (sessionInit.active){
	       session.userid = sessionInit.userid;
	       session.email = sessionInit.email;
	       session.name = sessionInit.name;   
	       session.nickname = session.name.split(" ")[0];
	       session.isLoggedIn = true;	       	       
	       session.userDataAvailableCallback();
    	   session.updateLoggedInDropdownMenu();
	       session.loggedInCallback();
	   }else{
	       session.updateLoggedOutDropdownMenu();
	       session.loggedOutCallback();
	   }	   	   
	},
	
	login: function(email, password, remember){
		
		$.post( window.HOME_ROOT + "u/login", {e: email, p: password, remember: remember }, function(result){
	          try{
	               var user = JSON.parse(result);
	               
	               if (typeof user == "object" && user.id && user.n && user.e){    			    
     			     session.userid = user.id;
     			     session.name = user.n;
     			     session.email = user.e;
     			     session.isLoggedIn = true; 			     
     			     session.loggedInCallback(); 
	               }      
	          }catch(e){
	               Messenger.error("The username/password were incorrect! Please try again."); 		               
 			  }	
 			  
 			  if (!session.isLoggedIn){
 			        $("#signupModalLoginButton").removeClass("disabled").text("Login"); 
 			  }
		});				                           	
	},
	
	signup: function(email, password, remember, name, username){
		$.post( window.HOME_ROOT + "u/signup", {e: email, n: name, p: password, cp: password, remember: remember }, function(result){
		      try{
	               var user = JSON.parse(result);
	               
	               if (typeof user == "object" && user.id && user.n && user.e){    			    
                         session.userid = user.id;
          			     session.name = user.n;
          			     session.email = user.e;
          			     session.isLoggedIn = true;
          			     session.loggedInCallback();
	               }         
	          }catch(e){
	               Messenger.error("Whoops! We encountered an issue while signing you up!");
	               Messenger.error("Please try again or use the contact link at the bottom of the page to let us investigate the issue.");	               
    		     
    		       var userData = { e: email, n: name, s: "Failed Signup Attempt", t: "issue" };
    		       $.post(window.HOME_ROOT + "app/email.php", userData);
 			  }			  
        });
				
	},	
	
	loggedInCallback: function(){	
	    if (sessionStorage.isActiveUser == null || sessionStorage.isActiveUser == "null"){
	       sessionStorage.isActiveUser = true;
	       	       	      
	       if (sessionStorage.goToClositt){
                location.href = window.HOME_ROOT + "clositt.php"; 
           }else if(typeof loggedIn == 'function'){
                loggedIn();
		   }          	
        }else if(typeof loggedIn == 'function'){
			loggedIn();
		}  
	},
	
	loggedOutCallback: function(){	
        sessionStorage.isActiveUser = null;	                   
	       	   
		if(typeof loggedOut == 'function')
		{
			loggedOut();
		}  		
	},
	
	loggedOutErrorCallback: function(){	   
	    sessionStorage.isActiveUser = null;
	   
		if(typeof loggedOutError == 'function')
		{
			loggedOutError();
		}  		
	},
	
	userDataAvailableCallback: function(){
		if(typeof userDataReady == 'function')
		{
			userDataReady(session.name);
		}   
	},
	
	updateLoggedInDropdownMenu: function(){	   
		$("#loginBtns").html("")	    	
	    	.append( $('<li>').append( $('<a>').attr('href', window.HOME_ROOT + "settings.php")
    	    	.append(
    	    	      $("<span>").addClass("glyphicon glyphicon-user")
    	    	).append( 
    	    	      $("<span>").text(" " + session.nickname)
    	    	))
    	    )
	    	.append( $('<li>').append( $('<a>').attr('onclick', 'session.logout()').text('Logout')));
	},
	
	updateLoggedOutDropdownMenu: function(){
	   
		$("#loginBtns").html("")
		    .append( $('<li>').addClass("loggedoutBtns").append( $('<a>').addClass("btn btn-default").attr('onclick','showSigninModal()').text('LOGIN')))
		    .append( $('<li>').addClass("loggedoutBtns").append( $('<a>').addClass("btn btn-default inverse").attr('href',window.HOME_ROOT + 'signup.php').text('SIGNUP')));		
	},	

 	logout: function(){	 	   	  								
		$.post( window.HOME_ROOT + "u/logout", function(user){
	          location.href= window.HOME_ROOT;
		});				                           	
	}
};




var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};
