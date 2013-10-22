var closetPresenter = {
	share: '1212000',	
	carouselLeft: null,	
	carouselRight: null,

	init: function(user){
		var u = user ==  undefined ? undefined : user.toString().replace(closetPresenter.share,'');
		closetPresenter.getClosets(u);
		$(document).on("mousedown",".carousel-left", closetPresenter.leftAnimation);
		$(document).on("mousedown",".carousel-right", closetPresenter.rightAnimation);
		$(document).on("mouseup",".carousel-left", closetPresenter.stopCarouselLeft);
		$(document).on("mouseup",".carousel-right", closetPresenter.stopCarouselRight);
		
		$("#closet-settings > .settings-minicon").on("click", closetPresenter.showSettings);
		$(document).on("click", "#closet-settings > .save-minicon", closetPresenter.saveClosets);
		$(document).on("click", "#closet-share > .share-freeiconsweb", closetPresenter.shareCloset);
		$(document).on("click",".delete-outfit", closetPresenter.removeOutfit);		
		$(document).keypress(closetPresenter.saveClosetsOnEnter);				
	},
	
	getClosets: function(user){
		if(user != undefined){
			firebase.$.child(firebase.userPath).child(user).child("closets").once('value', closetPresenter.showClosets);
			firebase.$.child(firebase.userPath).child(user).child("name").once('value', function(data){
				$("#user-closet-title").text(data.val() + "'s Closet");
			});
		}else if(firebase.isLoggedIn){
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").once('value', closetPresenter.showClosets);		
			 $("#user-closet-title").text(firebase.username + "'s Closet");
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
							$("<img>").attr("src","css/images/hanger.png")
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

			$("#closet-share > .share-freeiconsweb").animate({
				right: '+=50'
			}, 50);			
	
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

			$("#closet-share > .share-freeiconsweb").animate({
                                right: '-=50'
                        }, 50);
			
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
	},

	shareCloset: function(){
		if($("#share-url").length){
			$("#share-url").remove();
		}else{
			var query = location.href.toString().replace("closet.php",("!" + closetPresenter.share) + firebase.userid)

			$("#closet-share > .share-freeiconsweb").before(
      			  $('<input type="text">')
            		 	.attr("id","share-url")
            			.attr("value",query)
            			.css("position","absolute")
           			    .css("top","110px")
            			.css("right","185px")
            			.css("height","30px")
            			.css("width","200px")
        		);

			$("#share-url").focus();
		}
	}
}





var closetFormPresenter = {

	closetNames: null, 
	closetItems: null,
	closetItemsMapping: null,
	darkHangerImg: "/css/images/hanger-icon.png",
	lightHangerImg: "/css/images/hanger-icon-white.png",
	
	getClosetInfo: function(){
		if(closetFormPresenter.closetNames == null && firebase.isLoggedIn){
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").on('value', function(snapshot){
				var closetNames = new Array();
				var closetItems = new Array();
				var closetItemsMapping = new Array();
				var i=0;
				
				snapshot.forEach(function(closet){
					closetNames[i] = closet.name();
					
					closet.child("items").forEach(function(item){
						closetItems.push(item.name());
						closetItemsMapping.push(closetNames[i]);							
					});
					
					i++;
				});	
				
				closetFormPresenter.closetNames = closetNames;
				closetFormPresenter.closetItems = closetItems;
				closetFormPresenter.closetItemsMapping = closetItemsMapping;
				closetFormPresenter.markUsersClositItems();
			});		
		}
	},
	
	showClosetForm: function(el){
		if(!firebase.isLoggedIn){
			Messenger.info("Please login or sign up to add items to your closet!");	
		}else{
			if(closetFormPresenter.closetNames == null){
				closetFormPresenter.getClosetInfo();
			}			
			
			var element = el.currentTarget;					
			
			if($(element).parent().parent().find("form").length > 0){
				$(element).children(".hanger-plus").addClass("icon-white");
				$(element).parent().parent().children(".addToClosetForm").tooltip('destroy');
				$(element).parent().parent().children(".addToClosetForm").remove();
				$(element).parent().parent().children(".addTagForm").tooltip('destroy');
				$(element).parent().parent().children(".addTagForm").remove();
				$(element).parent().parent().children(".bottom").show();			
			}else{
				$(element).children(".hanger-plus").removeClass("icon-white");			
				var $checkboxes = $();		
				
				for(var i=0; i< closetFormPresenter.closetNames.length; i++){
					var $input = $("<input>").attr("type","radio").attr("name","closet").attr("value",closetFormPresenter.closetNames[i]);

					var index = closetFormPresenter.closetItems.indexOf($(element).children("img").attr("id").substring(7)); // hanger- = 7
					if(index >= 0 && index < closetFormPresenter.closetItemsMapping.length &&
						closetFormPresenter.closetNames[i] == closetFormPresenter.closetItemsMapping[index]){
						$input.attr("checked","checked");
					}	
				
					$checkboxes = $checkboxes.add(
						$("<div>").addClass("controls").append(
							$("<label>").addClass("radio").append( $input								
							).append($("<span>").html(closetFormPresenter.closetNames[i]))
						)
					);
				}		
				
				$(element).parent().next(".bottom").hide();
						
				$(element).parent().parent().append(
					$("<div>").addClass("addToClosetForm").append(
						$("<form>").append(
							$("<div>").addClass("controls").append(
								$("<label>").addClass("control-label").text("New Clositt: ").append(						
									$("<input>").attr("type","text").attr("name","newCloset").addClass("newCloset")
								)
							)
						).append(
							$("<div>").addClass("selectCloset").append($checkboxes)
						).append(
							$("<input>").attr("type","submit").css("display","none")				
						)
					)
				);
				
				var $closetForm = $(element).parent().parent().children(".addToClosetForm");
				
				$closetForm.tooltip({title:"Press Enter to add item",placement:"bottom"});
				$closetForm.show();
			}
		}
	},	
	
	addToCloset: function(el){
		el.preventDefault();				
		
		var name = $(el.currentTarget).parent().prev().find(".name").text();
		var company = $(el.currentTarget).parent().prev().find(".companyName").text();
		var link = $(el.currentTarget).parent().parent().prev().find("a").attr("productid");
		var image  = $(el.currentTarget).parent().parent().prev().find("img").attr("src");
		
		var closetNameInput = $(el.currentTarget).find('input[name="newCloset"]').val();
		var closetNameRadio = $(el.currentTarget).find('input[name="closet"]:checked').val();
		
		var closetName = "";
		
		if(closetNameInput.trim().length > 0){
			closetName = closetNameInput;
		}else if(closetNameRadio.trim().length > 0){
			closetName = closetNameRadio;
		}
		
		if(closetName.trim().length > 0){
			var item = {name: name, company: company, link: link, image: image}; 
			var itemid = link.replace(/\W/g, '');
			var index = closetFormPresenter.closetItems.indexOf(itemid);
			
			if(index < 0 || index >= closetFormPresenter.closetItemsMapping.length || closetFormPresenter.closetItemsMapping[index] != closetName){			
				firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(closetName).child("items").child(itemid).set(item, function(error) {
				  if (error) {
						Messenger.error('Closet could not be saved. ' + error);
				  } else {
						Messenger.success('This item was added to "' + closetName + '"');
				  }
				});
			}else{
				Messenger.success('This item is already in your closet "' + closetName + '"');
			}
		}
		
		return false;
	},
	
	markUsersClositItems: function(){
		if(closetFormPresenter.closetItems != null && firebase.isLoggedIn){
			var $closetItems = $("#hanger-" +  closetFormPresenter.closetItems.join(", #hanger-") );
			$closetItems.attr("src",closetFormPresenter.darkHangerImg);
			$closetItems.parent().tooltip('destroy');
			$closetItems.parent().tooltip({title:"In my Closet"});	
		}
	}
}

