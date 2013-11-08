var gridPresenter = {	
	
	init: function(){				
		gridEvents.init();
	},			

	alignDefaultGrid: function(){
		var columns = gridPresenter.getDefaultColumns();
		$(".addToClosetBtn").tooltip();
		$(".tagOutfitBtn").tooltip();
		$(".showComments").tooltip();
					
		gridPresenter.alignGrid("product-grid", columns, 200, 270, 25);						
		closetFormPresenter.markUsersClositItems();
	}, 
	
	getDefaultColumns: function(){
		var columns = 1;
		var screenWidth = $(document).width();
		
		if(screenWidth > 975){
			columns = 4;	
		}else if(screenWidth > 750){
			columns = 3;	
		}else if(screenWidth > 525){
			columns = 2;	
		}
		
		/*
		2) 200 + 25 + 200 = 425 + 400 = 825
		3) 200 + 25 + 200 + 25 + 200 = 650 + 400 = 1050
		4) 200 + 25 + 200 + 25 + 200 + 25 + 200 = 875 + 400 = 1275
		5) 200 + 25 + 200 + 25 + 200 + 25 + 200 + 25 + 200 = 1100 + 400 = 1500
		*/
		
		return columns;	
	},

	alignGrid: function(/*string*/ id, /*int*/ cols, /*int*/ cellWidth, /*int*/ cellHeight, /*int*/ padding) {
   
		var x = 0;
		var y = 0;
		var count = $("#" + id).children("div[aligned=true]").size();
		var unit = "px";				
		
		var n=count;
		$("#" + id).children("div[aligned=true]").slice(-1 * cols).each(function() {
			var colNum = n++ % cols;
			if (colNum >= cols - 1) {
				x = 0;
				y = parseFloat($(this).css("top"),10) + cellHeight + padding;
			}else{
				x = parseInt($(this).css("left"),10) + cellWidth + padding;	
				y = parseFloat($(this).css("top"),10);			
			}
		});
				
		$("#" + id).css("position", "relative").css("margin","0 auto").css("width", (cols * (cellWidth + padding)) + "px");
		
		$(".pageEndSpacer").remove();
		    
		$("#" + id).children("div[aligned!=true]").each(function() {
		        var colNum = count % cols;		   
		        $(this).find(".picture").css("width", cellWidth + unit);
		        $(this).find(".picture").css("height", cellHeight + unit); 	
		    	
		    	var imgHeight = $(this).find(".picture > a > img").first().css("height");
		    	var imgWidth = $(this).find(".picture > a > img").first().css("width");
		    	
		    	if(imgHeight == undefined || imgHeight == null || imgHeight.trim() == ""){
					imgHeight = cellHeight;	    	
			    	imgWidth = cellWidth;  	
		    	}else{		    	
			    	imgHeight = parseFloat(imgHeight,10);	    	
			    	imgWidth = parseFloat(imgWidth,10);		    				    				    	
		    	}		    
		    	
		    	var newHeight = cellWidth * (imgHeight / imgWidth);
		    	
		    	if (newHeight <= cellHeight){		              
		              $(this).find(".picture > a > img").first().css("width", cellWidth + unit);
		    	}else{
		    	     var newWidth = cellHeight / (imgHeight / imgWidth); 		    	     
		             $(this).find(".picture > a > img").first().css("height", cellHeight + unit);  		    	     
		    	}
		    	
		        $(this).css("position", "absolute");		        
		        
		        $(this).css("left", x + unit);
		        $(this).css("top", y + unit);	        
		        $(this).attr("aligned",true);
		        		        		        
		        if (colNum >= cols - 1) {
		            x = 0;	           
		            y += cellHeight + padding;
		        } else {
		            x += cellWidth + padding;
		        }
		        		        		        
		        count++;
	    });
	    
	    $("#" + id).append(
	    	$("<div>").addClass("pageEndSpacer")	    		
	    		.css("top", y + "px")
	    );
	},
					
	
	showContent: function(numElements){
		var lastHeight = $("#product-grid").children("div[aligned=true]").last().css("top");
		
		if(lastHeight == undefined || lastHeight == null || lastHeight.trim() == ""){
			lastHeight = 0;
		}else{
			lastHeight = parseFloat(lastHeight,10);	
		}
		
		if(lastHeight <= ($(window).height() + $(window).scrollTop() + 125)){			
			
			if(productPresenter.filterStore != null){							
				var $items = $();
				var el=productPresenter.filterStore;
				var index = productPresenter.productIndex;
				
				for(var i = index; i < index + numElements;i++){
					
					if(el[Object.keys(el)[i]] != null){
						var html = productPresenter.getProductTemplate(Object.keys(el)[i]).css("position","absolute").css("left","-9999px");
						$items = $items.add(html);
					}
				}
				
				productPresenter.productIndex += numElements;				
				$("#product-grid").append($items);								
				gridPresenter.alignDefaultGrid();
				$("#loadingMainContent").hide();	
			}		
		}
	},
	
	beginTask: function(){
	   $("#product-grid").children().remove();	 		 	
       $("#product-grid").append($("<br><br><br><br>"));
       $("#loadingMainContent").show();	
	},
	
	endTask: function(){
	   $("#loadingMainContent").hide();	
	}
};