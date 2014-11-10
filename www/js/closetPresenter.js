var closetPresenter = {
    isInitialized: false,
	share: 121200,	
	carouselLeft: null,	
	carouselRight: null,
	user: null,
	wishListClosetId: 2,
	priceAlertFrequency: null,
	isBusy: false,
	busyInterval: null,

	init: function(){
	    closetPresenter.isInitialized = true;
	   
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
		$(document).on("click", ".saveProductBtn", closetPresenter.saveProductToCloset);
		$(document).on("click", ".unsavedCloset", closetPresenter.saveEntireCloset);
		
		$(document).on("click", ".mobile-toggle", closetPresenter.togglePriceAlerts);
		$(".mobile-toggle").tooltip();
		
		$("#search-bar").on("keypress", closetPresenter.searchOnEnter);
		$("#seach-bar-icon").on("click", closetPresenter.searchBarSubmit);   				
		
		footer.focusOnInputInModal('#addclositt');
		footer.focusOnInputInModal('#editClosittModal');
		
		$('.closetName').tooltip();
		$('.closet-title').tooltip();	
		$('.badge.itemCount').tooltip();	
		closetFormPresenter.init();	      		
	},		
	
	setUser: function(user){
	   closetPresenter.user = user;
	},	
	
	getClosets: function(){	   
		if(closetPresenter.user != undefined || session.isLoggedIn){		      
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
    		  		$closetInput.find(".itemCount").text($closetInput.find(".outfit").length);
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
	   var isClosetAlertOn = $(e.currentTarget).parents(".closetPanel").find(".mobile-toggle").hasClass("off");
       var closetAlert = isClosetAlertOn ? 'Y' : 'N';

	   $("#editClosetName").val(closetName);
	   $("#editClosetName").attr("alert", closetAlert);
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
	         status: 1,
	         alert: $("#editClosetName").attr("alert")
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
	
	updateClosetInfo: function(closetData){
	    if (closetData != null && closetData.id != null && closetData.title != null){
    	    $.post( window.HOME_ROOT + "cl/update", closetData, function(result){
    	          if (result != "success") {
    			    	Messenger.error(closetData.title + ' could not be saved.');
     			  } else {
    					Messenger.success("Clositt " + closetData.title + " was saved!");					
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
	       closetName == $("#newClosetName").attr("placeholder") || $('#' + closetName.replace(/\W+/g, '')).length > 0){
	           
	       Messenger.info("That clositt name already exists! Please enter a new clositt name.");   
	   }else{
	       closetFormPresenter.createNewCloset(closetName);   
	       $('#addclositt').modal('hide');
	       $('#newClosetName').val("");
	   }
	},
	
	saveEntireCloset: function(el){
	    $(el.currentTarget).parents(".closetPanel").first().find(".outfit").each(function(){
	       closetPresenter.saveProductToCloset($(this));
	    });
	},
	
	saveProductToCloset: function(el){
	     if (el.currentTarget != null){	   	   
	       el.preventDefault();
	       var $item = $(el.currentTarget).parents(".outfit").first();
	     }else{
	       var $item = el;
	     }
	     
	     var closetName = $item.parents(".closetPanel").first().attr("original");
         var closetId = $item.parents(".closetPanel").first().attr("number");
         var img = $item.find(".imagewrap img").attr("src"); 
         var sku = $item.attr("pid");         
         var itemName = $item.find(".productName").first().attr("title");
	   	    
	   	 var closetItem = {
	         id: closetId,
	         title: closetName.trim(),
	         item: sku,
	         cache: img,
	         owner: session.userid,
	         status: 1
	     };   
	   	     
	     if (!isNaN(closetId) || closetId < 0){
            // Add New Closet and Item              
            $.post( window.HOME_ROOT + "cl/createandadd", closetItem, function(result){    	 			  
	 			  if (result != "success") {
						Messenger.error(itemName + ' could not be saved into ' + closetName, 6000);	 			       	 			       
				  } else {    						    						
						Messenger.success(itemName + ' was saved to "' + closetName + '"!', 8000);
						
						// add to closet mapping
						if (closetFormPresenter.closetItemsMapping[closetName] == null){
    				        closetFormPresenter.closetItemsMapping[closetName] = [];
            			}	
            			
            			closetFormPresenter.closetItemsMapping[closetName].push(sku);	    						                
						closetFormPresenter.updateClosetCount(sku);	
						
						if ($item.parents(".closetPanel").first().find(".outfit").length <= 1){
						      Messenger.success('The entire clositt "' + closetName + '" was saved!', 8000);
						      $item.parents(".closetPanel").first().remove();
						      
						      if ($(".unsaved-clositt-inner").first().find(".closetPanel").length <= 0){
    						      $(".unsaved-clositt-inner").first().remove();
    						  } 
    						  
						}else{
    						  $item.remove();
						}
						
						return true;
				  }
            });	     
	     
	     } else if (closetName.length > 0){				
			closetFormPresenter.addItemToCloset(el, sku, closetName, closetId);			
		 }
				 
		 return false;
	},
	
	goToCloset: function(e){
	   var closetName = $(e.currentTarget).attr("name");  	   
	   
	   // Only go to clositt if it has outfits
	   // && $('#' + closetName + " .items .item").length > 0 
	   
	   if ($('#' + closetName).length > 0){	    
	       pagePresenter.scrollTo($('#' + closetName).offset().top - $("#header").height() - 10);
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
    },
    
    togglePriceAlerts: function(e){   
        if (!session.isLoggedIn){
            Messenger.alert("You must be logged in to save Price Alerts!");
            return;   
        }
             
        var $btn = $(e.currentTarget);                
        
        var closetName = $(e.currentTarget).parents(".closetPanel").attr("original");
	    var closetNumber = $(e.currentTarget).parents(".closetPanel").attr("number");
        
        var closittData = {
	         id: closetNumber,
	         title: closetName,
	         owner: session.userid,
	         status: 1	      
	    };
        
        if ($btn.hasClass("off")){            
            closittData.alert = 'Y';            
            
            $btn.removeClass("off");            
            $btn.attr("title", closetPresenter.priceAlertFrequency + " Price Alerts On");
        }else{
            closittData.alert = 'N';            
            
            $btn.addClass("off");            
            $btn.attr("title", closetPresenter.priceAlertFrequency + " Price Alerts Off");            
        }   
        
        $btn.tooltip('destroy');
        $btn.tooltip('show');        
        closetPresenter.updateClosetInfo(closittData);
    },
    
    setPriceAlerts: function(){
        var priceAlerts = '' + session.priceAlertFrequency;
        
        switch(priceAlerts){
            case '2':
                closetPresenter.priceAlertFrequency = "Weekly";
                break;
            case '3':
                closetPresenter.priceAlertFrequency = "Monthly";           
                break;
            default:
                closetPresenter.priceAlertFrequency = "Daily";
        }
    },
    
    updatePriceAlertFrequency: function(){
        closetPresenter.setPriceAlerts();
        
        $(".mobile-toggle").each(function(){
            var off = $(this).hasClass("off");
            var offText = off ? "Off" : "On";
            var tooltip = closetPresenter.priceAlertFrequency + " Price Alerts " + offText;
            $(this).attr("title", tooltip);             
        });   
        
        $(".mobile-toggle").tooltip('destroy');
        $(".mobile-toggle").tooltip();
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
	    
	    $(document).on("show.bs.dropdown",".addToClosittDropdown", closetFormPresenter.showClosetForm);
	    $(document).on("shown.bs.dropdown",".addToClosittDropdown", function(e){
	       var $element = $(e.currentTarget).parent().find(".addToClosetOptions");
	       if (!$element.hasClass("mCustomScrollbar")){
	           $element.mCustomScrollbar();
	       }
	    });
	    
	    $(document).on('keyup', '.addNewClosetInput', function(e) {
            e.preventDefault();	 
            
            // on enter
            if(e.keyCode == 13) {                      
                $(e.currentTarget).next(".submitNewCloset").trigger("click");
            }
            
            return false;
        });
	    
        closetFormPresenter.getClosetInfo();        
	},		
	
	getClosetInfo: function(){
		if(closetFormPresenter.closetNames == null){
		    $.post( window.HOME_ROOT + "cl/getall", closetFormPresenter.setClosetInfo, "json");			
		}
	},
	
	setClosetInfo: function(closets){
	    var closetIds = [];
		var closetNames = [];
		var closetItemsMapping = {};
		var i=0;
        
        if (closets != null && Object.keys(closets).length > 0){    
            for (var c in closets){
                  var closet = closets[c];
                  closetIds[i] = closet[0].id;
    			  closetNames[i] = closet[0].title;
    			  
    			  if (closet[0].title == closetFormPresenter.wishList){
    			       closetFormPresenter.wishListId = closet[0].id;
    			  }
    		      
    		       closet.forEach(function(item){
    		          if (item.item != null){					    
            			
            			if (closetItemsMapping[closetNames[i]] == null){
    				        closetItemsMapping[closetNames[i]] = [];
            			}	
            			        			
            			closetItemsMapping[closetNames[i]].push(item.item);
    		          }
            	   });
            	   
            	   i++;				
    	    }
    	    
    	    closetFormPresenter.closetIds = closetIds;
    		closetFormPresenter.closetNames = closetNames;
    		closetFormPresenter.closetItemsMapping = closetItemsMapping;
        }                	    	    
	},
	
	showClosetForm: function(el){				  
		if(closetFormPresenter.closetNames == null){
			closetFormPresenter.getClosetInfo();
			
			if (closetFormPresenter.closetNames == null){
			     return;
			}
		}			
		
		var element = el.currentTarget;			
		var sku = $(element).parents(".outfit").attr("pid");
		
		if($(element).parents(".item").find(".addToClosetOptions .closetOption").length <= 0){				
		 	
		 	$options = $("<div>");			
			
			for(var i=0; i< closetFormPresenter.closetNames.length; i++){	
			    
			    var radioBtn = "customcheckbox";
			    if (closetFormPresenter.closetItemsMapping[closetFormPresenter.closetNames[i]] != null &&
		              closetFormPresenter.closetItemsMapping[closetFormPresenter.closetNames[i]].indexOf(sku) >= 0){
			        
			        radioBtn = "customcheckbox icon-check";
			    }									
			
			    var closetName = closetFormPresenter.closetNames[i];
			    var closetTitle = "";
			    
			    if (closetName.length >= 20){
			        closetName = closetName.substring(0,19) + "...";   
			        closetTitle = closetFormPresenter.closetNames[i];     
			    }
			
				$options.append(
					$("<a>").addClass("ring_opt closetOption").attr("i",i).append(
						$("<div>").addClass(radioBtn + " pull-left")
					).append( 
					    $("<p>").addClass("pull-left").attr("title",closetTitle).text(closetName)
					)
				);
			}		
													
			$(element).parent().find(".addToClosetOptions").append( $options.children() );										
		}		
	},	
	
	addToCloset: function(el){		
		var sku = $(el.currentTarget).parents(".outfit").attr("pid");	

		if ($(el.currentTarget).find(".customcheckbox.icon-check").length > 0){
    		$(el.currentTarget).find(".customcheckbox").removeClass("icon-check");	
		}else{
    		$(el.currentTarget).find(".customcheckbox").addClass("icon-check");	
		}
		
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
	   if (closetPresenter.isBusy){
	       if (closetPresenter.busyInterval == null){
    	       closetPresenter.busyInterval = setInterval(function(){
    	           closetPresenter.createNewCloset(closetName, el, sku);   
    	       }, 3000);
	       }
	       
	       return;
	   }
	   
	   closetPresenter.isBusy = true;
	   clearInterval(closetPresenter.busyInterval);	  
	   closetPresenter.busyInterval = null;   
	   
	   if (closetFormPresenter.closetNames.indexOf(closetName.trim()) >= 0){
	       Messenger.info("That clositt name already exists! Please enter a new clositt name.");   
	       return;    
	   }
	   
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
		      
		      if (closetFormPresenter.closetNames.indexOf(closetName.trim()) < 0){
		              closetFormPresenter.closetNames.push(closetName.trim());
        		      closetFormPresenter.closetIds.push(result);
        	  }
		
		       
		       if (el == null){
		          if ($("#closetNameList").length > 0){
		              var $newClositt = $("<li>").css("display","none").append(
            		                      $("<div>").addClass("btn-group").append(
            		                          $("<button>").addClass("btn btn-default nav-filter closetName newClosetName")
            		                              .attr("type","button")
            		                              .attr("name",closittData.title)
            		                              .text(closittData.title)                  
            		                      )
            		                  );
		              
		              $newClositt.insertBefore("#closetNameList .addnew");
		              $newClositt.show('slow');
		              $newClositt.find(".newClosetName").removeClass("newClosetName", 3000);		              		              		              
		          }   
		       }else{
			$(el.currentTarget).prev(".addNewClosetInput").val("");
		          		          		       		 
      		       var selector = ".addToClosetOptions";		       
      		       if ($(el.currentTarget).parent().find(".addToClosetOptions .mCSB_container").length > 0){
      		            selector = ".addToClosetOptions	.mCSB_container";
      		       }
      		       
      		       $(el.currentTarget).parent().find(selector).prepend(
      			       $("<a>").addClass("ring_opt closetOption").attr("i",closetFormPresenter.closetNames.length - 1)
      			       .append(
      						$("<div>").addClass("customcheckbox pull-left icon-check")
      					).append( 
      					    $("<p>").addClass("pull-left").text(closetName)
      					)
      			   );		       
		       
      		       if (el != null && sku != null){
       			       closetFormPresenter.addItemToCloset(el, sku, closetName, result);
       		   	   }
		       }
		       
		       closetPresenter.isBusy = false;
		});
	},
	
	addItemToCloset: function(el, sku, closetName, closetId){
	   if (closetName.length > 0){				
			var productIsNotInCloset = closetFormPresenter.closetItemsMapping[closetName] == null ||
			              closetFormPresenter.closetItemsMapping[closetName].indexOf(sku) < 0;								
			
			var img = $(el.currentTarget).parents(".outfit").find(".imagewrap img").attr("src"); 
			    
		    var closetItem = {
		         id: closetId,
		         title: closetName.trim(),
		         item: sku,
		         cache: img,
		         owner: session.userid,
		         status: 1
		    };
			
			if(productIsNotInCloset){						 			 			    
			    
			    $.post( window.HOME_ROOT + "cl/add", closetItem, function(result){    	 			  
    	 			  if (result != "success") {
    						Messenger.error('Item could not be saved into ' + closetName);	 			       	 			       
    				  } else {
    						var notLoggedInMsg = '';
    						
    						if (!session.isLoggedIn){
    						   notLoggedInMsg = " temporarily. Please log in to save this clositt to your account!";
    						}
    						
    						Messenger.success('This item was added to "' + closetName + '"' + notLoggedInMsg);
    						
    						// add to closet mapping
    						if (closetFormPresenter.closetItemsMapping[closetName] == null){
        				        closetFormPresenter.closetItemsMapping[closetName] = [];
                			}	
                			
                			closetFormPresenter.closetItemsMapping[closetName].push(sku);	
    						
    						closetFormPresenter.showClosetForm(el);
    						closetFormPresenter.updateClosetCount(sku);	
    						return true;
    				  }
    			});	
			     				
			}else{
				$.post( window.HOME_ROOT + "cl/remove", closetItem, function(result){    	 			  
    	 			  if (result != "success") {
    						Messenger.error('Item could not be removed from ' + closetName);	 			       	 			       
    				  } else {    				        
    						Messenger.success('This item was removed from "' + closetName + '"');    							
    						
    						// remove from closet mapping
    						if (closetFormPresenter.closetItemsMapping[closetName] != null){
        				        var productIndex = closetFormPresenter.closetItemsMapping[closetName].indexOf(sku);
        				        
        				        if (productIndex > -1) {
                                     closetFormPresenter.closetItemsMapping[closetName].splice(productIndex, 1);
                                }
                			}	                			                			
    				  }
    			});
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
    		
    		var productIsNotInCloset = closetFormPresenter.closetItemsMapping[closetName] == null ||
			              closetFormPresenter.closetItemsMapping[closetName].indexOf(sku) < 0;								
    			
			var img = $(el.currentTarget).parents(".outfit").find(".picture img").attr("src"); 
		    
		    var closetItem = {
		         id: closetFormPresenter.wishListId,
		         title: closetName,
		         item: sku,
		         cache: img,
		         owner: session.userid,
		         status: 1
		    };
    			
    		if(productIsNotInCloset){					     		    
			    
			    $.post( window.HOME_ROOT + "cl/add", closetItem, function(result){    	 			  
    	 			  if (result != "success") {
    						Messenger.error('Item could not be saved into ' + closetName);	 			       	 			       
    				  } else {
    						Messenger.success('This item was added to "' + closetName + '"');    						
    						closetFormPresenter.updateClosetCount(sku);	
    				  }
    			});
    		        		        		   
    		}else{
    			
    			$.post( window.HOME_ROOT + "cl/remove", closetItem, function(result){    	 			  
    	 			  if (result != "success") {
    						Messenger.error('Item could not be removed from ' + closetName);	 			       	 			       
    				  } else {
    						Messenger.success('This item was removed from "' + closetName + '"');    							
    				  }
    			});      			    						 	        				        		  			
    		}
		}
	},
	
	markUsersClositItems: function(){
//		if(closetFormPresenter.closetItems != null && session.isLoggedIn){
//			var $closetItems = $("#hanger-" +  closetFormPresenter.closetItems.join(", #hanger-") );
//			$closetItems.attr("src",closetFormPresenter.inClosittHangerImg);
//			$closetItems.parent().tooltip('destroy');
//			$closetItems.parent().tooltip({title:"In my Clositt"});	
//		}
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

