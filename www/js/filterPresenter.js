var filterPresenter = {    
    allFilters: null,
    companies: null,
    customers: null,
    categories: null,
    defaultCustomer: "women",
    pauseRefresh: false,
    needsRefresh: false,
	
	init: function(){		
	    filterPresenter.allFilters = [];	  
	    filterPresenter.refreshCustomerFilter();
	    $(".search-results").mCustomScrollbar();	    
	    $('.alphabet-search-dropdown').parent().on('hidden.bs.dropdown', filterPresenter.clearAlphabetSearchDropdown)
	    
	    filterPresenter.setupPriceDropdown();
	    $('.pricefilter').first().parent().on('hide.bs.dropdown', filterPresenter.addPriceFilter)
	    
	    $(document).on("click", "#filters .categoryItem", filterPresenter.showCategorySubmenuItem);
        $(document).on("click", '#filters .selectedFilters>span>a', filterPresenter.removeFilter);
        $('#filters .select_filter').click(filterPresenter.onFilterSelect);        
        $("#filters .customer").click(filterPresenter.selectCustomerFilter);
        $(document).on('keyup', '#filters input.drop-search', filterPresenter.filterTypeAhead);        
        $(document).on("click","#filters .alphabets>a", filterPresenter.scrollToStore);
        
        $(".drop-search").click(function(e){
          	e.preventDefault();
          	return false;
      	});							
	},				 	
 	
 	refreshIfNeeded: function(){ 	        	  
 	      if (filterPresenter.needsRefresh && !filterPresenter.pauseRefresh){
 	          filterPresenter.onFilterSelect();
 	      }
 	}, 	 	
 	
 	onFilterSelect: function(e){ 	     	 
 	    
 	    if (e != null){  	    	  	    	     	    
    	   filterPresenter.createSelectedFilter(e);    	
 	    }
 	    
 	    // Search for new filters
	 	var criteria = new Object();
	 	var isSearch = $( "#search-bar" ).val().trim().length > 0;
	 	var areAnyFiltersChecked = false;	 	
	 	
	 	$("#filters .selectedFilters span").each(function(){
            areAnyFiltersChecked = true;
            
            var filterType = $(this).attr("filterType");            
            
            if (criteria[filterType] == undefined || criteria[filterType] == null){
	 		    criteria[filterType] = [];	 				 	
            }
	 	    	 		
	 		if(filterType == "price"){
	 			var abovePrice = parseInt($(this).attr("min"));
	 			var belowPrice = parseInt($(this).attr("max"));
	 					 			   
 			   if(criteria['belowPrice'] == null || belowPrice > criteria['belowPrice']){
 			      criteria['belowPrice'] = belowPrice;
 			   }
 			   
 			   if(criteria['abovePrice'] == null || abovePrice < criteria['abovePrice']){
 			      criteria['abovePrice'] = abovePrice;
 			   }
 			   
 			   if (isNaN(criteria['belowPrice'])){
 			        delete criteria['belowPrice'];
 			   }
 			   
	 		}else{
	 		    var filterValues = $(this).attr("value").toLowerCase().replace("all ", '').replace(/'/g, "\\'").split(",");
		 		criteria[filterType] = criteria[filterType].concat(filterValues);
	 		}
	 	});	 
	 	
	 	// add customer filter			 	
	 	if (filterPresenter.defaultCustomer != "both"){	 	      	
	 	     criteria['customer'] = [];
	 	     criteria['customer'].push(filterPresenter.defaultCustomer);
	 	}
			 		 	
	 	if (!filterPresenter.pauseRefresh){
	 	    productPresenter.filterStore = []; 	        
 	        gridPresenter.beginTask(); 
	 	 
    	 	if (isSearch){
    	 	     searchController.search(criteria);
    	 	     
    	 	}else if (areAnyFiltersChecked){    	 	    
    	 	    searchController.criteria = criteria;
                searchController.pageIndex = 0; 
                searchController.isSearchActive = true;
                searchController.hasMoreProducts = true;	 		 		 	
                searchController.getProducts();
    	 	}else{
    	 	      $(".noresults").remove();
    	 	      $("#search-bar-sort-block").css("visibility","hidden");
		      searchController.isSearchActive = false;
    	 	      productPresenter.refreshProducts();
    	 	}
    	 	
    	 	filterPresenter.needsRefresh = false;	 		 	
    	 	filterPresenter.clearAlphabetSearchDropdown();
	 	}
 	},
 	
 	formatSelectedValued: function(group){ 
 		var params = "";
 				
 		if(group != null && group.length > 0){
 			params += "( ";
 			
 			$.each(group, function(index, p) {	
 				params += p + " || ";
 			});	
 			
 			params = params.substring(0,params.length-4); 	 	
		 	params += ") && ";
 		}	
 		
 		return params;
 	},
 	
 	selectCustomerFilter: function(e){
 	      var previousSelectedCustomer = filterPresenter.defaultCustomer; 	      	      
 	      var canRefresh = false;
 	      
 	      if (e && $(e.currentTarget).attr("type") == "customer"){
 	          canRefresh = true;
 	          
 	          if ($(e.currentTarget).hasClass("selected")){
 	              $(e.currentTarget).removeClass("selected");    
 	          }else{
 	              $(".nav-filter.customer").removeClass("selected"); 	              
 	              $(e.currentTarget).addClass("selected");
 	          }	          
 	      }
 	      
 	      var $selected = $(".nav-filter.customer.selected");
 	      
 	      if ($selected.length != 1){
 	          filterPresenter.defaultCustomer = "both"; 	 	           	          
 	          filterPresenter.hideSubcategories("none"); 	          
 	          
 	      }else if ($selected.attr("value") == "men"){
 	          filterPresenter.defaultCustomer = "men"; 	           	          
 	          filterPresenter.hideSubcategories("women");
 	           	               	      
 	      }else{
 	          
              filterPresenter.defaultCustomer = "women";              	          
	          filterPresenter.hideSubcategories("men"); 	          	           	           	          
 	      }  	       	      
 	      
 	      // update cookie
 	      document.cookie="customer="+filterPresenter.defaultCustomer+"; expires=Sun, 31 Dec 9999 12:00:00 UTC; path=/";
 	      
 	      if (canRefresh && previousSelectedCustomer != filterPresenter.defaultCustomer){
 	          filterPresenter.onFilterSelect();
 	      }
 	}, 
 	
 	refreshCustomerFilter: function(){
 	      var customer = session.getCookie("customer");
 	      
 	      $(".nav-filter.customer").removeClass("selected");
 	      if (customer == "men"){
 	             $(".nav-filter.customer[value=men]").addClass("selected");
 	             filterPresenter.defaultCustomer = "men";
 	             filterPresenter.hideSubcategories("women"); 
 	      }else if (customer == "women"){
 	             $(".nav-filter.customer[value=women]").addClass("selected");
 	             filterPresenter.defaultCustomer = "women";
 	             filterPresenter.hideSubcategories("men"); 
 	      }else{
 	          filterPresenter.defaultCustomer = "both";   
 	          filterPresenter.hideSubcategories("none"); 
 	      }
 	},	
 	
 	hideSubcategories: function(customer){ 
 	      $(".filterItem").removeClass("disabled");              	 
          $(".filterItem." + customer).addClass("disabled");
          
          $(".categoryItem").each(function(){
                if ($(this).find(".filterItem." + customer).length == $(this).find(".filterItem").length){
                    $(this).addClass("disabled"); 
                }else{
                    $(this).removeClass("disabled");   
                }                                                
          }); 	                         
 	},
 	
 	createSelectedFilter: function(e){ 	       	  
 	    var tagText = $(e.currentTarget).text();	  
 	    var tagValue = $(e.currentTarget).attr("value");	  
	    var tagType = $(e.currentTarget).parents("ul.filter-options").attr("filterType");	  
	    
	    if ($('.selectedFilters span[value="'+tagValue+'"]').length <= 0){	    
	        var $filterButton = $('<span>').attr("value",tagValue).attr("filterType",tagType).text(tagText).append(
                $('<a class="icon-svg4"></a>')
    	    );	       	        
	       
          	$(".selectedFilters").append($filterButton);
	    }
    	
    	$(e.currentTarget).parents(".open").first().removeClass("open");
 	}, 	 	 	
	 
	 clearFilters: function(){
	   $(".nav-filter.customer").removeClass("selected");
	   $("#filters .selectedFilters span").remove();
	   filterPresenter.defaultCustomer = "both";
	 },
	 
	 removeFilter: function(e){      	      		 	     	    
 	    $(e.currentTarget).parent().remove();
 	    filterPresenter.needsRefresh = true;
 	    filterPresenter.onFilterSelect();
 	    return false;
 	 },
	 
	 filterTypeAhead: function(e){
	     var $dropdown = $(e.currentTarget).parents(".dropdown-menu");
	     $dropdown.find(".alphabets>a").removeClass("selected");
	     var searchTerm = $(e.currentTarget).val().trim().toLowerCase();
	     
	     if (!searchTerm || searchTerm == ""){
	         $dropdown.find("ul.search-results li").show();
       	     $dropdown.find(".alphabets>a").show();
       	     return;
	     }
	     
	     var invalidStores = $dropdown.find("ul.search-results li").filter(function(){
	           var item = $(this).find("a").attr("value");
	           
	           if (typeof item !== typeof undefined && item !== false) { 
	               item = item.toLowerCase();
	               return item.indexOf(searchTerm) != 0;
	           }
	           
	           return false;
	     });
	     	     
	     var invalidFirstLetters = $dropdown.find(".alphabets>a").filter(function(){
	           var letter = $(this).text().toLowerCase();	          
	           var searchFirstLetter = searchTerm.substr(0,1);
	           return searchFirstLetter != letter;	           	           
	     });	     	     
	     
	     $dropdown.find("ul.search-results li").show();
	     invalidStores.hide();
	     
	     if (searchTerm.length > 0){
	           $dropdown.find("ul.search-results li.brand-letter").hide(); 
	     }else{
	           $dropdown.find("ul.search-results li.brand-letter").show(); 
	     }
	     
	     $dropdown.find(".alphabets>a").show();
	     invalidFirstLetters.hide();
	 },
	 
	 showCategorySubmenuItem: function(e){	      	       
	       e.preventDefault(); 	                  	          
	       return false;
	 },
	 
	 clearAlphabetSearchDropdown: function(){
	       $("input.drop-search").val("");
	       $("ul.search-results:not(.category-dropdown) li").show(); 
	       $(".alphabets>a").show();
	       $(".alphabets>a.selected").removeClass("selected");	       
	 },
	 
	 scrollToStore: function(e){
		e.preventDefault();
		$(".alphabets>a").removeClass("selected");
		
		var letter = $(e.currentTarget).attr("rel");
        $(e.currentTarget).addClass("selected");        			
		$(e.currentTarget).parents(".dropdown-menu").find(".search-results").mCustomScrollbar("scrollTo", letter);

        return false;
	 },
	 
	 setupPriceDropdown: function(e){
	    var maxValue = $("#price-range").attr("max");
	    var startingMinRange = maxValue * -1;
	    var startingMinValue = startingMinRange / 2;
	   
	    $( "#price-range" ).slider({
            orientation: "vertical",
            range: true,
            step: 10,
            min: startingMinRange,
            max: 0,
            values: [ startingMinValue, 0 ],
            stop: filterPresenter.addPriceFilter,
            slide: function( event, ui ) {
              var minVal = Math.abs(ui.values[1]);
              $( "#price-range-min-value" )
                  .attr("value", minVal)
                  .text("$" + filterPresenter.formatNumber(minVal, 0));
              
              var maxVal = Math.abs(ui.values[0]);
              var maxValText = maxVal;
              
              if (maxVal == $("#price-range").attr("max")){
                maxValText = "Unlimited";
              }else{
                maxValText = "$" + filterPresenter.formatNumber(maxVal, 0); 
              }
              
              $( "#price-range-max-value" )
                  .attr("value", maxVal)
                  .text(maxValText);            
            }
        });         
	 },
	 
	 addPriceFilter: function(event, ui){
 	    var minPrice = parseInt($("#price-range-min-value").attr("value"));	  
 	    var maxPrice = parseInt($("#price-range-max-value").attr("value"));
	    var isMaxPrice = maxPrice == $("#price-range").attr("max") || isNaN(maxPrice);
	
	    // remove price tag if the min and price equal the bounds for the price range
	    if (minPrice == 0 && isMaxPrice){
	       if ($('.selectedFilters span[filterType="price"]').length > 0){      
	           $('.selectedFilters span[filterType="price"]').remove();   
	       }
	       
	       return;
	    }
	    
	    var priceTagText = '';
	        
        if (minPrice == 0){
           priceTagText = "Under $" + maxPrice;
        }else if (isMaxPrice){
           priceTagText = "Over $" + minPrice;
        }else{
           priceTagText = "$" + minPrice + " - $" + maxPrice;
        }
        
        if (isMaxPrice){
           maxPrice = "unlimited";  
        }       	            
	        
	    if ($('.selectedFilters span[filterType="price"]').length <= 0){	               	       
	       var $filterButton = $('<span>').attr("filterType","price").attr("min", minPrice).attr("max", maxPrice).text(priceTagText).append(
                $('<a class="icon-svg4"></a>')
    	    );	
	       
          	$(".selectedFilters").append($filterButton);
	    }else{
	       $('.selectedFilters span[filterType="price"]').first().attr("min", minPrice).attr("max", maxPrice).text(priceTagText).append(
                $('<a class="icon-svg4"></a>')
    	   );
	    }
	    
	    if (ui == null){
            filterPresenter.onFilterSelect();
	    }
	 },
	 
	 formatNumber: function(number, precision){
	   return number.toFixed(precision).replace(/./g, function(c, i, a) {
           return i && c !== "." && !((a.length - i) % 3) ? ',' + c : c;
       }); 
	 }	 	
};
