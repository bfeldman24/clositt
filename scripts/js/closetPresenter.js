var closetPresenter = {
	share: '1212000',	
	carouselLeft: null,	
	carouselRight: null,
	user: null,
	wishListClosetId: 2,

	init: function(){
	    if (closetPresenter.user != null){
		  closetPresenter.user =  closetPresenter.user.toString().replace(closetPresenter.share,'');
	    }
	    
		closetPresenter.getClosets();
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
	
	setUser: function(user){
	   closetPresenter.user = user;
	},
	
	getClosets: function(){
		if(closetPresenter.user != undefined){
			firebase.$.child(firebase.userPath).child(closetPresenter.user).child("closets").once('value', closetPresenter.showClosets);
			firebase.$.child(firebase.userPath).child(closetPresenter.user).child("name").once('value', function(data){
    			 if (data.val() != null){
    				$("#user-closet-title").text(data.val() + "'s Clositt");
    			 }
			});
		}else if(firebase.isLoggedIn){
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").once('value', closetPresenter.showClosets);		
			 $("#user-closet-title").text(firebase.username + "'s Clositt");
		}else{
			Messenger.info("Please login or sign up to add items to your clositt!");	
		}
	},
	
	showClosets: function(closets){							
		closets.forEach(function(closet){
		      closetPresenter.getClosetTemplate("closet-list", closet, true);				
		});	
		
		$(".closetName").last().attr("last",true);
	},		
	
	getClosetTemplate: function(parentId, closet, includeClosetName){
	    var $itemlist = $("<div>").addClass("items");
			
		var rand = Math.floor(Math.random() * 3) + 1;
		var textColor = rand > 1 ? 'orange' : rand > 0 ? 'red' : '';
		var closetHeader = null;
		
		if (includeClosetName){
		  closetHeader = $("<h1>").addClass("closetName").append($("<span>").addClass(textColor).attr("closetid",closet.name()).text(closet.val().name));
		}
		
		$("#"+parentId).append($("<hr>")).append(		
			$("<div>").addClass("closet").addClass("clearfix").append(closetHeader).append(
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
				productPresenter.getClosetItemTemplate(item.name(),item.val()).prepend(
					$("<div>").addClass("hanger").append(
						$("<img>").attr("src","css/images/hanger.png")
					)
				)
			); 				
		});	
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
							.attr("closetid",$(this).attr("closetid"))
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
				return $("<span>").attr("closetid",$(this).children("input").attr("closetid")).text($(this).children("input").attr("original"));
			});			
		}
	},
	
	saveClosets: function(){	
		if( $(".settings-minicon").hasClass("active") ){			    
		  		
			$(".closetName input").each(function(){
				var closetid = $(this).attr("closetid");
				var original = $(this).attr("original");
				var newName = $(this).val().trim();
				var $closetNameInput = $(this);
				var success = true;
								
				firebase.$.child(firebase.userPath)
		          .child(firebase.userid)
		          .child("closets")
		          .child(closetid)
		          .child("name")
		          .set(newName, function(error){
    					  
    					  if (error) {
    					    	Messenger.error('Item could not be removed.' + error);
    					    	success = false;
    		 			  } else {						
    							$closetNameInput.attr("original",newName);
    							$closetNameInput.attr("value",newName);
    																															
    							if ($closetNameInput.parent().parent().attr("last")){
    								if(success){
    									Messenger.success("Clositt Names were saved!");
    									closetPresenter.hideSettings();	
    								}else{
    									Messenger.error("Error! Clositt Names were not saved!");	
    								}
    							}	
    					  }									
				});																
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
		var sku = $(el.currentTarget).parents(".item").attr("pid");
		var closetName = $(el.currentTarget).parent().parent().parent().parent().prev(".closetName").find("input").attr("original");
		var closetId = $(el.currentTarget).parent().parent().parent().parent().prev(".closetName").find("input").attr("closetid");
		
		firebase.$.child(firebase.userPath)
		  .child(firebase.userid)
		  .child("closets")
		  .child(closetId)
		  .child("items")
		  .once('value', function(items){
		      
		      items.forEach(function(item){
		          if(item.val() == sku){
		              firebase.$.child(firebase.userPath)
		                  .child(firebase.userid)
		                  .child("closets")
		                  .child(closetId)
		                  .child("items")
		                  .child(item.name())
		                  .remove(function(error){
                    
                    		  if (error) {
                    		    	Messenger.error('Item could not be removed.' + error);
                    		  } else {
                    		  		$(el.currentTarget).parent().parent().css("display","none");
                    		    	Messenger.success('This item was removed from "' + closetName +'"');		    	
                    		  }
                	  });
                	  
                	  return true;                 
		          } 
		      });
		});
			
	},

	shareCloset: function(){
		if($("#share-url").length){
			$("#share-url").remove();
		}else{
			var query = location.href.toString().replace("clositt.php",("!" + closetPresenter.share) + firebase.userid)

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

	closetIds: null,
	closetNames: null, 
	closetItems: null,
	closetItemsMapping: null,
	darkHangerImg: "/css/images/hanger-icon.png",
	lightHangerImg: "/css/images/hanger-icon-white.png",
	
	getClosetInfo: function(){
		if(closetFormPresenter.closetNames == null && firebase.isLoggedIn){
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").on('value', function(snapshot){
				var closetIds = new Array();
				var closetNames = new Array();
				var closetItems = new Array();
				var closetItemsMapping = new Array();
				var i=0;
				
				snapshot.forEach(function(closet){				    				    
					closetIds[i] = closet.name();
					closetNames[i] = closet.val().name;				    
					
					closet.child("items").forEach(function(item){					   					    
						closetItems.push(item.name());					    
						closetItemsMapping.push(closetNames[i]);							
					});
					
					i++;
				});	
				
				closetFormPresenter.closetIds = closetIds;
				closetFormPresenter.closetNames = closetNames;
				closetFormPresenter.closetItems = closetItems;
				closetFormPresenter.closetItemsMapping = closetItemsMapping;
				closetFormPresenter.markUsersClositItems();
			});		
		}
	},
	
	showClosetForm: function(el){
		if(!firebase.isLoggedIn){
			Messenger.info("Please login or sign up to add items to your clositt!");	
		}else{
			if(closetFormPresenter.closetNames == null){
				closetFormPresenter.getClosetInfo();
			}			
			
			var element = el.currentTarget;					
			
			if($(element).parents(".item").find(".addToClosetForm > form").length > 0){
				$(element).children(".hanger-plus").addClass("icon-white");
				var $parent = $(element).parents(".item");
				var $closittForm = $parent.find(".addToClosetForm");
				$closittForm.tooltip('destroy');
				$closittForm.html("").hide();
				$parent.find(".addTagForm").tooltip('destroy');
				$parent.find(".addTagForm").html("").hide();
				$parent.find(".bottom").show();			
			}else{
				$(element).children(".hanger-plus").removeClass("icon-white");			
				var $checkboxes = $();		
				
				for(var i=0; i< closetFormPresenter.closetNames.length; i++){
					var $input = $("<input>").attr("type","radio").attr("name","closet").attr("value",closetFormPresenter.closetIds[i])
					                   .attr("closetName",closetFormPresenter.closetNames[i]);

					var index = closetFormPresenter.closetItems.indexOf($(element).parents(".item").attr("pid"));
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
				
				$(element).parents(".item").find(".bottom").hide();
						
				$(element).parents(".item").find(".addToClosetForm").append(
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
				);
				
				$(element).parents(".item").find(".addToClosetForm").show();
				var $closetForm = $(element).parents(".item").find(".addToClosetForm");
				
				$closetForm.tooltip({title:"Press Enter to add item",placement:"bottom"});
				$closetForm.show();
			}
		}
	},	
	
	addToCloset: function(el){
		el.preventDefault();								
		var sku = $(el.currentTarget).parents(".item").attr("pid");		
		
		var closetName = $(el.currentTarget).find('input[name="newCloset"]').val();
		var closetId = $(el.currentTarget).find('input[name="closet"]:checked').val();				
		
		if(closetName.trim().length > 0){
			closetName = closetName.trim();
			closetId = new Date().getTime();			
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(closetId).child("name").set(closetName);		
		}else if(closetId != null){		  
		    closetName = $(el.currentTarget).find('input[name="closet"]:checked').attr("closetName").trim();
		}
		
		if (closetName.length > 0){				
			var index = closetFormPresenter.closetItems.indexOf(sku);
			
			if(index < 0 || closetFormPresenter.closetItemsMapping[index] != closetName){			
			    var img = $(el.currentTarget).parents(".item").find(".picture img").attr("src"); 
			     
				firebase.$.child(firebase.userPath)
				    .child(firebase.userid)
				    .child("closets")
				    .child(closetId)
				    .child("items")
				    .child(sku)
				    .set(img, function(error) {
      
        				  if (error) {
        						Messenger.error('Clositt could not be saved. ' + error);
        				  } else {
        						Messenger.success('This item was added to "' + closetName + '"');
        						closetFormPresenter.showClosetForm(el);
        						closetFormPresenter.updateClosetCount(sku);																		
        				  }
				});
			}else{
				Messenger.success('This item is already in your clositt "' + closetName + '"');
			}
		}				
		
		return false;
	},
	
	addToWishList: function(el){	    
	    el.preventDefault();								
		var sku = $(el.currentTarget).parents(".item").attr("pid");
		var closetName = "Wish List";
		
		var index = closetFormPresenter.closetItems.indexOf(sku);
			
		if(index < 0 || closetFormPresenter.closetItemsMapping[index] != closetName){					 
		    var img = $(el.currentTarget).parents(".item").find(".picture img").attr("src"); 
		    
			firebase.$.child(firebase.userPath)
			     .child(firebase.userid)
			     .child("closets")
			      .child(closetPresenter.wishListClosetId)
			      .child("items")
			      .child(sku)
			      .set(img, function(error) {
         			  
         			  if (error) {
         					Messenger.error('Clositt could not be saved. ' + error);
         			  } else {
         					Messenger.success('This item was added to your ' + closetName + '!');					
         					closetFormPresenter.updateClosetCount(el, sku);		
         			  }
			});
		}else{
			Messenger.success('This item is already in your "' + closetName + '"');
		}
	},
	
	markUsersClositItems: function(){
		if(closetFormPresenter.closetItems != null && firebase.isLoggedIn){
			var $closetItems = $("#hanger-" +  closetFormPresenter.closetItems.join(", #hanger-") );
			$closetItems.attr("src",closetFormPresenter.darkHangerImg);
			$closetItems.parent().tooltip('destroy');
			$closetItems.parent().tooltip({title:"In my Clositt"});	
		}
	},
	
	updateClosetCount: function(el, sku){
	    var targetOutfit = $(el.currentTarget).parents(".productActions");
	    
	 	firebase.$.child("clositt").child(firebase.productsPath).child(sku).child("cc").transaction(function(value) {
	 	   var newValue = 1;
	 	   
	 	   if(value != null){		 	       
	 	        newValue = value +1;		 	        
	 	   } 		 	            
	 	   
	 	   targetOutfit.find(".numClosets > .counter").text(newValue);
	 	   var closetCountPlural = newValue == 1 ? "" : "s"; 
	 	   targetOutfit.find(".numClosets").attr("title","Added to "+newValue+" Clositt"+closetCountPlural);
	 	   targetOutfit.find(".numClosets").tooltip('destroy');
	 	   targetOutfit.find(".numClosets").tooltip();
	 	   return newValue;       
        });
	}
}

