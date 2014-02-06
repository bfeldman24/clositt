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
		$(document).on("click",".shareOutfitBtn",socialPresenter.showShareButtons);				
		$(document).on("submit",".addTagForm > form",tagPresenter.addTag);				
	},
	
	overlayEvent: function(){
		$(document).on("mouseenter",".outfit", gridEvents.showOverlay).on("mouseleave",".outfit", gridEvents.hideAllOverlays);
	},
	
	showOverlay: function() {	
            var overlay = $(this).children(".overlay").not(".alwaysVisible").first();
						
			if (overlay.length > 0 && !overlay.is(":visible")){			
			     overlay.stop();
			     overlay.fadeIn('fast');
			}
	},
	
	hideAllOverlays: function() {	  	   
	   
       	$(".overlay:visible").not(".alwaysVisible").each(function(){		
       	     
            $(this).fadeOut('slow');
		
			if (reviewsPresenter != null){
			     var sku = $(this).parents(".item").attr("pid");			     			     
			     reviewsPresenter.hideReview(reviewsPresenter.getReviewBlock(sku));
			}
		
       	});
	}	
};