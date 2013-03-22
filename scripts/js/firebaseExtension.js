var firebase = {

	$: null,
	authClient: null,
	userid: null,
	username: null,
	isLoggedIn: false,
	url: 'https://clothies.firebaseio.com/',
	userPath: 'userdata',
		
	init: function(){
		firebase.$ = new Firebase(firebase.url);	
		firebase.authClient = new FirebaseAuthClient(firebase.$, firebase.checkActiveUser);
	},
		
	checkActiveUser: function(error, user){
	  	if (error) {
		    // an error occurred while attempting login
		    console.log(error);
		} else if (user) {
		    // user authenticated with Firebase		    
		    firebase.handleUserData(user);		    				    			  			    
	        firebase.updateLoggedInDropdownMenu();
	        firebase.isLoggedIn = true;
		       	       				
	  	} else {
		    // user is logged out		    
		    console.log("logged out");
		    
		    if(location.pathname == "/closet.php"){
		    	location.href = "/";	
		    }
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
			
			if( firebase.username === null) {
			    console.log("No User Found")
			} else {
			  	$("#user-name").html(firebase.username);	    			  	
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
		 	username = username.toLowerCase();
		 	firebase.$.child(firebase.userPath).child(user.id).set({"email":user.email,"name":firstname,"username":username});
		 	
		  	firebase.login(user.email, password, remember);		  			  	

		  }else{		  	
		  		Messenger.error(error);	
		  }
	},
	
	logginCallback: function(){
		if(typeof loggedIn == 'function')
		{
			loggedIn();
		}  
	},
	
	userDataAvailableCallback: function(username){
		if(typeof userDataReady == 'function')
		{
			userDataReady(username);
		}   
	},
	
	updateLoggedInDropdownMenu: function(){
		$("#account-dropdown").html("")
	    	.append($('<li><a href="closet.php">My Closet</a></li>'))    	
	    	.append($('<li><a href="#">Account Settings</a></li>'))
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
		location.href="/";
	}
};


var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};
