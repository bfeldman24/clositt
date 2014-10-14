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

        $(document).on("click", ".loggedoutBtns .register", function(e){
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
     			     session.email = user.e;
     			     session.isLoggedIn = true; 			     
     			     session.loggedInCallback(); 
	               }      
	          }catch(e){
	               Messenger.error("The username/password were incorrect! Please try again."); 		               	               
 			  }	
 			  
 			  if (!session.isLoggedIn){
 			        $("#loginModalSubmit").removeClass("disabled").val("Login Now"); 
 			  }
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
	               Messenger.error("Whoops! We encountered an issue while signing you up!");
	               Messenger.error("Please try again or use the contact link at the bottom of the page to let us know of the issue.");	               
    		     
    		       var userData = { e: email, n: name, s: "Failed Signup Attempt", t: "issue" };
    		       $.post(window.HOME_ROOT + "e/contact", userData);
 			  }	
 			  
 			  if (!session.isLoggedIn){
 			        $("#signupModalSubmit").removeClass("disabled").val("Sign Up"); 
 			  }		  
        });
				
	},	
	
	loggedInCallback: function(){	
	    if (sessionStorage.isActiveUser == null || sessionStorage.isActiveUser == "null"){
	       sessionStorage.isActiveUser = true;
	       	       	      
	       if (sessionStorage.goToClositt){
                location.href = window.CLOSITT_PAGE; 
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
	    var pageUrl;
	    var linkTitle;
	    var linkClass;
	    var icon;
	    var iconTag;
	    
	    if (location.href.indexOf("clositt") > 0){
	       pageUrl = "#";
	       linkTitle = session.nickname + "'s Account";  
	       icon = "glyphicon glyphicon-user";
	       iconTag = "<span>";
	       linkClass = "user-settings";
	    }else{
	       pageUrl = window.CLOSITT_PAGE;
	       linkTitle = session.nickname + "'s Clositt";
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
	    	.append( $('<li>').append( $('<a>').attr('onclick', 'session.logout()').text('Logout')));
	    	
	    $(document).on("click", ".user-settings", session.showUserAccountModal);
	},
	
	updateLoggedOutDropdownMenu: function(){
	   
		$("#loginBtns").html("")
		    .append( $('<li>').addClass("loggedoutBtns").append( 
		          $('<a>').addClass("login").attr('data-toggle','modal').attr("data-target","#loginSignupModal").append(
		              $("<span>").append( 
        	    	            $("<i>").addClass("icon-svg20")
        	    	      ).append(
                                $("<span>").text(" My Clositt")
                	      )
		          )
		     ))
		    .append( $('<li>').addClass("loggedoutBtns active").append( 
		          $('<a>').addClass("register").attr('data-toggle','modal').attr("data-target","#loginSignupModal").text('Register')
		     ));			    		    	
	},	

 	logout: function(){	 	   	  								
		$.post( window.HOME_ROOT + "u/logout", function(user){
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
