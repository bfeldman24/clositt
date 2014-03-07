var gridPresenter = {
    randomStartingPosition: 0,	
    productIndex: 0,
    storeCount: 0,  
    browsePages: [],    
	
	init: function(){			
	    gridPresenter.randomStartingPosition = parseInt(Math.random() * 15000);	
		gridEvents.init();
		gridPresenter.mixupBrowsePages();
		gridPresenter.showContent(15);												
	},					

	alignDefaultGrid: function(gridName){
	    if (gridName == null){
	       gridName = "product-grid";  
	    }
	   
		var columns = gridPresenter.getDefaultColumns();
		gridPresenter.showTooltips();
					
		gridPresenter.alignGrid(gridName, columns, 200, 270, 50);						
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

	alignGrid: function(/*string*/ id, /*int*/ cols, /*int*/ cellWidth, /*int*/ cellHeight, /*int*/ padding, /*int*/ verticalMargin) {
   
		var x = 0;
		var y = 0;		
		var count = $("#" + id).children("div[aligned=true]").size();
		var unit = "px";	
		verticalMargin = typeof verticalMargin !== 'undefined' ? verticalMargin : 0;					
		
		var n=count;
		$("#" + id).children("div[aligned=true]").slice(-1 * cols).each(function() {
			var colNum = n++ % cols;
			if (colNum >= cols - 1) {
				x = 0;
				y = parseFloat($(this).css("top"),10) + cellHeight + padding + verticalMargin;
			}else{
				x = parseInt($(this).css("left"),10) + cellWidth + padding;	
				y = parseFloat($(this).css("top"),10);			
			}
		});
				
		$("#" + id).css("position", "relative").css("margin","0 auto").css("width", (cols * (cellWidth + padding)) + "px");
		
		$(".pageEndSpacer").remove();
		    
		$("#" + id).children("div[aligned!=true][ignore!=true]").each(function() {
		        var colNum = count % cols;		   
		        $(this).find(".picture").css("width", cellWidth + unit);
		        $(this).find(".picture").css("height", cellHeight + unit); 			    			    
		    	
		        $(this).css("position", "absolute");		        
		        
		        $(this).css("left", x + unit);
		        $(this).css("top", y + unit);	        
		        $(this).attr("aligned",true);
		        		        		        
		        if (colNum >= cols - 1) {
		            x = 0;	           
		            y += cellHeight + padding + verticalMargin;
		        } else {
		            x += cellWidth + padding;
		        }
		        		        		        
		        count++;
	    });
	    
	    $("#" + id).append(
	    	$("<div>").addClass("pageEndSpacer")	    		
	    		.css("top", (y + cellHeight) + "px")
	    );
	},
	
	// This is currently not called anywhere, but may be needed in the future
	resizeImages: function(el){
	    var image = $(el.currentTarget);
	    var imgHeight = image.css("height");
    	var imgWidth = image.css("width");
    	
    	if(imgHeight == undefined || imgHeight == null || imgHeight.trim() == ""){
			imgHeight = cellHeight;	    	
	    	imgWidth = cellWidth;  	
    	}else{		    	
	    	imgHeight = parseFloat(imgHeight,10);	    	
	    	imgWidth = parseFloat(imgWidth,10);		    				    				    	
    	}		    
    	
    	var newHeight = cellWidth * (imgHeight / imgWidth);
    	
    	if (newHeight <= cellHeight){		              
              image.css("width", cellWidth + unit);
    	}else{
    	     var newWidth = cellHeight / (imgHeight / imgWidth); 		    	     
             image.css("height", cellHeight + unit);  		    	     
    	}
	},		
	
	mixupBrowsePages: function(){
	    var max = 300;
		for(var i=0; i < max; i++){
		      var swap = Math.floor(Math.random() * max);
		      var temp = gridPresenter.browsePages[i];
		      gridPresenter.browsePages[i] = gridPresenter.browsePages[swap] == null ? swap : gridPresenter.browsePages[swap];
		      gridPresenter.browsePages[swap] = temp == null ? i : temp;
		}
	},
	
	showContent: function(numElements){
		var lastHeight = $("#product-grid").children("div[aligned=true]").last().css("top");
		
		if(lastHeight == undefined || lastHeight == null || lastHeight.trim() == ""){
			lastHeight = 0;
		}else{
			lastHeight = parseFloat(lastHeight, 10);	
		}
		
		if(lastHeight <= ($(window).height() + $(window).scrollTop() + 325)){						
			var $items = $();
			
			if(productPresenter.filterStore == null){				     				     			 		 
			     var c = filterPresenter.getSelectedCustomer();
			     
			     if (c == null){
			         c = "b";			         
			     }else{
    			     c = c.substring(0,1);
			     }
			     
			     var page = gridPresenter.productIndex;
			     
			     if (gridPresenter.browsePages[page] != null){
			         page = gridPresenter.browsePages[page];
			     }
			 
			     $.post( window.HOME_ROOT + "b/" + c + "/" + page, gridPresenter.lazyLoad, "json");
			     gridPresenter.productIndex++;
			            			     
    		}else{	    		    
    		    searchController.getProducts(gridPresenter.lazyLoad);       		              		        		    
    		    gridPresenter.productIndex = 0; 		  			
			}		
		}
	},
	
	lazyLoad: function(products){
	               
        products.forEach(function(product){	                       
			var $html = productPresenter.getProductTemplate(product);
            $("#product-grid").append($html);
            
            if ($("#product-grid .outfit").length < 30){                        
                $html.find("img[data-src]").unveil(10000);
            }else{
                $html.find("img[data-src]").unveil(200);
            }
	   });
			                   			   	   		
	   gridPresenter.alignDefaultGrid(); 
	   gridPresenter.endTask(); 
	},	
	
	beginTask: function(){
	   $("#product-grid").children().remove();
       $("#product-grid").append($("<br><br><br><br>"));
       $("#loadingMainContent").show();	
	},
	
	endTask: function(){
	   $("#loadingMainContent").hide();	
	},
	
	showTooltips: function(){
		$(".addToClosetBtn").tooltip();
		$(".tagOutfitBtn").tooltip();
		$(".showComments").tooltip();
		$(".numClosets").tooltip();
		$(".addToWishList").tooltip();
		$(".shareOutfitBtn").tooltip();
	}
};