var gridPresenter = {
    randomStartingPosition: 0,	
    productIndex: 0,
    storeCount: 0,  
    maxBrowsePages: 300,
    numberOfLoadingPages: 0,
    maxNumberOfPagesLoadingAtOnce: 2,
    browsePages: [],        
	
	init: function(){			
	    gridPresenter.randomStartingPosition = parseInt(Math.random() * 15000);	
		gridEvents.init();
		gridPresenter.mixupBrowsePages();				
		
		if ($( "#search-bar" ).val().length <= 0 && location.hash.indexOf("#outfit") != 0){		
		      gridPresenter.showContent(15);			
		}									
	},					

	alignDefaultGrid: function(){	   		
		gridPresenter.showTooltips();											
		closetFormPresenter.markUsersClositItems();
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
		for(var i=0; i < gridPresenter.maxBrowsePages; i++){
		      var swap = Math.floor(Math.random() * gridPresenter.maxBrowsePages);
		      var temp = gridPresenter.browsePages[i];
		      gridPresenter.browsePages[i] = gridPresenter.browsePages[swap] == null ? swap : gridPresenter.browsePages[swap];
		      gridPresenter.browsePages[swap] = temp == null ? i : temp;
		}
	},
	
	showContent: function(numElements){
	    if (gridPresenter.numberOfLoadingPages < gridPresenter.maxNumberOfPagesLoadingAtOnce - 1){
	       	
    		var lastHeight = $("#product-grid").children("div").last();
    		
    		if(lastHeight == undefined || lastHeight == null || lastHeight.length <= 0){
    			lastHeight = 0;
    		}else{
    			lastHeight = lastHeight.position().top;	
    		}
    		
    		if(lastHeight <= ($(window).height() + $(window).scrollTop() + 325)){						
    			var $items = $();
    			
    			if(searchController.isSearchActive){
    			    gridPresenter.numberOfLoadingPages++; 				     				     			 		 
    			    searchController.getProducts(gridPresenter.lazyLoad);       		              		        		    
        		    gridPresenter.productIndex = 0; 		  			
        		    
        		}else{	    		    
                     var defaultCustomer = filterPresenter.defaultCustomer.substring(0,1);
    			     var page = gridPresenter.productIndex;
    			     
    			     if (gridPresenter.browsePages[page] != null){
    			         page = gridPresenter.browsePages[page];
    			     }
    			 
    			     gridPresenter.numberOfLoadingPages++;
    			     $.post( window.HOME_ROOT + "b/" + defaultCustomer + "/" + page, gridPresenter.lazyLoad, "json");
    			     gridPresenter.productIndex++;    			            			             		    
    			}		
    		}
	    }
	},
	
	lazyLoad: function(products){
	    if (products == null){
	        return null;
	    }
	    
	    var $productHtml;
	    
	    if (products.products != null){
	       $productHtml = $(products.products);  
	    }	
	    
	    if ($productHtml != null && $productHtml.length > 0){
	       $("#product-grid").append($productHtml);	       
	       $("#product-grid .outfit img[data-src]").unveil(200, productPresenter.showImageCallback);
	    }else{	       
	       pagePresenter.enableLazyLoading = false; // no more products  
	    }       	                      
			                   			   	   		
	   gridPresenter.alignDefaultGrid(); 
	   gridPresenter.endTask(); 
	   gridPresenter.numberOfLoadingPages--;
	   
	   if ($("#product-loader").length > 0){
	       pagePresenter.productLoaderPosition = $("#product-loader").position().top;
	   }
	},	
	
	beginTask: function(){
	   $("#product-grid").children().remove();
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