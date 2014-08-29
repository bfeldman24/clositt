var session = {
    userid: null,
	username: null,
	email: null,
	isLoggedIn: false,
	loginCount: -1,
	
	init: function(){
	   // TODO implement  
	},
	
	login: function(email, password, remember){
		
		firebase.authClient.login('password', {
          email: email,
          password: password,
          rememberMe: remember
        });     	
	},
	
	signup: function(email, password, remember, name, username){
		firebase.authClient.createUser(email, password, function(error,user){
			session.register(error, user, password, remember, name, username);
		});
	},
	
	register: function(error, user, password, remember, name, username){
		 if (!error) {		  			  			  
		 	var firstname = stringFunctions.toTitleCase(name);
		 	var dateTime = new Date();		 	
		 	
		 	var userData = {"email":user.email, "name":firstname, "signedUpDate": dateTime.toJSON(), "loginCount": 1 };
		 	
		 	if (username != null){
    		 	username = username.toLowerCase();
    		 	userData['username'] = username;
		 	}
		 			 	
		 	userData['closets'] = new Object();
		 	userData['closets'][closetPresenter.wishListClosetId] = new Object();
		 	userData['closets'][closetPresenter.wishListClosetId]['name'] = "Wish List";		 	
		 	
		 	firebase.$.child(firebase.userPath).child(user.id).set(userData);		 			 	
		 	session.welcomeEmail(user.email, firstname);
		  	session.login(user.email, password, remember);

		  }else{		  	
		  		Messenger.error(error);	
		  }
	},
	
	logginCallback: function(){	
	    if (sessionStorage.isActiveUser == null || sessionStorage.isActiveUser == "null"){
	       sessionStorage.isActiveUser = true;
	       
	       firebase.$.child("Auth/Token").on('value',function(snapshot){	
        		var token = snapshot.val();			
        		
        		$.post(window.HOME_ROOT + "app/auth.php", { auth: token, user: session.userid }, function(){        		      
        		      
        		      if (sessionStorage.goToClositt){
                            location.href = window.HOME_ROOT + "clositt.php"; 
        		      }else if(typeof loggedIn == 'function'){
                            loggedIn();
            		  }  
        		});
        	});
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
	
	userDataAvailableCallback: function(username){
		if(typeof userDataReady == 'function')
		{
			userDataReady(username);
		}   
	},
	
	updateLoggedInDropdownMenu: function(username){
	   var userFirstName = session.username.split(" ")[0];
	   
		$("#loginBtns").html("")	    	
	    	.append( $('<li>').append( $('<a>').attr('href', window.HOME_ROOT + "settings.php")
    	    	.append(
    	    	      $("<span>").addClass("glyphicon glyphicon-user")
    	    	).append( 
    	    	      $("<span>").text(" " + userFirstName)
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
		firebase.$.child(firebase.userPath).child(session.userid).child(firebase.connections).remove(function(){
		    firebase.authClient.logout();
		  
      		$.post("/app/auth.php", function(){      		    	
      			location.href= window.HOME_ROOT+"signup.php";
      		}).fail(function() {			 
                  location.href= window.HOME_ROOT;
      	    });
		});				
	},
	
	welcomeEmail: function(email, name){
	    var userData = { e: email, n: name, t: "welcomeMessage" };
	   
		$.post(window.HOME_ROOT + "app/email.php", userData, function(data) {
			if(data == "success"){
				console.log("Message Sent!")
			}else{
				console.log("Message failed to send.")
			}
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
