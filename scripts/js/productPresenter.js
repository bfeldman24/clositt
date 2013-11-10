var productPresenter = {	
	splitValue: 30, 
	productIndex: 0,
	clothingStore: [], 
	filterStore: [], 	
	
	init: function(){		
		firebase.$.child('clositt').once('value', productPresenter.setup);	 	 
	},
	
	setup: function(snapshot){		
		productPresenter.showCompanyProducts(snapshot);
	 	gridPresenter.alignDefaultGrid();
		$('body').css("min-height",$(window).height());	
		productPresenter.productIndex += productPresenter.splitValue;	
	},
	
	initCloset: function(user){	
	    closetPresenter.setUser(user);	
	    firebase.$.child('clositt').once('value', productPresenter.closetSetup);			 	 
	},
	
	closetSetup: function(store){
	   productPresenter.clothingStore = store.child("products").val();
	   closetPresenter.init();	   
	},	
 
 	showCompanyProducts: function(store){	 		 	
	 	productPresenter.clothingStore = store.child("products").val();	
	 	productPresenter.filterStore = store.child("products").val();	
	 	var companies = store.child("companies").val();
	 	var customers = store.child("customers").val();
	 	var categories = store.child("categories").val();
	 	var prices = store.child("prices").val();									
	 		 	
        productPresenter.refreshProducts();	 	
	 	filterPresenter.createFilters(companies, customers, categories, prices);
	 },
 
	getProductTemplate: function(sku){
	    sku = productPresenter.formatSku(sku);
	    var product = productPresenter.clothingStore[sku];
		var company = product.o;
		var audience = product.u;
		var category = product.a;
		var link = product.l;
		var image = product.i;
		var name = product.n;
		var reviewCount = product.rc == null ? '' : product.rc;
		var id = product.s;
		var price = product.p == null || isNaN(product.p) ? "" : "$" + Math.round(product.p);		 	
 		var filterPrice = product.fp; 		 		

		var rand = Math.floor(Math.random() * 3) + 1;
		var shadow = "";
		if(rand == 1){
			shadow = 'shadow';	
		}		
			 			
 		//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
 		var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
		var html ='<div class="outfit" '+attr+'>';
				html +='<div class="picture"><a href="'+link+'" pid="'+id+'" target="_blank"><img src="' + image + '" class="'+shadow+'" onerror="return pagePresenter.handleImageNotFound(this)"/></a></div>';			
				html +='<div class="overlay">';
					html +='<div class="topleft">';										
						html +='<div class="tagOutfitBtn" data-toggle="tooltip" data-placement="left" title="Tagitt"><i class="icon-tags icon-white"></i></div>';
					html += '</div>';
					html +='<div class="topright">';										
						html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Closet"><img id="hanger-'+id+'" class="hanger-icon" src="css/images/hanger-icon-white.png" /><i class="icon-plus-sign icon-white hanger-plus"></i></div>';
					html += '</div>';
					html +='<div class="bottom">';	
					    html += '<div class="productActions" >';
					       html += '<div data-toggle="tooltip" data-placement="top" title="Show Comments" class="showComments"><span class="numReviews">'+reviewCount+'</span><i class="icon-comment icon-white"></i></div>';
					    html += '</div>';														
						html +='<div class="companyName">' + company + '</div>';
						html +='<div class="price">' +  price + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
					html += '<div class="product-comments"></div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
		return $(html);
	},
	
	getClosetItemTemplate: function(sku){
	    var product = productPresenter.clothingStore[sku];	
		var company = product.o;
		var link = product.l;
		var image = product.i;
		var name = product.n;
			 			
		var html ='<div class="outfit">';
				html +='<div class="picture"><a href="'+link+'" target="_blank" pid="'+sku+'"><img src="' + image + '" /></a></div>';							
				html +='<div class="overlay">';
					html +='<div class="bottom">';										
						html +='<div class="companyName">' + company + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
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
	    gridPresenter.showContent(15);	    
	},
	
	refreshProducts: function(){
	    gridPresenter.beginTask();
	    var grid = $("#product-grid");

		for(var i=0; i<productPresenter.splitValue;i++){
			var rand = Math.floor(Math.random() * Object.keys(productPresenter.clothingStore).length);
			var outfit = productPresenter.getProductTemplate(Object.keys(productPresenter.clothingStore)[rand]);								
			grid.append(outfit);		 								
		}
	 	 		 			 		 	
	 	gridPresenter.endTask();
	 	gridPresenter.alignDefaultGrid();	
     	productPresenter.productIndex = 0;      	
	 	productPresenter.filterStore = productPresenter.clothingStore;		 		 	
	},
	
	getProductsFromSkuList: function(skus){
	     var products = new Object;
	   
         for(var i=0; i < skus.length; i++){
             var sku = productPresenter.formatSku(skus[i]);
	         products[skus[i]] = productPresenter.clothingStore[sku];
         }
         
         return products;
	},
	
	formatSku: function(sku){
	   return sku.substring(sku.indexOf("_") + 1);  
	}
};
