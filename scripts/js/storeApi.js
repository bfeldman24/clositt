storeApi = {

	getFullUrl: function(company, url){
		var newUrl = "";		
		
		switch(company.toLowerCase()){
			case "gap":
			case "old navy":
			case "banana":
			case "piperlime":
			case "athleta":
				newUrl = url;
				break;
			case "jcrew":
				newUrl = url;
				break;		
			case "ann taylor":				
				var catid = url.substring(url.lastIndexOf("/") + 1);
				newUrl = url.indexOf("?") > 0 ? '' : "http://www.anntaylor.com/ann/catalog/category.jsp?pageSize=1000&goToPage=1&catid=" + catid;
				break;
			case "loft":
				newUrl = url;
				break;
			case "urban outfitters":
				newUrl = url;
				break;
			case "zara":
				newUrl = url;
				break;	
			case "hm":
				newUrl = url;
				break;
			case "tory burch":
				newUrl = url;
				break;
		}	
		
		return newUrl;
	},
	
	getProducts: function(company, data, url){
		var home = url.substring(0,url.indexOf(".com")+4);
		
		var products = "";
		
		switch(company.toLowerCase()){
			case "gap":
			case "old navy":
			case "banana":
			case "piperlime":
			case "athleta":
				products = storeApi.getGapJson(data, home);
				break;
			case "jcrew":
				products = storeApi.getJcrew(data, home);
				break;		
			case "ann taylor":
				products = storeApi.getAnnTaylor(data, home);
				break;
			case "loft":
				products = storeApi.getLoft(data, home);
				break;
			case "urban outfitters":
				products = storeApi.getUrban(data, home);
				break;
			case "zara":
				products = storeApi.getZara(data, home);
				break;	
			case "hm":
				products = storeApi.getHM(data, home);
				break;
			case "tory burch":
				products = storeApi.getToryBurch(data, home);
				break;
		}	
		
		return products;
	},
	
	
	getGapHTML: function(data, url){
			var products = new Object();
	  		  		
			$(data).find(".productCatItem").each(function(){					
				var item = new Object();
				item.image = $(this).find("img").attr("productimagepath");	
				item.link = url + $(this).find(".productItemName").attr("href");	
				item.name = $(this).find(".productItemName").html();
				item.price = $(this).find(".priceDisplay").html();	
			
				if(item.image != undefined){
					var itemid = item.link.replace(/\W/g, '');			
					products[itemid] =item;
				}
			});
		
		return JSON.stringify(products);
	},
	
	
	getGapJson: function(data, url){
			var json = $.parseJSON(data);
			var products = new Object();
	  		var cid = json.productCategoryFacetedSearch.productCategory.businessCatalogItemId;
			var vid = 1;
	
			if(json.productCategoryFacetedSearch.productCategory.childCategories != null){
				if(json.productCategoryFacetedSearch.productCategory.childCategories.length > 1){	
					$.each(json.productCategoryFacetedSearch.productCategory.childCategories, function(){
	  		
						$.each(this.childProducts, function(){								
							var pid = this.businessCatalogItemId;
						
							var item = new Object();
							item.image = this.quicklookImage.path;	
							item.link = url + "/browse/product.do?cid="+cid+"&vid="+vid+"&pid="+pid;	
							item.name = this.name;
							item.price = this.price.currentMinPrice;	
				
							if(item.image != undefined){			
								var itemid = item.link.replace(/\W/g, '');
								products[itemid] = item;
							}
						});
					});
				}else{
					$.each(json.productCategoryFacetedSearch.productCategory.childCategories.childProducts, function(){
	                                                var pid = this.businessCatalogItemId;
	
	                                                var item = new Object();
	                                                item.image = this.quicklookImage.path;
	                                                item.link = url + "/browse/product.do?cid="+cid+"&vid="+vid+"&pid="+pid;
	                                                item.name = this.name;
	                                                item.price = this.price.currentMinPrice;
	
	                                                if(item.image != undefined){
	                                                        var itemid = item.link.replace(/\W/g, '');
	                                                        products[itemid] = item;
	                                               }
	                                       
	                                });		
				}
			}else{
				$.each(json.productCategoryFacetedSearch.productCategory.childProducts, function(){
	                        	var pid = this.businessCatalogItemId;
	
	                                var item = new Object();
	                                item.image = this.quicklookImage.path;
	                                item.link = url + "/browse/product.do?cid="+cid+"&vid="+vid+"&pid="+pid;
	                                item.name = this.name;
	                                item.price = this.price.currentMinPrice;
	
	                                if(item.image != undefined){
	                                	var itemid = item.link.replace(/\W/g, '');
	                                        products[itemid] = item;
	                                }
	                        });
			}
		return JSON.stringify(products);
	},
	    
	getJcrew: function(data, url){	
		url += "?iNextCategory=-1";
	  	var products = new Object();   		
	  	
		$(data).find(".arrayProdCell").each(function(){
			var item = new Object();	
			
			item.image = $(this).find(".arrayImg").find("img").attr("src");			
			item.link = $(this).find(".arrayImg").find("a").attr("href");			
			item.name = $(this).find(".arrayProdName").find("a").text().trim();				
			item.price = $(this).find(".arrayProdPrice").text().trim();
			
			if(item.image != undefined){
				var itemid = item.link.replace(/\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);	
	},
	    
	getAnnTaylor: function(data, url){
	 	var products = new Object();
	 		   		
		$(data).find(".product").each(function(){
			var item = new Object();
			
			item.image = $(this).find(".thumb").children("img").first().attr("src");
			item.link = url + $(this).find(".overlay > a.clickthrough").first().attr("href");			
			item.name = $(this).find(".overlay > .fg > .description > .messaging > p").not(".POS").first().text().trim();		
			item.price = $(this).find(".overlay > .fg > .description > .price > p").not(".was").first().text().trim();
			
			if(item.image != undefined){
				var itemid = item.link.replace(/\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	
	    
	getLoft: function(data, url){
		 var products = new Object();
		 		    		
		$(data).find(".products").find(".product").each(function(){
			var item = new Object();
			
			item.image = $(this).find(".thumb").children("img").first().attr("src");				
			item.link = url + $(this).find(".overlay > a.clickthrough").first().attr("href");			
			item.name = $(this).find(".description > .messaging > p").not(".POS").first().text().trim();				
			item.price = $(this).find(".description > .price > p").not(".was").first().text().trim();
			
			if(item.image != undefined){
				var itemid = item.link.replace(/\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	    	
	getUrban: function(data, url){
	    var products = new Object();
	    		    		
		$(data).find("#category-products").children().each(function(){
			var item = new Object();
					
			item.image = $(this).find(".category-product-image > a > img").first().attr("src");				
			item.link = url + $(this).find(".category-product-image > a").first().attr("href");			
			item.name = $(this).find(".category-product-description > h2 > a").first().text().trim();				
			item.price = $(this).find(".category-product-description > .price").first().text().trim();
	
			if(item.image != undefined){
				var itemid = item.link.replace(/\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	    
	getZara: function(data, url){
		var products = new Object();
	    	$(".currency").html("");		
	      	  		
		$(data).find("#product-list").children(".product").each(function(){
			var item = new Object();
			
			item.image = $(this).find("a.gaProductDetailsLink > img").first().attr("data-src");
			item.link = $(this).find("a.gaProductDetailsLink").first().attr("href");			
			item.name = $(this).find(".product-info > a.name").first().text().trim();				
			item.price = $(this).find(".product-info > .price").first().text().trim();
			
			if(item.image != undefined){
				var itemid = item.link.replace(/\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	
	getHM: function(data, url){
		url += "&size=1000";
		var products = new Object();
	      	  		
		$(data).find("#list-products").children("li").not(".getTheLook").each(function(){
			var item = new Object();
			
			item.image = $(this).find(".image > img:nth-child(2)").first().attr("src");
			item.link = $(this).find("a").first().attr("href");			
			item.price = $(this).find("a > .details > .price").first().text().trim();
			$(this).find("a > .details > .price").first().remove();
			item.name = $(this).find("a > .details").first().text().trim();				
			
			if(item.image != undefined){
				var itemid = item.link.replace(/\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	
	getToryBurch: function(data, url){
	        var products = new Object();
	
	        $(data).find("#search > .productresultarea > .productlisting > .product").each(function(){
	                var item = new Object();
	
	                item.image = $(this).children(".image").find("img:nth-child(2)").attr("src");
	                item.link = $(this).children(".image").find("a").first().attr("href");
	                item.price = $(this).find(".pricing > .price").first().text().trim();
	                item.name = $(this).children(".name").find("a").first().text().trim();
	
	                if(item.image != undefined){
				var itemid = item.link.replace(/\W/g, '');
	                        products[itemid] = item;
	                }
	        });
	
	        return JSON.stringify(products);
	}
}
