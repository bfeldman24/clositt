var gridPresenter = {	
	
	init: function(){				
		gridEvents.init();
	},			

	alignDefaultGrid: function(){
		var columns = gridPresenter.getDefaultColumns();
		$(".addToClosetBtn").tooltip({title:"Add to Closet"});
		$(".tagOutfitBtn").tooltip({title:"Tagitt"});
		//$(".addToClosetBtn").tooltip();	
					
		gridPresenter.alignGrid("product-grid", columns, 200, 25);						
		closetFormPresenter.markUsersClositItems();
	}, 
	
	getDefaultColumns: function(){
		var columns = 1;
		var screenWidth = $(document).width();
		
		if(screenWidth > 1425){
			columns = 6;	
		}else if(screenWidth > 1200){
			columns = 5;	
		}else if(screenWidth > 975){
			columns = 4;	
		}else if(screenWidth > 750){
			columns = 3;	
		}else if(screenWidth > 525){
			columns = 2;	
		}
		
		/*
		2) 200 + 25 + 200 = 425 + 400 = 825
		3) 200 + 25 + 200 + 25 + 200 = 650 + 400 = 1050
		4) 200 + 25 + 200 + 25 + 200 + 25 + 200 = 875 + 400 = 1275
		5) 200 + 25 + 200 + 25 + 200 + 25 + 200 + 25 + 200 = 1100 + 400 = 1500
		*/
		
		return columns;	
	},

	alignGrid: function(/*string*/ id, /*int*/ cols, /*int*/ cellWidth, /*int*/ padding) {
   
		var x = 0;
		var y = 0;
		var count = $("#" + id).children("div[aligned=true]").size();
		var unit = "px";
		var yCol = new Array();
		
		for(var i=0; i< cols; i++){
			yCol[i] = 0;	
		}
		
		var n=count;
		$("#" + id).children("div[aligned=true]").slice(-1 * cols).each(function() {
			var colNum = n++ % cols;
			if (colNum >= cols - 1) {
				x = 0;
			}else{
				x = parseInt($(this).css("left"),10) + cellWidth + padding;				
			}						
			
			yCol[colNum] = parseFloat($(this).css("top"),10) + parseFloat($(this).css("height"),10) + padding;
		});
				
		$("#" + id).css("position", "relative").css("margin","0 auto").css("width", (cols * (cellWidth + padding)) + "px");
		
		$(".pageEndSpacer").remove();
		    
		$("#" + id).children("div[aligned!=true]").each(function() {
		    	var colNum = count % cols;
		    	var imgHeight = $(this).find(".picture > a > img").first().css("height");
		    	var imgWidth = $(this).find(".picture > a > img").first().css("width");
		    	
		    	if(imgHeight == undefined || imgHeight == null || imgHeight.trim() == ""){
					imgHeight = 70;	    	
			    	imgWidth = cellWidth;  	
		    	}else{		    	
			    	imgHeight = parseFloat(imgHeight,10);	    	
			    	imgWidth = parseFloat(imgWidth,10);		    	
			    	
			    	if(imgHeight < 50){			    		
			    		imgHeight = 270;
			    		imgWidth = 202;	
			    	}
		    	}
		    	
		    	var newHeight = cellWidth * imgHeight / imgWidth;
		    	
		        $(this).css("width", cellWidth + unit);
		        $(this).css("height", newHeight + unit);
		        $(this).css("position", "absolute");		        
		        
		        $(this).css("left", x + unit);
		        $(this).css("top", yCol[colNum] + unit);	        
		        $(this).attr("aligned",true);
		        		        		        
		        if (colNum >= cols - 1) {
		            x = 0;	           
		        } else {
		            x += cellWidth + padding;
		        }
		        
		        yCol[colNum] += newHeight + padding;
		        
		        count++;
	    });
	    
	    $("#" + id).append(
	    	$("<div>").addClass("pageEndSpacer")	    		
	    		.css("top", yCol[(count-1) % cols] + "px")
	    );
	},
					
	
	showContent: function(numElements){
		var lastHeight = $("#product-grid").children("div[aligned=true]").last().css("top");
		
		if(lastHeight == undefined || lastHeight == null || lastHeight.trim() == ""){
			lastHeight = 0;
		}else{
			lastHeight = parseFloat(lastHeight,10);	
		}
		
		if(lastHeight <= ($(window).height() + $(window).scrollTop() + 125)){			
			
			if(productPresenter.clothingStore != null){							
				var $items = $();
				var el=productPresenter.filterStore;
				var index = productPresenter.productIndex;
				
				for(var i = index; i < index + numElements;i++){
					
					if(el[i] != null){
						var html = productPresenter.getProductTemplate(el[i]).css("position","absolute").css("left","-9999px");
						$items = $items.add(html);
					}
				}
				productPresenter.productIndex += numElements;
				
				$("#product-grid").append($items);
								
				gridPresenter.alignDefaultGrid();	
			}		
		}
	}
};


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
	 	 	reviewsPresenter.currentOutfit.find('a[productid]').first().attr("productid") == $(e.target).parent().attr("productid") ){	 	 	
	 	
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
		 	var product = reviewsPresenter.currentOutfit.find('a[productid]').first().attr("productid");	 	 		 	 	
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

var tagPresenter = {	

	allTags: null,
	
	init: function(){
		$( "#search-bar" ).val("");
		tagPresenter.getAllTagNames();
		$("#search-form").submit(tagPresenter.searchTags);
		$("#seach-bar-icon").on("click", tagPresenter.searchTags);
		$("#search-clear").click(tagPresenter.clearSearch);
	},
	
	showTagForm: function(el){
		var element = el.currentTarget;					
		
		if($(element).parent().parent().find(".addTagForm").length > 0){						
			$(element).parent().parent().children(".addToClosetForm").tooltip('destroy');
			$(element).parent().parent().children(".addToClosetForm").remove();
			$(element).parent().parent().children(".addTagForm").tooltip('destroy');
			$(element).parent().parent().children(".addTagForm").remove();
			$(element).parent().parent().children(".topright").show();
		}else{														
			$(element).parent().siblings(".topright").hide();
					
			$(element).parent().parent().append(
				$("<div>").addClass("addTagForm").append(
					$("<form>").append(
						$("<div>").addClass("controls").append(					
							$("<input>").attr("type","text").attr("name","newTag").addClass("newTag")
						)
					).append(
						$("<input>").attr("type","submit").css("display","none")				
					)
				)
			);
			
			var $tagForm = $(element).parent().parent().children(".addTagForm");
			
			$tagForm.tooltip({title:"Press Enter to add tag",placement:"bottom"});
			$tagForm.show();
			$tagForm.find("input").first().focus();
		}
	},
	
	addTag: function(el){
		el.preventDefault();				
		var element = el.currentTarget;
		var name = $(element).parent().prev().find(".name").text();
		var company = $(element).parent().prev().find(".companyName").text();		
		var customer = $(element).parent().parent().parent().attr("customer");
		var category = $(element).parent().parent().parent().attr("category");
		var itemid = $(element).parent().parent().prev().find("a").attr("productid");
		var image  = $(element).parent().parent().prev().find("img").attr("src");
		var price = $(element).parent().prev().find(".price").text();
		
		if(price != null){
			price = price.substring(1); // Remove $
		}
		
		var tagInput = $(element).find('input[name="newTag"]').val().trim();		
		
		
		if(tagInput.length > 0){
			var item = {name: name, company: company, customer: customer, category: category, link: itemid, image: image, price: price}; 		
					
			try{		
				firebase.$.child("tags").child(tagInput.toLowerCase()).child("items").child(itemid).set(item, function(error) {
				  if (error) {
						Messenger.error('Tag could not be saved. ' + error);
				  } else {
				  		Messenger.timeout = 1750;
						Messenger.success('Tag \"'+tagInput+'\" was saved!');					
						Messenger.timeout = Messenger.defaultTimeout;
						$(element).parent().prevAll(".topright").show();
						$(element).parent().remove();
				  }
				});	
			}catch(err){
				Messenger.error('Tag could not be saved. ' + err);
				return false;
			}					
		}
		
		return false;
	},
	
	getAllTagNames: function(){
		firebase.$.child("tags").once('value',function(snapshot){
			tagPresenter.allTags = new Array();
			
			snapshot.forEach(function(tag){
				tagPresenter.allTags.push(tag.name());
			});
			
			$( "#tags" ).autocomplete({
				source: tagPresenter.allTags
			});
		});
	},
	
	searchTags: function(el){
		el.preventDefault();
		var tag = $( "#search-bar" ).val();
		var products = new Array();

		
		if(/^[a-zA-Z0-9 '-]+$/.test(tag)){	
			$("#product-grid").children().remove();
			$("#loadingMainContent").show();
		
			firebase.$.child("tags").child(tag.toLowerCase()).child("items").once('value',function(snapshot){
				snapshot.forEach(function(item){
					var product = item.val();
	 					 					
					var priceArray = product.price.split(/[\s-]+/);
					var finalPrice = parseFloat(priceArray[priceArray.length - 1].replace(/[^0-9\.]+/g,""));										
					
					var filterPrice = Math.floor(finalPrice/50)*50;
					
					var product = {"o":product.company,"u":product.customer,"a":product.category,"l":product.link,
										"i":product.image,"n":product.name,"p":finalPrice,"fp":filterPrice}
					products.push(product);
				});
				
				productPresenter.clothingStore = products;
				productPresenter.filterStore = products;
				productPresenter.productIndex = 0;

				$("#loadingMainContent").hide();
				
				if( products.length > 0){
					gridPresenter.showContent(15);
				}else{
					$("#product-grid").append($("<div>").html("Sorry there are no outfits that match: \"" + tag + "\"! Try using another way to describe what you are looking for."));
				}
				
				$("#search-clear").show();
			});			
		}else{
			Messenger.error('Search text can only contain letters, numbers, and apostrophes!');					
		}
		
		return false;
	},
	
	clearSearch: function(el){
		el.preventDefault();
		$( "#search-bar" ).val("");
		$("#product-grid").remove();
		$("#loadingMainContent").show();
		$("#search-clear").hide();
		
		productPresenter.clothingStore = [];
		productPresenter.filterStore = [];
		productPresenter.productIndex = 0;
		
		
		productPresenter.init();
				
		return false;
	}
};
