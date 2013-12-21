var tagPresenter = {	

	allTags: null,
	
	init: function(){		
		tagPresenter.getAllTagNames();		
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
						$("<input>").attr("type","text").attr("name","newTag").addClass("newTag")
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
				firebase.$.child(firebase.storePath)
				          .child("tags")
				          .child(tagInput.toLowerCase())
				          .child("items")
				          .child(itemid)
				          .transaction(function(currentData) {
                              if (currentData === null) {
                                    return 1;
                              } else {
                                    return currentData + 1;
                              }
                                                                
                            }, function(error, committed, snapshot) {
                              if (error)
                                    Messenger.error('Tag could not be saved. ' + error);
                              else if (!committed)
                                    Messenger.error('Tag could not be saved. ' + error);
                              else
                                    Messenger.timeout = 1750;
            						Messenger.success('Tag \"'+tagInput+'\" was saved!');					
            						Messenger.timeout = Messenger.defaultTimeout;
            						$(element).parents(".item").find(".topright").show();
            						$(element).parents(".item").find(".addTagForm").html("").hide();
            						$(element).parents(".item").find(".addTagForm").tooltip('destroy');
                            });    				    				 	
			}catch(err){
				Messenger.error('Tag could not be saved. ' + err);
				return false;
			}					
		}
		
		return false;
	},
	
	getAllTagNames: function(){
		firebase.$.child("store/tags").once('value',function(snapshot){
			tagPresenter.allTags = new Array();
			
			snapshot.forEach(function(tag){
				tagPresenter.allTags.push(tag.name());
			});
			
			$( "#tags" ).autocomplete({
				source: tagPresenter.allTags
			});
		});
	}
};
