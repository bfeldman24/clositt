var gridEvents = {	
	
	init: function(){
		gridEvents.overlayEvent();				
		$(document).on("click",".addToClosetBtn",closetFormPresenter.showClosetForm);		
		$(document).on("submit",".addToClosetForm > form",closetFormPresenter.addToCloset);
		$(document).on("click",'.addToClosetForm > form input[type="radio"]',function(el){
			$(el.currentTarget).closest("form").submit();
		});		
		
		$(document).on("click",".tagOutfitBtn",tagPresenter.showTagForm);		
		$(document).on("submit",".addTagForm > form",tagPresenter.addTag);				
	},
	
	overlayEvent: function(){
		$(document).on("mouseenter",".outfit", gridEvents.showOverlay).on("mouseleave",".outfit", gridEvents.hideOverlay);	
	},
	
	showOverlay: function() {			
			$(this).children(".overlay").not(".alwaysVisible").first().fadeIn('slow');
	},
	
	hideOverlay: function() {			
			$(this).children(".overlay").not(".alwaysVisible").first().fadeOut('slow');
			
			if (reviewsPresenter != null){
			     var sku = $(this).find('a[pid]').first().attr("pid");			     			     
			     reviewsPresenter.hideReview(reviewsPresenter.getReviewBlock(sku));
			}
	}, 
	
	continuousScroll: function(){		 
		gridPresenter.showContent(15);
	}		
};