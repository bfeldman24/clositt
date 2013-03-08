function getProducts(company, data, url){
	var home = url.substring(0,url.indexOf(".com")+4);
	
	var products = "";
	
	switch(company.toLowerCase()){
		case "gap":
		case "oldnavy":
		case "banana":
		case "piperlime":
		case "athleta":
			products = getGapJson(data, home);
			break;
		case "jcrew":
			products = getJcrew(data, home);
			break;		
		case "anntaylor":
			products = getAnnTaylor(data, home);
			break;
		case "loft":
			products = getLoft(data, home);
			break;
		case "urban":
			products = getUrban(data, home);
			break;
		case "zara":
			products = getZara(data, home);
			break;	
		case "hm":
			products = getHM(data, home);
			break;
		case "toryburch":
			products = getToryBurch(data, home);
			break;
	}	
	
	return products;
}


function getGapHTML(data, url){
		var products = new Array();
  		  		
		$(data).find(".productCatItem").each(function(){					
			var item = new Object();
			item.image = $(this).find("img").attr("productimagepath");	
			item.link = url + $(this).find(".productItemName").attr("href");	
			item.name = $(this).find(".productItemName").html();
			item.price = $(this).find(".priceDisplay").html();	
			
			if(item.image != undefined){			
				products.push(item);
			}
		});
	
	return JSON.stringify(products);
}


function getGapJson(data, url){
		var json = $.parseJSON(data);
		var products = new Array();
  		var cid = json.productCategoryFacetedSearch.productCategory.businessCatalogItemId;
		var vid = 1;
	
		$.each(json.productCategoryFacetedSearch.productCategory.childCategories, function(){
  		
		$.each(this.childProducts, function(){								
			var pid = this.businessCatalogItemId;
			
			var item = new Object();
			item.image = this.quicklookImage.path;	
			item.link = url + "/browse/product.do?cid="+cid+"&vid="+vid+"&pid="+pid;	
			item.name = this.name;
			item.price = this.price.currentMinPrice;	
			
			if(item.image != undefined){			
				products.push(item);
			}
		});
		});
	return JSON.stringify(products);
}
    
function getJcrew(data, url){	
	url += "?iNextCategory=-1";
  	var products = new Array();   		
  	
	$(data).find(".arrayProdCell").each(function(){
		var item = new Object();	
		
		item.image = $(this).find(".arrayImg").find("img").attr("src");			
		item.link = $(this).find(".arrayImg").find("a").attr("href");			
		item.name = $(this).find(".arrayProdName").find("a").text().trim();				
		item.price = $(this).find(".arrayProdPrice").text().trim();
		
		if(item.image != undefined){			
			products.push(item);
		}
	});
										
	return JSON.stringify(products);	
}
    
function getAnnTaylor(data, url){
 	var products = new Array();
 		   		
	$(data).find(".product").each(function(){
		var item = new Object();
		
		item.image = $(this).find(".thumb").children("img").first().attr("src");
		item.link = url + $(this).find(".overlay > a.clickthrough").first().attr("href");			
		item.name = $(this).find(".overlay > .fg > .description > .messaging > p").not(".POS").first().text().trim();		
		item.price = $(this).find(".overlay > .fg > .description > .price > p").not(".was").first().text().trim();
		
		if(item.image != undefined){			
			products.push(item);
		}
	});
										
	return JSON.stringify(products);
}		

    
function getLoft(data, url){
	 var products = new Array();
	 		    		
	$(data).find(".products").find(".product").each(function(){
		var item = new Object();
		
		item.image = $(this).find(".thumb").children("img").first().attr("src");				
		item.link = url + $(this).find(".overlay > a.clickthrough").first().attr("href");			
		item.name = $(this).find(".description > .messaging > p").not(".POS").first().text().trim();				
		item.price = $(this).find(".description > .price > p").not(".was").first().text().trim();
		
		if(item.image != undefined){			
			products.push(item);
		}
	});
										
	return JSON.stringify(products);
}
    	
function getUrban(data, url){
    var products = new Array();
    		    		
	$(data).find("#category-products").children().each(function(){
		var item = new Object();
				
		item.image = $(this).find(".category-product-image > a > img").first().attr("src");				
		item.link = url + $(this).find(".category-product-image > a").first().attr("href");			
		item.name = $(this).find(".category-product-description > h2 > a").first().text().trim();				
		item.price = $(this).find(".category-product-description > .price").first().text().trim();

		if(item.image != undefined){			
			products.push(item);
		}
	});
										
	return JSON.stringify(products);
}
    
function getZara(data, url){
	var products = new Array();
    $(".currency").html("");		
      	  		
	$(data).find("#product-list").children(".product").each(function(){
		var item = new Object();
		
		item.image = $(this).find("a.gaProductDetailsLink > img").first().attr("data-src");
		item.link = $(this).find("a.gaProductDetailsLink").first().attr("href");			
		item.name = $(this).find(".product-info > a.name").first().text().trim();				
		item.price = $(this).find(".product-info > .price").first().text().trim();
		
		if(item.image != undefined){			
			products.push(item);
		}
	});
										
	return JSON.stringify(products);
}

function getHM(data, url){
	url += "&size=1000";
	var products = new Array();
      	  		
	$(data).find("#list-products").children("li").not(".getTheLook").each(function(){
		var item = new Object();
		
		item.image = $(this).find(".image > img:nth-child(2)").first().attr("src");
		item.link = $(this).find("a").first().attr("href");			
		item.price = $(this).find("a > .details > .price").first().text().trim();
		$(this).find("a > .details > .price").first().remove();
		item.name = $(this).find("a > .details").first().text().trim();				
		
		if(item.image != undefined){			
			products.push(item);
		}
	});
										
	return JSON.stringify(products);
}

function getToryBurch(data, url){
        var products = new Array();

        $(data).find("#search > .productresultarea > .productlisting > .product").each(function(){
                var item = new Object();

                item.image = $(this).children(".image").find("img:nth-child(2)").attr("src");
                item.link = $(this).children(".image").find("a").first().attr("href");
                item.price = $(this).find(".pricing > .price").first().text().trim();
                item.name = $(this).children(".name").find("a").first().text().trim();

                if(item.image != undefined){
                        products.push(item);
                }
        });

        return JSON.stringify(products);
}

