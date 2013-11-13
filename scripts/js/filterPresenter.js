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
 						$("<input>").attr("type","checkbox").attr("name","customer").attr("value",value)
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
 						$("<input>").attr("type","checkbox").attr("name","category").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		});  		 		
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Brands:"));
 		$.each(companies, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		    
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","company").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		}); 
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Price:"));		 		 		
 		for(var i=0;i<priceBuckets.length-1;i++){
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","filterprice").attr("value",priceBuckets[i]).attr("max",priceBuckets[i+1])
 					).append($("<span>").html("$"+priceBuckets[i]+" - $"+priceBuckets[i+1]))
 				)
 			)
 		}
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Colors:"));		 		 		 		
		$("#filter-float").append(colorPresenter.getColorFilters());
 		 		
 		$("#filter-float").append($("<br><br><br><br><br><br><br>"));
 		filterPresenter.showFilter();
 	},
 
 	
 	onFilterSelect: function(){
 	    productPresenter.filterStore = [];
 	    window.scrollTo(0, 0);
 	    gridPresenter.beginTask(); 	       	    
 	    
	 	var criteria = new Object();
	 	var isSearch = $( "#search-bar" ).val().trim().length > 0;
	 	var areAnyFiltersChecked = false;
	 	var filters = new Array("customer","filterprice","category","company");
	 	
	 	$.each(filters, function(index, filterName) {
	 		criteria[filterName] = new Array();
	 		
		 	$("#filter-float").find('input[name="'+filterName+'"]:checked').each(function(){
		 	    areAnyFiltersChecked = true;
		 		var name = $(this).attr("name");
		 		var value = $(this).val().toLowerCase();
		 		var value = value.replace(/'/g, "\\'");
		 		
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
	 		 	
	 	criteria['colors'] = colorPresenter.getSelectedColors();
	 	
	 	if (criteria['colors'] != null && criteria['colors'].length > 0){     
	 	     areAnyFiltersChecked = true;
	 	}
	 	
	 	if (isSearch){
	 	     searchController.search(criteria);
	 	     
	 	}else if (areAnyFiltersChecked){	 		 	 	 		 		 	
            searchController.getProducts(criteria, null, searchController.showResults);
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
	 }
};