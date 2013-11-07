var searchController = {
    
    results: null,
    
    init: function(){
        $("#search-bar").on("keyup", searchController.showClearBtn);
        $("#search-bar").on("keypress", searchController.searchOnEnter);
        $("#search-form").submit(searchController.startSearch);
		$("#seach-bar-icon").on("click", searchController.searchBarSubmit);
		$("#search-clear-btn").click(searchController.clearSearch);
		$("#search-bar-sort").change(searchController.sortBy);
    },
    
    searchOnEnter: function(el){        
        // on enter button
        if (el.which == 13) {
            searchController.searchBarSubmit(el);
        }
    },
    
    searchBarSubmit: function(el){
		el.preventDefault();
		var searchTerm = $( "#search-bar" ).val().trim();
		
		if (searchTerm.charAt(0) == '#'){
		  var tag = searchTerm.substring(1);
		  searchController.getProductsWithTag(tag, searchController.showResults);
		}else if (searchTerm == ''){
		  filterPresenter.onFilterSelect();
		}else{
		  searchController.search();  
		}		
    },
    
    search: function(criteria){
		var searchTerm = $( "#search-bar" ).val().toLowerCase().trim();		
		var belowPrice = null;
		var abovePrice = null;
		var cleanSearchTerm = searchTerm;
		
		// get price if there is one
		if(searchTerm.indexOf("$") > 0 || searchTerm.indexOf("dollar") > 0){  
		      // Get start and end positions of price string
		      var prices = searchTerm.match(/\d+/g);
		      prices.sort(searchController.sortLowestToHighest);
		      
		      var priceA = parseInt(prices[0]);
		      var priceB = parseInt(prices[prices.length - 1]);
              
              // if above price 
              if(prices.length > 1 && (/between|from/gi).test(searchTerm)){
                abovePrice = priceA;
                belowPrice = priceB;
              }else if((/above|over|more than|more then/gi).test(searchTerm)){
                    abovePrice = priceA;
                    belowPrice = 99999;
              }else{
                    belowPrice = priceA;
                    abovePrice = 0;                     
              }
		      
		      // remove the price and price direction indicator
		      var priceRegex = new RegExp("\\$|dollar|above|over|under|below|more than|more then|less than|less then|between|from|to|" + priceA + "|" + priceB, 'gi');
		      cleanSearchTerm = cleanSearchTerm.replace(priceRegex,'').trim();		      
		}
		
		// remove all non alphanumeric characters except spaces
		cleanSearchTerm = cleanSearchTerm.replace(/[^A-Za-z0-9\w\s]/gi,''); 
		
		// remove words less than 3 characters long
        cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,'');
        
        // remove common words
        cleanSearchTerm = cleanSearchTerm.replace(/(for|with|that|has|like)(\s|$)/gi,'');                
        
        var tags = cleanSearchTerm.split(" ");
        var matchingFilters = null;
        
        if (criteria == null){
            var filters = filterPresenter.allFilters.join("|").toLowerCase().trim();
            filters = filters.replace(/s?(?=\s|\||$)/gi, ""); // remove trailing 's' form every word
            filters = filters.replace(/sse/gi, "ss"); // remove 'es' from applicable words        
            
            var regex = new RegExp(searchController.regexEscape(filters), 'gi');
            matchingFilters = cleanSearchTerm.match(regex);
            
            // Get additional filters based on key words
            if(matchingFilters == null){
                matchingFilters = [];   
            }        
                        
            searchController.getAdditionalFiltersFromTags(matchingFilters, tags);
                    
            filterPresenter.clearFilters();
            criteria = {};
            if (matchingFilters != null && matchingFilters.length > 0){
                
                searchController.getAdditionalFilters(matchingFilters);                                          
                
                for(var i=0; i < matchingFilters.length; i++){
                   var filter = $("#filter-float").find('input[value^="' + searchController.toTitleCase(matchingFilters[i]) + '"]');
                
                   if (filter != null){
                       filter.prop('checked', true);
                       var filterName = filter.attr("name").toLowerCase();
                       
                       if (criteria[filterName] == null){
                           criteria[filterName] = [];                    
                       }
                       
                       criteria[filterName].push(filter.val().toLowerCase());
                   }
               }                      
            }
            
            if (abovePrice != null || belowPrice != null){
                var filter = $("#filter-float").find('input[name="filterprice"]');                 
                criteria['belowPrice'] = belowPrice;
                criteria['abovePrice'] = abovePrice;                
            
                filter.each(function() {  
                    var filterMin = parseInt($(this).val());
                    var filterMax = parseInt($(this).attr('max'));
                        
                    if(filterMin < belowPrice && filterMax > abovePrice){                        
                        $(this).prop('checked', true);                                                
                    }
                });               
            }
            
            if (matchingFilters != null && matchingFilters.length > 0){
                // remove filters in the search string
                regex = new RegExp(searchController.regexEscape(matchingFilters.join('|')), 'gi');
                cleanSearchTerm = cleanSearchTerm.replace(regex, '');
                cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,''); // remove words less than 3 chars
                cleanSearchTerm = cleanSearchTerm.trim(); 
                tags = cleanSearchTerm.split(" ");       
            }
            
            
            // Seach for colors
            var colors = colorPresenter.getColorNames().join("|").toLowerCase().trim();            
            var regex = new RegExp(searchController.regexEscape(colors), 'gi');
            matchingColors = cleanSearchTerm.match(regex);
            
            if(matchingColors == null){
                matchingColors = [];   
            }   
            
            searchController.getAdditionalColorsFromTags(matchingColors, tags);                                                
            
            if (matchingColors != null && matchingColors.length > 0){
                criteria['colors'] = matchingColors;
                
                // remove filters in the search string
                regex = new RegExp(searchController.regexEscape(matchingColors.join('|')), 'gi');
                cleanSearchTerm = cleanSearchTerm.replace(regex, '');
                cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,''); // remove words less than 3 chars
                cleanSearchTerm = cleanSearchTerm.trim(); 
                tags = cleanSearchTerm.split(" ");       
            }              
        }
          
        searchController.getProducts(criteria, tags, searchController.showResults);
    },             
    
    getProducts: function(criteria, tags, callback){     
        var products = {};         
        
        gridPresenter.beginTask();                
        var hasTags = tags != null && tags != "" && !(tags.length == 1 && tags[0] == "") && tags.length > 0;               
        var tagsRegex = null;
        
        if (hasTags){
            var tagsRegexString = tags.join("|").toLowerCase().trim();        
            tagsRegex = new RegExp(searchController.regexEscape(tagsRegexString), 'gi'); 
        }
           
        // criteria has -> "company","customer","category","price","underprice"        
        if (criteria != null){
            var hasCriteria = (criteria.company != null && Object.keys(criteria.company).length > 0) || 
                              (criteria.customer != null && Object.keys(criteria.customer).length > 0) ||
                              (criteria.category != null && Object.keys(criteria.category).length > 0);                           
            
            // search store for all matching products
            firebase.$.child("store").once('value',function(store){                
                
                store.child("products").forEach(function(company) {
                    
                    if (criteria.company == null || criteria.company.length <= 0 || $.inArray(company.name(), criteria.company) >= 0){                    
                        company.forEach(function(customer) {
                            
                            if (criteria.customer == null || criteria.customer.length <= 0 || $.inArray(customer.name(), criteria.customer) >= 0){                        
                                customer.forEach(function(category) {
                                    
                                    if (criteria.category == null || criteria.category.length <= 0 || $.inArray(category.name(), criteria.category) >= 0){                                            
                                        category.forEach(function(item) {
                                            var sku = item.name();
                                            var product = products[sku];
                                            
                                            if (product == null){
                                                product = productPresenter.clothingStore[sku];
                                                
                                                if (product != null){
                                                    product.rank = 0;
                                                }
                                            }else{
                                                // product matches multiple criteria
                                                product.rank += 1;
                                            }
                                                           
                                            if(product != null){ 
                                                
                                                // matches price
                                                if((!criteria.belowPrice || product.p <= criteria.belowPrice) &&
                                                       (!criteria.abovePrice || product.p >= criteria.abovePrice)){
                                    
                                                    // product name ranking    
                                                    var foundMatchInName = false;          
                                                    if(hasTags){                                         				    
                                                        var matches = product.n.toLowerCase().match(tagsRegex);
                                                        
                                                        if (matches != null){
                                         			        product.rank += matches.length * 2;
                                         			        foundMatchInName = true;
                                                        }
                                                    }
                                                    
                                                    // Add product
                                                    if (hasCriteria || foundMatchInName){
                                                        products[sku] = product;
                                                    }
                                                }
                                            }                                              	                                                                                            
                                        });        
                                    }
                                });                                 
                            }
                        });    
                    }              
                });                                                                                                                     
                
                // Get product with tags and add ranking
                if(hasTags){ 
                    // remove all non alphanumeric characters with a few exceptions                                
                    for(var i=0; i < tags.length; i++){
                        var tag = tags[i].replace(/[^A-Za-z0-9\w\s '\-\$\.]/gi,'').toLowerCase();
                        var items = searchController.getMatchingChild(store.child("tags"), tag);    
        		    
        		        if (items != null){
                			items.forEach(function(item){
                				var sku = item.val();
                				var product = products[sku];
                				
                				if (product == null && !hasCriteria){                    				                    				
                				   product = productPresenter.clothingStore[sku];
                				   
                				   if (product != null){
                                        product.rank = 1;    
                				   }            				                       				
                				}else{
                				   product.rank += 5; 
                				}
                				
                				// Add product only if there is no criteria
                                if (product != null && !hasCriteria){
                                    // matches price
                                    if((!criteria.belowPrice || product.p <= criteria.belowPrice) &&
                                        (!criteria.abovePrice || product.p >= criteria.abovePrice) ){
                    
                                        // product name ranking    
                                        var foundMatchInName = false;                                                  				    
                                        var matches = product.n.toLowerCase().match(tagsRegex);
                                        
                                        if (matches != null){
                            			        product.rank += matches.length * 2;                            	
                                        }
                                    
                                        products[sku] = product;
                                    }
                                }
        			        });		
        		        }					
                    }
                }
                
                // Get product with colors and add ranking
                if(criteria.colors != null && criteria.colors.length > 0){ 
                    var productsMatchingColorCriteria = {};
                    for(var i=0; i < criteria.colors.length; i++){
                        var color = criteria.colors[i].toLowerCase();
        		    
        		        if (store.hasChild("colors/" + color)){
                			store.child("colors/" + color).forEach(function(item){
                				var sku = item.val();
                				var product = products[sku];
                				
                				if (product != null){                				   
                				   product.rank += 5; 
                				   productsMatchingColorCriteria[sku] = product;
                				}                				                				
                				
                				
        			        });		
        		        }					
                    }
                    
                    products = productsMatchingColorCriteria;                                        
                }
                
                callback(products);
            });                                                 
        }
    },    
    
    getProductsWithTag: function(tagName, callback){	                        
		$("#product-grid").children().remove();
		$("#loadingMainContent").show();
		    
		firebase.$.child("store/tags").once('value',function(snapshot){
		    var results = {};
		    
		    // remove all non alphanumeric characters with a few exceptions
            var tag = tagName.replace(/[^A-Za-z0-9\w\s '\-\$\.]/gi,'').toLowerCase();                                                
            var items = searchController.getMatchingChild(snapshot, tag);                
	    
	        if (items != null){		        
        			items.forEach(function(item){
        				var sku = item.val();
        				var product = productPresenter.clothingStore[sku];            				
        				
        				if (product != null){
            				if(product.s in results){
            				   product = results[product.s];
            				   product.rank += 10;
            				
            				}else{        				    
                				product.rank = 0;                				
                				results[product.s] = product;                				
            				}
        				}
        			});		
	        }					            
			
			callback(results);                 			
            
		}, this);				
	},		
	
	showResults: function(products){	  
	    products = searchController.orderResults(products);	    
		productPresenter.filterStore = products;
		$("#loadingMainContent").hide();
		
		if( Object.keys(products).length > 0){
		    productPresenter.refreshFilteredProducts();
		}else{
		    var searchTerm = $( "#search-bar" ).val().trim();
		    var errorMessage = '';
		    
		    if (searchTerm == ""){
		        errorMessage = "There are no macthing outfits!";
		    }else{
		        errorMessage = "There are no outfits that matched: \'" + searchTerm + "\'! Try using another way to describe what you are looking for.";
		    }
		  
			$("#product-grid").html($("<div>").text(errorMessage));
		}
	},
	
	showClearBtn: function(){
	    if(!$("#search-clear-btn").is(":visible") && $("#search-bar").val().trim().length > 0){
	       $("#search-clear-btn").show();       
	    }
	},
	
	sortBy: function(){	   
	   gridPresenter.beginTask();
	   searchController.showResults(productPresenter.filterStore);
	},
	
	getSortFunction: function(){
	   var sort = $("#search-bar-sort").val();
	   var sortFunction = null;
	   	 
	   switch(sort){	       	           
	       case "pricelowtohigh":
	           sortFunction = searchController.sortPriceLowToHigh;
	           break;
	       case "pricehightolow":
    	       sortFunction = searchController.sortPriceHighToLow;
    	       break;
    	   case "mostpopular":
    	       sortFunction = searchController.sortMostPopular;
    	       break;
    	   case "mostdiscussed":
    	       sortFunction = searchController.sortMostDiscussed;
    	       break;
    	   default:
    	       sortFunction = searchController.sortRanks;
	           break;
	   }
	   
	   return sortFunction;
	},
	
	orderResults: function(products){
	   var rankedProducts = [];
	   var orderedProducts = {};
	   
	   // convert object to array
	   for(var i=0; i < Object.keys(products).length; i++){
	       rankedProducts.push(products[Object.keys(products)[i]]);
	   }   
	   
	   var sortFunction = searchController.getSortFunction();
	   rankedProducts.sort(sortFunction);
	   
	   for(var i=0; i < rankedProducts.length; i++){
	          orderedProducts[i + "_" + rankedProducts[i]['s']] = rankedProducts[i];
	   } 

       return orderedProducts;
	},
	
	sortRanks: function(a, b){
	   return b.rank - a.rank; 
	},
	
	sortPriceLowToHigh: function(a, b){
	   return a.p - b.p; 
	},
	
	sortPriceHighToLow: function(a, b){
	   return b.p - a.p; 
	},
	
	sortMostPopular: function(a, b){
	   return b.cc - a.cc;
	},
	
	sortMostDiscussed: function(a, b){
	   return b.rc - a.rc;
	},
	
	sortLowestToHighest: function(a, b){
	   return a - b; 
	},		
	
	clearSearch: function(el){
		el.preventDefault();
		$( "#search-bar" ).val("");
		$("#loadingMainContent").show();
		$("#search-clear-btn").hide();
		filterPresenter.clearFilters();
		
		productPresenter.refreshProducts();
	},
	
	getAdditionalFilters: function(matchingFilters){
	   
	   if (($.inArray("dress", matchingFilters) >= 0 ||
	        $.inArray("skirts", matchingFilters)  >= 0 ||
	        $.inArray("ann taylor", matchingFilters)  >= 0 ||
	        $.inArray("loft", matchingFilters) >= 0) &&
	        $.inArray("women", matchingFilters)  < 0){
	           
	            matchingFilters.push("women");  
	        }
	},
	
	getAdditionalFiltersFromTags: function(matchingFilters, tags){
	   if ($.inArray("top", tags) >= 0 || $.inArray("tops", tags) >= 0){	  	       	                
            matchingFilters.push("polos");
            matchingFilters.push("shirts");
            matchingFilters.push("sweaters");
            matchingFilters.push("t's & tops");
            matchingFilters.push("top");  
        }
        
        if ($.inArray("bottom", tags) >= 0 || $.inArray("bottoms", tags) >= 0){	           
            matchingFilters.push("jeans");
            matchingFilters.push("pants");
            matchingFilters.push("skirts");
            matchingFilters.push("bottom");  
        }  
	},
	
	getMatchingChild: function(snapshot, tag){
	    var item = null;
	    
	    if(tag == null || tag.trim() == ""){
	       return null;  
	    }
	   
	    if (snapshot.hasChild(tag)){
            item = snapshot.child(tag + "/items");
        
        // add 's'
        }else if (snapshot.hasChild(tag + 's')){
            item = snapshot.child(tag + "s/items");
        
        // add 'es'
        }else if (snapshot.hasChild(tag + 'es')){
            item = snapshot.child(tag + "es/items");                
            
        // add 'ed'
        }else if (snapshot.hasChild(tag + 'ed')){
            item = snapshot.child(tag + "ed/items");                    
        
        // remove trailing 's' or 'y'
        }else if ((tag.charAt(tag.length - 1) == 's' || 
                   tag.charAt(tag.length - 1) == 'y') && 
                   snapshot.hasChild(tag.substring(0, tag.length - 1))){
                    
            item = snapshot.child(tag.substring(0, tag.length - 1) + "/items");
        
        // remove trailing 'es'
        }else if (tag.lastIndexOf("es") == (tag.length - 2) && snapshot.hasChild(tag.substring(0, tag.length - 2))){
            item = snapshot.child(tag.substring(0, tag.length - 2) + "/items");
        
        // remove trailing 'ed' and add an 'es'
        }else if (tag.lastIndexOf("ed") == (tag.length - 2) && snapshot.hasChild(tag.substring(0, tag.length - 2) + 'es')){
            item = snapshot.child(tag.substring(0, tag.length - 2) + "es/items");                
        
        // remove trailing 'y' and add an 's'
        }else if (tag.charAt(tag.length - 1) == 'y' && snapshot.hasChild(tag.substring(0, tag.length - 1) + 's')){
            item = snapshot.child(tag.substring(0, tag.length - 1) + "s/items");
          
        
        // remove trailing 'y' and add an 'es'
        }else if (tag.charAt(tag.length - 1) == 'y' && snapshot.hasChild(tag.substring(0, tag.length - 1) + 'es')){
            item = snapshot.child(tag.substring(0, tag.length - 1) + "es/items");
        }  
        
        return item;
    },
    
    getAdditionalColorsFromTags: function(matchingColors, tags){          
    },
    
    regexEscape: function(str) {
        return str.replace(/[-\/\\^$*+?.()[\]{}]/g, '\\$&')
    },
    
    toTitleCase: function(str)
    {
         return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
};