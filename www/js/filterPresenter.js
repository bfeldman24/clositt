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
	    $('#company-search-dropdown').parent().on('hidden.bs.dropdown', filterPresenter.clearCompanyDropdown)
	    
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
            var filterValue = $(this).attr("value").toLowerCase().replace(/'/g, "\\'");
            
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
	 		}else{
		 		criteria[filterType].push(filterValue);
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
    	 	      productPresenter.refreshProducts();
    	 	}
    	 	
    	 	filterPresenter.needsRefresh = false;	 		 	
    	 	filterPresenter.clearCompanyDropdown();
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
 	          filterPresenter.hideSubcategories("None");
 	      }else if ($selected.attr("value") == "men"){
 	          filterPresenter.defaultCustomer = "men"; 	           	          
 	          filterPresenter.hideSubcategories("Women");
 	      }else{
 	          
              filterPresenter.defaultCustomer = "women";              	          
	          filterPresenter.hideSubcategories("Men"); 	          	           	           	          
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
 	      }else if (customer == "women"){
 	             $(".nav-filter.customer[value=women]").addClass("selected");
 	             filterPresenter.defaultCustomer = "women";
 	      }else{
 	          filterPresenter.defaultCustomer = "both";   
 	      }
 	},	
 	
 	hideSubcategories: function(customer){
    	 // Toggle Subcategories
         $(".subcategory").each(function(){
               var isAllOneCustomer = true;
           
               $(this).find(".controls[filter-customer]").each(function(){
                   isAllOneCustomer = isAllOneCustomer && $(this).attr("filter-customer") == customer;
               });
               
               if (isAllOneCustomer){                    
                    $(this).prev().removeClass("open");
                    $(this).prev().hide('blind', 'slow', function(){ $(this).hide(); });
                    
                    $(this).hide('blind', 'slow', function(){ $(this).hide(); });
                    $(this).find(':checkbox').prop('checked', false);                                                            
               }else{
                    $(this).prev().show('blind', 'slow', function(){ $(this).show(); });                                        
               }
         });
 	},
 	
 	createSelectedFilter: function(e){ 	       	  
 	    var tagValue = $(e.currentTarget).attr("value");	  
	    var tagType = $(e.currentTarget).parents("ul.filter-options").attr("filterType");	  
	    
	    if ($('.selectedFilters span[value="'+tagValue+'"]').length <= 0){	    
	        var $filterButton = $('<span>').attr("value",tagValue).attr("filterType",tagType).text(tagValue).append(
                                     $('<a class="icon-svg4"></a>')
                         	   );
	       
	        if (tagType == "price"){
	           var min = $(e.currentTarget).attr("min");
	           var max = $(e.currentTarget).attr("max");
	           
	           $filterButton.attr("min",min).attr("max",max);  
	        }
	       
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
	 
	 filterTypeAhead: function(){
	     $(".alphabets>a").removeClass("selected");
	     var storeSearch = $("input.drop-search").val().trim().toLowerCase();
	     
	     if (!storeSearch || storeSearch == ""){
	         $("ul.search-results[filterType=company] li").show();
       	     $(".alphabets>a").show();
       	     return;
	     }
	     
	     var invalidStores = $("ul.search-results[filterType=company] li").filter(function(){
	           var store = $(this).find("a").attr("value");
	           
	           if (typeof store !== typeof undefined && store !== false) { 
	               store = store.toLowerCase();
	               return store.indexOf(storeSearch) != 0;
	           }
	           
	           return false;
	     });
	     	     
	     var invalidFirstLetters = $(".alphabets>a").filter(function(){
	           var letter = $(this).text().toLowerCase();	          
	           var searchFirstLetter = storeSearch.substr(0,1);
	           return searchFirstLetter != letter;	           	           
	     });	     	     
	     
	     $("ul.search-results[filterType=company] li").show();
	     invalidStores.hide();
	     
	     if (storeSearch.length > 0){
	           $("ul.search-results[filterType=company] li.brand-letter").hide(); 
	     }else{
	           $("ul.search-results[filterType=company] li.brand-letter").show(); 
	     }
	     
	     $(".alphabets>a").show();
	     invalidFirstLetters.hide();
	 },
	 
	 showCategorySubmenuItem: function(e){
	       e.preventDefault();
	       	       	       
	       var subcategory = $(e.currentTarget).find("ul.subcategory").first();		              	              
	       subcategory.toggle("slow", function(){	           	           	           
               if ($(e.currentTarget).hasClass("active")){                                        
                    $(e.currentTarget).removeClass("active");
               }else{
                    $(e.currentTarget).addClass("active");
               }
	       });
	           
	       return false;
	 },
	 
	 clearCompanyDropdown: function(){
	       $("input.drop-search").val("");
	       $("ul.search-results[filterType=company] li").show(); 
	       $(".alphabets>a").show();
	       $(".alphabets>a.selected").removeClass("selected");	       
	 },
	 
	 scrollToStore: function(e){
		e.preventDefault();
		$(".alphabets>a").removeClass("selected");
		
		var letter = $(e.currentTarget).attr("rel");
        $(e.currentTarget).addClass("selected");        			
		$(".search-results").mCustomScrollbar("scrollTo", letter);

        return false;
	 }	 	
};