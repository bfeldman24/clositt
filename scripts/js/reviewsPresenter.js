var reviewsPresenter = {	
	cachedReviews: null,	
	currentReviewFB: null,	
	 
	 init: function(){
	    reviewsPresenter.cachedReviews = new Object();
	    $(document).on("click",".showComments",reviewsPresenter.showReview);
	 	$(document).on("click", ".review-add-btn", reviewsPresenter.saveReview);	
	 	$(document).on("click", ".review-mask", reviewsPresenter.hideReview);		 		 
	 	
	 	$(document).on("mouseenter", ".review-rating .review-star", reviewsPresenter.showFilledStars);		 		 
	 	$(document).on("mouseleave", ".review-rating", reviewsPresenter.resetRating);		 		 	 	
	 	$(document).on("click", ".review-rating .review-star", reviewsPresenter.chooseRating);		 		 	 	
	 },
	 
	 showReview: function(e){
	       var targetOutfit = $(e.target).parents(".item");
	       var sku = targetOutfit.attr("pid");
	       var reviewBlock = reviewsPresenter.getReviewBlock(sku);
	       
	       if(reviewBlock.is(":visible")){	 	 		 	
	 	 	       reviewsPresenter.hideReview(reviewBlock);	 	   
	 	   }else{	 	   	 	 	  	 	       	 	
	 	       targetOutfit.find(".product-comments").html(reviewBlock);
	 	       
	 	       reviewBlock.find(".review-comments").html("");       	 	       
      	 	   reviewBlock.find(".review-rating").attr("userRating",0);      	 	   
      	 	   reviewsPresenter.refreshRating(reviewBlock, 0);
      	 	   //reviewsPresenter.showAverageRating(reviewBlock);
      	 	         	 	   	
      	 	   reviewsPresenter.currentReviewFB = firebase.$.child("reviews/"+sku);
      	 	   reviewsPresenter.currentReviewFB.on('child_added', reviewsPresenter.addReview);	
      	 	   
      	 	   //reviewBlock.show('blind');
    	       reviewBlock.show(); 
	 	   }
	 },
	 
	 populateProductPageReview: function(targetOutfit, sku){
	       var reviewBlock = reviewsPresenter.getReviewBlock(sku + "pp");
	       targetOutfit.find(".product-comments").html(reviewBlock);
	 	   
 	       reviewBlock.find(".review-comments").html("");       	 	       
	 	   reviewBlock.find(".review-rating").attr("userRating",0);      	 	   
	 	   reviewsPresenter.refreshRating(reviewBlock, 0);	 	   	 	   

	 	   reviewsPresenter.currentReviewFB = firebase.$.child("reviews/"+sku);
	 	   reviewsPresenter.currentReviewFB.on('child_added', reviewsPresenter.addReviewForProductPage);	 
 	 	   
	       //reviewBlock.show('blind');
	       reviewBlock.show();
	 },

	 hideReview:function(review){
	     if (reviewsPresenter.currentReviewFB != null){
     	     reviewsPresenter.currentReviewFB.off('child_added', reviewsPresenter.addReview);	
     	     reviewsPresenter.currentReviewFbUrl = null;
	     }

 	     if(review != null && review.is(":visible")){
	 	 	   review.hide('blind');
	 	 	   
	 	 	   setTimeout(function() {
                  review.find(".review-comments").html("");
                },300);
 	     }
	 },	 	 

	 saveReview: function(e){
	    if(!firebase.isLoggedIn){
			Messenger.info("Please login or sign up to add comments to this product!");	
		}else{
      	    var targetOutfit = $(e.target).parents(".item");
      	   
      	 	var comment = targetOutfit.find(".review-add-comment").val();
      	 	
      	 	if(comment.trim() != ""){	 		
      		 	var now = new Date();
      		 	var ampm = now.getHours() >= 12 ? "PM" : "AM";
      		 	var hour = now.getHours() % 12;
      		 	hour = hour == 0 ? 12 : hour;
      		 	hour = reviewsPresenter.addZero(hour);
      		 	var minute = reviewsPresenter.addZero(now.getMinutes());
      		 	
      		 	var nowString = (now.getMonth() + 1) +"/"+ now.getDate() +"/"+ now.getFullYear() + " " + hour +":"+ minute + " " + ampm;
      		 	var user = firebase.username == null ? "Guest" : firebase.username;
      		 	var rating = targetOutfit.find(".review-rating").attr("userRating");
      		 	rating = rating == undefined ? 0 : rating;
      		 	
      		 	var sku = targetOutfit.attr("pid");
      		 	reviewsPresenter.currentReviewFB = firebase.$.child("reviews/"+sku);	 	 	
      		 	reviewsPresenter.currentReviewFB.push({name:user, rating:rating, comment: comment, date:nowString, sku:sku});	 	
      		 	
      		 	targetOutfit.find(".review-add-comment").val("");		 	
      		 	var review = targetOutfit.find(".review-float");
      		 	reviewsPresenter.refreshRating(review, 0);
      		 	
      		 	// update review count
      		 	firebase.$.child("clositt/products/"+sku+"/rc").transaction(function(value) {
      		 	   var newValue = 1;
      		 	   
      		 	   if(value == null){		 	       
          	 	       firebase.$.child("clositt/products/"+sku+"/rc").set(newValue);
      		 	   }else{
      		 	        newValue = value +1;		 	        
      		 	   } 		 	            
      		 	   
      		 	   $('.item[pid="'+sku+'"]').find(".numReviews > .counter").text(newValue);
      		 	   targetOutfit.find(".productPageCommentCount").text("("+newValue+")");
      		 	   return newValue;       
                  });
      		 	
      	 	}else{
      	 		Messenger.info("Please enter a comment");
      	 	}
		}
	 },
	 
	 addReview: function(snapshot){
		var review = snapshot.val();
		if(review != null){		
		    var reviewBlock = reviewsPresenter.getReviewBlock(review.sku);		  	
			
			if(!reviewBlock.find(".review-comments > li").length){
				reviewBlock.find(".review-comments").html("");	
			}
				
			reviewBlock.find(".review-comments").append(
				$("<li>").append(
					reviewsPresenter.getReviewHeader(review)
				).append(				
					$("<span>").addClass("review-text").append( 
					   $("<span>").addClass("review-comment-user").text(review.name + ": ")
					).append(
					   $("<pre>").text(review.comment) 
					)
				)
			);
			
			//reviewsPresenter.showAverageRating(reviewBlock);	
		}	
	 },
	 
	 addReviewForProductPage: function(snapshot){
		var review = snapshot.val();
		if(review != null){		
		    var reviewBlock = reviewsPresenter.getReviewBlock(review.sku + "pp");		  	
			
			if(!reviewBlock.find(".review-comments > li").length){
				reviewBlock.find(".review-comments").html("");	
			}
				
			reviewBlock.find(".review-comments").append(
				$("<li>").append(
					reviewsPresenter.getReviewHeader(review)
				).append(				
					$("<span>").addClass("review-text").append( 
					   $("<span>").addClass("review-comment-user").text(review.name + ": ")
					).append(
					   $("<pre>").text(review.comment) 
					)
				)
			);
			
		   //reviewsPresenter.showAverageRating(reviewBlock);
		   var targetOutfit = reviewBlock.parents(".item");
		   var aveRating = reviewsPresenter.showAverageRating(targetOutfit);	 	   
	 	   aveRating = aveRating > 0 ? aveRating : 0;
	 	   var aveRatingBlock = reviewsPresenter.getReviewRating(aveRating, 'large');
	 	   targetOutfit.find(".productPageRating .review-average-stars").html(aveRatingBlock);
		}	
	 },
	 
	 getReviewHeader: function(review){
	    var isToday = reviewsPresenter.isDateToday(review.date);	    
	    var dateTimeSplitIndex = review.date.indexOf(" ");
	    var reviewDate = "";
	    
	    if (isToday){
	       reviewDate = review.date.substring(dateTimeSplitIndex + 1);  
	    }else{
	       reviewDate = review.date.substring(0,dateTimeSplitIndex);
	    }	    	    
	   
	 	return $("<div>").addClass("review-header").append(
	 		$("<span>").addClass("review-comment-date").text(reviewDate)	 		
	 	).append(
		 		reviewsPresenter.getReviewRating(review.rating)
	 	);
	 },	 	 
	 
	 getReviewRating: function(numStars, size){
	    size = size == null ? 'small' : size;
	 	var rating = $("<span>").addClass("review-comment-rating").attr("rating",numStars);
	 	var count = 0;
	 	
	 	if(numStars == null || numStars < 0 || numStars > 5){
	 	     return null;
	 	}
	 	
	 	for(var r=1; r <= numStars; r++){
	 		rating.append(
	 			$("<i>").addClass("star-"+size+"-full")
	 		);
	 		count++;
	 	}	
	 	
	 	if(count < 5 && numStars % .5 == 1){
	 		rating.append(
	 			$("<i>").addClass("star-"+size+"-half")
	 		)
	 		count++;
	 	}
	 	
	 	while(count < 5){
	 		rating.append(
		 		$("<i>").addClass("star-"+size+"-empty")
		 	)
	 		count++;
	 	}		 		 		 		 		 	
	 	
	 	return rating;	
	 },
	 
	 showAverageRating: function(review){	 	
	    
	 	var aveRating = reviewsPresenter.getAverageRating(review);		 	
		
		if(aveRating >= 0 && aveRating <=5){
		 	review.find(".review-average").text("("+aveRating+")");
		 	//review.find(".review-average").show();
		}else{
			review.find(".review-average").text("(0)");
		 	//review.find(".review-average").hide();
		}
	 	
//	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){	 	
//		 	var aveRating = reviewsPresenter.getAverageRating();
//		 	
//		 	if(aveRating >= 0 && aveRating <=5){
//			 	reviewsPresenter.refreshRating(aveRating);
//		 	}else{
//		 		reviewsPresenter.refreshRating(0);
//		 	}	 		 		 		
//	 	}

        return aveRating;
	 },
	 
	 getAverageRating: function(review){	 
	 	var totalRatings = 0;
	 	var numRatings = 0;
	 		
	 	review.find(".review-comments .review-comment-rating").each(function(){
	 		var val = $(this).attr("rating");
	 		val = val < 0 ? 0 : val;
	 		val = val > 5 ? 5 : val;
	 		
	 		totalRatings += parseFloat(val);
	 		numRatings++;	 		
	 	});
	 	
	 	if(numRatings > 0){
	 		var ave = totalRatings / numRatings;	
	 		return Math.round( ave * 10 ) / 10;
	 	}
	 	
	 	return -1;
	 },
	 
	 showFilledStars: function(e){	 	
	 	var star = $(e.target).attr("star");
	 	star = star > 5 ? 5 : star;
	 	
	 	var userRating = $(".review-rating").attr("userRating");
	 	
	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){
	 	    var outfit = $(e.target).parent().parent().parent();
	 		reviewsPresenter.refreshRating(outfit, star);	 	
	 	}
	 },
	 
	 refreshRating: function(review, star){	 
	 	star = parseFloat(star);
	 	var count = 0;
	 	 	
	 	// Full Stars
	 	for(var i=1; i<= star; i++){
	 		var targetStar = review.find('.review-rating .review-star[star="'+i+'"]');
	 		targetStar.removeClass("star-small-empty star-small-half");
	 		targetStar.addClass("star-small-full");
	 		count++;
	 	}	 
	 	
	 	// Half Stars
	 	if(count < 5 && star % .5 == 1){
	 		var targetStar = review.find('.review-rating .review-star[star="'+count+'"]');
	 		targetStar.removeClass("star-small-empty star-small-full");
	 		targetStar.addClass("star-small-half");
	 		count++;
	 	}		 	
	 	
	 	// Empty Stars
	 	for(var i=count+1; i<= 5; i++){
	 		var targetStar = review.find('.review-rating .review-star[star="'+i+'"]');
	 			 		
	 		targetStar.removeClass("star-small-full star-small-half");
	 		targetStar.addClass("star-small-empty");
	 	} 
	 },
	 
	 chooseRating: function(e){
	 	var star = $(e.target).attr("star");	 	
	 	
	 	if($(".review-rating").attr("userRating") == star){
	 		star = 0;
	 	}

		$(".review-rating").attr("userRating",star);
		var outfit = $(e.target).parent().parent().parent();	 			 	
	 	reviewsPresenter.refreshRating(outfit, star);
	 },
	 
	 resetRating: function(e){
	    var outfit = $(e.target).parent().parent().parent();
	 	var userRating = outfit.find(".review-rating").attr("userRating");
	 	
	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){
	 		reviewsPresenter.refreshRating(outfit, 0);	 	
	 	}else{
		 	reviewsPresenter.refreshRating(outfit, userRating);	 		
	 	}
	 },
	 
	 getReviewBlock: function(id){
	   if (reviewsPresenter.cachedReviews[id] != null){
	       return reviewsPresenter.cachedReviews[id];
	   }
	   
	   var reviewRating = $("<div>").addClass("review-rating");
	   
	   for (var i=1; i <= 5; i++){
	       reviewRating.append(
                $("<i>").addClass("review-star star-small-empty").attr("star", i)
            )
	   }	   	   
	   
	   //reviewRating.append($("<span>").addClass("review-average label label-info").text("0"));     
	   	   
       var reviewBlock = $("<div>").attr("id",id + "-review-float").addClass("review-float").css("display","none").append(
            $("<div>").addClass("review-form").append(
                $("<textarea>").addClass("review-add-comment").attr("rows","3").attr("placeholder","Add a Comment...")
            ).append(reviewRating).append(
                $("<button>").addClass("review-add-btn btn btn-success btn-mini").attr("type","button").text("Add Comment")
            )                       
       ).append(
            $("<ul>").addClass("review-comments")
       ); 	          
       
       reviewsPresenter.cachedReviews[id] = reviewBlock;
       return reviewBlock;        	   
	 },
	 
	 isDateToday: function(d){
	   var date = new Date(d);
	   var today = new Date();
	   
	   return date.getUTCFullYear() == today.getUTCFullYear() &&
	          date.getUTCMonth() == today.getUTCMonth() &&
	          date.getUTCDate() == today.getUTCDate();	   
	 },
	 
	 addZero: function(i){
		if(isNaN(i)){
			i = 0;
		}	
	 	
		if (i<10){
		  i="0" + i;
		}
		
		return i;
	}
};	