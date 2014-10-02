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
	    $(".search-results").mCustomScrollbar();
	    
        $(document).on("click", '#filters .selectedFilters>span>a', filterPresenter.removeFilter);
        $('#filters .select_filter').click(filterPresenter.onFilterSelect);        
        $(document).on('keyup', '#filters input.drop-search', filterPresenter.filterTypeAhead);        
        $(document).on("click","#filters .alphabets>a", filterPresenter.scrollToStore);
						
//		$("#filter-float").on("click",".filterHeader", filterPresenter.toggleFilterOptionsVisibility);
//		$("#filter-float").on("click",".filterSubheader", filterPresenter.toggleFilterSubOptionsVisibility);
//		$("#filter-float").on("click",".filterHeader-Customer .customerOption", filterPresenter.selectCustomerFilter);		
//		$("#filter-float").on("click",".selectedFilter-x", filterPresenter.removeFilter);
//		
//		$("#filter-float").on("click","input", filterPresenter.onFilterInputChecked);	
//				
//		$.getJSON(window.HOME_ROOT + "s/filters", filterPresenter.populateFilterData);
	},		
	
	populateFilterData: function(store){		
		var companies = store["companies"];
	 	var customers = store["customers"];
	 	var categories = store["categories"];
	 	var prices = store["prices"];
	 	filterPresenter.createFilters(companies, customers, categories, prices);		
	},
 
	createFilters:  function(companies, customers, categories, prices){
 		filterPresenter.companies = companies;
 		filterPresenter.customers = customers;
 		filterPresenter.categories = categories;
 		
 		var priceBuckets = new Array();
 		
 		var priceCount = prices.length;

 		priceBuckets[0] = 0;
 		var i=0;
 		while(priceBuckets[i] < prices[priceCount - 1] && i < 5){
 			priceBuckets[i+1] = priceBuckets[i] + 50;
 			i++;
 		}
 		
 		if(priceBuckets[i] < prices[priceCount - 1]){
 			priceBuckets[i]	= (Math.round(prices[priceCount - 1] / 50) * 50) + 50;
 		}
 		
 		$("#filter-float").html("");
 		$("#filter-float").append($("<div>").attr("id","selectedFilters"));
 		
 		var selectedWomen = filterPresenter.defaultCustomer == "women" ? "selected" : "";
 		var selectedMen = filterPresenter.defaultCustomer == "men" ? "selected" : "";
 		$("#filter-float").append($("<h4>").addClass("filterHeader-Customer").css("padding","0").append(
 		         $("<div>").addClass("customerOption " + selectedWomen).attr("filterid","women").text("Women")
 		     ).append(
 		         $("<div>").addClass("customerOption " + selectedMen).attr("filterid","men").text("Men")
 		     )
 		);
// 		var customerOptions = $("<div>").addClass("filterOptions");
// 		
// 		$.each(filterPresenter.customers, function(index, value) {
// 		    filterPresenter.allFilters.push(value);
// 		    
// 			customerOptions.append(
// 				$("<div>").addClass("controls").append(
// 					$("<label>").addClass("checkbox").append(
// 						$("<input>").attr("type","checkbox").attr("name","customer").attr("value",value)
// 					).append($("<span>").addClass("filterValueName").html(value))
// 				)
// 			)
// 		}); 		
// 		$("#filter-float").append(customerOptions);
 		
 		
 		$("#filter-float").append($("<h4>").html("Category").addClass("filterHeader").attr('id', 'category'));
 		var categoryOptions = $("<div>").addClass("filterOptions");
 		$.each(filterPresenter.categories, function(subindex, subcategory) {
 		    categoryOptions.append($("<h5>").addClass("filterSubheader").text(subindex));
 		    
 		    var subCategoryOptions = $("<div>").addClass("subcategory"); 		    
 		    $.each(subcategory, function(index, value) {  		     
     		    filterPresenter.allFilters.push(value[0]);
     		     
     			subCategoryOptions.append(
     				$("<div>").addClass("controls").attr("filter-customer",value[1]).append(
     					$("<label>").addClass("checkbox").append(
     						$("<input>").attr("type","checkbox").attr("name","category").attr("value",value[0])
     					).append($("<span>").addClass("filterValueName").html(value[0]))
     				)
     			)
 		    });
 		    
 		    categoryOptions.append(subCategoryOptions);
 		});  
 		$("#filter-float").append(categoryOptions);	 		
 		
 		$("#filter-float").append($("<h4>").html("Brand").addClass("filterHeader").attr('id', 'brands'));
 		var brandOptions = $("<div>").addClass("filterOptions");
 		$.each(filterPresenter.companies, function(index, value) {
 		    filterPresenter.allFilters.push(value[0]);
 		    
 			brandOptions.append(
 				$("<div>").addClass("controls").attr("filter-customer",value[1]).append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","company").attr("value",value[0])
 					).append($("<span>").addClass("filterValueName").html(value[0]))
 				)
 			)
 		}); 
 		$("#filter-float").append(brandOptions);
 		
 		$("#filter-float").append($("<h4>").html("Price").addClass("filterHeader").attr('id', 'price'));	
 		var priceOptions = $("<div>").addClass("filterOptions");	 		 		
 		for(var i=0;i<priceBuckets.length-1;i++){
 			priceOptions.append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","filterprice").attr("value",priceBuckets[i]).attr("max",priceBuckets[i+1])
 					).append($("<span>").addClass("filterValueName").html("$"+priceBuckets[i]+" - $"+priceBuckets[i+1]))
 				)
 			)
 		}
 		$("#filter-float").append(priceOptions);
 		
 		$("#filter-float").append($("<h4>").html("Color").addClass("filterHeader").attr('id', 'color'));
 		var colorOptions = $("<div>").addClass("filterOptions");	 		 				 		 		 		
		$("#filter-float").append(colorOptions.append(colorPresenter.getColorFilters())); 		 		 		
 		
 		filterPresenter.allFilters.sort(function(a,b){
 		     return a.split(" ").length < b.split(" ").length;
 		});
 		
 		filterPresenter.showFilter();
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
            
	 		criteria[filterType] = new Array();	 				 	
	 	    	 		
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
			 		 	
	 	if (!filterPresenter.pauseRefresh){
	 	    productPresenter.filterStore = []; 	        
 	        gridPresenter.beginTask(); 
	 	 
    	 	if (isSearch){
    	 	     searchController.search(criteria);
    	 	     
    	 	}else if (areAnyFiltersChecked){
    	 	    searchController.criteria = criteria;
                searchController.pageIndex = 0; 
                searchController.hasMoreProducts = true;	 		 		 	
                searchController.getProducts();
    	 	}else{
    	 	      $(".noresults").remove();
    	 	      $("#search-bar-sort-block").css("visibility","hidden");
    	 	      productPresenter.refreshProducts();
    	 	}
    	 	
    	 	filterPresenter.needsRefresh = false;	 		 	
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
 	      var isFilter = false;
 	      
 	      var selectedCustomer = $("#filter-float").find(".customerOption.selected").first();
 	      
 	      if (selectedCustomer != null){
 	          selectedCustomer.removeClass("selected");
 	      }
 	      
 	      // Do not reselect the customer if it was the one that was previously selected 
 	      // and then clicked
 	      if (e != null && e.currentTarget != null){   
 	          isFilter = true;
 	          
 	          if (selectedCustomer.attr("filterid") != $(e.currentTarget).attr("filterid")){      	      
 	              $(e.currentTarget).addClass("selected");
 	          } 	          
 	           	      
 	      }else if (e == "men"){ 	      
 	          $('.customerOption[filterid="men"]').addClass("selected");
 	          
 	      }else if (e == "women"){ 	      
 	          $('.customerOption[filterid="women"]').addClass("selected");
 	      }
 	      
 	      filterPresenter.refreshFilters();
 	      
 	      if (isFilter){
 	          filterPresenter.onFilterSelect();
 	      }
 	}, 	
 	 	
 	refreshFilters: function(){
 	      var customer = filterPresenter.getSelectedCustomer();
 	      
 	      if (customer == "men"){
 	          filterPresenter.defaultCustomer = "men";
 	          
 	          // Need to use the callback because the animation visibility function does not hide hidden elements 	          
 	          $('.filterOptions .controls[filter-customer="Men"]').show('blind', 'slow', function(){ $(this).show(); });	          
 	          $('.filterOptions .controls[filter-customer="Women"]').hide('blind', 'slow', function(){ $(this).hide(); });
 	          
 	          filterPresenter.hideSubcategories("Women");
 	      }else{
 	          
 	          if (customer == "women"){
 	              filterPresenter.defaultCustomer = "women";
 	              
 	              $('.filterOptions .controls[filter-customer="Men"]').hide('blind', 'slow', function(){ $(this).hide(); });
     	          $('.filterOptions .controls[filter-customer="Women"]').show('blind', 'slow', function(){ $(this).show(); });
     	          
     	          filterPresenter.hideSubcategories("Men");
 	          }else{
 	              filterPresenter.defaultCustomer = "both";
 	              
 	              $('.filterOptions .controls[filter-customer="Men"]').show('blind', 'slow', function(){ $(this).show(); });
     	          $('.filterOptions .controls[filter-customer="Women"]').show('blind', 'slow', function(){ $(this).show(); });
     	          $('.filterOptions .filterSubheader').show('blind', 'slow', function(){ $(this).show(); });
 	          } 	           	           	          
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
    	$(".selectedFilters").append(
    	   $('<span>').attr("value",tagValue).attr("filterType",tagType).text(tagValue).append(
                $('<a class="icon-svg4"></a>')
    	   )
    	);
    	
    	$(e.currentTarget).parents(".open").first().removeClass("open");
 	}, 	 	 	
	 
	 clearFilters: function(){
	   $("#filter-float").find("input").prop("checked", false);
	   $("#filter-float").find(".selectedColor").removeClass("selectedColor");
	   $("#selectedFilters").html("");
	   
	   $("#filter-float").find(".customerOption").removeClass("selected");
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
	     
	     var invalidStores = $("ul.search-results[filterType=store] li").filter(function(){
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
	     
	     $("ul.search-results[filterType=store] li").show();
	     invalidStores.hide();
	     
	     $(".alphabets>a").show();
	     invalidFirstLetters.hide();
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