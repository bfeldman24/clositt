var closetPresenter = {
	share: 121200,	
	carouselLeft: null,	
	carouselRight: null,
	user: null,
	wishListClosetId: 2,

	init: function(){
	    if (closetPresenter.user != null){
		  closetPresenter.user =  parseInt(closetPresenter.user) - parseInt(closetPresenter.share);
	    }
	    
		closetPresenter.getClosets();
		$(document).on("mousedown",".carousel-left", closetPresenter.leftAnimation);
		$(document).on("mousedown",".carousel-right", closetPresenter.rightAnimation);
		$(document).on("mouseup",".carousel-left", closetPresenter.stopCarouselLeft);
		$(document).on("mouseup",".carousel-right", closetPresenter.stopCarouselRight);
		
		$(document).on("click", "#closet-share", socialPresenter.showClosittShareButtons);
		$(document).on("click",".delete-outfit", closetPresenter.removeOutfit);				
		$(document).keypress(closetPresenter.saveClosetsOnEnter);		      		
	},
	
	setUser: function(user){
	   closetPresenter.user = user;
	},
	
	getClosets: function(){
	   
		if(closetPresenter.user != undefined){
		      $.post( window.HOME_ROOT + "cl/getall", closetPresenter.showClosets, "json");
		      
		      $.post( window.HOME_ROOT + "u/name", {"n": closetPresenter.user}, function(user){
		          if (user != null && user.name != null){
		            $("#user-closet-title").text(user.name + "'s Clositt");  
		          }   
		      }, "json");
		      		      
		}else if(session.isLoggedIn){
			$.post( window.HOME_ROOT + "cl/getall", closetPresenter.showClosets, "json");
			$("#user-closet-title").text(session.username + "'s Clositt");
		    			 
		}else{
			Messenger.info("We'd love to add that to your Clositt. Just sign in and we'll take care if it for you.");	
		}
	},
	
	showClosets: function(closets){							
		for (var c in closets){
		      closetPresenter.getClosetTemplate("closet-list", closets[c], true);				
		}	
		
		$(".closetName").last().attr("last",true);
		
	   if(typeof startClosittTour == 'function')
	   {
		 startClosittTour();
	   }
	   
	   closetFormPresenter.setClosetInfo(closets);
	},		
	
	getClosetTemplate: function(parentId, closet, includeClosetName){
	    var $itemlist = $("<div>").addClass("items");
			
		var rand = Math.floor(Math.random() * 3) + 1;
		var textColor = rand > 1 ? 'orange' : rand > 0 ? 'red' : '';
		var closetHeader = null;
		
		if (includeClosetName){
		  closetHeader = $("<h1>").addClass("closetName").append($("<span>").addClass(textColor + " closetNameHeader").attr("closetid",closet[0].id).text(closet[0].title));
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
		
		closet.forEach(function(item){
			$itemlist.append(
				productPresenter.getClosetItemTemplate(item.item,item.cache).prepend(
					$("<div>").addClass("hanger").append(
						$("<img>").attr("src",window.HOME_ROOT + "css/images/hanger.png")
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

		if( !$(".menu-settings").hasClass("active") && $(".outfit").length > 0){
			$(".menu-settings").addClass("active");
			
			$(".menu-save").show();
			$(".menu-cancel").show();
			$(".menu-settings").hide();

//			$("#closet-share > .share-freeiconsweb").animate({
//				right: '+=50'
//			}, 50);			
	
//			$("#closet-settings").prepend(
//				$("<i>").addClass("minicon-single save-minicon")
//			);
			
			$(".picture").append(
				$("<div>").addClass("delete-outfit").append(
					$("<i>").addClass("icon-remove icon-white")
				)
			);			
				
			$(".closetName > span").replaceWith(function() {
				return $("<span>").append(
						$("<input>").addClass("closetNameInput form-control")
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
	   
		if( $(".menu-settings").hasClass("active") ){
			$(".menu-settings").removeClass("active");

//			$("#closet-settings .save-minicon").remove();
//
//			$("#closet-share > .share-freeiconsweb").animate({
//                                right: '-=50'
//                        }, 50);
			
			$(".picture .delete-outfit").remove();
				
			$(".closetName > span").replaceWith(function() {
				return $("<span>").attr("closetid",$(this).children("input").attr("closetid")).text($(this).children("input").attr("original"));
			});			
			
			$(".menu-save").hide();
			$(".menu-cancel").hide();
			$(".menu-settings").show();
		}
	},
	
	saveClosets: function(){		    
		if( $(".menu-settings").hasClass("active") ){			    
		  		
			$(".closetName input").each(function(){
			    var closittData = {
			         id: $(this).attr("closetid"),
			         title: $(this).val().trim(),
			         owner: session.userid,
			         status: 1
			    };
			 		
			 	var original = $(this).attr("original");			
				var $closetNameInput = $(this);
				
				if (original != closittData.title){	
    				$.post( window.HOME_ROOT + "cl/update", closittData, function(result){
    			          if (result != "success") {
    					    	Messenger.error('Clositts could not be saved.');
    		 			  } else {						
    							$closetNameInput.attr("original", closittData.title);
    							$closetNameInput.attr("value", closittData.title);
    																															
    							if ($closetNameInput.parent().parent().attr("last")){
    								Messenger.success("Clositt " + closittData.title + " was saved!");
    								closetPresenter.hideSettings();	
    							}	
    					  }	
    				});	
				}
			});		
		}					
	},

	saveClosetsOnEnter: function(e){
		// 13 == Enter
		if( $(".menu-settings").hasClass("active") ){
			if(e.which == 13) {			
				closetPresenter.saveClosets();
			}	
		}
	},
	
	removeOutfit: function(el){
        var $item = $(el.currentTarget).parents(".item");
		var sku = $item.attr("pid");
		var $closetInput = $(el.currentTarget).parents(".carousel").prev(".closetName").find("input");				
		
		var closittData = {
	         id: $closetInput.attr("closetid"),
	         title: $closetInput.attr("original"),
	         owner: session.userid,
	         status: 2,
	         item: sku
	    };	 			 	
				
		$.post( window.HOME_ROOT + "cl/remove", closittData, function(result){
	          if (result != "success") {
	    	  	   Messenger.error('Item could not be removed.');
    		  } else {
    		  		$item.remove();
    		    	Messenger.success('This item was removed from "' + closittData.title +'"');		    	
    		  }
	   });		
	}	
}





var closetFormPresenter = {

	closetIds: null,
	closetNames: null, 
	closetItems: null,
	closetItemsMapping: null,	
	inClosittHangerImg: "/css/images/hanger-icon-green.png",	
    wishList: "Wish List",
	wishListId: null,	
	
	getClosetInfo: function(){
		if(closetFormPresenter.closetNames == null && session.isLoggedIn){
		    $.post( window.HOME_ROOT + "cl/getall", closetFormPresenter.setClosetInfo, "json");		  		  		  		  				
		}
	},
	
	setClosetInfo: function(closets){
	    var closetIds = new Array();
		var closetNames = new Array();
		var closetItems = new Array();
		var closetItemsMapping = new Array();
		var i=0;
            
        for (var c in closets){
                var closet = closets[c];
                closetIds[i] = closet[0].id;
			  closetNames[i] = closet[0].title;
			  
			  if (closet[0].title == closetFormPresenter.wishList){
			       closetFormPresenter.wishListId = closet[0].id;
			  }
		      
		       closet.forEach(function(item){
        			closetItems.push(item.item);					    
				    closetItemsMapping.push(closetNames[i]);							 				
        	   });	
        	   
        	   i++;				
	    }
	    
	    closetFormPresenter.closetIds = closetIds;
		closetFormPresenter.closetNames = closetNames;
		closetFormPresenter.closetItems = closetItems;
		closetFormPresenter.closetItemsMapping = closetItemsMapping;
		closetFormPresenter.markUsersClositItems();
	},
	
	showClosetForm: function(el){
		if(!session.isLoggedIn){
			Messenger.info("We'd love to add that to your Clositt, but first you need to sign in.");	
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
								$("<input>").attr("type","text").attr("name","newCloset").addClass("newCloset form-control")
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
				
				$(element).parents(".item").find(".social-btns").html("").hide('blind');
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
		    // Create new closet	
			var closittData = {
		         title: closetName.trim(),
		         owner: session.userid,
		         status: 1
		    };		 				 				

			$.post( window.HOME_ROOT + "cl/create", closittData, function(result){
		          if (result == "failed" || isNaN(result)) {
				    	Messenger.error('Clositt could not be saved.');	 			       	 			       
	 			  }else{
	 			       closetFormPresenter.addItemToCloset(el, sku, closetName, result);
	 			  } 
			});	
		}else if(closetId != null){		  
		    closetName = $(el.currentTarget).find('input[name="closet"]:checked').attr("closetName").trim();
		    closetFormPresenter.addItemToCloset(el, sku, closetName, closetId);
		}								
		
		return false;		
	},
	
	addItemToCloset: function(el, sku, closetName, closetId){
	   if (closetName.length > 0){				
			var index = closetFormPresenter.closetItems.indexOf(sku);
			
			if(index < 0 || closetFormPresenter.closetItemsMapping[index] != closetName){			
			    var img = $(el.currentTarget).parents(".item").find(".picture img").attr("src"); 
			    
			    var closetItem = {
			         id: closetId,
			         title: closetName.trim(),
			         item: sku,
			         cache: img,
    		         owner: session.userid,
    		         status: 1
			    };
			    
			    $.post( window.HOME_ROOT + "cl/add", closetItem, function(result){    	 			  
    	 			  if (result != "success") {
    						Messenger.error('Item could not be saved into ' + closetName);	 			       	 			       
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
	},
	
	addToWishList: function(el){	
	    if(!session.isLoggedIn){
			Messenger.info("We'd love to add that item to your wishlist, but first you need to sign in.");	
		}else{    
    	    el.preventDefault();								
    		var sku = $(el.currentTarget).parents(".item").attr("pid");
    		var closetName = closetFormPresenter.wishList;    		
    		var index = closetFormPresenter.closetItems.indexOf(sku);
    			
    		if(index < 0 || closetFormPresenter.closetItemsMapping[index] != closetName){					 
    		    var img = $(el.currentTarget).parents(".item").find(".picture img").attr("src"); 
    		    
    		    var closetItem = {
    		         id: closetFormPresenter.wishListId,
			         title: closetName,
			         item: sku,
			         cache: img,
    		         owner: session.userid,
    		         status: 1
			    };
			    
			    $.post( window.HOME_ROOT + "cl/add", closetItem, function(result){    	 			  
    	 			  if (result != "success") {
    						Messenger.error('Item could not be saved into ' + closetName);	 			       	 			       
    				  } else {
    						Messenger.success('This item was added to "' + closetName + '"');    						
    						closetFormPresenter.updateClosetCount(sku);	
    				  }
    			});
    		        		        		   
    		}else{
    			Messenger.success('This item is already in your "' + closetName + '"');
    		}
		}
	},
	
	markUsersClositItems: function(){
		if(closetFormPresenter.closetItems != null && session.isLoggedIn){
			var $closetItems = $("#hanger-" +  closetFormPresenter.closetItems.join(", #hanger-") );
			$closetItems.attr("src",closetFormPresenter.inClosittHangerImg);
			$closetItems.parent().tooltip('destroy');
			$closetItems.parent().tooltip({title:"In my Clositt"});	
		}
	},
	
	updateClosetCount: function(sku){
	    
	    $.post( window.HOME_ROOT + "p/cc", {sku: sku}, function(newValue){
	       
	       if (!isNaN(newValue)){	                       
	           var productTile = $('.item[pid="'+sku+'"] .numClosets');
	                       
	           var total = parseInt(productTile.find(".counter").text()) + parseInt(newValue);
    	       productTile.find(".counter").text(total);
    	       $('.item[pid="'+sku+'"] .productPageClosittCount .counter').text(total);
    	       
    	 	   var closetCountPlural = total == 1 ? "" : "s"; 
    	 	   productTile.attr("title","Added to "+total+" Clositt"+closetCountPlural);
    	 	   productTile.tooltip('destroy');
    	 	   productTile.tooltip();
    	    }
	    });
	}
}

