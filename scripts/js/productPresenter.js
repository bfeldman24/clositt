var productPresenter = {	
	splitValue: 30, 
	productIndex: 0,
	clothingStore: [], 
	filterStore: [], 	
	
	init: function(){		
		firebase.$.child('clositt').once('value', productPresenter.setup);	 	 
	},
	
	setup: function(snapshot){		
		productPresenter.showCompanyProducts(snapshot);
	 	gridPresenter.alignDefaultGrid();
		$('body').css("min-height",$(window).height());	
		productPresenter.productIndex += productPresenter.splitValue;	
	},
 
 	showCompanyProducts: function(store){
	 	var grid = $('<div>').attr("id","product-grid");	
	 	var i=0;
	 	
	 	productPresenter.clothingStore = store.child("products").val();	
	 	productPresenter.filterStore = store.child("products").val();	
	 	var companies = store.child("companies").val();
	 	var customers = store.child("customers").val();
	 	var categories = store.child("categories").val();
	 	var prices = store.child("prices").val();			
		
		for(var i=0; i<productPresenter.splitValue;i++){
			var rand = Math.floor(Math.random() * productPresenter.clothingStore.length);
			var outfit = productPresenter.getProductTemplate(productPresenter.clothingStore[rand]);								
			grid.append(outfit);		 								
		}
	 	 		 			 	
	 	$("#loadingMainContent").hide();
	 	$("#main-content").append(grid);
	 	
	 	filterPresenter.createFilters(companies, customers, categories, prices);
	 },
 
	getProductTemplate: function(product){
		var company = product.o;
		var audience = product.u;
		var category = product.a;
		var link = product.l.replace(/\W/g, '');
		var image = product.i;
		var name = product.n;
		var id = link.replace(/\W/g, '');
		var price = product.p == null || isNaN(product.p) ? "" : "$" + Math.round(product.p);		 	
 		var filterPrice = product.fp; 		 		

		var rand = Math.floor(Math.random() * 3) + 1;
		var shadow = "";
		if(rand == 1){
			shadow = 'shadow';	
		}		
			 			
 		//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
 		var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'"';
		var html ='<div class="outfit" '+attr+'>';
				html +='<div class="picture"><a productid="'+link+'"><img src="' + image + '" class="'+shadow+'" /></a></div>';			
				html +='<div class="overlay">';
					html +='<div class="topleft">';										
						html +='<div class="tagOutfitBtn" data-toggle="tooltip" data-placement="left"><i class="icon-tags icon-white"></i></div>';
					html += '</div>';
					html +='<div class="topright">';										
						html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right"><img id="hanger-'+id+'" class="hanger-icon" src="css/images/hanger-icon-white.png" /><i class="icon-plus-sign icon-white hanger-plus"></i></div>';
					html += '</div>';
					html +='<div class="bottom">';										
						html +='<div class="companyName">' + company + '</div>';
						html +='<div class="price">' +  price + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
		return $(html);
	},
	
	getClosetItemTemplate: function(product){
		var company = product.company;				
		var link = product.link;
		var image = product.image;
		var name = product.name;				
			 			
		var html ='<div class="outfit">';
				html +='<div class="picture"><a href="'+link+'" target="_blank"><img src="' + image + '" /></a></div>';							
				html +='<div class="overlay">';
					html +='<div class="bottom">';										
						html +='<div class="companyName">' + company + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
		return $(html);
	}
};

var filterPresenter = {
	
	init: function(){		
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
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","o").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		}); 
 		
 		$("#filter-float").append($("<br><br><br>"));
 		filterPresenter.showFilter();
 	},
 
 	
 	onFilterSelect: function(){		 
	 	var params = new Object(); 	
	 	var filters = new Array("customer","price","category","company");
	 	var filterNameCode = new Array("u","fp","a","o");	
	 	
	 	$.each(filters, function(index, filterName) {
	 		params[filterName] = new Array();
	 		
		 	$("#filter-float").find('input[name="'+filterNameCode[index]+'"]:checked').each(function(){
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
	 	
	 	// Format selected parameters into a boolean expression
	 	var allParams = filterPresenter.formatSelectedValued(params.customer);
	 	allParams += filterPresenter.formatSelectedValued(params.price);
	 	allParams += filterPresenter.formatSelectedValued(params.category);
	 	allParams += filterPresenter.formatSelectedValued(params.company);	 		 		 		 	
	 	allParams = allParams.substring(0,allParams.length-4); 	 	
	 	
	 	$("#product-grid").children().remove();	 		 	
	 	$("#product-grid").append($("<br><br><br><br>"));
	 	
	 	var products = productPresenter.clothingStore;
	 	if(allParams != ""){
			products = $.grep(products, function(p,i){
				return eval(allParams);	
			});
	 	}
		
		var items = $();
		productPresenter.productIndex = 0;
		for(var i=0; i< productPresenter.splitValue && i< products.length; i++){
				items = items.add(productPresenter.getProductTemplate(products[i]));	
				productPresenter.productIndex = i+1;
		}
		
		if(products.length >= productPresenter.splitValue){ 
			productPresenter.filterStore = products.slice(productPresenter.splitValue);
		}else{
			productPresenter.filterStore = [];
		}
		
		if(items.length <= 0){
			$("#product-grid").append($("<div>").addClass("noresults").html("No Results"));
		}else{
			$("#product-grid").append(items);			
			$(".noresults").remove();
		} 		
	 	
	 	gridPresenter.alignDefaultGrid();	
	 	productPresenter.productIndex = 0;
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
		 	 	$("#filter-toggle").animate({left: '224px'}, 1000);
		 	 	$("#filter-toggle").text('Hide Filter');
		 	 }else{
		 	 	$("#product-grid").animate({left: '0px'}, 1000);
		 	 	$("#filter-toggle").animate({left: '-29px'}, 1000);
		 	 	$("#filter-toggle").text('Show Filter');
		 	 }
 		}
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
	 	 	$("#filter-toggle").animate({left: '224px'}, 500);
	 	 	$("#filter-toggle").text('Hide Filter');    
	   }
	 }
};


var pagePresenter = {
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    $("#brand").css("position", "fixed");
        $("#user-dropdown").css("position", "fixed");
        
        $(document).on("error","img", pagePresenter.handleImageNotFound);
        $(window).scroll(pagePresenter.handleScrollEvents);
        
    },
    
    handleScrollEvents: function(){
        pagePresenter.toggleHeader();

        if(typeof gridEvents == 'object'){
            gridEvents.continuousScroll();          
        }        
    },
    
    toggleHeader: function(){
                
	   var defaultHeaderHeight = 45;
	   var scrollLocation = $(window).scrollTop();	  
	   
	   if (scrollLocation > defaultHeaderHeight && $("#subheader-navbar").css('position') != 'fixed'){
	       $("#subheader-navbar").css('position', 'fixed');
	       $("#subheader-navbar").css('top', '0');
	       $("#filter-float").css("top", defaultHeaderHeight + "px");	
	       $("#brand-fixed-background").show("blind","fast");      
	   } else if (scrollLocation <= defaultHeaderHeight){
	       $("#filter-float").css("top", (84 - scrollLocation) + "px");
	       
	       if($("#subheader-navbar").css('position') == 'fixed')
	       {
    	       $("#subheader-navbar").css('position', 'relative');
    	       $("#subheader-navbar").css('top', '30px');	       
    	       $("#brand-fixed-background").hide("blind","fast");
	       }
	   } 
	},
    
    handleImageNotFound:  function() {
        $( this ).attr( "src", "../../css/images/missing.png" );
    }
};

