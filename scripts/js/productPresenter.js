var productPresenter = {	
    isLoaded: false,
    loadSize: 50,
	splitValue: 30, 
	productIndex: 0,
	filterStore: null, 
	populateStoreCallback: null,		
	
	init: function(){				
	},		
 
	getProductTemplate: function(product){
	    if (typeof(product) != "object"){      	
	       return $("");
	    }
	    
		var company = product.o;
		var audience = product.u;
		var category = product.a;
		var link = product.l;
		var image = product.i;
		var name = product.n;		
		var reviewCount = product.rc == null ? 0 : product.rc;
		var closetCount = product.cc == null ? 0 : product.cc;
		var closetCountPlural = closetCount == 1 ? "" : "s"; 
		var id = product.s;
		var price = product.p == null || isNaN(product.p) ? "" : "$" + Math.round(product.p);		 	
 		var filterPrice = product.fp; 		 		
 		var feedOwner = product.owner;
		var feedCloset = product.closet;

		var rand = Math.floor(Math.random() * 3) + 1;
		var shadow = "";
		if(rand == 1){
			shadow = 'shadow';	
		}		
			 			
 		//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
 		var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
		var html ='<div class="outfit item" '+attr+' pid="'+id+'">';
				html +='<div class="picture"><a class="productPage" target="_blank"><img src="' + image + '" class="'+shadow+'" onerror="return pagePresenter.handleImageNotFound(this)"/></a></div>';			
				html +='<div class="overlay">';
					html +='<div class="topleft">';										
						html +='<div class="shareOutfitBtn" data-toggle="tooltip" data-placement="left" title="Share it!"><img class="social-people-icon" src="css/images/social/social-people-white.png" /></div>';						 
					html += '</div>';
					html += '<div class="social-btns" style="display:none;"></div>';
					html +='<div class="topright">';										
						html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Clositt"><img class="hanger-icon" src="css/images/hanger-icon-white.png" /><i class="icon-plus-sign icon-white hanger-plus"></i></div>';
					html += '</div>';
					html +='<div class="bottom">';						    					    
					    html += '<div class="productActions" >';					    
					       html += '<span data-toggle="tooltip" data-placement="top" title="Add to Wish List" class="addToWishList"><i class="icon-gift icon-white"></i></span>';
					       html += '<span data-toggle="tooltip" data-placement="top" title="Show Comments" class="showComments numReviews"><span class="counter" >'+reviewCount+'</span><i class="icon-comment icon-white"></i></span>';
					       html += '<span data-toggle="tooltip" data-placement="top" title="Added to '+closetCount+' Clositt'+closetCountPlural+'" class="numClosets"><span class="counter">'+closetCount+'</span><i class="icon-hanger-white"></i></span>';
					    html += '</div>';									
					    
					    if(feedOwner != null && feedCloset != null){
					       html += '<div class="productSubHeader" >';
	   				            html += '<div class="outfitFeedOwner"><span class="outfitOwner">'+feedOwner+'\'s</span><span>&nbsp;\"'+feedCloset+'\" clositt</span></div>';
    					    html += '</div>';  
					    }
					    					
						html +='<div class="companyName">' + company + '</div>';
						html +='<div class="price">' +  price + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
					html += '<div class="product-comments"></div>';
					html += '<div class="addToClosetForm" style="display:none;"></div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
		return $(html);
	},
	
//	getStoreProductTemplate: function(product){	    
//	    
//	    var company = product.o;
//		var audience = product.u;
//		var category = product.a;
//		var link = product.link;
//		var image = product.image;
//		var name = product.name;		
//		var reviewCount = product.rc == null ? 0 : product.rc;
//		var closetCount = product.cc == null ? 0 : product.cc;
//		var closetCountPlural = closetCount == 1 ? "" : "s"; 
//		var id = product.sku;
//		var price = product.price == null || isNaN(product.price) ? "" : "$" + Math.round(product.price);		 	
// 		var filterPrice = product.fp; 		 		
// 		var feedOwner = product.owner;
//		var feedCloset = product.closet;
//
//		var rand = Math.floor(Math.random() * 3) + 1;
//		var shadow = "";
//		if(rand == 1){
//			shadow = 'shadow';	
//		}		
//			 			
// 		//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
// 		var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
//		var html ='<div class="outfit item" '+attr+' pid="'+id+'">';
//				html +='<div class="picture"><a class="productPage" target="_blank"><img src="' + image + '" class="'+shadow+'" onerror="return pagePresenter.handleImageNotFound(this)"/></a></div>';			
//				html +='<div class="overlay">';
//					html +='<div class="topleft">';										
//						html +='<div class="tagOutfitBtn" data-toggle="tooltip" data-placement="left" title="Tagitt"><i class="icon-tags icon-white"></i></div>';						 
//					html += '</div>';
//					html += '<div class="addTagForm" style="display:none;"></div>';
//					html +='<div class="topright">';										
//						html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Clositt"><img class="hanger-icon" src="css/images/hanger-icon-white.png" /><i class="icon-plus-sign icon-white hanger-plus"></i></div>';
//					html += '</div>';
//					html +='<div class="bottom">';						    					    
//					    html += '<div class="productActions" >';					    
//					       html += '<span data-toggle="tooltip" data-placement="top" title="Add to Wish List" class="addToWishList"><i class="icon-gift icon-white"></i></span>';
//					       html += '<span data-toggle="tooltip" data-placement="top" title="Show Comments" class="showComments numReviews"><span class="counter" >'+reviewCount+'</span><i class="icon-comment icon-white"></i></span>';
//					       html += '<span data-toggle="tooltip" data-placement="top" title="Added to '+closetCount+' Clositt'+closetCountPlural+'" class="numClosets"><span class="counter">'+closetCount+'</span><i class="icon-hanger-white"></i></span>';
//					    html += '</div>';									
//					    
//					    if(feedOwner != null && feedCloset != null){
//					       html += '<div class="productSubHeader" >';
//	   				            html += '<div class="outfitFeedOwner"><span class="outfitOwner">'+feedOwner+'\'s</span><span>&nbsp;\"'+feedCloset+'\" clositt</span></div>';
//    					    html += '</div>';  
//					    }
//					    					
//						html +='<div class="companyName">' + company + '</div>';
//						html +='<div class="price">' +  price + '</div>';
//						html +='<div class="name">' + name + '</div>';
//					html += '</div>';
//					html += '<div class="product-comments"></div>';
//					html += '<div class="addToClosetForm" style="display:none;"></div>';
//				html += '</div>';
//				html += '<div class="clear"></div>';				
//			html +='</div>';
//			
//		return $(html);
//	},
	
	getClosetItemTemplate: function(sku, image){	    
	    var html = '';
	    
	    if (sku != null && image != null){	       
	    	 			    			 			
    		html ='<div class="outfit item" pid="'+sku+'">';
				html +='<div class="picture"><a class="productPage" target="_blank" ><img src="' + image + '" /></a></div>';							
//				html +='<div class="overlay">';
//					html +='<div class="bottom">';										
//						html +='<div class="companyName">' + company + '</div>';
//						html +='<div class="name">' + name + '</div>';
//					html += '</div>';
//				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
	    }
			
		return $(html);
	},		
	
	refreshImages: function(){	   
	     var date = new Date();
	     
         $(".picture > a > img").each(function(){
             var src = $(this).attr("src");
             var sign = '?';
             var pos = src.indexOf(sign);
             if (pos >= 0) {
                sign = '&';
             }
             
             $(this).attr("src", src + sign + 'rldimg=' + date.getTime());
         });
         
         return true;
	},
	
	refreshFilteredProducts: function(){
	    gridPresenter.endTask();
	    productPresenter.productIndex = 0;
	    searchController.pageIndex = 0;
	    gridPresenter.showContent(15);	    
	},
	
	refreshProducts: function(){
	    gridPresenter.endTask();
     	productPresenter.productIndex = 0;      	
	 	productPresenter.filterStore = null;	
	 	searchController.criteria = null;
        searchController.pageIndex = 0; 	 		 	
	 	gridPresenter.showContent(15);
	},		
	
	formatSku: function(sku){
	   return sku.substring(sku.indexOf("_") + 1);  
	}
};
