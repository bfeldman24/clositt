var socialPresenter = {	
    link: null,
        
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
	   if (e == null || e.currentTarget == null){ return false; }
	   
	   socialPresenter.link = $(e.currentTarget).attr("data-url");
	   
	   if ($(e.currentTarget).parents("#productModal").length > 0){
	       $(e.currentTarget).parents("#productModal").modal('hide');
	   }	   
	   	   
	   $('#shareProductModal').modal('show');
	   
	   e.preventDefault();
	   return false;
	},
	
	shareProduct: function(e){
	   var to = $("#shareEmail").val();
	   
	   if (to.trim() == ""){
	       Messenger.alert("You must enter an email address!");
	       return;   
	   }
	   
	   $("#shareProductModal #share").text("Sending...");
	   
	   var url = socialPresenter.link;
	   
	   if (url.indexOf("http") < 0){
	       url = window.HOME_URL + "!/" + url;
	   }
	   
	   $.post(window.HOME_ROOT + "e/share", { to: to, link: url}, function(data) {
			if(data == "success"){
				Messenger.alert("Your message was sent successfully! Thank you!");
				$("#shareEmail").val("");
				socialPresenter.link = null;
        	    $('#shareProductModal').modal("hide");
			}else{
				Messenger.error("There was a problem sending an email to that address. Please try again.");	
			}
			
			$("#shareProductModal #share").text("Share");
		});	
		
		e.preventDefault();
	   return false;   	   
	}
};
