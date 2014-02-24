var searchController = {
    
    results: null,
    criteria: null,
    pageIndex: 0,
    hasMoreProducts: true,
    tags: [],
    
    init: function(){
        $("#search-bar").on("keyup", searchController.showClearBtn);
        $("#search-bar").on("keypress", searchController.searchOnEnter);
        $("#search-form").submit(searchController.search);
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
		  filterPresenter.clearFilters();
		  
		  var tag = searchTerm.substring(1);
		  searchController.getProductsWithTag(tag, searchController.showResults);
		}else if (searchTerm == ''){
		  filterPresenter.onFilterSelect();
		}else{
		  filterPresenter.clearFilters();
		  searchController.search();  
		}		
    },
    
    search: function(criteria){
		var searchTerm = $( "#search-bar" ).val().toLowerCase().trim();		
		var belowPrice = null;
		var abovePrice = null;
		var cleanSearchTerm = searchTerm;
		
		// log search term
		var logSearchTerm = searchTerm.replace(/[^A-Za-z0-9\w\s]/gi,'');
		var timestamp = new Date().getTime();
		firebase.$.child("search").child(logSearchTerm).child(timestamp).set({user: firebase.userid});
		
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
                
        var matchingFilters = null;
        
        if (criteria == null){
            searchController.tags = cleanSearchTerm.split(" ");
            
            var filters = filterPresenter.allFilters.join("|").toLowerCase().trim();
            filters = filters.replace(/s?(?=\s|\||$)/gi, ""); // remove trailing 's' form every word
            filters = filters.replace(/sse/gi, "ss"); // remove 'es' from applicable words        
            
            var regex = new RegExp(searchController.regexEscape(filters), 'gi');
            matchingFilters = cleanSearchTerm.match(regex);
            
            // Get additional filters based on key words
            if(matchingFilters == null){
                matchingFilters = [];   
            }else{
                if ($.inArray("dress", matchingFilters)  >= 0 && $.inArray("shirt", matchingFilters)  >= 0){                                        
                    
                    matchingFilters = jQuery.grep(matchingFilters, function(value) {
                      return value != 'dress' && value != 'shirt';
                    });
                                        
                    matchingFilters.push('dress shirts');
                }
            }                                
                        
            searchController.getAdditionalFiltersFromTags(matchingFilters, searchController.tags);
                    
            filterPresenter.clearFilters();
            criteria = {};
            if (matchingFilters != null && matchingFilters.length > 0){
                
                searchController.getAdditionalFilters(matchingFilters);                                          
                
                for(var i=0; i < matchingFilters.length; i++){
                   var filter = $("#filter-float").find('input[value^="' + searchController.toTitleCase(matchingFilters[i]) + '"]');                                        
                
                   if (filter != null){                     
                       if (filter.length > 1 ){
                        
                            // TODO get best match                            
                            filter = filter.last();                            
                       }
                        
                       filter.prop('checked', true);
                       var filterName = filter.attr("name").toLowerCase();
                       
                       if (criteria[filterName] == null){
                           criteria[filterName] = [];                    
                       }
                       
                       filterPresenter.createSelectedFilter(filterName, filter.val());
                       criteria[filterName].push(filter.val().toLowerCase());
                   }
               }                      
            }
            
            var customerRegex = new RegExp(searchController.regexEscape("women|men"), 'gi');
            matchingCustomerFilters = cleanSearchTerm.match(customerRegex);
            
            if (matchingCustomerFilters != null && matchingCustomerFilters.length > 0){
                filterPresenter.selectCustomerFilter(matchingCustomerFilters[0]);
                criteria['customer'] = matchingCustomerFilters;
                
                cleanSearchTerm = cleanSearchTerm.replace(customerRegex, '');
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
                searchController.tags = cleanSearchTerm.split(" ");       
            }
            
            
            // Seach for colors
            var colors = colorPresenter.getColorNames().join("|").toLowerCase().trim();            
            var regex = new RegExp(searchController.regexEscape(colors), 'gi');
            matchingColors = cleanSearchTerm.match(regex);
            
            if(matchingColors == null){
                matchingColors = [];   
            }   
            
            searchController.getAdditionalColorsFromTags(matchingColors, searchController.tags);                                                
            
            if (matchingColors != null && matchingColors.length > 0){
                criteria['colors'] = matchingColors;                                       
            }              
        }
         
        criteria['tags'] = searchController.tags;  
        criteria['searchTerm'] = $( "#search-bar" ).val().trim();
        
        searchController.criteria = criteria;
        searchController.pageIndex = 0;
        searchController.hasMoreProducts = true;
        $("#product-grid").html("");
        searchController.getProducts(searchController.showResults);
    },            
    
    getProducts: function(){                                
        
        if (searchController.hasMoreProducts){
            var pageIndex = searchController.pageIndex;
            $.post( window.HOME_ROOT + "p/search/"+pageIndex, searchController.criteria, function( data ) {            
                            
        		gridPresenter.endTask();
        		
        		if( Object.keys(data).length > 0){  
        		    productPresenter.filterStore = data;
        		    gridPresenter.lazyLoad(data);     		        		    
        		}else if (pageIndex <= 0){
        		    productPresenter.filterStore = {};
        		    
        		    var errorMessage = '';
        		    
        		    if (searchController.criteria['searchTerm'] == null || searchController.criteria['searchTerm'] == ""){
        		        errorMessage = "There are no macthing outfits!";
        		    }else{
        		        errorMessage = "There are no outfits that matched \'" + searchController.criteria['searchTerm'] + "\'! Try using another way to describe what you are looking for.";
        		    }
        		  
        			$("#product-grid").html($("<div>").text(errorMessage));
        		}else{
        		      searchController.hasMoreProducts = false; 
        		}                        
            }
            , "json"
            );
              
            searchController.pageIndex++;        
        }
    },     
    
    getProductsOld: function(criteria, tags, callback){                              
        gridPresenter.beginTask();                        
           
        // criteria has -> "company","customer","category","price","underprice"        
        if (criteria != null){                        
            // search store for all matching products
                        
            var companies = criteria.company != null && criteria.company.length > 0 ? criteria.company : filterPresenter.companies;
            var customers = criteria.customer != null && criteria.customer.length > 0 ? criteria.customer : filterPresenter.customers;
            var categories = criteria.category != null && criteria.category.length > 0 ? criteria.category: filterPresenter.categories;
                        
            var returnCount = 0;
            var expectedCount = companies.length * customers.length * categories.length;         
            var mergedObject = {};            
            
            companies.forEach(function(company){
                customers.forEach(function(customer){
                    categories.forEach(function(category){

                        firebase.$.child(firebase.storePath).child("products")
                            .child(company.toLowerCase())
                            .child(customer.toLowerCase())
                            .child(category.toLowerCase())
                            .once('value', 
                                
                                // success
                                function (snap) {
                                    // add it to the merged data
                                    $.extend(mergedObject, snap.val());
                                    
                                    // when all paths have resolved, we invoke
                                    // the callback (jQuery.when would be handy here)
                                    if (++returnCount === expectedCount) {
                                        searchController.searchForColors(null, mergedObject, criteria, tags, callback);
                                    }
                                },
                                
                                // error
                                function (error) {
                                    returnCount = expectedCount + 1; // abort counters
                                    searchController.searchForColors(error, null, criteria, tags, callback);
                                });  
                                    
                    });    
                });    
            }); 
        }
    },
    
    searchForColors: function(error, products, criteria, tags, callback){
//        console.log("Error: " + error);
//        console.log("Products: " + Object.keys(products).length);
        
        if (error){
            return null;      
        }                                                             
                              
        var hasColors = criteria.colors != null && criteria.colors.length > 0;                        
                 
        // matches color
        var matchesColor = false;
        if(hasColors){ 
            var returnCount = 0;
            var expectedCount = criteria.colors.length; 
            var allColors = {};
            
            for(var i=0; i < criteria.colors.length; i++){
                var color = criteria.colors[i].toLowerCase();                                
                		    
		        firebase.$.child(firebase.storePath).child("colors").child(color).once('value', 
                                
                // success
                    function (snap) {
                    // add it to the merged data
                    $.extend(allColors, snap.val());
                    
                    // when all paths have resolved, we invoke
                    // the callback (jQuery.when would be handy here)
                    if (++returnCount === expectedCount) {
                        searchController.searchForTags(allColors, tags, products, criteria);    
                    }
                },
                
                // error
                function (error) {
                    returnCount = expectedCount + 1; // abort counters
                    searchController.searchForTags(allColors, tags, products, criteria);    
                });    	        	
	        }
        }else{
            searchController.searchForTags({}, tags, products, criteria);    
        } 
    },  
    
    searchForTags: function(allColors, tags, products, criteria){
        // Get product with tags and add ranking
        
        var hasTags = tags != null && tags != "" && !(tags.length == 1 && tags[0] == "") && tags.length > 0;               
        var tagsRegex = null;
        
        if (hasTags){
            var tagsRegexString = tags.join("|").toLowerCase().trim();        
            tagsRegex = new RegExp(searchController.regexEscape(tagsRegexString), 'gi');     
        
            firebase.$.child(firebase.storePath).child("tags").once('value', function(snapshot){
                var allTags = {};
                
                // remove all non alphanumeric characters with a few exceptions                                
                for(var i=0; i < tags.length; i++){                
                    var tag = tags[i].replace(/[^A-Za-z0-9\w\s '\-\$\.]/gi,'').toLowerCase();
                    var items = searchController.getMatchingChild(snapshot, tag);    
    		    
    		        if (items != null){
                        $.extend(allTags, items.val());					
    		        }
                }
                
                searchController.getColorAndTagProducts(allColors, allTags, products, criteria, tagsRegex, hasTags); 
            });
        }else{                                        
            searchController.getColorAndTagProducts(allColors, {}, products, criteria, tagsRegex, hasTags); 
        }
    },
    
    getColorAndTagProducts: function(allColors, allTags, products, criteria, tagsRegex, hasTags){        
        var searchResults = {};                        
        
        // Get colors
        for(var c=0; c < Object.keys(allColors).length; c++){
      	    var sku = Object.keys(allColors)[c];
      	    var percentConfidence = allColors[sku];    
    	        	    
    	    if (searchResults[sku] != null){                
    			searchResults[sku].rank += percentConfidence; 	    			 
            
            }else if (products[sku] != null){                
    			products[sku].rank += percentConfidence; 	    			
    			searchResults[sku] = products[sku]; 
            }                        		        
        }
        
        // Get Tags
        for(var t=0; t < Object.keys(allTags).length; t++){
      	    var sku = Object.keys(allTags)[t];
      	    var numTags = allTags[sku];    
    	    
    	    if (searchResults[sku] != null){                
    			searchResults[sku].rank += numTags; 	    			 
            
            }else if (products[sku] != null){                
    			products[sku].rank += numTags; 	    			
    			searchResults[sku] = products[sku]; 
            }                       		        
        }
        
        if (Object.keys(allColors).length <= 0 && Object.keys(allTags).length <= 0){
            searchResults = products;
        }        
        
        searchController.filterSearchResultsByCriteria(searchResults, criteria, tagsRegex, hasTags);
    },
    
    filterSearchResultsByCriteria: function(searchResults, criteria, tagsRegex, hasTags){
        var filteredResults = {};
        
        if (searchResults != null){
            
            for (var i=0; i < Object.keys(searchResults).length; i++){
                var sku = Object.keys(searchResults)[i];
                var product = searchResults[sku];                                
                                
                if(product != null){                     
                                        
                    // matches price
                    if((!criteria.belowPrice || product.price <= criteria.belowPrice) &&
                            (!criteria.abovePrice || product.price >= criteria.abovePrice)){
        
                        // product name ranking    
                        var foundMatchInName = false;          
                        if(hasTags){                                         				    
                            var matches = product.name.toLowerCase().match(tagsRegex);
                            
                            if (matches != null){
                			        product.rank += matches.length * 2;
                			        foundMatchInName = true;
                            }
                        }
                        
                        // Add product
                        if(!hasTags || foundMatchInName){
                                filteredResults[sku] = product;                                                       
                        }
                    }
                }                                              	                                                                                            
            }   		
        }
        
        $("#search-bar-sort-block").css("visibility","visible");
        searchController.showResults(filteredResults);
    },    
            
    getProductsWithTag: function(tagName, callback){	                        
		gridPresenter.beginTask();
		    
		firebase.$.child(firebase.storePath).child("tags").once('value',function(snapshot){
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
		gridPresenter.endTask();
		
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
	          orderedProducts[i + "_" + rankedProducts[i]['sku']] = rankedProducts[i];
	   } 

       return orderedProducts;
	},
	
	sortRanks: function(a, b){
	   return b.rank - a.rank; 
	},
	
	sortPriceLowToHigh: function(a, b){
	   return a.p == null ? a.price - b.price : a.p - b.p; 
	},
	
	sortPriceHighToLow: function(a, b){
	   return a.p == null ? b.price - a.price : b.p - a.p; 
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
		gridPresenter.beginTask();
		$( "#search-bar" ).val("");		
		$("#search-clear-btn").hide();
		$("#search-bar-sort-block").css("visibility","hidden");
		filterPresenter.clearFilters();	       		
		productPresenter.refreshProducts();
		searchController.tags = [];
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
            item = snapshot.child(tag);
        
        // add 's'
        }else if (snapshot.hasChild(tag + 's')){
            item = snapshot.child(tag + "s");
        
        // add 'es'
        }else if (snapshot.hasChild(tag + 'es')){
            item = snapshot.child(tag + "es");                
            
        // add 'ed'
        }else if (snapshot.hasChild(tag + 'ed')){
            item = snapshot.child(tag + "ed");                    
        
        // remove trailing 's' or 'y'
        }else if ((tag.charAt(tag.length - 1) == 's' || 
                   tag.charAt(tag.length - 1) == 'y') && 
                   snapshot.hasChild(tag.substring(0, tag.length - 1))){
                    
            item = snapshot.child(tag.substring(0, tag.length - 1));
        
        // remove trailing 'es'
        }else if (tag.lastIndexOf("es") == (tag.length - 2) && snapshot.hasChild(tag.substring(0, tag.length - 2))){
            item = snapshot.child(tag.substring(0, tag.length - 2));
        
        // remove trailing 'ed' and add an 'es'
        }else if (tag.lastIndexOf("ed") == (tag.length - 2) && snapshot.hasChild(tag.substring(0, tag.length - 2) + 'es')){
            item = snapshot.child(tag.substring(0, tag.length - 2) + "es");                
        
        // remove trailing 'y' and add an 's'
        }else if (tag.charAt(tag.length - 1) == 'y' && snapshot.hasChild(tag.substring(0, tag.length - 1) + 's')){
            item = snapshot.child(tag.substring(0, tag.length - 1) + "s");
          
        
        // remove trailing 'y' and add an 'es'
        }else if (tag.charAt(tag.length - 1) == 'y' && snapshot.hasChild(tag.substring(0, tag.length - 1) + 'es')){
            item = snapshot.child(tag.substring(0, tag.length - 1) + "es");
        }  
        
        return item != null ? item.child("items") : null;
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