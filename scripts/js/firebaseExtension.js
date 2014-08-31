var firebase = {

	$: null,
	url: 'https://clositt-team.firebaseio.com/',
	userPath: 'userdata',
	productsPath: "products",
	storePath: "store",
		
	init: function(){
		firebase.$ = new Firebase(firebase.url);					
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
