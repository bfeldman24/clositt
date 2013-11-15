var firebase = {

	$: null,
	authClient: null,
	userid: null,
	username: null,
	email: null,
	isLoggedIn: false,
	url: 'https://clothies.firebaseio.com/',
	userPath: 'userdata',
		
	init: function(){
		firebase.$ = new Firebase(firebase.url);	
		firebase.authClient = new FirebaseSimpleLogin(firebase.$, firebase.checkActiveUser);
	},
		
	checkActiveUser: function(error, user){
	  	if (error) {
		    // an error occurred while attempting login
		    console.log(error);
		    Messenger.error("Incorrect login information");
		    firebase.loggedOutErrorCallback();
		} else if (user) {
		    // user authenticated with Firebase		    
		    firebase.handleUserData(user);		    				    			  			    
	        firebase.updateLoggedInDropdownMenu();
	        firebase.isLoggedIn = true;
		       	       				
	  	} else {
		    // user is logged out		    
		    console.log("logged out");
		    firebase.loggedOutCallback();
		}
	 
		if(error || !user){
			firebase.updateLoggedOutDropdownMenu();
			firebase.isLoggedIn = false;
		}
	},
	
	handleUserData: function(user){
		firebase.$.child(firebase.userPath).child(user.id).child('name').on('value',function(snapshot){	
			firebase.username = snapshot.val();
			firebase.userid = user.id;
			firebase.email = user.email;
			
			if( firebase.username === null) {
			    console.log("No User Found")
			} else {
			  	$("#user-name").html(firebase.username.split(" ")[0]);	    			  	
			  	firebase.userDataAvailableCallback(firebase.username);
			}
			
			firebase.logginCallback();
		});
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
			firebase.register(error, user, password, remember, name, username);
		});
	},
	
	register: function(error, user, password, remember, name, username){
		 if (!error) {		  			  			  
		 	var firstname = stringFunctions.toTitleCase(name);
		 	
		 	var userData = {"email":user.email,"name":firstname};
		 	
		 	if (username != null){
    		 	username = username.toLowerCase();
    		 	userData['username'] = username;
		 	}
		 	
		 	firebase.$.child(firebase.userPath).child(user.id).set(userData);
		 	
		  	firebase.login(user.email, password, remember);		  			  	

		  }else{		  	
		  		Messenger.error(error);	
		  }
	},
	
	addToWaitingList: function(email, callback){
	   var success = false;
	   
	   if (email.length > 3 && email.indexOf("@") > 0 && email.indexOf(".") > 0){
	       firebase.$.child("waitinglist").push(email);
	       Messenger.success("Thanks for joining Clositt! You have been placed on our waiting list!");		       	        
	       success = true;
	   }else{
	       Messenger.error("Your email address is not valid! Please try again.");		       	           
	   }
	   
	   if(typeof callback == 'function')
	   {
		 callback(success);
	   }
	},
	
	logginCallback: function(){	    	   
		if(typeof loggedIn == 'function')
		{
			loggedIn();
		}  
	},
	
	loggedOutCallback: function(){	    	   
		if(typeof loggedOut == 'function')
		{
			loggedOut();
		}  
		
		firebase.sendToWelcomePage();
	},
	
	loggedOutErrorCallback: function(){	   
		if(typeof loggedOutError == 'function')
		{
			loggedOutError();
		}  
		
		firebase.sendToWelcomePage();
	},
	
	userDataAvailableCallback: function(username){
		if(typeof userDataReady == 'function')
		{
			userDataReady(username);
		}   
	},
	
	updateLoggedInDropdownMenu: function(){
		$("#account-dropdown").html("")
	    	//.append($('<li><a href="closet.php">My Closet</a></li>'))    	
	    	.append($('<li><a href="settings.php">Account Settings</a></li>'))
	    	.append($('<li class="divider"></li>'))
	    	.append($('<li><a href="javascript:firebase.logout();">Logout</a></li>')); 
	},
	
	updateLoggedOutDropdownMenu: function(){
		$("#account-dropdown").html("")
	  		.append($('<li><a href="login.php">Login</a></li>'))
	    	.append($('<li class="divider"></li>'))
	    	.append($('<li><a href="signup.php">Sign Up</a></li>'));
	},	

 	logout: function(){
		firebase.authClient.logout();	

		$.post("/auth.php", function(){
			location.href= "/";
		}).fail(function() {
			 $.post("auth.php", function(){
                        	location.href= "./";
                	}) 
		});
	},
	
	sendToWelcomePage: function(){
	   if (location.href.indexOf("signup") < 0 &&
	       location.href.indexOf("welcome") < 0 &&
	       location.href.indexOf("login") < 0 && 
	       location.href.indexOf("contact") < 0){
	       
          	   if (location.href.indexOf("welcome.php") < 0){
          	       location.href = "/welcome.php";
          	   }
      	}
	}
};


var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};
