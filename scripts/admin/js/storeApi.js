/* 
var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
*/

storeApi = {

	getFullUrl: function(company, url){
		var newUrl = "";		
		
		switch(company.toLowerCase()){		
			case "ann taylor":				
				var catid = url.indexOf("?") > 0 ? url.substring(url.lastIndexOf("catid") + 6) : url.substring(url.lastIndexOf("/") + 1);
                catid = url.indexOf("?") > 0 ? catid.substring(0, catid.indexOf("&")) : catid;
                newUrl = "http://www.anntaylor.com/ann/catalog/category.jsp?pageSize=1000&goToPage=1&catid=" + catid;
				break;
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
		    case "jcpenney":
		        newUrl = storeApiHelper.replaceParameter(url, "Nao", "96");
		        newUrl = storeApiHelper.replaceParameter(newUrl, "pageSize", "96");		        		        		        
		        newUrl = storeApiHelper.replaceParameter(newUrl, "pN", "1");		        
		        break;
		    case "new york & company":
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
	
	getProducts: function(company, data, url){	   	   
		var home = url.substring(0, url.indexOf("/", url.indexOf(".")));		
		var products = "";
		
		switch(company.toLowerCase()){
			case "gap":
			case "old navy":
			case "banana":
			case "banana republic":
			case "piperlime":
			case "athleta":
				products = storeApi.getGapJson(data, home);
				break;
			case "j_crew":
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
			case "h&m":
				products = storeApi.getHM(data, home);
				break;
			case "tory burch":
				products = storeApi.getToryBurch(data, home);
				break;
			case "anthropologie":
			    products = storeApi.getAnthropologie(data, home);
			    break;
			case "bloomingdales":
    			products = storeApi.getBloomingdales(data, home);
			    break;
			case "intermix":
			    products = storeApi.getIntermix(data, home);
			    break;
			case "madewell":
			    products = storeApi.getMadewell(data, home);
			    break;
			case "brooks brothers":
			    products = storeApi.getBrooksBrothers(data, home);
			    break; 
			case "nordstrom":
			    products = storeApi.getNordstrom(data, home);
			    break;  
			case "american apparel":			     
			    products = storeApi.getAmericanApparel(data, home);
			    break;  
			case "lord & taylor":			         
			    products = storeApi.getLordAndTaylor(data, home);
			    break;  
			case "bcbg":			
    			products = storeApi.getBCBG(data, home);
			    break;  
			case "charles tyrwhitt":
				products = storeApi.getCharlesTyrwhitt(data, home);
			    break;  
			case "lululemon":			 
    			products = storeApi.getLuLuLemon(data, home);
			    break;  
			case "target":
			    products = storeApi.getTarget(data, home);
			    break; 
			case "top shop":
			    products = storeApi.getTopShop(data, home);
			    break;  
			case "kate spade":			 
			    products = storeApi.getKateSpade(data, home);
			    break; 
			case "neiman marcus": 			
    			products = storeApi.getNeimanMarcus(data, home);
			    break; 
			case "free people":			
			    products = storeApi.getFreePeople(data, home);
			    break;
			case "macys":			
			    products = storeApi.getMacys(data, home);
			    break;
			case "jcpenney":			
			    products = storeApi.getJCPenney(data, home);
			    break; 
			case "new york & company":
			    products = storeApi.getNyAndCompany(data, home);
			    break;
			case "burberry":
			    products = storeApi.getBurberry(data, home);
			    break;
			case "hollister":
			    products = storeApi.getHollister(data, home);
			    break; 
			case "kohls":
			    products = storeApi.getKohls(data, home);
			    break;
			case "forever21":
			    products = storeApi.getForever21(data, home);
			    break;
			case "dillards":
			    products = storeApi.getDillards(data, home);
			    break;
			case "american eagle":
			    products = storeApi.getAmericanEagle(data, home);
			    break;
			case "nike":
			    products = storeApi.getNike(data, home);
			    break;
			case "michael kors":
			    products = storeApi.getMichaelKors(data, home);
			    break;
			case "chicos":
			    products = storeApi.getChicos(data, home);
			    break;
			case "cusp":
			    products = storeApi.getCusp(data, home);
			    break; 
			case "j_jill":
			    products = storeApi.getJJill(data, home);
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
	        
		return JSON.stringify(products);
	},
	    
	getJcrew: function(data, siteHome){	
		siteHome += "?iNextCategory=-1";
	  	var products = new Object();   		
	  	
	  	storeApiHelper.checkForProductListing("jc", $(data).find(".arrayProdCell"));
	  	
		$(data).find(".arrayProdCell").each(function(){
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
		});
											
		return JSON.stringify(products);	
	},
	    
	getAnnTaylor: function(data, siteHome){
	 	var products = new Object();
	 	
	 	storeApiHelper.checkForProductListing("at", $(data).find(".product"));
	 		   		
		$(data).find(".product").each(function(){
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
		});
											
		return JSON.stringify(products);
	},
	
	    
	getLoft: function(data, siteHome){
		 var products = new Object();
		 
		 storeApiHelper.checkForProductListing("loft", $(data).find(".products").find(".product"));
		 		    		
		$(data).find(".products").find(".product").each(function(){
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
		});
											
		return JSON.stringify(products);
	},
	    	
	getUrban: function(data, siteHome){
	    var products = new Object();
	    
	    storeApiHelper.checkForProductListing("urban", $(data).find("#category-products").children());
	    		    		
		$(data).find("#category-products").children().each(function(){
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
		});
											
		return JSON.stringify(products);
	},
	    
	getZara: function(data, siteHome){
		var products = new Object();
	    	$(".currency").html("");
	    	
	    storeApiHelper.checkForProductListing("zara", $(data).find("#product-list").children(".product"));			
	      	  		
		$(data).find("#product-list").children(".product").each(function(){
			var item = new Object();
			
			item.image = $(this).find("a.gaProductDetailsLink > img").first().attr("data-src");
			item.link = $(this).find("a.gaProductDetailsLink").first().attr("href");			
			item.name = $(this).find(".product-info > a.name").first().text().trim();			
			
			var price = $(this).find(".product-info > .price span").first().attr("data-ecirp");
			price = price.replace(/[a-zA-Z£$:]*/g,'').trim();
            priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    	    item.price = storeApiHelper.getLowestPrice(priceArr);     
    		item.price = storeApiHelper.findPrice(item.price);  
							
			item.sku = 'z' + $(this).find("a.gaProductDetailsLink").first().attr("data-item");
			
			if(storeApiHelper.checkForProductImage(item.image)){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	
	getHM: function(data, siteHome){
		siteHome += "&size=1000";
		var products = new Object();
		
		storeApiHelper.checkForProductListing("hm", $(data).find("#list-products").children("li").not(".getTheLook"));
	      	  		
		$(data).find("#list-products").children("li").not(".getTheLook").each(function(){
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
		});
											
		return JSON.stringify(products);
	},
	
	getToryBurch: function(data, siteHome){
	        var products = new Object();
	        
	        storeApiHelper.checkForProductListing("tb", $(data).find("#search > .productresultarea > .productlisting > .product"));
	
	        $(data).find("#search > .productresultarea > .productlisting > .product").each(function(){
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
	        });
	
	        return JSON.stringify(products);
	},
	
	
	// Needs to iterate over urls 
	// &page=2&startValue=51
	getAnthropologie: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("a", $(data).find(".category-item"));
	
       $(data).find(".category-item").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getBloomingdales: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("b", $(data).find(".productThumbnail"));
	
       $(data).find(".productThumbnail").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getIntermix: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("i", $(data).find(".thumbtext"));
	
       $(data).find(".thumbtext").each(function(){
                var item = new Object();

                item.image = siteHome + $(this).find(".thumbcontainer img").first().attr("src");
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
        });

        return JSON.stringify(products);
	},
	
	getMadewell: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("m", $(data).find(".arrayProdCell"));
	
       $(data).find(".arrayProdCell").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getBrooksBrothers: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("bb", $(data).find(".grid-tile"));
	
       $(data).find(".grid-tile").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getNordstrom: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("n", $(data).find(".fashion-item"));
	
       $(data).find(".fashion-item").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getAmericanApparel: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("aa", $(data).find(".product"));
	
       $(data).find(".product").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
    getLordAndTaylor: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("lt", $(data).find("#ProductsList #totproductsList").children("li"));
	
       $(data).find("#ProductsList #totproductsList").children("li").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getBCBG: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("bcbg", $(data).find(".grid-tile"));
	
       $(data).find(".grid-tile").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getCharlesTyrwhitt: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ct", $(data).find(".prodcontainer"));
	
       $(data).find(".prodcontainer").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getLuLuLemon: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("lll", $(data).find(".product").not(".video"));
	
       $(data).find(".product").not(".video").each(function(){            
            var price = $(this).find(".amount").text().replace(/[a-zA-Z]*/g,'').trim();
            var name = $(this).attr("title").trim();
            
            $(this).find(".product-images > li").each(function(){
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
            });                                
        });

        return JSON.stringify(products);
	},
	
	getTarget: function(data, siteHome){
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("t", $(data).find("#productListing .productsListView"));
	
       $(data).find("#productListing .productsListView").each(function(){            
            var item = new Object();

            item.image = $(this).find(".tileImage img.tileImage").first().attr("original");
            item.link = s$(this).find(".tileInfo .productTitle > a").first().attr("href");
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
        });

        return JSON.stringify(products);
	},
	
	getTopShop: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ts", $(data).find("#wrapper_page_content .product"));
	
       $(data).find("#wrapper_page_content .product").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getKateSpade: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ks", $(data).find("#search-result-items .grid-tile .product-tile"));
	
       $(data).find("#search-result-items .grid-tile .product-tile").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getNeimanMarcus: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("nm", $(data).find(".products .product"));
	
       $(data).find(".products .product").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getFreePeople: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("fp", $(data).find("#products ul li"));
	
       $(data).find("#products ul li").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getMacys: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ma", $(data).find("#macysGlobalLayout #thumbnails .productThumbnail"));
	
       $(data).find("#macysGlobalLayout #thumbnails .productThumbnail").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getJCPenney: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("jp", $(data).find(".product_gallery_holder2 .product_holder"));
	
       $(data).find(".product_gallery_holder2 .product_holder").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getNyAndCompany: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ny", $(data).find(".items_wrapper > ul > li"));
	
       $(data).find(".items_wrapper > ul > li").each(function(){
                var item = new Object();

                item.image = $(this).find("img").first().attr("src");
                item.link = siteHome + $(this).find(".product-details a").first().attr("href");
                item.name = $(this).find(".product-details a").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".product-details .original_price").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ny' + item.image.substring(item.image.lastIndexOf("/")+1, item.image.indexOf("?")).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getBurberry: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("bu", $(data).find("li.product"));
	
       $(data).find("li.product").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getHollister: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ho", $(data).find("li.product-wrap"));
	
       $(data).find("li.product-wrap").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getKohls: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ko", $(data).find("#product-matrix .product"));
	
       $(data).find("#product-matrix .product").each(function(){
                var item = new Object();

                item.image = $(this).find("a.image-holder-s img").first().attr("src");
                item.link = siteHome + $(this).find("a.image-holder-s").first().attr("href");
                item.name = $(this).find(".pmi-wrap .product-info a").first().text().trim();                
    			item.price = storeApiHelper.findPricesAndGetLowest($(this).find(".pmi-wrap .product-info .price-original").text().trim());

                if(storeApiHelper.checkForProductImage(item.image)){
                   item.sku = 'ko' + item.link.substring(item.link.indexOf("-")+1, item.link.indexOf("/", item.link.indexOf("-"))).replace(/\D/g, ''); // strip all non numeric chars;
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getForever21: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("fo", $(data).find(".ItemImage"));
	
       $(data).find(".ItemImage").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getDillards: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("di", $(data).find(".item"));
	
       $(data).find(".item").each(function(){
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
        });

        return JSON.stringify(products);
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
        });

        return JSON.stringify(products);
	},
	
	getNike: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ni", $(data).find(".product-wall .grid-item"));
	
       $(data).find(".product-wall .grid-item").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getMichaelKors: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("mk", $(data).find(".products .productstart, .products .product"));
	
       $(data).find(".products .productstart, .products .product").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getChicos: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("ch", $(data).find("#shelfProducts .product-capsule"));
	
       $(data).find("#shelfProducts .product-capsule").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getCusp: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("cu", $(data).find(".products .product"));
	
       $(data).find(".products .product").each(function(){
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
        });

        return JSON.stringify(products);
	},
	
	getJJill: function(data, siteHome){	   
	   var products = new Object();
	   
	   storeApiHelper.checkForProductListing("jj", $(data).find(".itemlink"));
	
       $(data).find(".itemlink").each(function(){
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
        });

        return JSON.stringify(products);
	}
}

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
        var priceArray = (price + "").trim().split(/[\s-]+/);
		return parseFloat(priceArray[priceArray.length - 1].replace(/[^0-9\.]+/g,""));   
    },
    
    getLowestPrice: function(priceArray){
        var min = parseFloat(priceArray[0]);
        for (var i=0; i < priceArray.length; i++){
               var num = parseFloat(priceArray[i]);
               if (!isNaN(num) && num < min ){
                    min = num;
               }else if(i == 0 && !isNaN(parseFloat(priceArray[i+1]))){
                    min = parseFloat(priceArray[i+1]);
               }
        }   
        
        return min;
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
    } 
}