var socialPresenter = {	
    link: null,
    currentlySending: false,
        
    init: function(){
        $(document).on("click",".email-product", socialPresenter.emailProduct);         
        $(document).on("click", '#shareProductModal #share', socialPresenter.shareProduct); 
    },
    
	showClosittShareButtons: function(){			
	   		
		if($("#social-btns").is(":visible")){			    					
			$("#social-btns").html("").hide('blind');
		}else{
		    var closittLink = window.HOME_URL + "@/" + (parseInt(closetPresenter.share) + parseInt(session.userid));		    		    
		    var imgLink = encodeURIComponent($(document).find(".imagewrap img").first().attr("src"));
		    var desc = encodeURIComponent(session.username + "'s Clositt on Clositt.com");		    
		    var socialElement = $("#social-btns");
		    
			socialPresenter.createShareButtons(socialElement, closittLink, imgLink, desc);						
		}
	},
	
	showProductShareButtons: function(el){
	   	if (el == null){ return; }
	   		
		var element = el.currentTarget == null ? el : el.currentTarget;					
		
		if($(element).parents(".item").find(".social-btns").is(":visible")){
			$(element).parents(".item").find(".social-btns").html("").hide('blind');						
		}else{
		    var shortlink = $(element).parents(".item").attr("data-url");		    
		    var productLink = window.HOME_ROOT + "!/"+shortlink;		    		    
		    var imgLink = encodeURIComponent($(element).parents(".item").find(".imagewrap img").attr("src"));
		    var desc = encodeURIComponent("Found on Clositt.com");		    
		    var socialElement = $(element).parents(".item").find(".social-btns");
		    
			socialPresenter.createShareButtons(socialElement, productLink, imgLink, desc);						
		}
		
	},
	
	
	createShareButtons: function(element, link, imgLink, description){
	   var encodeLink = encodeURIComponent(link);
	   
	   $(element).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://www.facebook.com/sharer/sharer.php?u="+encodeLink).append(
        		      $("<img>").attr("src", window.HOME_ROOT + "css/images/social/facebook-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://twitter.com/share?url=" + encodeLink).append(
        		      $("<img>").attr("src", window.HOME_ROOT + "css/images/social/twitter-icon.png")
        		  )		
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://plus.google.com/share?url="+encodeLink).append(
        		      $("<img>").attr("src", window.HOME_ROOT + "css/images/social/googleplus-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","http://pinterest.com/pin/create/button/?url="+encodeLink+"&media="+imgLink+"&description="+description).append(
        		      $("<img>").attr("src", window.HOME_ROOT + "css/images/social/pinterest-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("href","mailto:?subject=Clositt.com: What do you think of this?&body=Do you like this? " + link).append(
        		      $("<img>").attr("src", window.HOME_ROOT + "css/images/social/email-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("onclick",'window.prompt("Copy to clipboard: Ctrl+C", "'+link+'")').append(
        		      $("<img>").addClass("social-link").attr("src", window.HOME_ROOT + "css/images/link.png")
        		  )
			).show('blind');
	},
	
	emailProduct: function(e){
	   e.preventDefault();
	   
	   if (e == null || e.currentTarget == null){ return false; }
	   
	   socialPresenter.link = $(e.currentTarget).attr("data-url");
	   
	   if (socialPresenter.link.indexOf("http") < 0){
	       socialPresenter.link = window.HOME_URL + "!/" + socialPresenter.link;
	   }
	   
	   if ($(e.currentTarget).parents("#productModal").length > 0){
	       $(e.currentTarget).parents("#productModal").modal('hide');
	   }	   
	   
	   if (session.name == null){
	       $("#shareEmailFromName").show();
	   }else{
	       $("#shareEmailFromName").hide();
	   }
	   
	   // Clear text
	   $("#emailOutfitLink").text("");
	   $("#emailOutfitStore").text("");
	   
	   // populate text
	   if ($(e.currentTarget).parents(".item").length <= 0){
	       var closetTitle = $(e.currentTarget).prevAll(".closet-title").first().text();
	       $("#emailOutfitText").text("Check out my clositt");
	       $("#emailOutfitStore").text("");
    	   $("#emailOutfitLink").attr("href",socialPresenter.link).text(closetTitle);    	   
	   }else{
    	   var item = $(e.currentTarget).parents(".item").first();
    	   var store = item.find(".productStore").text();
    	   var itemName = item.find(".productName").text();
    	       	   
    	   if (itemName == null || itemName.trim() == ""){
    	       Messenger.error("Sorry. That product no longer exists in our database so it cannot be shared.");
    	       return false;   
    	   }
    	   
    	   $("#emailOutfitText").text("Check out this outfit" + (store != null && store.trim() != "" ? " from" : ''));
    	   $("#emailOutfitStore").text(store);	   
    	   $("#emailOutfitLink").attr("href", socialPresenter.link).text(itemName);    	   
	   }
	   	   
	   $('#shareProductModal').modal('show');
	   
	   setTimeout(function(){            
            $("#shareProductModal #shareEmail").focus();            
        }, 500);
	   	   
	   return false;
	},
	
	shareProduct: function(e){
	   e.preventDefault();
	   
	   var email = $("#shareEmail").val();
	   
	   if (email.trim() == ""){
	       Messenger.alert("You must enter an email address!");
	       return;   
	   }
	   
	   $("#shareProductModal #share").attr("disabled","disabled");
	   $("#shareProductModal #share").text("Sending...");	   
	   
	   var name = $("#shareEmailFromName").val();
	   var inputMessage = $("#shareEmailMessage").val();
	   var product = $("#emailOutfitLink").text();
	   var store = $("#emailOutfitStore").text();
	   
	   if (!socialPresenter.currentlySending){
	       socialPresenter.currentlySending = true;
	       
    	   $.post(window.HOME_ROOT + "e/share", { to: email, username: name, message: inputMessage, link: socialPresenter.link, product: product, store: store }, function(data) {
    			if(data == "success"){
    				Messenger.success("Your message was sent successfully! Thank you!");
    				$("#shareEmail").val("");
    				$("#shareEmailFromName").val("");
            	    $("#shareEmailMessage").val("");
            	    $("#emailOutfitLink").text("");
            	    $("#emailOutfitStore").text("");
    	   
    				socialPresenter.link = null;
            	    $('#shareProductModal').modal("hide");
    			}else{
    				Messenger.error("There was a problem sending an email to that address. Please try again.");	
    			}
    			
    			$("#shareProductModal #share").removeAttr("disabled");
    			$("#shareProductModal #share").text("Share");
    			socialPresenter.currentlySending = false;
    		});	
	   }
				
	   return false;   	   
	}
};
