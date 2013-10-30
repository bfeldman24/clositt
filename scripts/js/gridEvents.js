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
			$(this).children(".overlay").first().fadeIn('slow');
	},
	
	hideOverlay: function() {			
			$(this).children(".overlay").first().fadeOut('slow');
	}, 
	
	continuousScroll: function(){		 
		gridPresenter.showContent(15);
	}		
};