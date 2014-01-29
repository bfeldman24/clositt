var socialPresenter = {		
	
	showShareButtons: function(el){
	   		
		var element = el.currentTarget;					
		
		if($(element).parents(".item").find(".social-btns").is(":visible")){			    					
			$(element).parents(".item").find(".addToClosetForm").tooltip('destroy');
			$(element).parents(".item").find(".addToClosetForm").html("").hide();
//			$(element).parents(".item").find(".social-btns").tooltip('destroy');
			$(element).parents(".item").find(".social-btns").html("").hide('blind');						
		}else{							  												
		    var shortlink = $(element).parents(".item").attr("data-url");
		    
		    var productLink = window.HOME_URL + "@/"+shortlink;		    
		    var productEncodeLink = encodeURIComponent(productLink);
		    var imgLink = encodeURIComponent($(element).parents(".item").find(".picture img").attr("src"));
		    var desc = encodeURIComponent("Found on Clositt.com");
		    
			$(element).parents(".item").find(".social-btns").append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://www.facebook.com/sharer/sharer.php?u="+productEncodeLink).append(
        		      $("<img>").attr("src", "css/images/social/facebook-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://twitter.com/share?url=" + productEncodeLink).append(
        		      $("<img>").attr("src","css/images/social/twitter-icon.png")
        		  )		
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","https://plus.google.com/share?url="+productEncodeLink).append(
        		      $("<img>").attr("src", "css/images/social/googleplus-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("target","_blank")
        		      .attr("href","http://pinterest.com/pin/create/button/?url="+productEncodeLink+"&media="+imgLink+"&description="+desc).append(
        		      $("<img>").attr("src", "css/images/social/pinterest-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("href","mailto:?subject=Clositt.com: What do you think of this?&body=Do you like this? " + productLink).append(
        		      $("<img>").attr("src", "css/images/social/email-icon.png")
        		  )
        		).append(
        		  $("<a>").addClass("socialbtn").attr("onclick",'window.prompt("Copy to clipboard: Ctrl+C, Enter", "'+productLink+'")').append(
        		      $("<img>").addClass("social-link").attr("src", "css/images/link.png")
        		  )
			).show('blind');
			
//			var $socialBtns = $(element).parents(".item").find(".social-btns");			
//			$socialBtns.tooltip({title:"Share this!",placement:"left"});			
		}
		
	}
};
