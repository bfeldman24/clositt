var searchController = {
    
    results: null,
    
    init: function(){
        $("#search-bar").on("keyup", searchController.showClearBtn);
        $("#search-bar").on("keypress", searchController.searchOnEnter);
        $("#search-form").submit(searchController.startSearch);
		$("#seach-bar-icon").on("click", searchController.startSearch);
		$("#search-clear-btn").click(searchController.clearSearch);
    },
    
    searchOnEnter: function(el){        
        // on enter button
        if (el.which == 13) {
            searchController.startSearch(el);
        }
    },
    
    startSearch: function(el){
		el.preventDefault();
		var searchTerm = $( "#search-bar" ).val().toLowerCase().trim();
		var filters = filterPresenter.allFilters.join("|").toLowerCase().trim();
		var price = null;
		var underPrice = false;
		var cleanSearchTerm = searchTerm;
		
		// get price if there is one
		if(searchTerm.indexOf("$") > 0 || searchTerm.indexOf("dollar") > 0){  
		      // Get start and end positions of price string
		      var priceStart = searchTerm.indexOf("$") + 1;
		      priceStart = priceStart > 0 ? priceStart : searchTerm.indexOf("dollar") + 1;
		      var priceEnd = searchTerm.indexOf(" ", priceStart + 1);
		      
		      // get the price and if we are searching for amounts above or below the price
		      price = priceEnd >= 0 ? price = searchTerm.substring(priceStart, priceEnd) : price = searchTerm.substring(priceStart);
		      price = parseInt(price);
              underPrice = !(/above|over|more than|more then/gi).test(searchTerm);
		      
		      // remove the price and price direction indicator
		      var priceRegex = new RegExp("\\$|dollar|above|over|under|below|more than|more then|less than|less then|" + price, 'gi');
		      cleanSearchTerm = cleanSearchTerm.replace(priceRegex,'').trim();		      
		}
		
		// remove all non alphanumeric characters except spaces
		cleanSearchTerm = cleanSearchTerm.replace(/[^A-Za-z0-9\w\s]/gi,''); 
		
		// remove words less than 3 characters long
        cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,'');
        
        // remove common words
        cleanSearchTerm = cleanSearchTerm.replace(/(for|with|that|has|like)(\s|$)/gi,'');                
        
        filters = filters.replace(/s?(?=\s|\||$)/gi, ""); // remove trailing 's' form every word
        filters = filters.replace(/sse/gi, "ss"); // remove 'es' from applicable words        
        
        var regex = new RegExp(searchController.regexEscape(filters), 'gi');
        var matchingFilters = cleanSearchTerm.match(regex);
        
        // Get additional filters based on key words
        if(matchingFilters == null){
            matchingFilters = [];   
        }        
        var tags = cleanSearchTerm.split(" ");
        searchController.getAdditionalFiltersFromTags(matchingFilters, tags);
                
        filterPresenter.clearFilters();
        var selectedFilters = {};
        if (matchingFilters != null && matchingFilters.length > 0){
            
            searchController.getAdditionalFilters(matchingFilters);
            
            // remove filters in the search string
            regex = new RegExp(searchController.regexEscape(matchingFilters.join('|')), 'gi');
            cleanSearchTerm = cleanSearchTerm.replace(regex, '');
            cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,''); // remove words less than 3 chars
            cleanSearchTerm = cleanSearchTerm.trim(); 
            tags = cleanSearchTerm.split(" ");              
            
            for(var i=0; i < matchingFilters.length; i++){
               var filter = $("#filter-float").find('input[value^="' + searchController.toTitleCase(matchingFilters[i]) + '"]');
            
               if (filter != null){
                   filter.prop('checked', true);
                   
                   if (selectedFilters[filter.attr("name")] == null){
                       selectedFilters[filter.attr("name")] = [];                    
                   }
                   
                   selectedFilters[filter.attr("name")].push(filter.attr("value"));
               }
           }                      
        }
        
        if (price != null){
            var filter = $("#filter-float").find('input[name="fp"]');
            selectedFilters['p'] = price; 
            selectedFilters['underPrice'] = underPrice;
        
            filter.each(function() {  
                var filterPrice = parseInt($(this).val());    
                          
                if(underPrice && (filterPrice < price) || !underPrice && (filterPrice >= price)){
                    $(this).prop('checked', true);
                    
                    if (selectedFilters['fp'] == null){
                        selectedFilters['fp'] = [];                    
                    }
                    
                    selectedFilters['fp'].push(filterPrice);
                }
            });               
        }       
               
        searchController.results = new Object();     
        searchController.getProductsWithTag(searchTerm, tags, selectedFilters); 
    },
    
    regexEscape: function(str) {
        return str.replace(/[-\/\\^$*+?.()[\]{}]/g, '\\$&')
    },
    
    toTitleCase: function(str)
    {
         return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },
    
    getProductsWithTag: function(searchTerm, tags, selectedFilters)
    {	                        
		$("#product-grid").children().remove();
		$("#loadingMainContent").show();
		    
		firebase.$.child("tags").once('value',function(snapshot){
		    
		    // remove all non alphanumeric characters with a few exceptions
            for(var i=0; i < tags.length; i++){
                var tag = tags[i].replace(/[^A-Za-z0-9\w\s '\-\$\.]/gi,'').toLowerCase();                                                
                var items = searchController.getMatchingChild(snapshot, tag);                
		    
		        if (items != null){		        
         			items.forEach(function(item){
         				var sku = item.val();
         				var product = productPresenter.clothingStore[sku];            				
         				
         				if(product.s in searchController.results){
         				   product = searchController.results[product.s];
         				   product.rank -= 10;
         				
         				}else{
         				    product.rank = 1000;
             				
             				// matches price
             				if (selectedFilters.p != null){
             				   if (selectedFilters['underPrice'])
             				   {
             				       if (product.p <= selectedFilters.p){
             				           product.rank -= 1;        
             				       }             				   
             				   }else{
             				       if (product.p >= selectedFilters.p){
             				           product.rank -= 1;        
             				       }
             				   }
             				   
             				}
             				
             				// matches company
             				if (selectedFilters.o != null && $.inArray(product.o, selectedFilters.o) >= 0){
             				   product.rank -= 5;   
             				}
             				
             				// u = customer, a = category
             				if ((selectedFilters.u == null || $.inArray(product.u, selectedFilters.u) >= 0) &&
             				    (selectedFilters.a == null || $.inArray(product.a, selectedFilters.a) >= 0))
             				    {			    
             				       searchController.results[product.s] = product;
             				    }
         				}
         			});		
		        }					
            }
			
			searchController.showResults(searchTerm, searchController.results);
//      		filterPresenter.onFilterSelect(); 
            
		}, this);
		
		return null;
	},
	
	showResults: function(tag, products)
	{	  
	    products = searchController.orderResults(products);
	    
		productPresenter.filterStore = products;
		$("#loadingMainContent").hide();
		
		if( Object.keys(products).length > 0){
		    productPresenter.refreshFilteredProducts();
		}else{
			$("#product-grid").append($("<div>").html("Sorry there are no outfits that match: \"" + tag + "\"! Try using another way to describe what you are looking for."));
		}
	},
	
	showClearBtn: function(){
	    if(!$("#search-clear-btn").is(":visible") && $("#search-bar").val().trim().length > 0){
	       $("#search-clear-btn").show();       
	    }
	},
	
	orderResults: function(products){
	   var rankedProducts = [];
	   var orderedProducts = {};
	   
	   for(var i=0; i < Object.keys(products).length; i++){
	       rankedProducts.push(products[Object.keys(products)[i]]);
	   }   
	   
	   rankedProducts.sort(searchController.sortResults);
	   
	   for(var i=0; i < rankedProducts.length; i++){
	          orderedProducts[i + "_" + rankedProducts[i]['s']] = rankedProducts[i];
	   } 

       return orderedProducts;
	},
	
	sortResults: function(a, b){
	   return a.rank < b.rank ? -1 : 1; 
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
	        $.inArray("women", matchingFilters)  >= 0){
	           
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
          
        // remove trailing 'ed' and add an 's'
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
    }
};