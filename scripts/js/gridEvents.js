var gridEvents = {	
	
	init: function(){
		gridEvents.overlayEvent();				
		$(document).on("click",".addToClosetBtn",closetFormPresenter.showClosetForm);		
		$(document).on("click",".addToWishList", closetFormPresenter.addToWishList);
		$(document).on("submit",".addToClosetForm > form",closetFormPresenter.addToCloset);
		$(document).on("click",'.addToClosetForm > form input[type="radio"]',function(el){
			$(el.currentTarget).closest("form").submit();
		});		
		
		$(document).on("click",".tagOutfitBtn",tagPresenter.showTagForm);
		$(document).on("click",".shareOutfitBtn",socialPresenter.showProductShareButtons);										
	},
	
	overlayEvent: function(){
		$(document).on("mousemove",".outfit", gridEvents.showOverlay).on("mouseleave",".outfit", gridEvents.hideAllOverlays);
	},
	
	showOverlay: function() {	
            var overlay = $(this).children(".overlay").not(".alwaysVisible").first();
						
			if (overlay.length > 0 && (!overlay.is(":visible") || overlay.data("fadingOut"))){			
			     overlay.stop(true, true);			     
			     overlay.fadeIn('fast');
			     overlay.data("fadingOut", false);
			}
	},
	
	hideAllOverlays: function() {	  	   
	    
	    if ($(window).width() > 767){
           	$(".overlay:visible").not(".alwaysVisible").each(function(){		       	    
           	    
           	    $(this).data("fadingOut", true); 
                $(this).fadeOut('slow');
    		
    			if (reviewsPresenter != null){
    			     var sku = $(this).parents(".item").attr("pid");			     			     
    			     reviewsPresenter.hideReview(reviewsPresenter.getReviewBlock(sku));
    			     $(this).parents(".item").find(".social-btns").html("").hide('blind');
    			     $(this).parents(".item").find(".addToClosetForm").html("").hide();
    			}
    		
           	});
	    }
	}	
};