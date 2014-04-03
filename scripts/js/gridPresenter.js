var gridPresenter = {
    randomStartingPosition: 0,	
    productIndex: 0,
    storeCount: 0,  
    maxBrowsePages: 300,
    browsePages: [],        
	
	init: function(){			
	    gridPresenter.randomStartingPosition = parseInt(Math.random() * 15000);	
		gridEvents.init();
		gridPresenter.mixupBrowsePages();
		gridPresenter.showContent(15);												
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
		var lastHeight = $("#product-grid").children("div").last();
		
		if(lastHeight == undefined || lastHeight == null || lastHeight.length <= 0){
			lastHeight = 0;
		}else{
			lastHeight = lastHeight.position().top;	
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
			$html.addClass("col-xs-5 col-xs-offset-1 col-sm-4 col-md-3 col-lg-2");
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