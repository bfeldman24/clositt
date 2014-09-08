var searchController = {
    url: "p/search/",
    results: null,
    criteria: null,
    pageIndex: 0,
    hasMoreProducts: true,
    isSearchActive: false,
    
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
		
		searchController.isSearchActive = true;
		
		$('body,html').animate({
			scrollTop: 610
		}, 800);
		
		if (searchTerm.charAt(0) == '#'){
		  filterPresenter.clearFilters();		  		  
		  
		  // TODO: implement
		  // var tag = searchTerm.substring(1);
		  //searchController.getProductsWithTag(tag, searchController.showResults);
		  
		  // Remove after the above is implemented
		  searchController.search();  
		  
		}else if (searchTerm == ''){
		  filterPresenter.onFilterSelect();
		}else{
		  filterPresenter.clearFilters();
		  searchController.search();  
		}		
    },
    
    search: function(criteria){
		var searchTerm = $( "#search-bar" ).val().toLowerCase().trim();		
		var cleanSearchTerm = searchTerm;
		var tags = [];
		var belowPrice = null;
		var abovePrice = null;				
		
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
		
		// remove all non alphanumeric characters except spaces and # sign
		cleanSearchTerm = cleanSearchTerm.replace(/[^A-Za-z0-9#\w\s]/gi,''); 
		
		// remove words less than 3 characters long
        cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,'');
        
        // remove common words
        cleanSearchTerm = cleanSearchTerm.replace(/(for|with|that|has|like)(\s|$)/gi,'');                
    
        var matchingFilters = [];            
                   
        // Get Tags Starting with #
        while (cleanSearchTerm.indexOf("#") >= 0){  
            var i = cleanSearchTerm.indexOf("#") + 1;
            var tag = "";
            
            if (cleanSearchTerm.indexOf(" ", i) > 0){
                tag = cleanSearchTerm.substring(i, cleanSearchTerm.indexOf(" ", i));
            }else{
                tag = cleanSearchTerm.substring(i);
            }
            
            cleanSearchTerm = cleanSearchTerm.replace("#" + tag, "");
            tags.push(tag);
            
            for (var i=0; i< filterPresenter.allFilters.length; i++) {
                var filterValue = filterPresenter.allFilters[i].toLowerCase().replace(/[^A-Za-z0-9\w\s]/gi,'');
                
                // Try matching original filter value
                if (tag == filterValue){
                        matchingFilters.push(filterPresenter.allFilters[i].toLowerCase());                           
                        tags.splice(tags.length - 1, 1);
                }
            }
        }                                
        
        if (criteria == null){
            criteria = {};
            
            // Select the customer if applicable
            var customerRegex = new RegExp(searchController.regexEscape("women|men"), 'gi');
            matchingCustomerFilters = cleanSearchTerm.match(customerRegex);
            
            if (matchingCustomerFilters != null && matchingCustomerFilters.length > 0){
                filterPresenter.selectCustomerFilter(matchingCustomerFilters[0]);
                criteria['customer'] = matchingCustomerFilters;
                
                cleanSearchTerm = cleanSearchTerm.replace(customerRegex, '');
            }                                                                        
                    
            // Clear filters and reselct the matching filters        
            filterPresenter.clearFilters();            
            if (matchingFilters.length > 0){                                                                        
                
                for(var i=0; i < matchingFilters.length; i++){
                   var filter = $("#filter-float").find('input[value^="' + searchController.toTitleCase(matchingFilters[i]) + '"]');                                                            
                
                   if (filter.length > 0){                     
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
            
//            if (matchingFilters != null && matchingFilters.length > 0){
//                // remove filters in the search string
//                regex = new RegExp(searchController.regexEscape(matchingFilters.join('|')), 'gi');
//                cleanSearchTerm = cleanSearchTerm.replace(regex, '');
//                cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,''); // remove words less than 3 chars
//                cleanSearchTerm = cleanSearchTerm.trim(); 
//                tags = cleanSearchTerm.split(" ");       
//            }
            
            
            // Seach for colors
            var colors = colorPresenter.getColorNames();                        
            matchingColors = [];   
            
            for (var i=0; i< colors.length; i++) {
                var colorName = colors[i].toLowerCase();                                
                
                if (cleanSearchTerm.indexOf(colorName) >= 0){
                       matchingColors.push(colorName);
                       
                       var colorFilter = $("#filter-float").find('.colorFilter.' + colorName);
                
                        if (colorFilter.length > 0){
                            $(".selectedColor").removeClass("selectedColor");
                            colorFilter.addClass("selectedColor");
                            
                            filterPresenter.createSelectedFilter(colorFilter.attr("data-original-title"), colorFilter.attr("data-original-title"));
                        } 
                }
            }                                                                                 
            
            if (matchingColors.length > 0){
                criteria['colors'] = matchingColors;                                       
            }              
        }
         
        if (tags.length > 0){ 
            criteria['tags'] =  tags;  
        }
        
        criteria['searchTerm'] = $( "#search-bar" ).val().replace("#","").trim();
        
        searchController.criteria = criteria;
        searchController.pageIndex = 0;
        searchController.hasMoreProducts = true;
        $("#product-grid").html("");
        searchController.getProducts(searchController.showResults);
    },            
    
    getProducts: function(){                                
        
        if (searchController.hasMoreProducts){
            var pageIndex = searchController.pageIndex;
            $.post( window.HOME_ROOT + searchController.url +pageIndex, searchController.criteria, function( data ) {
                data = data.products;
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
        		        errorMessage = "There are no outfits that matched your search! Try using another way to describe what you are looking for.";
        		    }
        		  
        			$("#product-grid").html($("<div>").text(errorMessage));
        		}else{
        		      searchController.hasMoreProducts = false; 
        		}                        
            }
            , "json"
            );
              
            searchController.pageIndex++;        
        }else{
            if ($(".endResults").length <= 0){
                
                if ($("#product-grid .item").length > 0){
                    $("#product-grid").append(
                        $("<div>").addClass("endResults col-xs-6 col-sm-4 col-md-3 col-lg-2")
                        .text("End of Results")
                    );   
                }
            }
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
	   
	    if (el != null){ el.preventDefault(); }
	    
		gridPresenter.beginTask();
		$( "#search-bar" ).val("");		
		$("#search-clear-btn").hide();
		$("#search-bar-sort-block").css("visibility","hidden");
		filterPresenter.clearFilters();	       		
		productPresenter.refreshProducts();
		searchController.isSearchActive = false; 
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
    
    regexEscape: function(str) {
        return str.replace(/[-\/\\^$*+?.()[\]{}]/g, '\\$&')
    },
    
    toTitleCase: function(str)
    {
         return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
};