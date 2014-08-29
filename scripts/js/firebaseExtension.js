var firebase = {

	$: null,
	authClient: null,	
	url: 'https://clositt-team.firebaseio.com/',
	userPath: 'userdata',
	productsPath: "products",
	storePath: "store",
	connections: "connections",	
	connectedPath: ".info/connected",
	isOnline: "isOnline",
	lastOnline: "lastOnline",
		
	init: function(){
		firebase.$ = new Firebase(firebase.url);	
		firebase.authClient = new FirebaseSimpleLogin(firebase.$, firebase.checkActiveUser);				
	},
		
	checkActiveUser: function(error, user){
	  	if (error) {
		    // an error occurred while attempting login
		    console.log(error);
		    Messenger.error("Incorrect login information");
		    session.loggedOutErrorCallback();
		} else if (user) {
		    // user authenticated with Firebase		    
		    firebase.handleUserData(user);		    				    			  			    	        
	        session.isLoggedIn = true;
		       	       				
	  	} else {
		    // user is logged out		    
		    console.log("logged out");
		    firebase.$.child(firebase.connectedPath).on('value', firebase.managePresence);
		    session.loggedOutCallback();
		}
	 
		if(error || !user){
			session.updateLoggedOutDropdownMenu();
			session.isLoggedIn = false;
		}
	},
	
	handleUserData: function(user){
		firebase.$.child(firebase.userPath).child(user.id).once('value',function(snapshot){	
			session.username = snapshot.child('name').val();
			session.loginCount = snapshot.child('loginCount').val();
			session.userid = user.id;
			session.email = user.email;
			firebase.$.child(firebase.connectedPath).on('value', firebase.managePresence);
			
			if( session.username === null) {
			    console.log("No User Found")
			} else {			  		    			  	
			  	session.userDataAvailableCallback(session.username);
			  	session.updateLoggedInDropdownMenu(session.username);
			}
			
			if (sessionStorage.isActiveUser == null || sessionStorage.isActiveUser == "null"){			
			    
    			firebase.$.child(firebase.userPath).child(user.id).child("loginCount").transaction(function(value) {
        	 	   var newValue = 1;
        	 	   
        	 	   if(value != null){		 	       
        	 	        newValue = value + 1;		 	        
        	 	   } 		 	            
        	 	   
        	 	   //session.loginCount = newValue;                	 	                   	 	   
        	 	   return newValue;       
                });
			}
            
            var dateTime = new Date();            
            session.logginCallback();
		});
	},
	
	managePresence: function(snap){
    	   if (snap.val() === true && session.isLoggedIn && session.userid > 0) {
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        
                // add this device to my connections list
                // this value could contain info about the device or a timestamp too                
                var connection = firebase.$.child(firebase.userPath).child(session.userid)
                                                    .child(firebase.connections).push(Firebase.ServerValue.TIMESTAMP);                        
        
                // when I disconnect, remove this device
                connection.onDisconnect().remove();
        
                // when I disconnect, update the last time I was seen online
                firebase.$.child(firebase.userPath).child(session.userid).child(firebase.lastOnline)
                                                    .onDisconnect().set(Firebase.ServerValue.TIMESTAMP);                                                                                                                                                         
            }else if (snap.val() === true) {
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        
                // add this device to my connections list
                // this value could contain info about the device or a timestamp too                
                var connection = firebase.$.child("onlineGuests").push(Firebase.ServerValue.TIMESTAMP);                        
        
                // when I disconnect, remove this device
                connection.onDisconnect().remove();                                                                                                                                                                
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
	}		
};
