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
		        newUrl = url + "&ppp=1000";																
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
			case "j crew":
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
			case "lord and taylor":			         
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
    				
    							if(item.image != undefined){			
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

                                                if(item.image != undefined){
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
	
	                                if(item.image != undefined){
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
	  	
		$(data).find(".arrayProdCell").each(function(){
			var item = new Object();	
			
			item.image = $(this).find(".arrayImg").find("img").attr("src");			
			item.link = $(this).find(".arrayImg").find("a").attr("href");			
			item.name = $(this).find(".arrayProdName").find("a").text().trim();				
			var price = $(this).find(".arrayProdPrice").text().trim();
			priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
			item.price = priceArr[priceArr.length -1];					
			item.price = storeApiHelper.findPrice(item.price);				     			
			
			if(item.image != undefined){    
			    item.sku = 'jc' + item.link.substring(item.link.lastIndexOf("/")+1, item.link.lastIndexOf("."));
			    
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);	
	},
	    
	getAnnTaylor: function(data, siteHome){
	 	var products = new Object();
	 		   		
		$(data).find(".product").each(function(){
			var item = new Object();
			
			item.image = $(this).find(".thumb").children("img").first().attr("src");
			item.link = siteHome + $(this).find(".overlay > a.clickthrough").first().attr("href");			
			item.name = $(this).find(".overlay > .fg > .description > .messaging > p").not(".POS").first().text().trim();		
			item.price = $(this).find(".overlay > .fg > .description > .price > p").not(".was").first().text().trim();
			item.price = storeApiHelper.findPrice(item.price);
			
			var url = item.link.substring(0, item.link.indexOf("?"));
            item.sku = 'at' + url.substring(url.lastIndexOf("/")+1);
			
			if(item.image != undefined){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	
	    
	getLoft: function(data, siteHome){
		 var products = new Object();
		 		    		
		$(data).find(".products").find(".product").each(function(){
			var item = new Object();
			
			item.image = $(this).find(".thumb").children("img").first().attr("src");				
			item.link = siteHome + $(this).find(".overlay > a.clickthrough").first().attr("href");			
			item.name = $(this).find(".description > .messaging > p").not(".POS").first().text().trim();				
			item.price = $(this).find(".description > .price > p").not(".was").first().text().trim();
			item.price = storeApiHelper.findPrice(item.price);
			
			var url = item.link.substring(0, item.link.indexOf("?"));
            item.sku = 'l' + url.substring(url.lastIndexOf("/")+1);
			
			if(item.image != undefined){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	    	
	getUrban: function(data, siteHome){
	    var products = new Object();
	    		    		
		$(data).find("#category-products").children().each(function(){
			var item = new Object();
					
			item.image = $(this).find(".category-product-image > a > img").first().attr("src");				
			item.link = siteHome + $(this).find(".category-product-image > a").first().attr("href");			
			item.name = $(this).find(".category-product-description > h2 > a").first().text().trim();				
			item.price = $(this).find(".category-product-description > .price").first().text().trim();	
			item.price = storeApiHelper.findPrice(item.price);	        
	
			if(item.image != undefined){
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
			
			if(item.image != undefined){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	
	getHM: function(data, siteHome){
		siteHome += "&size=1000";
		var products = new Object();
	      	  		
		$(data).find("#list-products").children("li").not(".getTheLook").each(function(){
			var item = new Object();
			
			item.image = $(this).find(".image > img:nth-child(2)").first().attr("src");
			item.link = $(this).find("a").first().attr("href");			
			item.price = $(this).find("a > .price").first().text().trim();
			item.price = storeApiHelper.findPrice(item.price);
			$(this).find("a > .details > .price").first().remove();
			item.name = $(this).find("a > .details").first().text().trim();	
			item.sku = 'hm' + $(this).find("button.quicklook").first().attr("data-product");				
			
			if(item.image != undefined){
				var itemid = item.sku.replace(/-\W/g, '');			
				products[itemid] = item;
			}
		});
											
		return JSON.stringify(products);
	},
	
	getToryBurch: function(data, siteHome){
	        var products = new Object();
	
	        $(data).find("#search > .productresultarea > .productlisting > .product").each(function(){
	                var item = new Object();
	
	                item.image = $(this).find(".image .product-image-primary").attr("src");
	                item.link = $(this).find(".image").find("a").first().attr("href");
	                item.price = $(this).find(".pricing > .price").first().text().trim();
	                item.price = storeApiHelper.findPrice(item.price);
	                item.name = $(this).find(".name").find("a").first().text().trim();	                
	
	                if(item.image != undefined){
	                   item.sku = 'tb' + item.link.substring(item.link.lastIndexOf("/")+1,item.link.indexOf(","));
	                   
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
	
       $(data).find(".category-item").each(function(){
                var item = new Object();

                item.image = $(this).find(".imageWrapper img").first().attr("src");
                item.link = siteHome + $(this).find(".imageWrapper a").first().attr("href");                
                item.price = $(this).find(".item-description > .item-price > .price").first().text();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".item-description a").first().attr("title");

                if(item.image != undefined){
                    
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

                if(item.image != undefined){
                    
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
	
       $(data).find(".thumbtext").each(function(){
                var item = new Object();

                item.image = siteHome + $(this).find(".thumbcontainer img").first().attr("src");
                item.link = siteHome + $(this).find(".thumbcontainer a").first().attr("href");                
                item.price = $(this).find(".thumbInfo > .thumbPricing > #productPricing").first().text().trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".thumbcontainer img").first().attr("alt");

                if(item.image != undefined){
                    
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
	
       $(data).find(".arrayProdCell").each(function(){
                var item = new Object();

                item.image = $(this).find(".arrayImg img").first().attr("src");
                item.link = $(this).find(".arrayImg a").first().attr("href");                
                item.price = $(this).find(".arrayCopy .arrayProdPrice").text().replace(/([a-zA-Z$ ])*(\s)+/g, ' ').trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".arrayImg img").first().attr("alt");

                if(item.image != undefined){
                                    
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
	
       $(data).find(".grid-tile").each(function(){
                var item = new Object();

                item.image = $(this).find(".product-image img").first().attr("src");
                item.link = siteHome + $(this).find(".product-image a").first().attr("href");                
                item.price = $(this).find(".product-pricing .price-value").text().trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".product-image a").first().attr("alt");

                if(item.image != undefined){
                   item.sku = 'bb' + $(this).attr("data-item-id");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getNordstrom: function(data, siteHome){	   
	   var products = new Object();
	
       $(data).find(".fashion-item").each(function(){
                var item = new Object();

                item.image = $(this).find(".fashion-photo img").first().attr("data-original");
                item.link = siteHome + $(this).find(".info a").first().attr("href");                
                item.price = $(this).find(".info > .price.regular").text().trim();
                item.price += " " + $(this).find(".info > .price.sale").text().trim();
                item.price = item.price.trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".fashion-photo img").first().attr("alt");

                if(item.image != undefined){
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
	
       $(data).find(".product").each(function(){
                var item = new Object();

                item.image = $(this).find(".product-img").first().attr("src");
                item.link = siteHome + $(this).find(".name a").first().attr("href");                
                item.price = $(this).find(".pricing").text().replace(/([a-zA-Z$ ])*(\s)+/g, ' ').trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".name a").first().text();

                if(item.image != undefined){
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

                if(item.image != undefined){
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
	
       $(data).find(".grid-tile").each(function(){
                var item = new Object();

                item.image = $(this).find(".product-image .thumb-link img").first().attr("src");
                item.link = $(this).find(".product-image a.thumb-link").first().attr("href");
                item.price = $(this).find(".product-pricing .normal-price").text().trim();
                item.price += " " + $(this).find(".product-pricing .product-sales-price").text().trim();
                item.price = item.price.trim();
                item.price = storeApiHelper.findPrice(item.price);
                item.name = $(this).find(".product-image .thumb-link img").first().attr("alt");

                if(item.image != undefined){
                   item.sku = 'bcbg' + $(this).find(".product-tile").attr("data-itemid");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getCharlesTyrwhitt: function(data, siteHome){	   
	   var products = new Object();
	
       $(data).find(".prodcontainer").each(function(){
                var item = new Object();

                item.image = $(this).find(".img img").first().attr("src");
                item.link = siteHome + $(this).find("a.img").first().attr("href");
                item.name = $(this).find("h3 a").first().text().trim();
                var price = $(this).find(".price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);                           

                if(item.image != undefined){
                   item.sku = 'ct' + $(this).attr("id");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getLuLuLemon: function(data, siteHome){	   
	   var products = new Object();
	
       $(data).find(".product").not(".video").each(function(){            
            var price = $(this).find(".amount").text().replace(/[a-zA-Z]*/g,'').trim();
            var name = $(this).attr("title").trim();
            
            $(this).find(".product-images > li").each(function(){
                var item = new Object();
                item.price = storeApiHelper.findPrice(price);
                item.name = name;
                item.link = siteHome + $(this).find("a").first().attr("href");
                item.image = $(this).find("img").first().attr("src");
                
                if(item.image != undefined && item.image.indexOf("_1") > 0){
                    
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
	
       $(data).find("#productListing .productsListView").each(function(){            
            var item = new Object();

            item.image = $(this).find(".tileImage img.tileImage").first().attr("original");
            item.link = s$(this).find(".tileInfo .productTitle > a").first().attr("href");
            item.name = $(this).find(".tileInfo .productTitle > a").first().text().trim();
            var price = $(this).find(".tileInfo .pricecontainer .price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
            priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
			item.price = storeApiHelper.getLowestPrice(priceArr);     
			item.price = storeApiHelper.findPrice(item.price);                           

            if(item.image != undefined){
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
	
       $(data).find("#wrapper_page_content .product").each(function(){
                var item = new Object();

                item.image = $(this).find(".product_image img").first().attr("src");
                item.link = $(this).find(".product_image a").first().attr("href");
                item.name = $(this).find(".product_description a").first().text().trim();
                var price = $(this).find(".product_price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);                           

                if(item.image != undefined){
                   item.sku = 'ts' + $(this).find(".product_image a").first().attr("data-productid");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getKateSpade: function(data, siteHome){	   
	   var products = new Object();
	
       $(data).find("#search-result-items .grid-tile .product-tile").each(function(){
                var item = new Object();

                item.image = $(this).find(".product-image img.first-img").first().attr("data-baseurl");
                item.link = $(this).find(".product-image a").first().attr("href");
                item.name = $(this).find(".product-name a.name-link").first().text().trim();
                var price = $(this).find(".product-name .product-price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);                           

                if(item.image != undefined){
                   item.sku = 'ks' + $(this).attr("data-itemid");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getNeimanMarcus: function(data, siteHome){	   
	   var products = new Object();
	
       $(data).find(".products .product").each(function(){
                var item = new Object();

                item.image = $(this).find(".productImageContainer img.productImage").first().attr("src");
                item.link = siteHome + $(this).find(".productImageContainer a.prodImgLink").first().attr("href");
                item.name = $(this).find(".details .productname a.recordTextLink").first().text().trim();
                var price = $(this).find(".details .allpricing").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);
    			item.price = storeApiHelper.findPrice(item.price);           
    			
    			item.designer = $(this).find(".details .productdesigner a").first().text().trim();

                if(item.image != undefined){
                   item.sku = 'nm' + $(this).find(".qv-tip").attr("product_id");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	},
	
	getFreePeople: function(data, siteHome){	   
	   var products = new Object();
	
       $(data).find("#products ul li").each(function(){
                var item = new Object();

                item.image = $(this).find(".media img").first().attr("src");
                item.link = $(this).find(".media a").first().attr("href");
                item.name = $(this).find(".info .name a").first().text().trim();
                var price = $(this).find(".info .offers .price").text().replace(/[a-zA-Z£$:]*/g,'').trim();
                priceArr = price.replace(/([^0-9.])*(\s)+/g, ' ').split(" ");
    			item.price = storeApiHelper.getLowestPrice(priceArr);     
    			item.price = storeApiHelper.findPrice(item.price);               			

                if(item.image != undefined){
                   item.sku = 'fp' + $(this).find(".wl-product-thumbnail").attr("data-stylenumber");
                   
			        var itemid = item.sku.replace(/-\W/g, '');
                    products[itemid] = item;
                }
        });

        return JSON.stringify(products);
	}
}

storeApiHelper = {
    findPrice: function(price){
        var priceArray = (price + "").trim().split(/[\s-]+/);
		return parseFloat(priceArray[priceArray.length - 1].replace(/[^0-9\.]+/g,""));   
    },
    
    getLowestPrice: function(priceArray){
        var min = priceArray[0];
        for (var i=0; i < priceArray.length; i++){
               if (!isNaN(priceArray[i]) && priceArray[i] < min ){
                    min = priceArray[i];
               }
        }   
        
        return min;
    }   
}