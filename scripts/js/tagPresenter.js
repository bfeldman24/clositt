var tagPresenter = {	

	allTags: null,
	
	init: function(){		    	   			
		$(document).on("submit",".addTagForm > form", tagPresenter.addTag);	
	},
	
	showTagForm: function(el){
		var element = el.currentTarget;					
		
		if($(element).parents(".item").find(".addTagForm > form").length > 0){			    					
			$(element).parents(".item").find(".addToClosetForm").tooltip('destroy');
			$(element).parents(".item").find(".addToClosetForm").html("").hide();
			$(element).parents(".item").find(".addTagForm").tooltip('destroy');
			$(element).parents(".item").find(".addTagForm").html("").hide();
			$(element).parents(".item").find(".topright").show();
		}else{														
			$(element).parents(".item").find(".topright").hide();
					
			$(element).parents(".item").find(".addTagForm").append(
				$("<form>").append(
					$("<div>").addClass("controls").append(					
						$("<input>").attr("type","text").attr("name","newTag").addClass("newTag form-control")
					)
				).append(
					$("<input>").attr("type","submit").css("display","none")				
				)
			);
			
			var $tagForm = $(element).parents(".item").find(".addTagForm");
			
			$tagForm.tooltip({title:"Press Enter to add tag",placement:"bottom"});
			$tagForm.show();
			$tagForm.find("input").first().focus();
		}
	},
	
	addTag: function(el){
		el.preventDefault();				
		var element = el.currentTarget;
		var itemid = $(element).parents(".item").attr("pid");		
		var tagInput = $(element).find('input[name="newTag"]').val().trim();		
				
		if(tagInput.length > 0){								
			try{	
			 	$.post( window.HOME_ROOT + "t/add", {tag: tagInput.toLowerCase(), sku: itemid }, function( data ) {
			 	   if (data != "success"){
                        Messenger.error('Tag could not be saved.');                       
			 	   }else{
                        Messenger.timeout = 1750;
						Messenger.success('Tag \"'+tagInput+'\" was saved!');					
						Messenger.timeout = Messenger.defaultTimeout;
						$(element).parents(".item").find(".topright").show();
						$(element).parents(".item").find(".addTagForm").tooltip('destroy');
						$(element).parents(".item").find(".addTagForm").html("").hide();	
			 	   }
			 	});
			 	  				    				 	
			}catch(err){
				Messenger.error('Tag could not be saved. ' + err);
				return false;
			}					
		}
		
		return false;
	}		
};
