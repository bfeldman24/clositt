/* 
var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
*/

storeApi = {
    unavaiableTerms: ['unavailable', 'not available', 'no longer available', 'out of stock', 'not in stock', 'no longer exist', 'does not exist', 'sold out'],
    
	getFullUrl: function(company, url){
		var newUrl = "";		
		
		switch(company.toLowerCase()){		
//			case "ann taylor":				
//				var catid = url.indexOf("?") > 0 ? url.substring(url.lastIndexOf("catid") + 6) : url.substring(url.lastIndexOf("/") + 1);
//                catid = url.indexOf("?") > 0 ? catid.substring(0, catid.indexOf("&")) : catid;
//                newUrl = "http://www.anntaylor.com/ann/catalog/category.jsp?pageSize=1000&goToPage=1&catid=" + catid;
//				break;
		    case "bcbg":
		        newUrl = url + "#start=0&sz=1000";      
		        break;	
		    case "charles tyrwhitt":										
		        newUrl = storeApiHelper.replaceParameter(url, "ppp", "1000");
		        break;
		    case "macys":
		        newUrl = storeApiHelper.replaceParameter(url, "pageIndex", "1");
		        newUrl = storeApiHelper.replaceParameter(url, "productsPerPage", "1000");
		        break;
		    //case "new york & company":
		    case "chicos":		    
		        newUrl = storeApiHelper.replaceParameter(url, "viewAll", "true");		        
		        break;
		    case "forever21":
		    case "cusp":
		        newUrl = storeApiHelper.replaceParameter(url, "pageSize", "1000");
		        newUrl = storeApiHelper.replaceParameter(newUrl, "page", "1");		        		        
		        break;
		    case "nike":
		        newUrl = storeApiHelper.replaceParameter(url, "sortOrder", "viewAll|asc");		        
		        break;
		    case "j_jill":
		        newUrl = storeApiHelper.replaceParameter(url, "rpp", "0");		        
		        break; 
		    case "michael kors":
		        newUrl = storeApiHelper.replaceParameter(url, "navid", "viewAll");   
		        newUrl = storeApiHelper.replaceParameter(newUrl, "view", "all");   
		        break;
			default:
				newUrl = url;
				break;			
		}	
		
		return newUrl;
	},
	
	getProducts: function(company, url, callback){
	   storeApi.fetchProducts(company, url, 0, {}, callback);
	},
	
	fetchProducts: function(company, url, pageNumber, products, callback){
       $.post("webProxy.php", {u:url}, function(result){	
         
            if (result == null || result.trim() == ""){
    			 console.log("webProxy returned nothing. Make sure the URL is correct and does not redirect.");    		
		         Messenger.error("Error: Could not read the product page. Check to make sure this link is still active.");	         
		         
		         if (typeof(callback) == "function"){
			        callback(products);   
			     }
		    }else{       			         								
				
				try{
				    // Get Product Data
				    var data = storeApi.populateProducts(company, result, url);
                    
                    if (data == null || Object.keys(data).length <= 0){
                        if (typeof(callback) == "function"){
         			        callback(products);   
         			    }
                    }else{ 

                        // Add valid products to list
    				    for (var i=0; i < Object.keys(data).length; i++){            
           	                var testProduct = data[Object.keys(data)[i]];
           	                
        				    if (storeApiHelper.validateProduct(testProduct)){
        				        products[testProduct.sku] = testProduct;   
        				    }
    				    }
    				    
    				    // Get next page url 
    				    var nextPage = storeApiHelper.getNextPageUrl(company, result, url);
    				    
    				    if (pageNumber < 100 &&
    				        nextPage != null && 
    				        nextPage.length > 10 &&				        
    				        nextPage != url &&
    				        (nextPage.indexOf(".com") > 0 || nextPage.indexOf(".net") > 0 || nextPage.indexOf(".org") > 0)){
    				            
    				            pageNumber++;
    				            storeApi.fetchProducts(company, nextPage, pageNumber, products, callback); 
    				            
    			        } else {
    			            if (typeof(callback) == "function"){
    			                callback(products);   
    			            }
    			        }
                    }
				        
				    
				}catch(err){
				    // do nothing
				    console.log("Whoops ran into a problem: " + err);
				    
				    if (typeof(callback) == "function"){
				        callback(products);   
				    }
				}
		    }
        });
	},
	
	populateProducts: function(company, data, url){	   	   
		var home = url.substring(0, url.indexOf("/", url.indexOf(".")));		
		var products = {};
		var companyScript = company.replace(/[\s_&]/g,'');
		
		if (data.indexOf("{") != 0){
		      data = $("<html>").html(data);
		}
		
		switch(companyScript){
			case "Gap":
			case "OldNavy":
			case "BananaRepublic":
			case "Piperlime":
			case "Athleta":
				products = storeApi.getGapJson(data, home);
				break;			
			default:
			    console.log(companyScript);			    
			    products = storeApi['get' + companyScript](data, home);
			    break;										
		}	
		
		return products;
	},
	
	
	getGapJson: function(data, siteHome){
			var json = $.parseJSON(data);
			var products = new Object();
	  		var cid = json.productCategoryFacetedSearch.productCategory.businessCatalogItemId;
			var vid = 1;
	
	        
			if(json.productCategoryFacetedSearch.productCategory.childCategories != null){
				if(json.productCategoryFacetedSearch.productCategory.childCategories.length > 1){	
					$.each(json.productCategoryFacetedSearch.productCategory.childCategories, function(){
	  		
						$.each(this.childProducts, function(){								
							var pid = this.businessCatalogItemId;
						      
						    if (pid != null){
    							var item = new Object();
    							item.image = this.quicklookImage.path;	
    							item.link = siteHome + "/browse/product.do?cid="+cid+"&vid="+vid+"&pid="+pid;	
    							item.name = this.name;
    							item.price = this.price.currentMinPrice;	
    							item.price = storeApiHelper.findPrice(item.price);
    							item.sku = 'g' + this.businessCatalogItemId;
    				
    							if(storeApiHelper.checkForProductImage(item.image)){			
    								var itemid = item.sku.replace(/-\W/g, '');
    								products[itemid] = item;
    							}
						    }
						});
					});
				}else if (json.productCategoryFacetedSearch.productCategory.childCategories.childProducts != null){
					$.each(json.productCategoryFacetedSearch.productCategory.childCategories.childProducts, function(){
                                            var pid = this.businessCatalogItemId;
                                            
                                            if (pid != null){
                                                var item = new Object();
                                                item.image = this.quicklookImage.path;
                                                item.link = siteHome + "/browse/product.do?cid="+cid+"&vid="+vid+"&pid="+pid;
                                                item.name = this.name;
                                                item.price = this.price.currentMinPrice;
                                                item.price = storeApiHelper.findPrice(item.price);
                                                item.sku = 'g' + this.businessCatalogItemId;

                                                if(storeApiHelper.checkForProductImage(item.image)){
                                                        var itemid = item.sku.replace(/-\W/g, '');
                                                        products[itemid] = item;
                                               }
                                            }
	                                       
	                                });		
				}
			}else if(json.productCategoryFacetedSearch.productCategory.childProducts != null){
				$.each(json.productCategoryFacetedSearch.productCategory.childProducts, function(){
	                        	var pid = this.businessCatalogItemId;
	   
	                            if (pid){
	                                var item = new Object();
	                                item.image = this.quicklookImage.path;
	                                item.link = siteHome + "/browse/product.do?cid="+cid+"&vid="+vid+"&pid="+pid;
	                                item.name = this.name;
	                                item.price = this.price.currentMinPrice;
	                                item.price = storeApiHelper.findPrice(item.price);
	                                item.sku = 'g' + this.businessCatalogItemId;
	
	                                if(storeApiHelper.checkForProductImage(item.image)){
	                                	var itemid = item.sku.replace(/-\W/g, '');
	                                        products[itemid] = item;
	                                }
	                            }
	                        });
			}
	        
		return products;
	},
	    
	getJCrew: function(data, siteHome){	
		siteHome += "?iNextCategory=-1";
	  	var products = new Object();   		
	  	
	  	storeApiHelper.checkForProductListing("jc", $(data).find(".arrayProdCell"));
	  	
		$(data).find(".arrayProdCell").each(function(){
		  if (storeApiHelper.isProductAvailable(this)){
			var item = new Object();	
			
			item.image = $(this).find(".arrayImg").find("img").attr("src");			
			item.link = $(this).find(".arrayImg").find("a").attr("href");			
			item.name = $(this).find(".arrayProdName").find("a").text().trim();				
			var price = $(this).find(".arrayProdPrice").text().trim();
			priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
			item.price = priceArr[priceArr.length -1];					
			item.price = storeApiHelper.findPrice(item.price);				     			
			
			if(storeApiHelper.checkForProductImage(item.image)){    
			    item.sku = 'jc' + item.link.substring(item.link.lastIndexOf("/")+1, item.link.lastIndexOf("."));
			    
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		  }
		});
											
		return products;	
	},
	    
	getAnnTaylor: function(data, siteHome){
	 	var products = new Object();
	 	
	 	storeApiHelper.checkForProductListing("at", $(data).find(".product"));
	 		   		
		$(data).find(".product").each(function(){
		  if (storeApiHelper.isProductAvailable(this)){
			var item = new Object();
			
			item.image = $(this).find(".thumb").children("img").first().attr("src");
			item.link = siteHome + $(this).find(".overlay > a.clickthrough").first().attr("href");			
			item.name = $(this).find(".overlay > .fg > .description > .messaging > p").not(".POS").first().text().trim();		
			item.price = $(this).find(".overlay > .fg > .description > .price > p").not(".was").first().text().trim();
			item.price = storeApiHelper.findPrice(item.price);
			
			var url = item.link.substring(0, item.link.indexOf("?"));
            item.sku = 'at' + url.substring(url.lastIndexOf("/")+1);
			
			if(storeApiHelper.checkForProductImage(item.image)){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		  }
		});
											
		return products;
	},
	
	    
	getLoft: function(data, siteHome){
		 var products = new Object();
		 
		 storeApiHelper.checkForProductListing("loft", $(data).find(".products").find(".product"));
		 		    		
		$(data).find(".products").find(".product").each(function(){
		  if (storeApiHelper.isProductAvailable(this)){
			var item = new Object();
			
			item.image = $(this).find(".thumb").children("img").first().attr("src");				
			item.link = siteHome + $(this).find(".overlay > a.clickthrough").first().attr("href");			
			item.name = $(this).find(".description > .messaging > p").not(".POS").first().text().trim();				
			item.price = $(this).find(".description > .price > p").not(".was").first().text().trim();
			item.price = storeApiHelper.findPrice(item.price);
			
			var url = item.link.substring(0, item.link.indexOf("?"));
            item.sku = 'l' + url.substring(url.lastIndexOf("/")+1);
			
			if(storeApiHelper.checkForProductImage(item.image)){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		  }
		});
											
		return products;
	},
	    	
	getUrbanOutfitters: function(data, siteHome){
	    var products = new Object();
	    
	    storeApiHelper.checkForProductListing("urban", $(data).find("#category-products").children());
	    		    		
		$(data).find("#category-products").children().each(function(){
		  if (storeApiHelper.isProductAvailable(this)){
			var item = new Object();
					
			item.image = $(this).find(".category-product-image > a > img").first().attr("src");				
			item.link = siteHome + $(this).find(".category-product-image > a").first().attr("href");			
			item.name = $(this).find(".category-product-description > h2 > a").first().text().trim();				
			item.price = $(this).find(".category-product-description > .price").first().text().trim();	
			item.price = storeApiHelper.findPrice(item.price);	        
	
			if(storeApiHelper.checkForProductImage(item.image)){
			    item.sku = 'uo' + item.link.substring(item.link.indexOf("id=")+3, item.link.indexOf("&"));
			    
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		  }
		});
											
		return products;
	},
	    
	getZara: function(data, siteHome){
		var products = new Object();
	    	$(".currency").html("");
	    	
	    storeApiHelper.checkForProductListing("zara", $(data).find("#product-list").children(".product"));			
	      	  		
		$(data).find("#product-list").children(".product").each(function(){
		  if (storeApiHelper.isProductAvailable(this)){
			var item = new Object();
			
			item.image = $(this).find("a.gaProductDetailsLink > img").first().attr("data-src");
			item.link = $(this).find("a.gaProductDetailsLink").first().attr("href");			
			item.name = $(this).find(".product-info > a.name").first().text().trim();			
			
			var price = $(this).find(".product-info > .price span").first().attr("data-ecirp");
			
			if (price != null){			
    			price = price.replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
                
        	    item.price = storeApiHelper.getLowestPrice(priceArr);     
        		item.price = storeApiHelper.findPrice(item.price);  
			}
							
			item.sku = 'z' + $(this).find("a.gaProductDetailsLink").first().attr("data-item");
			
			if(storeApiHelper.checkForProductImage(item.image)){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		  }
		});
											
		return products;
	},
	
	getHM: function(data, siteHome){
		siteHome += "&size=1000";
		var products = new Object();
		
		storeApiHelper.checkForProductListing("hm", $(data).find("#list-products").children("li").not(".getTheLook"));
	      	  		
		$(data).find("#list-products").children("li").not(".getTheLook").each(function(){
		  if (storeApiHelper.isProductAvailable(this)){
			var item = new Object();
			
			item.image = $(this).find(".image > img:nth-child(2)").first().attr("src");
			item.link = $(this).find("a").first().attr("href");			
			item.price = $(this).find("a > .price").first().text().trim();
			item.price = storeApiHelper.findPrice(item.price);
			$(this).find("a > .details > .price").first().remove();
			item.name = $(this).find("a > .details").first().text().trim();	
			item.sku = 'hm' + $(this).find("button.quicklook").first().attr("data-product");				
			
			if(storeApiHelper.checkForProductImage(item.image)){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		  }
		});
											
		return products;
	},
	
	getToryBurch: function(data, siteHome){
	        var products = new Object();
	        
	        storeApiHelper.checkForProductListing("tb", $(data).find("#search > .productresultarea > .productlisting > .product"));
	
	        $(data).find("#search > .productresultarea > .productlisting > .product").each(function(){
	           if (storeApiHelper.isProductAvailable(this)){
	                var item = new Object();
	
	                item.image = $(this).find(".image .product-image-primary").attr("src");
	                item.link = $(this).find(".image").find("a").first().attr("href");
	                item.price = $(this).find(".pricing > .price").first().text().trim();
	                item.price = storeApiHelper.findPrice(item.price);
	                item.name = $(this).find(".name").find("a").first().text().trim();	                
	
	                if(storeApiHelper.checkForProductImage(item.image)){
	                   item.sku = item.link.substring(item.link.lastIndexOf("/")+1);
	                   
	                   if (item.sku.indexOf("?")){
	                       item.sku = item.sku.substring(0, item.sku.indexOf("?"));
	                   }
	                   
	                   if (item.sku.indexOf(".")){
	                       item.sku = item.sku.substring(0, item.sku.indexOf("."));
	                   }
	                   
	                   item.sku = 'tb' + item.sku;	                    
	                   
				       var itemid = item.sku.replace(/-\W/g, '');
	                   products[itemid] = item;
	                }
	           }
	        });
	
	        return products;
	},
	
	
	// Needs to iterate over urls 
	// &page=2&startValue=51
	getAnthropologie: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("a", $(data).find(".category-item"));
	
       $(data).find(".category-item").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".imageWrapper img").first().attr("data-original");
                item.link = siteHome + $(this).find(".imageWrapper a").first().attr("href");                
                item.price = $(this).find(".item-description > .item-price > .price").first().text();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".item-description a").first().attr("title");

                if(storeApiHelper.checkForProductImage(item.image)){
                    
                   var sku = $(this).find(".imageWrapper a").first().attr("id");  
                   item.sku = 'a' + sku.replace(/\D/g, ''); // strip all non numeric chars
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getBloomingdales: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("b", $(data).find(".productThumbnail"));
	
       $(data).find(".productThumbnail").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.link = $(this).find(".productImages a").first().attr("href");                
                item.price = $(this).find(".prices .netPrice").first().val();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".shortDescription a").first().text();
                
                var imageUrl = $(this).find(".productImages img").first().attr("src");                
                
                if (imageUrl.indexOf("src=is{$b$") > 0){
                    var baseUrl = imageUrl.substring(0, imageUrl.indexOf("?"));    
                    var pStart = imageUrl.indexOf("src=is{$b$");
                    var productUrl = imageUrl.substring(pStart+10, imageUrl.indexOf("}", pStart));                    
                    item.image = baseUrl + "products/" + productUrl;   
                }else{
                    item.image = imageUrl;
                }

                if(storeApiHelper.checkForProductImage(item.image)){
                    
                   var sku = $(this).attr("id");  
                   item.sku = 'b' + sku.replace(/\D/g, ''); // strip all non numeric chars
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getIntermix: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("i", $(data).find(".thumbtext"));
	
       $(data).find(".thumbtext").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".thumbcontainer img").first().attr("src");
                item.link = siteHome + $(this).find(".thumbcontainer a").first().attr("href");                
                item.price = $(this).find(".thumbInfo > .thumbPricing > #productPricing").first().text().trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".thumbcontainer img").first().attr("alt");

                if(storeApiHelper.checkForProductImage(item.image)){
                    
                   var sku = $(this).find(".qveThumbnail").attr("catpk");
                   item.sku = 'i' + sku.replace(/\D/g, ''); // strip all non numeric chars
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getMadewell: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("m", $(data).find(".arrayProdCell"));
	
       $(data).find(".arrayProdCell").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".arrayImg img").first().attr("src");
                item.link = $(this).find(".arrayImg a").first().attr("href");                
                item.price = $(this).find(".arrayCopy .arrayProdPrice").text().replace(/([a-zA-Z$ ])*(\s)+/g, ' ').trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".arrayImg img").first().attr("alt");

                if(storeApiHelper.checkForProductImage(item.image)){
                                    
                   var sku = item.link.substring(item.link.lastIndexOf("/")+1, item.link.lastIndexOf("."));                    
                   item.sku = 'm' + sku.replace(/\D/g, ''); // strip all non numeric chars
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getBrooksBrothers: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("bb", $(data).find(".grid-tile"));
	
       $(data).find(".grid-tile").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".product-image img").first().attr("src");
                item.link = siteHome + $(this).find(".product-image a").first().attr("href");                
                item.price = $(this).find(".product-pricing .price-value").text().trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".product-image a").first().attr("alt");

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'bb' + $(this).attr("data-item-id");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getNordstrom: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("n", $(data).find(".fashion-item"));
	
       $(data).find(".fashion-item").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".fashion-photo img").first().attr("data-original");
                item.link = siteHome + $(this).find(".info a").first().attr("href");                
                item.price = $(this).find(".info > .price.regular").text().trim();
                item.price += " " + $(this).find(".info > .price.sale").text().trim();
                item.price = item.price.trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".fashion-photo img").first().attr("alt");

                if(storeApiHelper.checkForProductImage(item.image)){
                   var sku = $(this).attr("id");
                   item.sku = 'n' + sku.replace(/\D/g, ''); // strip all non numeric chars
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getAmericanApparel: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("aa", $(data).find(".product"));
	
       $(data).find(".product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".product-img").first().attr("src");
                item.link = siteHome + $(this).find(".name a").first().attr("href");                
                item.price = $(this).find(".pricing").text().replace(/([a-zA-Z$ ])*(\s)+/g, ' ').trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".name a").first().text();

                if(storeApiHelper.checkForProductImage(item.image)){
                   var sku = $(this).find(".product-img").first().attr("id");                   
                   item.sku = 'aa' + sku.substring(sku.indexOf("_")+1); 
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
    getLordTaylor: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("lt", $(data).find("#ProductsList #totproductsList").children("li"));
	
       $(data).find("#ProductsList #totproductsList").children("li").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".pro_pic img").first().attr("data-original");
                var js_link = $(this).find(".catEntryDisplayUrlScript").first().text();
                item.link = js_link.substring( js_link.indexOf("http"), js_link.indexOf(")") -1);                                                                                 
                item.price = $(this).find(".pro_price_black").text().trim();
                item.price += " " + $(this).find(".pro_price_red").text().replace(/[a-zA-Z]*/g,'').trim();
                item.price = item.price.trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".pro_pic img").first().attr("alt");

                if(storeApiHelper.checkForProductImage(item.image)){
                   var sku = $(this).find(".pro_pic").attr("id");
                   item.sku = 'll' + sku.replace(/\D/g, ''); // strip all non numeric chars
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getBCBG: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("bcbg", $(data).find(".grid-tile"));
	
       $(data).find(".grid-tile").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".product-image .thumb-link img").first().attr("src");
                item.link = $(this).find(".product-image a.thumb-link").first().attr("href");
                item.price = $(this).find(".product-pricing .normal-price").text().trim();
                item.price += " " + $(this).find(".product-pricing .product-sales-price").text().trim();
                item.price = item.price.trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".product-image .thumb-link img").first().attr("alt");

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'bcbg' + $(this).find(".product-tile").attr("data-itemid");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getCharlesTyrwhitt: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ct", $(data).find(".prodcontainer"));
	
       $(data).find(".prodcontainer").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".img img").first().attr("src");
                item.link = siteHome + $(this).find("a.img").first().attr("href");
                item.name = $(this).find("h3 a").first().text().trim();
                var price = $(this).find(".price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);                           

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ct' + $(this).attr("id");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getLululemon: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("lll", $(data).find(".product").not(".video"));
	
       $(data).find(".product").not(".video").each(function(){                        
            var price = $(this).find(".amount").text().replace(/[a-zA-Z]*/g,'').trim();
            var name = $(this).attr("title").trim();
            
            $(this).find(".product-images > li").each(function(){
                if (storeApiHelper.isProductAvailable(this)){
                    var item = new Object();
                    item.price = storeApiHelper.findPrice(price);
                    item.name = name;
                    item.link = siteHome + $(this).find("a").first().attr("href");
                    item.image = $(this).find("img").first().attr("src");
                    
                    if(storeApiHelper.checkForProductImage(item.image) && item.image.indexOf("_1") > 0){
                        
                        item.sku = 'lll' + $(this).attr("class").replace(/\D/g, ''); // strip all non numeric chars
                        var itemid = item.sku.replace(/-\W/g, '');   
    			        
    			        if (products[itemid] == null){
                            products[itemid] = item;
    			        }
                    } 
                }
            });                                
        });

        return products;
	},
	
	getTarget: function(data, siteHome){
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("t", $(data).find("#productListing .tile"));
	
       $(data).find("#productListing .tile").each(function(){     
           if (storeApiHelper.isProductAvailable(this)){       
                var item = new Object();
    
                item.image = $(this).find(".tileImage img.tileImage").first().attr("original");
                item.link = $(this).find(".tileInfo .productTitle > a").first().attr("href");
                item.name = $(this).find(".tileInfo .productTitle > a").first().text().trim();
                var price = $(this).find(".tileInfo .pricecontainer .price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);                           
    
                if(storeApiHelper.checkForProductImage(item.image)){
                    //http://www.target.com/p/denizen-men-s-regular-fit-jeans/-/A-14711092#prodSlot=medium_1_1
                    
                    var id = item.link;
                    
                    if (item.link.indexOf("#") > 0){
                        id = id.substring(0, id.indexOf("#"));
                    }
                    
                    if (item.link.indexOf("?") > 0){
                        id = id.substring(0, id.indexOf("?"));
                    }
                    
                    id = id.substring(id.lastIndexOf("/"));
                    
                    item.sku = 't' + id;
                    
    		        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
           }
        });

        return products;
	},
	
	getTopShop: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ts", $(data).find("#wrapper_page_content .product"));
	
       $(data).find("#wrapper_page_content .product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".product_image img").first().attr("src");
                item.link = $(this).find(".product_image a").first().attr("href");
                item.name = $(this).find(".product_description a").first().text().trim();
                var price = $(this).find(".product_price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);                           

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ts' + $(this).find(".product_image a").first().attr("data-productid");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getKateSpade: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ks", $(data).find("#search-result-items .grid-tile .product-tile"));
	
       $(data).find("#search-result-items .grid-tile .product-tile").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".product-image img.first-img").first().attr("data-baseurl");
                item.link = $(this).find(".product-image a").first().attr("href");
                item.name = $(this).find(".product-name a.name-link").first().text().trim();
                var price = $(this).find(".product-name .product-price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);                           

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ks' + $(this).attr("data-itemid");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getNeimanMarcus: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("nm", $(data).find(".products .product"));
	
       $(data).find(".products .product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".productImageContainer img.productImage").first().attr("src");
                item.link = siteHome + $(this).find(".productImageContainer a.prodImgLink").first().attr("href");
                item.name = $(this).find(".details .productname a.recordTextLink").first().text().trim();
                var price = $(this).find(".details .allpricing").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);
    			item.price = storeApiHelper.findPrice(item.price);           
    			
    			//item.designer = $(this).find(".details .productdesigner a").first().text().trim();

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'nm' + $(this).find(".qv-tip").attr("product_id");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getFreePeople: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("fp", $(data).find("#products ul li"));
	
       $(data).find("#products ul li").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".media img").first().attr("src");
                item.link = $(this).find(".media a").first().attr("href");
                item.name = $(this).find(".info .name a").first().text().trim();
                var price = $(this).find(".info .offers .price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);               			

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'fp' + $(this).find(".wl-product-thumbnail").attr("data-stylenumber");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getMacys: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ma", $(data).find("#macysGlobalLayout #thumbnails .productThumbnail"));
	
       $(data).find("#macysGlobalLayout #thumbnails .productThumbnail").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("img.thumbnailMainImage").first().attr("src");
                item.link = siteHome + $(this).find(".shortDescription a.productThumbnailLink").first().attr("href");
                item.name = $(this).find(".shortDescription a.productThumbnailLink").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".prices").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ma' + $(this).attr("id").replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getJCPenney: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("jp", $(data).find(".product_gallery_holder2 .product_holder"));
	
       $(data).find(".product_gallery_holder2 .product_holder").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".product_image img").first().attr("src");
                item.link = siteHome + $(this).find(".product_image a").first().attr("href");
                item.name = $(this).find(".detail a").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".gallery_page_price").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'jp' + $(this).attr("id").replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getNewYorkCompany: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ny", $(data).find(".product"));
	
       $(data).find(".product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("img").first().attr("src");
                item.link = siteHome + $(this).find("a").first().attr("href");
                item.name = $(this).find(".info-container .name > a").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".info-container .price").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ny' + item.link.substring(item.link.indexOf("-prod")+5).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getBurberry: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("bu", $(data).find("li.product"));
	
       $(data).find("li.product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".aspect-inner img").first().attr("data-src");
                item.link = siteHome + $(this).find("a.product-link").first().attr("href");
                item.name = $(this).find("a.product-link").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".product-details .product-price").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   if($(this).find("a.product-link").first().attr('data-product-id') != null){ 
                    
                       item.sku = 'bu' + $(this).find("a.product-link").first().attr('data-product-id').replace(/\D/g, ''); // strip all non numeric chars;
                       
    			        var itemid = item.sku.replace(/-\W/g, '');
                        products[itemid] = item;
                   }
                }
            }
        });

        return products;
	},
	
	getHollister: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ho", $(data).find("li.product-wrap"));
	
       $(data).find("li.product-wrap").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(".image-wrap img").first().attr("data-src");
                item.link = siteHome + $(this).find(".product-info .name a").first().attr("href");
                item.name = $(this).find(".product-info .name a").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".product-info .price").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ho' + $(this).find("div").first().attr('data-productid').replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getKohls: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ko", $(data).find("#product-matrix .product"));
	
       $(data).find("#product-matrix .product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("a.image-holder-s img").first().attr("src");
                    
                if (item.image == null || item.image.trim() == "" || item.image.indexOf("x.gif") > 0){
                    item.image = $(this).find("a.image-holder-s img").first().attr("data-original");       
                }
                
                item.link = siteHome + $(this).find("a.image-holder-s").first().attr("href");
                item.name = $(this).find(".pmi-wrap .product-info a").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".pmi-wrap .product-info").find(".price-original, .sale_add").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ko' + item.link.substring(item.link.indexOf("-")+1, item.link.indexOf("/", item.link.indexOf("-"))).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getForever21: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("fo", $(data).find(".ItemImage"));
	
       $(data).find(".ItemImage").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("a img").first().attr("src");
                item.link = $(this).find("a").first().attr("href");
                item.name = $(this).parents("table").first().find(".DisplayName").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).parents("table").first().find(".price").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'fo' + item.link.substring(item.link.indexOf("ProductID=")+10, item.link.indexOf("&", item.link.indexOf("ProductID"))).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getDillards: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("di", $(data).find(".item"));
	
       $(data).find(".item").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("a.img img").first().attr("data-src_large");
                item.link = siteHome + $(this).find("a.img").first().attr("href");
                item.name = $(this).find(".info .productInfo .productName").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".info .productInfo .price").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'di' + $(this).find("a.img").attr("id").replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getAmericanEagle: function(data, siteHome){	   
	   var products = new Object();	   	   
	   	   
	   var productListing = $(data).find(".sProd");
	   
	   if (products.length <= 0){
            var noscript = $(data).find("#facetResults noscript").text();  
            productListing = $(noscript).siblings(".sProd");      
	   }
       
       storeApiHelper.checkForProductListing("ae", productListing);
	
       productListing.each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("a .image img").not(".hidden").first().attr("src");
                item.link = siteHome + $(this).find("a").first().attr("href");
                item.name = $(this).find("a .equity .name").first().text().trim();                
    			var dollars = $(this).find("a .equity .price .dollars").text().trim();
    			var cents = $(this).find("a .equity .price .cents").text().trim();
    			item.price = storeApiHelper.findPricesAndGetLowest(dollars + "." + cents);
                // var listedPrice = $(this).find("a .equity .listPrice").text().trim();

                if(storeApiHelper.checkForProductImage(item.image)){
                   var id = $(this).attr("data-product-id") + "_" + $(this).attr("data-color-id");
                   item.sku = 'ae' + id.replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getNike: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ni", $(data).find(".product-wall .grid-item"));
	
       $(data).find(".product-wall .grid-item").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("grid-item-image img").first().attr("src");
                item.link = $(this).attr("data-pdpurl");
                item.name = $(this).find(".grid-item-info-wrapper .product-name .griditem-display-name").first().text().trim();                    
                var prices = $(this).find(".grid-item-info-wrapper .product-price-wrapper .prices");
    			item.price = storeApiHelper.findPricesAndGetLowest(prices);

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ni' + item.link.substring(item.link.indexOf("pid-")+4).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getMichaelKors: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("mk", $(data).find(".products .productstart, .products .product"));
	
       $(data).find(".products .productstart, .products .product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("a.prodImgLink .productImage").first().attr("src");
                item.link = siteHome + $(this).find("a.prodImgLink").attr("href");
                item.name = $(this).find("p .productlink").first().text().trim();                    
                var prices = $(this).find("p.priceadorn").text().trim();
    			item.price = storeApiHelper.findPricesAndGetLowest(prices);

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'mk' + $(this).attr("id").replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getChicos: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ch", $(data).find("#shelfProducts .product-capsule"));
	
       $(data).find("#shelfProducts .product-capsule").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = siteHome + $(this).find("img.product-image").first().attr("src");
                item.link = siteHome + $(this).find(".product-information a.product-name").attr("href");
                item.name = $(this).find(".product-information a.product-name").first().text().trim();                    
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".product-information .product-price").text());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ch' + item.link.substring(item.link.indexOf("productId=")+10, item.link.indexOf("&", item.link.indexOf("productId="))).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getCusp: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("cu", $(data).find(".products .product"));
	
       $(data).find(".products .product").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find("a.prodImgLink .productImage").first().attr("src");
                item.link = siteHome + $(this).find("a.prodImgLink").attr("href");
                item.name = $(this).find(".details .productname a").first().text().trim();                    
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".details .allPricing").text());
    			//item.designer = $(this).find(".details .productdesigner a").first().text().trim();

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'cu' + $(this).attr("id").replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},
	
	getJJill: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("jj", $(data).find(".itemlink"));
	
       $(data).find(".itemlink").each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();
                    
                var product = $(this).parent();    
                item.image = product.find("img").first().attr("src");
                item.link = siteHome + $(this).attr("href");
                item.name = $(this).text().trim();                                    
    			item.price = storeApiHelper.findPricesAndGetLowest(product.find(".normalsmall").text());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'jj' + item.link.substring(item.link.indexOf("item=")+5, item.link.indexOf("&", item.link.indexOf("item="))); 
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	},


	getStore: function(company, data, siteHome){	   
	   var products = new Object();
	   var store = Companies[company];
	   
	   storeApiHelper.checkForProductListing(store.id, $(data).find(store.itemListing));
	
       $(data).find(store.itemListing).each(function(){
            if (storeApiHelper.isProductAvailable(this)){
                var item = new Object();

                item.image = $(this).find(store.image).first().attr(store.imageAttr);
                item.link = siteHome + $(this).find(store.link).attr(store.linkAttr);
                
                var nameElement = store.name == null ? $(this) : $(this).find(store.name).first();
                nameElement.attr("text",nameElement.text());
                item.name = nameElement.attr(store.nameAttr).trim();   
                
                var priceElement = store.price == null ? $(this) : $(this).find(store.price);                 
                priceElement.attr("text",priceElement.text())
    			item.price = storeApiHelper.findPricesAndGetLowest(priceElement.attr(store.priceAttr));
    			
    			//item.designer = $(this).find(".details .productdesigner a").first().text().trim();

                if(storeApiHelper.checkForProductImage(item.image)){
                   var skuElement = store.sku == null ? $(this) : $(this).find(store.sku);
                   item.sku = store.id + skuElement.attr(store.skuAttr).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
            }
        });

        return products;
	}
}

// TODO: MOVE ALL FUNCTIONS TO USE THIS COMPANY LISTING AND TO CALL storeApi.getStore()
Companies = {
    'Cusp': {
        'id': 'cu',
        'itemListing': '.products .product',
        
        'image': 'a.prodImgLink .productImage',
        'imageAttr': 'src',
        
        'link': 'a.prodImgLink',
        'linkAttr': 'href',
        
        'name': '.details .productname a',
        'nameAttr': 'text',
        
        'price': '.details .allPricing',
        'priceAttr': 'text',
        
        'sku': null,
        'skuAttr': 'id',
        'skuKeepOnlyNumeric': true        
    }  
};

NextPageSelector = {    
    "AmericanApparel": null,
    "AmericanEagle": null,
    "AnnTaylor": ".pages a.next",
    "Anthropologie": null,
    "Athleta": null,
    "BananaRepublic": null,
    "BCBG": ".first-last a.page-next",
    "Bloomingdales": "#topRightArrow.nextArrow", 
    "BrooksBrothers": null,
    "Burberry": null,
    "CharlesTyrwhitt": ".all",
    "Chicos": "#pagination a.next",
    "Cusp": null, // onclick event, but lots of pages 
    "Dillards": ".next",
    "Forever21": "img#arrowNext",
    "FreePeople": ".next.page a.arrow",
    "Gap": null,
    "HM": ".pages .next",
    "Hollister": null,
    "Intermix": null,
    "JCPenney": "#paginationIdTOP a[title='next page']",
    "JCrew": ".paginationTop .pageNext",
    "JJill": null, // ".result-nav #(end with _sNextTop) a",
    "KateSpade": null,
    "Kohls": "a.next-set",
    "Loft": ".pages .next",
    "Lululemon": null,
    "LordTaylor": null,
    "Macys": "#paginationTop .arrowRight",
    "Madewell": null,
    "MichaelKors": ".pagination .nextpage",
    "NeimanMarcus": null, // "$(.nextarrow).prev()"
    "Nike": null,
    "Nordstrom": ".next",
    "NewYorkCompany": ".nav .next",
    "OldNavy": null,
    "Piperlime": null,
    "Target": ".pagination-item.next",
    "TopShop": ".show_next",
    "ToryBurch": null,
    "UrbanOutfitters": null, // "$(.category-pagination-pages a).last()"
    "Zara": null
};

storeApiHelper = {  
    debug: false,
      
    findPricesAndGetLowest: function(price){
        if (price != null && (price + "").trim() != ""){
            price = price.replace(/[a-zA-Z£$:,]*/g,'');
            var priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
        	price = storeApiHelper.getLowestPrice(priceArr);     
        	price = storeApiHelper.findPrice(price); 
        	
        	return price;
        }              	
        
        return null;		
    },
        
    findPrice: function(price){
        if (price == null){
            return null;   
        }
        
        var priceArray = (price + "").trim().split(/[\s-]+/);
		return parseFloat(priceArray[priceArray.length - 1].replace(/[^0-9\.]+/g,""));   
    },
    
    getLowestPrice: function(priceArray){
        var maxInt = 999999;
        var min = maxInt;
        
        for (var i=0; i < priceArray.length; i++){
               var num = parseFloat(priceArray[i]);
               if (!isNaN(num) && num < min ){
                    min = num;
               }else if(i == 0 && !isNaN(parseFloat(priceArray[i+1]))){
                    min = parseFloat(priceArray[i+1]);
               }
        }   
        
        return min == maxInt ? null : min;
    },
    
    replaceParameter: function (url, paramName, paramValue){
    	var start = url.indexOf(paramName + "=");	
    	var end = url.indexOf("&", start);
        var newurl;
    
    	if (start > 0){
    		newurl = url.substring(0, start); 
    		newurl += paramName + "=" + paramValue;
    
    		if (end > 0){
    			newurl += url.substring(end);
    		}
    	}else{
    		newurl = url;
    
    		if (url.indexOf("?") > 0){
    			newurl += "&";
    		}else{
    			newurl += "?";
    		}
    
    		newurl += paramName + "=" + paramValue;
    	}
    
    	return newurl;
    },
    
    checkForProductListing: function(storeCode, element){
        if (element == null || element.length <= 0){
            console.log(storeCode + ": Store api could NOT find product listing.");                           
            Messenger.error("Error: Could not find any products. Check to make sure this link is still active.");
        }else{
            console.log(storeCode + ": Store FOUND products listing!");   
        }
        
        if (storeApiHelper.debug){
            ;debugger;   
        }
    },
    
    checkForProductImage: function(image){
           if (image != undefined && image != null){
                return true;
           }
           
           console.log("Image does not exist for this product");
           return false;
    },
    
    isProductAvailable: function(product){        
        
        var unavailableKeyWords = $(product).find('p,div,a,span,i,strong,b,h1,h2,h3,h4,h5,h6').filter(function(){ 
                return $(this).text().trim().length < 100 &&
                       new RegExp(storeApi.unavaiableTerms.join("|")).test($(this).text().toLowerCase());
        });
        
        if (unavailableKeyWords.length > 0){
           console.log("Product is out of stock");     
        }
                
        return unavailableKeyWords.length <= 0;
    },
    
    getNextPageUrl: function(company, data, url){
        var companyName = company.replace(/[\s_&]/g,'');
        var nextPage = $(data).find(NextPageSelector[companyName]).first().find("a").attr("href"); 
        
        if (nextPage == null){
            nextPage = $(data).find(NextPageSelector[companyName]).first().attr("href");    
            
            if (nextPage == null){
                nextPage = $(data).find(NextPageSelector[companyName]).first().parents("a").attr("href");    
            }
        }
        
        if (nextPage != null){
            
            // If its a relative url
            if (nextPage.indexOf("//") != 0 &&  
                nextPage.indexOf("http") != 0 &&
                nextPage.indexOf("www.") != 0){
                    var home = url.substring(0, url.indexOf("/", url.indexOf(".")));                    
                    nextPage = home + nextPage;		
                }
        }
        
        return nextPage;            
    },
    
    validateProduct: function(product){        
        var isValid = false;
                       	        
        if (product != null &&
            product.price != null && 
            product.image != null && 
            product.link != null && 
            product.name != null &&
            product.sku != null){				 
                
                var price = product.price + "";
                price = parseFloat(price.replace("$",""));
		        price = parseFloat(price);
		        
		        if(isNaN(price)){       				        
			        console.log("Product ("+i+") price is not a number");           			            
		        
		        }else if(price < 3){
		          console.log("Product ("+i+") price seems too small");           			            
		        
		        }else if(price > 20000){
		          console.log("Product ("+i+") price seems too large");           			            
		            
		        }else{       			          
		            return true;	                				               				        
		        }
        }else{                                
            if (product == null){
                console.log("Product ("+i+") is null");    
                
            }else{
            
                if (product.price == null){
                    console.log("Product ("+i+") price is null");    
                }
                
                if (product.image == null){
                    console.log("Product ("+i+") image is null");    
                }
                
                if (product.link == null){
                    console.log("Product ("+i+") link is null");    
                }
                
                if (product.name == null){
                    console.log("Product ("+i+") name is null");    
                }
                
                if (product.sku == null){
                    console.log("Product ("+i+") sku is null");    
                }    
            }                    				                
        }
    
        return false;
    } 
}
