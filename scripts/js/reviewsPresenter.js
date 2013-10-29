var reviewsPresenter = {	
	currentOutfit: null,
	currentOutfitPosition: null,
	
	
	currentReviewFB: null,	
	 
	 init: function(){
	 	$(document).on("click", ".picture > a", reviewsPresenter.showReview);
	 	$(document).on("click", "#review-add-btn", reviewsPresenter.saveReview);	
	 	$(document).on("click", "#review-mask", reviewsPresenter.hideReview);		 		 
	 	
	 	$(document).on("mouseenter", "#review-rating .review-star", reviewsPresenter.showFilledStars);		 		 
	 	$(document).on("mouseleave", "#review-rating", reviewsPresenter.resetRating);		 		 	 	
	 	$(document).on("click", "#review-rating .review-star", reviewsPresenter.chooseRating);		 		 	 	
	 },
	 
	 
	 showReview: function(e){	 	
	 	 	 	
	 	 $("#review-comments").height($("#review-float").height() - 230);
	 	 
	 	 if( reviewsPresenter.currentOutfit != null && 
	 	 	reviewsPresenter.currentOutfit.find('a[pid]').first().attr("pid") == $(e.target).parent().attr("pid") ){	 	 	
	 	
	 	 	reviewsPresenter.hideReview();	 	 			 
	 	 }else{	 
	 	 	filterPresenter.hideFilterPanel();
	 	 	$("#review-comments").html("Be the first to add a review!");
	 	 	$("#review-rating").attr("userRating",0);
	 	 	reviewsPresenter.refreshRating(0);
	 	 	reviewsPresenter.showAverageRating();	 	 	
	 	 	reviewsPresenter.currentOutfit = $(e.target).parent().parent().parent();
	 	 	var store = reviewsPresenter.currentOutfit.attr("company");
		 	var customer = reviewsPresenter.currentOutfit.attr("customer");
		 	var category = reviewsPresenter.currentOutfit.attr("category");	 	
		 	var product = reviewsPresenter.currentOutfit.find('a[pid]').first().attr("pid");	 	 		 	 	
	 	 	reviewsPresenter.currentReviewFB = firebase.$.child("reviews/"+store+"/"+customer+"/"+category+"/"+product);	 	 	
	 	 	reviewsPresenter.currentReviewFB.on('child_added', reviewsPresenter.addReview);
	 	 	
	 	 	setTimeout(function(){
	 	 		$("#review-float").fadeIn();
	 	 	}, 500);
	 	 	
	 	 	$("#review-mask").fadeIn();
	 	 	if(isNaN(parseInt($("#product-grid").css("left"))) || parseInt($("#product-grid").css("left")) == 0){
	 	 		$("#product-grid").animate({left: '-200px'}, 1000);
		 	}
		 	
		 	
	 	 	reviewsPresenter.currentOutfitPosition = reviewsPresenter.currentOutfit.css("left");
	 	 	reviewsPresenter.currentOutfit.css("z-index",60);
	 	 	reviewsPresenter.currentOutfit.css("box-shadow","0 0 20px #080808");
	 	 	reviewsPresenter.currentOutfit.animate({left: "50%"}, 1000);
	 	 }
	 },
	 
	 hideReview:function(){
	 	reviewsPresenter.currentReviewFB.off('child_added', reviewsPresenter.addReview);	
	 	 	reviewsPresenter.currentReviewFbUrl = null;
	 	 	
	 	 	if(reviewsPresenter.currentOutfit != null){
		 	 	reviewsPresenter.currentOutfit.animate({left: reviewsPresenter.currentOutfitPosition}, 1000, function() {
					reviewsPresenter.currentOutfit.css("z-index",0);
			 	 	reviewsPresenter.currentOutfit.css("box-shadow","none");	
			 	 	reviewsPresenter.currentOutfit = null;
			 	 	
			 	 	$("#review-float").hide();	 	 	
		 	 		$("#review-mask").fadeOut();
				});	 	 		 	 				
		 	 	
		 	 	if(parseInt($("#product-grid").css("left")) == -200){
			 	 	$("#product-grid").animate({left: '0px'}, 1000);
		 	 	}
	 	 	}
	 },
	 
	 saveReview: function(){
	 	var comment = $("#review-add-comment").val();
	 	
	 	if(comment.trim() != ""){	 		
		 	var now = new Date();
		 	var ampm = now.getHours() >= 12 ? "PM" : "AM";
		 	var hour = now.getHours() % 12;
		 	hour = hour != 0 ? hour : 12;
		 	hour = reviewsPresenter.addZero(hour);
		 	var minute = reviewsPresenter.addZero(now.getMinutes());
		 	
		 	var nowString = now.getMonth() +"/"+ now.getDate() +"/"+ now.getFullYear() + " " + hour +":"+ minute + " " + ampm;
		 	var user = firebase.username != null ? firebase.username : "Guest";
		 	var rating = $("#review-rating").attr("userRating");
		 	rating = rating == undefined ? 0 : rating;
		 	
		 	reviewsPresenter.currentReviewFB.push({name:user, rating:rating, comment: comment, date:nowString});	 	
		 	
		 	$("#review-add-comment").val("");
		 	reviewsPresenter.refreshRating(0);
	 	}else{
	 		Messenger.info("Please enter a comment");
	 	}
	 },
	 
	 addReview: function(snapshot){
		var review = snapshot.val();
		if(review != null){			
			
			if(!$("#review-comments > li").length){
				$("#review-comments").html("");	
			}
				
			$("#review-comments").append(
				$("<li>").append(
					reviewsPresenter.getReviewHeader(review)
				).append(				
					$("<span>").addClass("review-text").append( $("<pre>").text(review.comment) )
				)
			);
			
			reviewsPresenter.showAverageRating();	
		}	
	 },
	 
	 getReviewHeader: function(review){
	 	return $("<div>").addClass("review-header").append(
	 		$("<span>").addClass("review-comment-user").text(review.name + " ")
	 	).append(
		 		reviewsPresenter.getReviewRating(review.rating)
	 	).append(
	 		$("<span>").addClass("review-comment-date").text(review.date)
	 	);
	 },
	 
	 getReviewRating: function(numStars){
	 	var rating = $("<span>").addClass("review-comment-rating").attr("rating",numStars);
	 	var count = 0;
	 	
	 	if(numStars != null && numStars >= 0 && numStars <=5){
		 	for(var r=1; r <= numStars; r++){
		 		rating.append(
		 			$("<i>").addClass("star-small-full")
		 		);
		 		count++;
		 	}	
		 	
		 	if(count < 5 && numStars % .5 == 1){
		 		rating.append(
		 			$("<i>").addClass("star-small-half")
		 		)
		 		count++;
		 	}
		 	
		 	while(count < 5){
		 		rating.append(
			 		$("<i>").addClass("star-small-empty")
			 	)
		 		count++;
		 	}
		 	
		 	rating.prepend("&lt;");
		 	rating.append("&gt;");
	 	}	 		 	
	 	
	 	return rating;	
	 },
	 
	 showAverageRating: function(){	 	
	 	var aveRating = reviewsPresenter.getAverageRating();		 	
		
		if(aveRating >= 0 && aveRating <=5){
		 	$("#review-average").text(aveRating);
		 	$("#review-average").show();
		}else{
			$("#review-average").text(0);
		 	$("#review-average").hide();
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
	 },
	 
	 getAverageRating: function(){	 
	 	var totalRatings = 0;
	 	var numRatings = 0;
	 		
	 	$("#review-comments .review-comment-rating").each(function(){
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
	 	
	 	var userRating = $("#review-rating").attr("userRating");
	 	
	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){
	 		reviewsPresenter.refreshRating(star);	 	
	 	}
	 },
	 
	 refreshRating: function(star){	 
	 	star = parseFloat(star);
	 	var count = 0;
	 	 	
	 	// Full Stars
	 	for(var i=1; i<= star; i++){
	 		var targetStar = $('#review-rating .review-star[star="'+i+'"]');
	 		targetStar.removeClass("star-large-empty star-large-half");
	 		targetStar.addClass("star-large-full");
	 		count++;
	 	}	 
	 	
	 	// Half Stars
	 	if(count < 5 && star % .5 == 1){
	 		var targetStar = $('#review-rating .review-star[star="'+count+'"]');
	 		targetStar.removeClass("star-large-empty star-large-full");
	 		targetStar.addClass("star-large-half");
	 		count++;
	 	}		 	
	 	
	 	// Empty Stars
	 	for(var i=count+1; i<= 5; i++){
	 		var targetStar = $('#review-rating .review-star[star="'+i+'"]');
	 			 		
	 		targetStar.removeClass("star-large-full star-large-half");
	 		targetStar.addClass("star-large-empty");
	 	} 
	 },
	 
	 chooseRating: function(e){
	 	var star = $(e.target).attr("star");	 	
	 	
	 	if($("#review-rating").attr("userRating") == star){
	 		star = 0;
	 	}

		$("#review-rating").attr("userRating",star);	 			 	
	 	reviewsPresenter.refreshRating(star);
	 },
	 
	 resetRating: function(){
	 	var userRating = $("#review-rating").attr("userRating");
	 	
	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){
	 		reviewsPresenter.refreshRating(0);	 	
	 	}else{
		 	reviewsPresenter.refreshRating(userRating);	 		
	 	}
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