var reviewsPresenter = {	
	cachedReviews: null,	
	currentReviewFB: null,	
	 
	 init: function(){
	    reviewsPresenter.cachedReviews = new Object();
	    	 		 		 		 	
	 	// New design
	 	$(document).on("click",".comments, .comments .commentTextArea, .comments .btn", function(e){
	        e.preventDefault();
          	return false;  
	    });
	    
	    $(document).on("click", ".addCommentBtn .btn", reviewsPresenter.saveReview);	
	    $(document).on("show.bs.dropdown",".commentDropdown", reviewsPresenter.showReview);
	    
	 },
	 
	 showReview: function(e){
	       var targetOutfit = $(e.currentTarget).parents(".outfit");
	       
	       if (targetOutfit.find(".comments .review").length <= 0){
    	       var sku = targetOutfit.attr("pid");
    	       var $reviewBlock = reviewsPresenter.getReviewBlock(sku, e);     	              	 	       
    	 	   
    	 	   $.post( window.HOME_ROOT + "r/get", {s: sku}, function(reviews){    	 	     
    	 	       targetOutfit.find(".comments .review-comments").html("");
    	 	         
    	 	       for( var i=0; i< reviews.length; i++){
        	 	       reviewsPresenter.addReview(reviews[i], $reviewBlock);
    	 	       }
    	 	       
        	       if (!$reviewBlock.hasClass("mCustomScrollbar")){
        	           $reviewBlock.mCustomScrollbar();
        	       }
    	 	       
    	 	   },"json");    	 	   	       	 	   
	       }
	 },
	 
	 populateProductPageReview: function(targetOutfit, sku){
	       var reviewBlock = reviewsPresenter.getReviewBlock(sku + "pp");
	       targetOutfit.find(".product-comments").html(reviewBlock);
	 	   
 	       reviewBlock.find(".review-comments").html("");       	 	       
	 	   reviewBlock.find(".review-rating").attr("userRating",0);      	 	   
	 	   reviewsPresenter.refreshRating(reviewBlock, 0);	 	   	 	    
 	 	   
 	 	   $.post( window.HOME_ROOT + "r/get", {s: sku}, function(reviews){
	 	       for( var i=0; i< reviews.length; i++){
    	 	       reviewsPresenter.addReviewForProductPage(reviews[i]);
	 	       }
	 	   },"json");
 	 	    	 	   
	       reviewBlock.show();
	 },	 	 

	 saveReview: function(e){
	    if(!session.isLoggedIn){
			Messenger.info("Please login or sign up to add comments to this product!");	
		}else{
      	    var targetOutfit = $(e.currentTarget).parents(".outfit");
      	   
      	 	var comment = targetOutfit.find(".commentTextArea").val();
      	 	
      	 	if(comment.trim() != ""){	 		      		 	
      	 	   $(".addCommentBtn .btn").addClass("disabled").text("COMMENT...");
      	 	   
      		 	var user = session.userid == null ? -1 : session.userid;      		 	
      		 	var sku = targetOutfit.attr("pid");
      		 	
      		 	var reviewData = {u:user, n: session.name, c: comment, s:sku};
      		 	      		 	
      		 	$.post( window.HOME_ROOT + "r/add", reviewData, function(result){
      		 	      if (result != "success"){
      		 	          Messenger.error("Sorry! There was a problem saving your comment!");
      		 	      }else{
      		 	         Messenger.success("Thanks! Your comment was saved!"); 
      		 	         targetOutfit.find(".commentTextArea").val("");      		 	               		 	               		 	         
        	                       	         
          		 	     targetOutfit.find(".commentDropdown .message-icon").html(
          		 	          $('<span class="badge">&nbsp;</span>')
          		 	     );
          		 	     
          		 	     reviewsPresenter.addReview(reviewData, targetOutfit.find(".review-comments"), true);             		 	     
      		 	      }
      		 	      
      		 	      $(".addCommentBtn .btn").removeClass("disabled").text("COMMENT");
      		 	});      		 	      		 			 	      		 	
      		 	      		 	      		 	      		 	
      	 	}else{
      	 		Messenger.info("Please enter a comment");
      	 	}
		}
	 },
	 
	 addReview: function(review, reviewBlock, prepend){
		if(review != null && reviewBlock != null){								
			
			var name = review.n.split(" ")[0];
			var reviewTemplate = reviewsPresenter.getReviewTemplate(review.u, review.n, review.c);	
				
			if (reviewBlock.find(".mCSB_container").length > 0){
			    reviewBlock = reviewBlock.find(".mCSB_container").first();
			}	
			
			reviewTemplate.hide()
				
			if (prepend != undefined && prepend){
			     reviewBlock.prepend(reviewTemplate);	
			}else{	
			     reviewBlock.append(reviewTemplate);				     
			}		
			
			reviewTemplate.show('slow');
		}	
	 },
	 
	 addReviewForProductPage: function(review){
		if(review != null){		
		    var reviewBlock = reviewsPresenter.getReviewBlock(review.s + "pp");		  	
			
			if(!reviewBlock.find("li").length){
				reviewBlock.find(".review-comments").html("");	
			}
				
			reviewBlock.append(
				reviewsPresenter.getReviewTemplate(review.u, review.n, review.c)
			);
			
		   //reviewsPresenter.showAverageRating(reviewBlock);
		   var targetOutfit = reviewBlock.parents(".item");
		   var aveRating = reviewsPresenter.showAverageRating(targetOutfit);	 	   
	 	   aveRating = aveRating > 0 ? aveRating : 0;
	 	   var aveRatingBlock = reviewsPresenter.getReviewRating(aveRating, 'large');
	 	   targetOutfit.find(".productPageRating .review-average-stars").html(aveRatingBlock);
		}	
	 },	 	 
	 
	  getReviewBlock: function(id, e){
    	   if (reviewsPresenter.cachedReviews[id] != null){
    	       return reviewsPresenter.cachedReviews[id];
    	   }	   	             
           
           reviewBlock = $(e.currentTarget).find(".review-comments");
           
           reviewsPresenter.cachedReviews[id] = reviewBlock;
           return reviewBlock;        	   
	 },	 
	 
	 getReviewTemplate: function(id, name, comment){
	   name = name.split(" ")[0];
	   id = id == null || id <= 0 ? "#" : id;
	   
       return $("<li>").addClass("review").append(									
				$("<span>").addClass("review-user").append( 
				   $("<a>").attr("href", window.HOME_URL + "@/" + id).text(name + ": ")
				)
			).append(
			   $("<span>").addClass("review-text").text(comment) 
			)
	 }	 	 
};	