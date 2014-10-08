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
		
		
		$(document).on("click", "#closet-share", socialPresenter.showClosittShareButtons);
		$(document).on("click",".removeProductBtn", closetPresenter.removeOutfit);		
		$(document).on("click", ".closetName", closetPresenter.goToCloset);	

        $(document).on("click", ".closet-title", closetPresenter.editClosetName);
        $(document).on("click", "#saveEditNewClosetName", closetPresenter.saveExistingClosetName);
        $(document).on("click", "#confirmRemoveClosetBtn", closetPresenter.confirmRemoveCloset);
        $(document).on("click", "#removeClosetBtn", closetPresenter.removeCloset);
                
		$(document).on("click", "#saveNewClosetName", closetPresenter.saveNewClosetName);				
		
		
		$("#search-bar").on("keypress", closetPresenter.searchOnEnter);
		$("#seach-bar-icon").on("click", closetPresenter.searchBarSubmit);     
		
		$('.closet-title').tooltip();		      		
	},		
	
	setUser: function(user){
	   closetPresenter.user = user;
	},
	
	getClosets: function(){
	   
		if(closetPresenter.user != undefined){
		      $.post( window.HOME_ROOT + "cl/getall", closetPresenter.showClosets, "json");		      		      		      
		}else if(session.isLoggedIn){
			$.post( window.HOME_ROOT + "cl/getall", closetPresenter.showClosets, "json");		    			 
		}else{
			Messenger.info("We'd love to add that to your Clositt. Just sign in and we'll take care if it for you.");	
		}
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
	
	removeOutfit: function(el){
	   if (closetPresenter.user != null){
	       Messenger.error("Sorry only the owner of this clositt can do that!");
	       return;   
	   }
	   
        var $item = $(el.currentTarget).parents(".outfit");
		var sku = $item.attr("pid");
		var $closetInput = $(el.currentTarget).parents(".closetPanel");				
		
		var closittData = {
	         id: $closetInput.attr("number"),
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
	},
	
	editClosetName: function(e){
	   if (closetPresenter.user != null){
	       Messenger.error("Sorry only the owner of this clositt can do that!");
	       return;   
	   }
	   
	   var closetName = $(e.currentTarget).text();
	   var closetNumber = $(e.currentTarget).parents(".closetPanel").attr("number");
	   var closetSelector = $(e.currentTarget).parents(".closetPanel").attr("id");

	   $("#editClosetName").val(closetName);
	   $("#editClosetName").attr("original", closetName);	   
	   $("#editClosetName").attr("num", closetNumber);
	   $("#editClosetName").attr("selector", closetSelector);	   	   	   
	   $("#editClosittModal").modal('show');
	},
	
	saveExistingClosetName: function(){		    
		if (closetPresenter.user != null){
	       Messenger.error("Sorry only the owner of this clositt can do that!");
	       return;   
	   }
	   		  				
	    var closittData = {
	         id: $("#editClosetName").attr("num"),
	         title: $("#editClosetName").val().trim(),
	         owner: session.userid,
	         status: 1
	    };
	 		
	 	var original = $("#editClosetName").attr("original");			
		
		if (original != closittData.title){	
			$.post( window.HOME_ROOT + "cl/update", closittData, function(result){
		          if (result != "success") {
				    	Messenger.error(original + ' could not be saved.');
	 			  } else {
						Messenger.success("Clositt " + closittData.title + " was saved!");
						
						var closetSelector = $("#editClosetName").attr("selector");
						$("#" + closetSelector).find(".closet-title").text(closittData.title);
						$("#closetNameList .closetName[name="+closetSelector+"]").text(closittData.title);
						$("#editClosittModal").modal('hide');
				  }	
			});	
		}					
	},
	
	confirmRemoveCloset: function(){
	   $("#editClosittModal").modal('hide');
	   
	   var closet = $("#editClosetName").attr("original");
	   $("#removeClosetName").text(closet);	   
	   $("#confirmRemoveClosittModal").modal('show');
	},
	
	removeCloset: function(){	
	   if (closetPresenter.user != null){
	       Messenger.error("Sorry only the owner of this clositt can do that!");
	       return;   
	   }
	      
	   var closittData = {
	         id: $("#editClosetName").attr("num"),
	         title: $("#editClosetName").attr("original"),
	         owner: session.userid,
	         status: 2
	    };
	    
	    $.post( window.HOME_ROOT + "cl/delete", closittData, function(result){
	          if (result != "success") {
			    	Messenger.error(closittData.title + ' could not be saved.');
 			  } else {
					Messenger.success("Clositt " + closittData.title + " was successfully removed!");
					
					var closetSelector = $("#editClosetName").attr("selector");
				    $("#" + closetSelector).remove();				    
				    $("#closetNameList .closetName[name="+closetSelector+"]").parents("li").first().remove();
						
					$("#confirmRemoveClosittModal").modal('hide');
			  }	
		});	   	   
	},
	
	saveNewClosetName: function(){
	   if (closetPresenter.user != null){
	       Messenger.error("Sorry only the owner of this clositt can do that!");
	       return;   
	   }
	   
	   var closetName = $("#newClosetName").val();
	   
	   if (closetName == null || closetName.trim() == "" || 
	       closetName == $("#newClosetName").attr("placeholder") || $('#' + closetName.replace(/ /g,'')).length > 0){
	           
	       Messenger.info("Please enter a new clositt name!");   
	   }else{
	       closetFormPresenter.createNewCloset(closetName);   
	       $('#addclositt').modal('hide')
	   }
	},
	
	goToCloset: function(e){
	   var closetName = $(e.currentTarget).attr("name");  	   
	   
	   // Only go to clositt if it has outfits
	   // && $('#' + closetName + " .items .item").length > 0 
	   
	   if ($('#' + closetName).length > 0){	       
	       pagePresenter.scrollTo($('#' + closetName).offset().top);
	   }else{
	       Messenger.info("There are no items in that clositt");   
	   }
	},
	
	searchOnEnter: function(el){        
        // on enter button
        if (el.which == 13) {
            closetPresenter.searchBarSubmit(el);
        }
    },
    
    searchBarSubmit: function(e){
        e.preventDefault();
        var searchTerm = $( "#search-bar" ).val().trim();        
        location.href = window.HOME_URL + "?outfit=" + encodeURIComponent(searchTerm);
        return false;
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
	
	init: function(){	    	       	       
	    $(document).on("click",".closetOption", closetFormPresenter.addToCloset);	       
	    $(document).on("click",".submitNewCloset", closetFormPresenter.addNewCloset);
	    $(document).on("click",".create_new input.addNewClosetInput", function(e){
	        e.preventDefault();
          	return false;  
	    });
	    
	    closetFormPresenter.initNotLoggedIn();
        closetFormPresenter.getClosetInfo();        
	},
	
	initNotLoggedIn: function(){
	   $(document).on("show.bs.dropdown",".addToClosittDropdown", closetFormPresenter.showClosetForm);
	   $(document).on("shown.bs.dropdown",".addToClosittDropdown", function(e){
	       var $element = $(e.currentTarget).parent().find(".addToClosetOptions");
	       if (!$element.hasClass("mCustomScrollbar")){
	           $element.mCustomScrollbar();
	       }
	   });
	},
	
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
			return false;				
		}else{		  
			if(closetFormPresenter.closetNames == null){
				closetFormPresenter.getClosetInfo();
			}			
			
			var element = el.currentTarget;					
			
			if($(element).parents(".item").find(".addToClosetOptions .closetOption").length <= 0){				
			 	
			 	$options = $("<div>");			
				
				for(var i=0; i< closetFormPresenter.closetNames.length; i++){										
				
					$options.append(
						$("<a>").addClass("ring_opt closetOption").attr("i",i).append(
							$("<div>").addClass("ring2 pull-left")
						).append( 
						    $("<p>").addClass("pull-left").text(closetFormPresenter.closetNames[i])
						)
					);
				}		
														
				$(element).parent().find(".addToClosetOptions").append( $options.children() );										
			}
		}
	},	
	
	addToCloset: function(el){		
		var sku = $(el.currentTarget).parents(".outfit").attr("pid");	
		$(el.currentTarget).parent().find(".ring").removeClass("ring").addClass("ring2");
		$(el.currentTarget).find(".ring2").removeClass("ring2").addClass("ring");	
		
		var i = $(el.currentTarget).attr("i");			
		var closetName = closetFormPresenter.closetNames[i];
		var closetId = closetFormPresenter.closetIds[i];			
				
		if(closetName.trim().length > 0){
		   return closetFormPresenter.addItemToCloset(el, sku, closetName, closetId);		   		   		   		  	
		}							
		
		el.preventDefault();
		return false;		
	},

    addNewCloset: function(el){		
		el.preventDefault();
		
		var sku = $(el.currentTarget).parents(".outfit").attr("pid");			
		closetName = $(el.currentTarget).prev(".addNewClosetInput").val();  
		var index = closetFormPresenter.closetNames.indexOf(closetName);	
			
		if(index >= 0 || closetName == null || closetName.trim() == "" || closetName.trim().length <= 0){			
			Messenger.error("Please enter a new clositt name!");
			return false;
		}	    
		    
	    closetFormPresenter.createNewCloset(closetName, el, sku);
				
		return false;		
	},
	
	createNewCloset: function(closetName, el, sku){
		var closittData = {
	         title: closetName.trim(),
	         owner: session.userid,
	         status: 1
	    };		 				 				

		$.post( window.HOME_ROOT + "cl/create", closittData, function(result){
	          if (result == "failed" || isNaN(result)) {
			       Messenger.error('Clositt could not be saved.');	 			       	 			       
			       return;
 			  } 			  			    		       
		       
		      Messenger.success('Clositt '+ closittData.title + ' was saved!');  
		      closetFormPresenter.closetNames.push(closetName);
		       		 
		       var selector = ".addToClosetOptions";		       
		       if ($(el.currentTarget).parent().find(".addToClosetOptions .mCSB_container").length > 0){      		       										   		selector = ".addToClosetOptions	.mCSB_container";		       		       
		       }
		       
		       $(el.currentTarget).parent().find(selector).prepend(
			       $("<a>").addClass("ring_opt closetOption").attr("i",closetFormPresenter.closetNames.length - 1).append(
						$("<div>").addClass("ring pull-left")
					).append( 
					    $("<p>").addClass("pull-left").text(closetName)
					)
			   );
		       
		       if (el != null && sku != null){
 			       closetFormPresenter.addItemToCloset(el, sku, closetName, result);
 			  }
		});
	},
	
	addItemToCloset: function(el, sku, closetName, closetId){
	   if (closetName.length > 0){				
			var index = closetFormPresenter.closetItems.indexOf(sku);
			
			if(index < 0 || closetFormPresenter.closetItemsMapping[index] != closetName){			
			    var img = $(el.currentTarget).parents(".outfit").find(".imagewrap img").attr("src"); 
			    
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
    						return true;
    				  }
    			});	
			     				
			}else{
				Messenger.success('This item is already in your clositt "' + closetName + '"');
			}
		}
		
		el.preventDefault();
		return false;
	},
	
	addToWishList: function(el){	
	    if(!session.isLoggedIn){
			Messenger.info("We'd love to add that item to your wishlist, but first you need to sign in.");	
		}else{    
    	    el.preventDefault();								
    		var sku = $(el.currentTarget).parents(".outfit").attr("pid");
    		var closetName = closetFormPresenter.wishList;    		
    		var index = closetFormPresenter.closetItems.indexOf(sku);
    			
    		if(index < 0 || closetFormPresenter.closetItemsMapping[index] != closetName){					 
    		    var img = $(el.currentTarget).parents(".outfit").find(".picture img").attr("src"); 
    		    
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
	    	              
       var productTile = $('.outfit[pid="'+sku+'"] .numClosets');
                    
       var total = parseInt(productTile.find(".counter").text()) + 1;
       productTile.find(".counter").text(total);
       $('.outfit[pid="'+sku+'"] .productPageClosittCount .counter').text(total);
       
 	   var closetCountPlural = total == 1 ? "" : "s"; 
 	   productTile.attr("title","Added to "+total+" Clositt"+closetCountPlural);
 	   productTile.tooltip('destroy');
 	   productTile.tooltip();
	}
}

