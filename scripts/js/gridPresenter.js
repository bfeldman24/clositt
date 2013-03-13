var gridPresenter = {
	
	defaultGrid: 'normalGrid',
	
	init: function(){		
		$("#gridType").children('[value="'+gridPresenter.defaultGrid+'"]').first().button('toggle');	
		$("#gridType").children("button").on("click", function(){gridPresenter.gridToggle($(this).attr("value"))});
		gridEvents.init();
	},		
	
	gridToggle: function(gridType){
		var columns = gridPresenter.getDefaultColumns();
		$("#product-grid").children().attr("aligned",false);
		
		if(gridType == "normalGrid"){
			gridPresenter.alignGrid("product-grid", columns, 200, 25);	
		}else{			
			gridPresenter.alignRandomGrid("product-grid", columns, 200, 16, true);
		}
		
		closetFormPresenter.markUsersClositItems();
	},

	alignDefaultGrid: function(){
		var columns = gridPresenter.getDefaultColumns();
		$(".addToClosetBtn").tooltip({title:"Add to Closet"});
		$(".tagOutfitBtn").tooltip({title:"Tagitt"});
		//$(".addToClosetBtn").tooltip();	
			
		if($("#gridType > .active").first().attr("value") == "normalGrid"){
			gridPresenter.alignGrid("product-grid", columns, 200, 25);				
		}else{			
			gridPresenter.alignRandomGrid("product-grid", columns, 200, 16);
		}		
		
		closetFormPresenter.markUsersClositItems();
	}, 
	
	getDefaultColumns: function(){
		var columns = 2;
		var screenWidth = $(document).width();
		
		if(screenWidth > 1200){
			columns = 5;	
		}else if(screenWidth > 975){
			columns = 4;	
		}else if(screenWidth > 750){
			columns = 3;	
		}
		
		/*
		2) 200 + 25 + 200 = 425 + 400 = 825
		3) 200 + 25 + 200 + 25 + 200 = 650 + 400 = 1050
		4) 200 + 25 + 200 + 25 + 200 + 25 + 200 = 875 + 400 = 1275
		5) 200 + 25 + 200 + 25 + 200 + 25 + 200 + 25 + 200 = 1100 + 400 = 1500
		*/
		
		return columns;	
	},

	alignRandomGrid: function(/*string*/ id, /*int*/ cols, /*int*/ cellWidth, /*int*/ padding) {
   
		var x = 0;
		var count = 0;
		var unit = "px";
		var yPos = new Array();
		//var staticCellSizes = [[2,2,2,3,4,3,2,1,2,2,2,1],[2,2,2,2,3,2,2,2,2,3,2,2],[3,3,3,3,3,3,3,3,3,3,2,3,1],[1,2,3,3,4,2,2,2,4,2,4,2]];
		var colNum = 0;
		var randCols = 0;
		
		var divisor = 4;
		cols *= divisor;
		cellWidth = Math.ceil(cellWidth / divisor);
		padding = Math.ceil(padding / divisor);
		
		for(var i=0; i< cols; i++){
			yPos[i] = 0;	
		}				
		
		$lastOutfit = $("#" + id).children("div[aligned=true]").last();
		
		if($lastOutfit.size() > 0){			
	       	for(var i=0; i < cols; i++){
	       		yPos[i] = parseInt($lastOutfit.attr("ypos"));
	       	}        
	       	
	        x = parseInt($lastOutfit.attr("xpos")); 
	        
	        count = parseInt($lastOutfit.attr("sc")) + parseInt($lastOutfit.attr("rc")) % cols;	        	        	       
		}                              
		
	    $("#" + id).css("position", "relative").css("margin","0 auto").css("width", (cols * (cellWidth + padding)) + "px");
	    
	    $(".pageEndSpacer").remove();
	    
	    $("#" + id).children("div[aligned!=true]").each(function() {
	    	colNum = count % cols;
	    	//var rowNum = Math.floor(count / cols) % staticCellSizes.length;
	    	
	    	// get max available cols
	    	var maxCols = divisor - (colNum % divisor);		    					    			    	
	    	
	    	// get rand # cols within max cols
	    	randCols = Math.floor(Math.random() * (maxCols - 1)) + 2;
	    	//var randCols = staticCellSizes[rowNum][colNum];
	    	
	    	// get the max height of the previous cells in the overlapping cols
	    	var maxHeightOfPreviousRow = 0;
	    	
	    	for(var i= colNum; i < colNum + randCols; i++){
	    		if(yPos[i % cols] > maxHeightOfPreviousRow){
	    			maxHeightOfPreviousRow = yPos[i % cols];	
	    		}	
	    	}	
	    	
	    	// get the max height of the cells in the current row
	    	var maxHeightOfCurrentRow = 0;
	    	
	    	for(var i= 0; i < cols; i++){
	    		if(yPos[i] > maxHeightOfCurrentRow){
	    			maxHeightOfCurrentRow = yPos[i];	
	    		}	
	    	}		    
	    	
	    	var cellTempPadding = padding * randCols;		    	
	    	var cellTempWidth = cellWidth * randCols;
	    	
	    	if(cellTempPadding != padding * divisor){
	    		cellTempWidth -= cellTempPadding / 2;	
	    	}		    			    			    	
	    	
	    	var imgHeight = $(this).find(".picture > a > img").first().css("height");
	    	var imgWidth = $(this).find(".picture > a > img").first().css("width");
	    	
	    	if(imgHeight == undefined || imgHeight == null || imgHeight.trim() == ""){
				imgHeight = 70;	    	
		    	imgWidth = cellTempWidth;  	
	    	}else{		    	
		    	imgHeight = parseInt(imgHeight.substring(0,imgHeight.length - 2));	    	
		    	imgWidth = parseInt(imgWidth.substring(0,imgWidth.length - 2));
	    	}
	    	
	    	if(imgHeight < 50){	    		
	    		imgHeight = 270;
	    		imgWidth = 202;	
	    	}
	    	
	    	var newHeight = cellTempWidth * imgHeight / imgWidth;
	    	
	        $(this).css("width", cellTempWidth + unit);
	        $(this).css("height", newHeight + unit);
	        $(this).css("position", "absolute");		        		        		    		    	
	        
	        $(this).css("left", x + unit);
	        $(this).css("top", maxHeightOfPreviousRow + unit);
	        $(this).attr("aligned", true);
	        $(this).attr("sc", colNum);
	        $(this).attr("rc", randCols);	        
	        
	        if (colNum + randCols >= cols -1 ) {
	            x = 0;	            
	        } else {
	            x += cellTempWidth + cellTempPadding;
	        }	        	        	           
	        
	        for(var i=colNum; i<colNum + randCols; i++){
	        	yPos[i % cols] = maxHeightOfPreviousRow + newHeight + cellTempPadding;
	        }
	        
	        $(this).attr("ypos", maxHeightOfCurrentRow);
	        $(this).attr("xpos", x);
	        
	        count += randCols;
	    });
	    
	     $("#" + id).append(
	    	$("<div>").addClass("pageEndSpacer")	    		
	    		.css("top", yPos[(count-1) % cols] + "px")
	    );	    
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
		
		if(lastHeight == undefined || lastHeight == null ||lastHeight.trim() == ""){
			lastHeight = 0;
		}else{
			lastHeight = parseFloat(lastHeight,10);	
		}
		
		if(lastHeight <= ($(window).height() + $(window).scrollTop() + 125)){			
			
			if(sessionStorage.clothingStore != null){			
				//$("#product-grid").append($("#filter-grid").children("div").slice(0, numElements));
				var $items = $();
				var el=JSON.parse(sessionStorage.filterStore);
				var index = parseInt(sessionStorage.productIndex)
				for(var i = index; i < index + numElements;i++){
					
					if(el[i] != null){
						var html = productPresenter.getProductTemplate(el[i]).css("position","absolute").css("left","-9999px");
						$items = $items.add(html);
					}
				}
				sessionStorage.productIndex = parseInt(sessionStorage.productIndex) + numElements;
				
				$("#product-grid").append($items);
								
				gridPresenter.alignDefaultGrid();	
			}		
		}
	}
};


var gridEvents = {	
	
	init: function(){
		gridEvents.overlayEvent();
		$(window).scroll(gridEvents.continuousScroll);
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
}
	

var tagPresenter = {	

	allTags: null,
	
	init: function(){
		$( "#tags" ).val("");
		tagPresenter.getAllTagNames();
		$("#tag-search-form").submit(tagPresenter.searchTags);
		$("#tag-search-clear").click(tagPresenter.clearSearch);
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
							$("<label>").addClass("control-label").text("Tag: ").append(						
								$("<input>").attr("type","text").attr("name","newTag").addClass("newTag")
							)
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
		var link = $(element).parent().parent().prev().find("a").attr("href");
		var image  = $(element).parent().parent().prev().find("img").attr("src");
		var price = $(element).parent().prev().find(".price").text();
		
		if(price != null){
			price = price.substring(1); // Remove $
		}
		
		var tagInput = $(element).find('input[name="newTag"]').val().trim();		
		
		
		if(tagInput.length > 0){
			var item = {name: name, company: company, customer: customer, category: category, link: link, image: image, price: price}; 
			var itemid = link.replace(/\W/g, '');			
					
			try{		
				firebase.$.child("tags").child(tagInput.toLowerCase()).child("items").child(itemid).set(item, function(error) {
				  if (error) {
						Messenger.error('Tag could not be saved. ' + error);
				  } else {
						Messenger.success('Tag was saved!');					
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
		var tag = $( "#tags" ).val();
		var products = new Array();

		
		if(/^[a-zA-Z0-9]+$/.test(tag)){	
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
				
				sessionStorage.clothingStore = JSON.stringify(products);
				sessionStorage.filterStore = JSON.stringify(products);
				sessionStorage.productIndex = 0;

				$("#loadingMainContent").hide();
				
				if( products.length > 0){
					gridPresenter.showContent(15);
				}else{
					$("#product-grid").append($("<div>").html("Sorry there are no outfits with that tag! Don't be shy though, be the first to use the tag \"" + tag + "\""));
				}
				
				$("#tag-search-clear").show();
			});			
		}else{
			Messenger.error('Tags can only be alphanumeric!');					
		}
		
		return false;
	},
	
	clearSearch: function(el){
		el.preventDefault();
		$("#product-grid").remove();
		$("#loadingMainContent").show();
		$("#tag-search-clear").hide();
		
		sessionStorage.clothingStore = null;
		sessionStorage.filterStore = null;
		sessionStorage.productIndex = 0;
		
		
		productPresenter.init();
				
		return false;
	}
};
