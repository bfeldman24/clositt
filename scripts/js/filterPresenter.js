var filterPresenter = {    
    allFilters: null,
    companies: null,
    customers: null,
    categories: null,
    defaultCustomer: "women",
	
	init: function(){		
	    filterPresenter.allFilters = [];
	   
		$(document).on("click","#filter-toggle", filterPresenter.filterPanelToggle);
						
		$("#filter-float").on("click",".filterHeader", filterPresenter.toggleFilterOptionsVisibility);
		$("#filter-float").on("click",".filterSubheader", filterPresenter.toggleFilterSubOptionsVisibility);
		$("#filter-float").on("click",".filterHeader-Customer .customerOption", filterPresenter.selectCustomerFilter);		
		$("#filter-float").on("click",".selectedFilter-x", filterPresenter.removeFilter);
		
		$("#filter-float").on("click","input", function(){
			setTimeout(filterPresenter.onFilterSelect, 50);			
		});	
		
		//firebase.$.child('clositt/filterdata').once('value', filterPresenter.populateFilterData);	 					
		$.getJSON(window.HOME_ROOT + "s/filters", filterPresenter.populateFilterData);
	},
	
	populateFilterDataOld: function(store){		
		var companies = store.child("companies").val();
	 	var customers = store.child("customers").val();
	 	var categories = store.child("categories").val();
	 	var prices = store.child("prices").val();										 		 	
	 	filterPresenter.createFilters(companies, customers, categories, prices);		
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
     		    filterPresenter.allFilters.push(value);
     		     
     			subCategoryOptions.append(
     				$("<div>").addClass("controls").append(
     					$("<label>").addClass("checkbox").append(
     						$("<input>").attr("type","checkbox").attr("name","category").attr("value",value)
     					).append($("<span>").addClass("filterValueName").html(value))
     				)
     			)
 		    });
 		    
 		    categoryOptions.append(subCategoryOptions);
 		});  
 		$("#filter-float").append(categoryOptions);	 		
 		
 		$("#filter-float").append($("<h4>").html("Brand").addClass("filterHeader").attr('id', 'brands'));
 		var brandOptions = $("<div>").addClass("filterOptions");
 		$.each(filterPresenter.companies, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		    
 			brandOptions.append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","company").attr("value",value)
 					).append($("<span>").addClass("filterValueName").html(value))
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
 		 		
 		$("#filter-float").append($("<br><br><br><br><br><br><br>"));
 		filterPresenter.showFilter();
 	},
 
 	
 	onFilterSelect: function(){
 	    productPresenter.filterStore = [];
 	    window.scrollTo(0, 0);
 	    gridPresenter.beginTask(); 	 
 	    $("#selectedFilters").html("");      	    
 	    
	 	var criteria = new Object();
	 	var isSearch = $( "#search-bar" ).val().trim().length > 0;
	 	var areAnyFiltersChecked = false;
	 	var filters = new Array("filterprice","category","company");
	 	
	 	$.each(filters, function(index, filterName) {
	 		criteria[filterName] = new Array();
	 		
		 	$("#filter-float").find('input[name="'+filterName+'"]:checked').each(function(){
		 	    areAnyFiltersChecked = true;
		 		var name = $(this).attr("name");
		 		var value = $(this).val().toLowerCase();
		 		var value = value.replace(/'/g, "\\'");
		 		filterPresenter.createSelectedFilter($(this).val(), $(this).next(".filterValueName").text());
		 		
		 		if(name == "filterprice"){
		 			var abovePrice = parseInt(value);
		 			var belowPrice = parseInt($(this).attr("max"));
		 					 			   
	 			   if(criteria['belowPrice'] == null || belowPrice > criteria['belowPrice']){
	 			      criteria['belowPrice'] = belowPrice;
	 			   }
	 			   
	 			   if(criteria['abovePrice'] == null || abovePrice < criteria['abovePrice']){
	 			      criteria['abovePrice'] = abovePrice;
	 			   }
		 		}else{
			 		criteria[filterName].push(value);
		 		}
		 	});
	 	});
	 		 	
	 	var customer = filterPresenter.getSelectedCustomer();
	 	
	 	if (customer != null){
	 	     criteria['customer'] = [customer];	 	
	 	}
	 	criteria['colors'] = colorPresenter.getSelectedColors();
	 	
	 	if (criteria['colors'] != null && criteria['colors'].length > 0){     
	 	     areAnyFiltersChecked = true;
	 	}
	 	
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
 	      if (e != null && e.currentTarget != null && selectedCustomer.attr("filterid") != $(e.currentTarget).attr("filterid")){   
 	                	      
 	          $(e.currentTarget).addClass("selected");
 	          isFilter = true;
 	          
 	      }else if (e == "men"){ 	      
 	          $('.customerOption[filterid="men"]').addClass("selected");
 	          
 	      }else if (e == "women"){ 	      
 	          $('.customerOption[filterid="women"]').addClass("selected");
 	      }
 	      
 	      if (isFilter){
 	          filterPresenter.onFilterSelect();
 	      }
 	}, 	
 	
 	getSelectedCustomer: function(){
 	      var selected = $("#filter-float").find(".customerOption.selected").first();
 	       	      
 	      if (selected.length > 0){
 	          return selected.attr("filterid");   
 	      }else if ($("#filter-float").find(".customerOption").length > 0){
 	          return null; 	          
 	      }else{
 	          return filterPresenter.defaultCustomer;    
 	      } 	       	      
 	},
 	
 	createSelectedFilter: function(filterid, filterValue){ 	       	  
 	      $("#selectedFilters").append(
 	          $("<div>").addClass("selectedFilter-wrapper").attr("filterid", filterid).append(
 	              $("<div>").addClass("selectedFilter-x").text("X")
 	          ).append(
     	          $("<div>").addClass("selectedFilter-value").text(filterValue)
 	          )
 	      );
 	},
 	
 	removeFilter: function(e){
 	    var filterValue = $(e.currentTarget).parent().attr("filterid");
 	    
 	    var input = $("#filter-float").find('input[value="'+filterValue+'"]');
 	    
 	    if (input == null || input.length <= 0){
 	          colorPresenter.removeSelectedColor(filterValue);
 	    }else{
 	          input.prop('checked', false);  
 	    }
 	    
 	    filterPresenter.onFilterSelect();
 	},
 	
 	filterPanelToggle: function(){
 	 		
	 	 $("#filter-float").toggle('slide',1000);	 	 
			 
	 	 if(isNaN(parseInt($("#product-grid").css("left"))) || parseInt($("#product-grid").css("left")) == 0){
	 	 	$("#product-grid").animate({left: '100px'}, 1000);
	 	 	$("#filter-toggle").animate({left: '165px'}, 1000);
	 	 	$("#filter-toggle").text('Hide Filter');
	 	 }else{
	 	 	$("#product-grid").animate({left: '0px'}, 1000);
	 	 	$("#filter-toggle").animate({left: '-37px'}, 1000);
	 	 	$("#filter-toggle").text('Show Filter');
	 	 } 		
	 },
	 
	 clearFilters: function(){
	   $("#filter-float").find("input").prop("checked", false);
	   $("#selectedFilters").html("");
	 },
	 
	 hideFilterPanel: function(){
	 	if($("#filter-float").is(":visible")){
		 	 $("#filter-float").hide('slide',500);
		 	 $("#product-grid").animate({left: '0px'}, 500);
		 	 $("#filter-toggle").animate({left: '-37px'}, 500);
		 	 $("#filter-toggle").text('Show Filter');
	 	}
	 },
	 
	 showFilter: function(){
	   if(!$("#review-form").is(":visible")){ 
	        $("#filter-float").show('slide',500);
	 	 	$("#product-grid").animate({left: '100px'}, 500);
	 	 	$("#filter-toggle").animate({left: '165px'}, 500);
	 	 	$("#filter-toggle").text('Hide Filter');    
	   }
	 },
	 
	 toggleFilterOptionsVisibility: function(){
           var filterOptions = $(this).next(".filterOptions").first(); 
	       
	       if (filterOptions != null){
	           if (filterOptions.is(":visible")){
	               $(this).removeClass("open");
	           }else{
	               $(this).addClass("open");   
	           }
	           
	           filterOptions.toggle('blind');   
	       }
	 },
	 
	 toggleFilterSubOptionsVisibility: function(){
           var filterOptions = $(this).next(".subcategory").first(); 
	       
	       if (filterOptions != null){
	           if (filterOptions.is(":visible")){
	               $(this).removeClass("open");
	           }else{
	               $(this).addClass("open");   
	           }
	           
	           filterOptions.toggle('blind');   
	       }
	 }
};