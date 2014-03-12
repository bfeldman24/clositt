var firebase = {

	$: null,
	authClient: null,
	userid: null,
	username: null,
	email: null,
	isLoggedIn: false,
	loginCount: -1,
	url: 'https://clositt-team.firebaseio.com/',
	userPath: 'userdata',
	productsPath: "products",
	storePath: "store",
	connections: "connections",
	isOnline: "isOnline",
	lastOnline: "lastOnline",
	connectedPath: ".info/connected",
		
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
		firebase.$.child(firebase.userPath).child(user.id).once('value',function(snapshot){	
			firebase.username = snapshot.child('name').val();
			firebase.loginCount = snapshot.child('loginCount').val();
			firebase.userid = user.id;
			firebase.email = user.email;
			firebase.$.child(firebase.connectedPath).on('value', firebase.managePresence);
			
			if( firebase.username === null) {
			    console.log("No User Found")
			} else {
			  	$("#user-name").html(firebase.username.split(" ")[0]);	    			  	
			  	firebase.userDataAvailableCallback(firebase.username);
			}
			
			if (sessionStorage.isActiveUser == null || sessionStorage.isActiveUser == "null"){			
			    
    			firebase.$.child(firebase.userPath).child(user.id).child("loginCount").transaction(function(value) {
        	 	   var newValue = 1;
        	 	   
        	 	   if(value != null){		 	       
        	 	        newValue = value + 1;		 	        
        	 	   } 		 	            
        	 	   
        	 	   //firebase.loginCount = newValue;                	 	                   	 	   
        	 	   return newValue;       
                });
			}
            
            var dateTime = new Date();            
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
		 	firebase.welcomeEmail(user.email, firstname);
		  	firebase.login(user.email, password, remember);

		  }else{		  	
		  		Messenger.error(error);	
		  }
	},
	
	managePresence: function(snap){
    	   if (snap.val() === true && firebase.isLoggedIn && firebase.userid > 0) {
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        
                // add this device to my connections list
                // this value could contain info about the device or a timestamp too                
                var connection = firebase.$.child(firebase.userPath).child(firebase.userid)
                                                    .child(firebase.connections).push(Firebase.ServerValue.TIMESTAMP);                        
        
                // when I disconnect, remove this device
                connection.onDisconnect().remove();
        
                // when I disconnect, update the last time I was seen online
                firebase.$.child(firebase.userPath).child(firebase.userid).child(firebase.lastOnline)
                                                    .onDisconnect().set(Firebase.ServerValue.TIMESTAMP);                                                                                                                                                         
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
	    if (sessionStorage.isActiveUser == null || sessionStorage.isActiveUser == "null"){
	       sessionStorage.isActiveUser = true;
	       
	       firebase.$.child("Auth/Token").on('value',function(snapshot){	
        		var token = snapshot.val();			
        		
        		$.post(window.HOME_ROOT + "app/auth.php", { auth: token, user: firebase.userid }, function(){        		      
        		      
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
	
	updateLoggedInDropdownMenu: function(){
		$("#account-dropdown").html("")
	    	//.append($('<li><a href="clositt.php">MyClositt</a></li>'))    	
	    	.append($('<li><a href="'+window.HOME_ROOT+'settings.php">Account Settings</a></li>'))
	    	.append($('<li class="divider"></li>'))
	    	.append($('<li><a href="javascript:firebase.logout();">Logout</a></li>')); 
	},
	
	updateLoggedOutDropdownMenu: function(){
		$("#account-dropdown").html("")
	  		.append($('<li><a href="'+window.HOME_ROOT+'signup.php">Login or Sign Up</a></li>'))
	},	

 	logout: function(){
		firebase.authClient.logout();	

		$.post("/app/auth.php", function(){
			location.href= window.HOME_ROOT+"signup.php";
		}).fail(function() {			 
            location.href= window.HOME_ROOT;
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
