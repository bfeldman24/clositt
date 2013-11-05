var tagPresenter = {	

	allTags: null,
	
	init: function(){		
		tagPresenter.getAllTagNames();		
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
		var itemid = $(element).parent().parent().prev().find("a").attr("pid");		
		var tagInput = $(element).find('input[name="newTag"]').val().trim();		
				
		if(tagInput.length > 0){								
			try{		
				firebase.$.child("store/tags").child(tagInput.toLowerCase()).child("items").push(itemid, function(error) {
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
