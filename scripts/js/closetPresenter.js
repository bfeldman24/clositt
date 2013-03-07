var closetPresenter = {
	
	carouselLeft: null,	
	carouselRight: null,

	init: function(){
		closetPresenter.getClosets();
		$(document).on("mousedown",".carousel-left", closetPresenter.leftAnimation);
		$(document).on("mousedown",".carousel-right", closetPresenter.rightAnimation);
		$(document).on("mouseup",".carousel-left", closetPresenter.stopCarouselLeft);
		$(document).on("mouseup",".carousel-right", closetPresenter.stopCarouselRight);
		
		$("#closet-settings > .settings-minicon").on("click", closetPresenter.showSettings);
		$(document).on("click", "#closet-settings > .save-minicon", closetPresenter.saveClosets);
		$(document).on("click",".delete-outfit", closetPresenter.removeOutfit);		
		$(document).keypress(closetPresenter.saveClosetsOnEnter);				
	},
	
	getClosets: function(){
		if(firebase.isLoggedIn){
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").once('value', closetPresenter.showClosets);		
		}else{
			Messenger.info("Please login or sign up to add items to your closet!");	
		}
	},
	
	showClosets: function(closets){							
		closets.forEach(function(closet){
			var $itemlist = $("<div>").addClass("items");
			
			var rand = Math.floor(Math.random() * 3) + 1;
			var textColor = rand > 1 ? 'orange' : rand > 0 ? 'red' : '';
			
			$("#closet-list").append($("<hr>")).append(
				$("<div>").addClass("closet").addClass("clearfix").append(
					$("<h1>").addClass("closetName").append($("<span>").addClass(textColor).text(closet.name()))				
				).append(
					$("<div>").addClass("carousel").append(
						$("<div>").addClass("carousel-left").append(
							$("<div>").addClass("left-arrow")
						)
					).append($itemlist).append(
						$("<div>").addClass("carousel-right").append(
							$("<div>").addClass("right-arrow")
						)						
					)
				)
			);
			
			closet.child("items").forEach(function(item){											
				$itemlist.append(
					productPresenter.getClosetItemTemplate(item.val()).prepend(
						$("<div>").addClass("hanger").append(
							$("<img>").attr("src","/css/images/hanger.png")
						)
					)
				); 				
			});				
		});	
		
		$(".closetName").last().attr("last",true);
	},		
	
	stopCarouselLeft: function(el){
		$(el.currentTarget).next(".items").first().stop();
		$(el.currentTarget).animate({opacity: .5},500);
	},
	
	stopCarouselRight: function(el){
		$(el.currentTarget).prev(".items").first().stop();
		$(el.currentTarget).animate({opacity: .5},500);
	},
	
	leftAnimation: function(el){		
		$(el.currentTarget).next(".items").first().animate({left:  -1 * $(document).width() - $(this).width()},7000);		
		$(el.currentTarget).animate({opacity: 1},500);
	},
	
	rightAnimation: function(el){
		$(el.currentTarget).prev(".items").first().animate({left: $(document).width() - $(this).width()},7000);	
		$(el.currentTarget).animate({opacity: 1},500);
	},
	
	showSettings: function(){
		if( !$(".settings-minicon").hasClass("active") && $(".outfit").length > 0){
			$(".settings-minicon").addClass("active");
			
			$("#closet-settings").prepend(
				$("<i>").addClass("minicon-single save-minicon")
			);
			
			$(".picture").append(
				$("<div>").addClass("delete-outfit").append(
					$("<i>").addClass("icon-remove icon-white")
				)
			);			
				
			$(".closetName > span").replaceWith(function() {
				return $("<span>").append(
						$("<input>").addClass("closetNameInput")
							.attr("type","text")
							.attr("name","closetName")
							.attr("original",$(this).text())
							.attr("value",$(this).text()));
			});			
		}else{
			closetPresenter.hideSettings();	
		}
	},
	
	hideSettings: function(){
		if( $(".settings-minicon").hasClass("active") ){
			$(".settings-minicon").removeClass("active");
			
			$("#closet-settings .save-minicon").remove();
			
			$(".picture .delete-outfit").remove();
				
			$(".closetName > span").replaceWith(function() {
				return $("<span>").text($(this).children("input").attr("original"));
			});			
		}
	},
	
	saveClosets: function(){	
		if( $(".settings-minicon").hasClass("active") ){			
			$(".closetName input").each(function(){
				var original = $(this).attr("original");
				var newName = $(this).val();
				var $closetNameInput = $(this);
				var success = true;
				
				if(newName != original){
					firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(original).once('value',function(snapshot){
						
						firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(newName).set(snapshot.val(), function(error){
							if (error) {
							    	Messenger.error('Item could not be removed.' + error);
							    	success = false;
				 			  } else {
				 				    firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(original).remove();
						
									$closetNameInput.attr("original",newName);
									$closetNameInput.attr("value",newName);
																																	
									if ($closetNameInput.parent().parent().attr("last")){
										if(success){
											Messenger.success("Closet Names were saved!");
											closetPresenter.hideSettings();	
										}else{
											Messenger.error("Error! Closet Names were not saved!");	
										}
									}	
							  }						
						});					
					});										
				}else{
					if ($closetNameInput.parent().parent().attr("last")){
						if(success){
							Messenger.success("Closet Names were saved!");
							closetPresenter.hideSettings();	
						}else{
							Messenger.error("Error! Closet Names were not saved!");	
						}
					}	
				}			
			});	
		}			
	},

	saveClosetsOnEnter: function(e){
		// 13 == Enter
		if( $(".settings-minicon").hasClass("active") ){
			if(e.which == 13) {			
				closetPresenter.saveClosets();
			}	
		}
	},
	
	removeOutfit: function(el){
		var link = $(el.currentTarget).prev("a").attr("href").replace(/\W/g,'');
		var closetName = $(el.currentTarget).parent().parent().parent().parent().prev(".closetName").find("input").attr("original");
		
		firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(closetName).child("items").child(link).remove(function(error){
		  if (error) {
		    	Messenger.error('Item could not be removed.' + error);
		  } else {
		  		$(el.currentTarget).parent().parent().css("display","none");
		    	Messenger.success('This item was removed from "' + closetName +'"');		    	
		  }
		});
	}
}

