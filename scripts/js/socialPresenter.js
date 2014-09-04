var socialPresenter = {		
	
	showClosittShareButtons: function(){			
	   		
		if($("#social-btns").is(":visible")){			    					
			$("#social-btns").html("").hide('blind');
		}else{
		    var closittLink = window.HOME_URL + "@/" + (parseInt(closetPresenter.share) + parseInt(session.userid));		    		    
		    var imgLink = encodeURIComponent($(document).find(".picture img").first().attr("src"));
		    var desc = encodeURIComponent(session.username + "'s Clositt on Clositt.com");		    
		    var socialElement = $("#social-btns");
		    
			socialPresenter.createShareButtons(socialElement, closittLink, imgLink, desc);						
		}
	},
	
	showProductShareButtons: function(el){
	   		
		var element = el.currentTarget;					
		
		if($(element).parents(".item").find(".social-btns").is(":visible")){			    					
			$(element).parents(".item").find(".addToClosetForm").tooltip('destroy');
			$(element).parents(".item").find(".addToClosetForm").html("").hide();
//			$(element).parents(".item").find(".social-btns").tooltip('destroy');
			$(element).parents(".item").find(".social-btns").html("").hide('blind');						
		}else{
		    var shortlink = $(element).parents(".item").attr("data-url");		    
		    var productLink = window.HOME_URL + "!/"+shortlink;		    		    
		    var imgLink = encodeURIComponent($(element).parents(".item").find(".picture img").attr("src"));
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
        		      $("<img>").attr("src", "css/images/social/facebook-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://twitter.com/share?url=" + encodeLink).append(
        		      $("<img>").attr("src","css/images/social/twitter-icon.png")
        		  )		
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://plus.google.com/share?url="+encodeLink).append(
        		      $("<img>").attr("src", "css/images/social/googleplus-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","http://pinterest.com/pin/create/button/?url="+encodeLink+"&media="+imgLink+"&description="+description).append(
        		      $("<img>").attr("src", "css/images/social/pinterest-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("href","mailto:?subject=Clositt.com: What do you think of this?&body=Do you like this? " + link).append(
        		      $("<img>").attr("src", "css/images/social/email-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("onclick",'window.prompt("Copy to clipboard: Ctrl+C", "'+link+'")').append(
        		      $("<img>").addClass("social-link").attr("src", "css/images/link.png")
        		  )
			).show('blind');
	}
};
