var session = {
    userid: null,
	name: null,
	nickname: null,
	email: null,
	isLoggedIn: false,
	loginCount: -1,
	goToClosittOnLogin: false,
	priceAlertFrequency: 0,
	
	init: function(){	   
	   if (sessionInit.active){
	       session.userid = sessionInit.userid;
	       session.email = sessionInit.email;
	       session.name = sessionInit.name;   
	       session.nickname = session.name.split(" ")[0];
	       session.priceAlertFrequency = sessionInit.pricealerts || 1;
	       session.isLoggedIn = true;	       	       
	       session.userDataAvailableCallback();
    	   session.updateLoggedInDropdownMenu();
	       session.loggedInCallback();
	   }else{
	       session.updateLoggedOutDropdownMenu();
	       session.loggedOutCallback();
	   }	   	   

        $(document).on("click", ".loggedoutBtns .register, #getstarted", function(e){
            e.preventDefault();
            $("#signupModalTabBtn").tab('show');
        });       
        
        $(document).on("click", ".loggedoutBtns .login", function(e){
            e.preventDefault();            
            $("#loginModalTabBtn").tab('show');
        });         
	},
	
	login: function(email, password, remember){
		
		$("#loginModalSubmit").addClass("disabled").val("Logging in...");
		
		$.post( window.HOME_ROOT + "u/login", {e: email, p: password, remember: remember }, function(result){
	          try{
	               var user = JSON.parse(result);
	               
	               if (typeof user == "object" && user.id && user.n && user.e){    			    
     			     session.userid = user.id;
     			     session.name = user.n;
     			     session.nickname = session.name.split(" ")[0];
     			     session.email = user.e;
     			     session.priceAlertFrequency = user.f;
     			     session.isLoggedIn = true; 			     
     			     session.loggedInCallback(); 
	               }      
	          }catch(e){
	               Messenger.error("The username/password were incorrect! Please try again."); 		               	               
 			  }	
 			  
 			  setTimeout(function(){
 			    $("#loginModalSubmit").removeClass("disabled").val("Login Now")
 			  }, 1000); 			   			    			  
		});				                           	
	},
	
	signup: function(email, password, remember, name, username){
	   
	    $("#signupModalSubmit").addClass("disabled").val("Signing Up...");
	    
		$.post( window.HOME_ROOT + "u/signup", {e: email, n: name, p: password, remember: remember }, function(result){
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
	               if (result == "Incorrect credentials"){
	                   Messenger.error("There is already a clositt user with that email address in our system!", 8000);
	                   Messenger.error("Go to the login tab and try again. If you forgot your password, use the forgot password link.", 8000);
	                   $("#loginModalTab-inputEmail").val(email);
	               }else{	           
    	               Messenger.error("Whoops! We encountered an issue while signing you up!", 8000);
    	               Messenger.error("Please try again or use the contact link at the bottom of the page to let us know of the issue.", 8000);	               
        		     
        		       var userData = { e: email, n: name, s: "Failed Signup Attempt", t: "issue" };
        		       $.post(window.HOME_ROOT + "e/contact", userData);
	               }
 			  }	
 			  
 			  if (!session.isLoggedIn){
 			        $("#signupModalSubmit").removeClass("disabled").val("Sign Up"); 
 			  }		  
        });
				
	},	
	
	loggedInCallback: function(){	
	    if (sessionStorage.isActiveUser == null || sessionStorage.isActiveUser == "null"){
	       sessionStorage.isActiveUser = true;	       	       
	       	       	      
	       if (session.goToClosittOnLogin){
                location.href = window.CLOSITT_PAGE; 
                return;
           }      	
        }
        
        session.updateLoggedInDropdownMenu();                
                
        if(typeof loggedIn == 'function'){
            loggedIn();                
        }
        
        Messenger.success("Thanks " + session.nickname + "! You are now logged in and ready to go!");  
		
		$("#loginSignupModal").modal('hide');
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
	    var pageUrl;
	    var linkTitle;
	    var linkClass;
	    var icon;
	    var iconTag;
	    
	    if (location.href.indexOf(".com"+window.HOME_ROOT+"myclositts") > 0){
	       pageUrl = "#";
	       linkTitle = session.nickname + "'s Account";  
	       icon = "glyphicon glyphicon-user";
	       iconTag = "<span>";
	       linkClass = "user-settings";
	    }else{
	       pageUrl = window.CLOSITT_PAGE;
	       linkTitle = session.nickname + "'s Clositts";
	       icon = "icon-svg20"; // hanger
	       iconTag = "<i>";
	       linkClass = "";
	    }
	     
		$("#loginBtns").html("")	    	
	    	.append( 
        	      $('<li>').append( $('<a>').attr('href', pageUrl).addClass(linkClass)	    	      
        	    	 .append(
        	    	      $("<span>").append( 
        	    	            $(iconTag).addClass(icon)
        	    	      ).append(
                                $("<span>").text(" " + linkTitle)
                	      )
    	    	     )
    	       )
    	    )
	    	.append( $('<li>').append( $('<a>').attr('href', window.HOME_ROOT + 'about').text('About Us')))
	    	.append( $('<li>').append( $('<a>').addClass("startTour").text('Tour')))
	    	.append( $('<li>').append( $('<a>').attr('onclick', 'session.logout()').text('Logout')));
	    	
	    $(document).on("click", ".user-settings", session.showUserAccountModal);
	},
	
	updateLoggedOutDropdownMenu: function(){
	   
		$("#loginBtns").html("")
		    .append( $('<li>').addClass("loggedoutBtns").append( 
		          $('<a>').addClass("myclositt").attr("href",window.HOME_ROOT + "myclositts").append(
		              $("<span>").append( 
        	    	            $("<i>").addClass("icon-svg20")
        	    	      ).append(
                                $("<span>").text(" My Clositts")
                	      )
		          )
		     ))
		    .append( $('<li>').append( $('<a>').attr('href', window.HOME_ROOT + 'about').text('About Us')))
		    .append( $('<li>').append( $('<a>').addClass("startTour").text('Tour')))
		    .append( $('<li>').addClass("loggedoutBtns active").append( 
		          $('<a>').addClass("login").attr('data-toggle','modal').attr("data-target","#loginSignupModal").text('Login')
		     ));			    		    	
	},	

 	logout: function(){	 	   	  								
		$.post( window.HOME_ROOT + "u/logout", function(user){
	          session.goToClosittPageOnLogin = false;
	          location.href= window.HOME_ROOT;
		});				                           	
	},
	
	showUserAccountModal: function (e) {		   
	    	    
	    $("#userModal").modal({
	       show: true,
	       remote: window.HOME_ROOT + "settings"
	    });
	    	    	    	           
        e.preventDefault();
        return false;  		    
    },
    
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return "";    
    } 
};




var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};
