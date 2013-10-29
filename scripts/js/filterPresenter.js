var filterPresenter = {
    
    allFilters: null,
	
	init: function(){		
	    filterPresenter.allFilters = [];
	   
		$(document).on("click","#filter-toggle", filterPresenter.filterPanelToggle);
		$("#filter-float").on("click","input", function(){
			setTimeout(filterPresenter.onFilterSelect, 50);			
		});				
	},
 
	createFilters:  function(companies, customers, categories, prices){
 		prices = prices.sort(function(a,b){return parseInt(a)-parseInt(b)});
 		companies = companies.sort();
 		customers = customers.sort();
 		categories = categories.sort();
 		
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
 		
 		
 		$("#filter-float").append($("<h4>").html("Shop For:"));
 		
 		$.each(customers, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		    
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","u").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		});
 		
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Category:"));
 		$.each(categories, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		     
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","a").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		}); 
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Price:"));		 		 		
 		for(var i=0;i<priceBuckets.length-1;i++){
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","fp").attr("value",priceBuckets[i])
 					).append($("<span>").html("$"+priceBuckets[i]+" - $"+priceBuckets[i+1]))
 				)
 			)
 		}
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Brands:"));
 		$.each(companies, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		    
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","o").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		}); 
 		
 		$("#filter-float").append($("<br><br><br><br><br><br><br>"));
 		filterPresenter.showFilter();
 	},
 
 	
 	onFilterSelect: function(){		
	 	var params = new Object(); 	
	 	var isSearch = $( "#search-bar" ).val().toLowerCase().trim().length > 0;
	 	var areAnyFiltersChecked = false;
	 	var filters = new Array("customer","price","category","company");
	 	var filterNameCode = new Array("u","fp","a","o");	
	 	
	 	$.each(filters, function(index, filterName) {
	 		params[filterName] = new Array();
	 		
		 	$("#filter-float").find('input[name="'+filterNameCode[index]+'"]:checked').each(function(){
		 	    areAnyFiltersChecked = true;
		 		var name = $(this).attr("name");
		 		var value = $(this).attr("value");
		 		var value = value.replace(/'/g, "\\'");	 		
		 		
		 		if(name == "price"){
		 			var prices = value.split(" - "); 			
		 			params[filterName].push("p." + name + '==\'' + prices[prices.length-1] + '\'');
		 		}else{	 		
			 		params[filterName].push("p." + name + '==\'' + value + '\'');
		 		}
		 	}); 		 	
	 	}); 
	 	
	 	if (areAnyFiltersChecked){	 		 	 	 		 		 	
	 	
     	 	// Format selected parameters into a boolean expression
     	 	var allParams = filterPresenter.formatSelectedValued(params.customer);
     	 	allParams += filterPresenter.formatSelectedValued(params.price);
     	 	allParams += filterPresenter.formatSelectedValued(params.category);
     	 	allParams += filterPresenter.formatSelectedValued(params.company);	 		 		 		 	
     	 	allParams = allParams.substring(0,allParams.length-4); 	 	
     	 	
     	 	$("#product-grid").children().remove();	 		 	
     	 	$("#product-grid").append($("<br><br><br><br>"));
     	 	
     	 	var products = [];
     	 	if(allParams != ""){	 	     
     	 	     for(var key in productPresenter.filterStore) {
     	 	        var sku = productPresenter.formatSku(key);
     	 	        var p = productPresenter.clothingStore[sku];
     	 	        
     				if (eval(allParams)){
     				    products.push(key);   
     				}
     			}
     	 	}     	
     		
     		if(products.length <= 0){
     			$("#product-grid").append($("<div>").addClass("noresults").html("No Results"));
     		}else{     		 
     			productPresenter.filterStore = productPresenter.getProductsFromSkuList(products);
     			$(".noresults").remove();
     		    productPresenter.refreshFilteredProducts();			     			
     		} 		     	 	

	 	}else if (isSearch){	 	      
	 	     if(Object.keys(productPresenter.filterStore).length <= 0){
     			$("#product-grid").append($("<div>").addClass("noresults").html("No Results"));
     		}else{     		
     			$(".noresults").remove();
     			productPresenter.refreshFilteredProducts();	
     		} 	
	 	}else{
	 	      $(".noresults").remove();
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
 	
 	filterPanelToggle: function(){
 	 		
	 	 $("#filter-float").toggle('slide',1000);	 	 
		
		if(!$("#review-form").is(":visible")){ 	 
		 	 if(isNaN(parseInt($("#product-grid").css("left"))) || parseInt($("#product-grid").css("left")) == 0){
		 	 	$("#product-grid").animate({left: '200px'}, 1000);
		 	 	$("#filter-toggle").animate({left: '185px'}, 1000);
		 	 	$("#filter-toggle").text('Hide Filter');
		 	 }else{
		 	 	$("#product-grid").animate({left: '0px'}, 1000);
		 	 	$("#filter-toggle").animate({left: '-29px'}, 1000);
		 	 	$("#filter-toggle").text('Show Filter');
		 	 }
 		}
	 },
	 
	 clearFilters: function(){
	   $("#filter-float").find("input").prop("checked", false);
	 },
	 
	 hideFilterPanel: function(){
	 	if($("#filter-float").is(":visible")){
		 	 $("#filter-float").hide('slide',500);
		 	 $("#product-grid").animate({left: '0px'}, 500);
		 	 $("#filter-toggle").animate({left: '-29px'}, 500);
		 	 $("#filter-toggle").text('Show Filter');
	 	}
	 },
	 
	 showFilter: function(){
	   if(!$("#review-form").is(":visible")){ 
	        $("#filter-float").show('slide',500);
	 	 	$("#product-grid").animate({left: '200px'}, 500);
	 	 	$("#filter-toggle").animate({left: '185px'}, 500);
	 	 	$("#filter-toggle").text('Hide Filter');    
	   }
	 }
};