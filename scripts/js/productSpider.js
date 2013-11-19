function getLinks(){
	$("#links").html("");	
	
	firebase.$.child("spider").once('value', function(spider){
	   spider.forEach(function(company){
	       $("#links").append($("<div>").addClass("company").append($("<div>").html("&bull; " + company.name())));   
	       
	       company.forEach(function(customer){
	           $("#links > .company").last().append($("<div>").addClass("customer").append($("<div>").html("&raquo; " + customer.name())));
	           
	           customer.forEach(function(category){
	               $("#links > .company > .customer").last().append(
    					$("<div>").addClass("category").append(
    						$("<input>")
    							.attr("type","checkbox")
    							.attr("company",company.name())
    							.attr("customer",customer.name())
    							.attr("category",category.name())
    							.attr("url",category.val())
    						).append($("<a>").attr("href",category.val()).html(category.name()))
    				);
	           });
	       });
	   });	  
	});	
	
//	$.each( store, function( company, customers ) {			
//		$("#links").append($("<div>").addClass("company").append($("<div>").html("&bull; " + company)));
//			
//		$.each( customers, function( customer, categories ) {					
//			$("#links > .company").last().append($("<div>").addClass("customer").append($("<div>").html("&raquo; " + customer)));
//				
//			$.each( categories, function( category, url ) {
//				$("#links > .company > .customer").last().append(
//					$("<div>").addClass("category").append(
//						$("<input>")
//							.attr("type","checkbox")
//							.attr("company",company)
//							.attr("customer",customer)
//							.attr("category",category)
//							.attr("url",url)
//						).append($("<a>").attr("href",url).html(category))
//				);
//			});
//		});
//	});		
}							
				
function getProductsFromLinks(save){
	$("#json-output").html("");
	
	var total = $("#links > .company > .customer > .category > input:checked").size();
	var count = 0;
	
	if (total <= 0){
		alert("Please select a product store > category");	
	}else{
				
		$("#links > .company > .customer > .category > input:checked").each(function(){	
			var company = $(this).attr("company");
			var customer = $(this).attr("customer");
			var category = $(this).attr("category");
			var url = $(this).attr("url");
			url = storeApi.getFullUrl(company, url);
			
			$.post("webProxy.php", {u:url}, function(data){														
			    var storeProducts = storeApi.getProducts(company, data, url); 
			 
			    if (save){
    				$("#json-output").append(
    					$("<div>")
    						.attr("company", company)
    						.attr("customer", customer)
    						.attr("category", category)
    						.html( storeProducts )
    				);		
    				
    				count++;
    				if(count == total){					
    				    saveAllProducts();
    				}		
			    }else{
			         alert(company + " > " + customer + " > " + category + ": " + storeProducts);		
			    }						
			});
		});
	}
}

function testProductsFromLinks(showSample){
	
	var total = $("#links > .company > .customer > .category > input:checked").size();
	var count = 0;
	var validCount = 0;
	
	if (total <= 0){
		alert("Please select a product store > category");	
	}else{
				
		$(".isvalid").remove();		
		$("#links > .company > .customer > .category > input:checked").each(function(){	
		    var link = $(this);
			var company = link.attr("company");
			var customer = link.attr("customer");
			var category = link.attr("category");
			var url = link.attr("url");
			url = storeApi.getFullUrl(company, url);
			
			$.post("webProxy.php", {u:url}, function(data){																		
				var isValid = false;
				var itemCount = 0;				
				
				try{
				    var dataString = storeApi.getProducts(company, data, url);
				    var data = $.parseJSON(dataString);
				    
				    if (data != null && data.constructor === {}.constructor){
				        var testProduct = data[Object.keys(data)[0]];
				        
				        if (testProduct != null &&
				            testProduct.price != null && 
				            testProduct.image != null && 
				            testProduct.link != null && 
				            testProduct.name != null &&
				            testProduct.sku != null){				        

        				        isValid = true;  
        				        itemCount = Object.keys(data).length;
        				        validCount++;
        				        
        				        if (showSample && validCount == 1){
        				            showSampleProducts(data, company, customer, category);   
        				        }
				            }
				    }
				}catch(err){
				    // do nothing
				    console.log("Whoops ran into a problem: " + err);
				}
								
				if (isValid){				    
				    link.siblings("a").after('<span class="isvalid" style="color:green">&nbsp;- Works! ('+itemCount+' products)</span>');
				}else{
				    link.siblings("a").after('<span class="isvalid" style="color:red">&nbsp;- BROKEN :(</span>');
				}
				
				count++;
				if(count == total){
					alert(validCount + "/" + total + " catgeories were valid");					
				}														
			});
		});
	}
}

function showSampleProducts(data, company, audience, category){
    if (data != null && Object.keys(data).length > 0){
        gridPresenter.beginTask();
        var grid = $("#sample-grid");        
        grid.html("");
        
    	for(var i=0; i< 28 ;i++){
    		var outfit = getProductTemplate(data[Object.keys(data)[i]], company, audience, category);								
    		grid.append(outfit);
    	}
     	 		 			 		 	
     	gridPresenter.endTask();
     	gridPresenter.alignGrid("sample-grid", 4, 200, 270, 25);	
     	$(document).on("mouseenter",".outfit", gridEvents.showOverlay);     	
    }
}

function saveAllProducts(){
	var total = $("#links > .company > .customer > .category > input:checked").size();
	var fireBaseStore = new Firebase('https://clothies.firebaseio.com/store/products');
 	var success = 0;
 	
 	if (total <= 0){
		alert("There is nothing to save! Please add product data.");	
	}else{ 	
	 	$("#json-output").children().each(function(){			
			fireBase = fireBaseStore.child($(this).attr("company").toLowerCase());		
			fireBase = fireBase.child($(this).attr("customer").toLowerCase());
			fireBase = fireBase.child($(this).attr("category").toLowerCase());
			
			var jsonObj = $.parseJSON($(this).text());
			
			// firebase.update
			fireBase.set(jsonObj, function(error) {
			  if (!error) {	
			    success++;
				
				if(success == total){
					alert("Data saved successfully for " + success + "/" + total + " links");
				}
			  }
			});
	 	});
	 	
	 	setTimeout(function(){
	 		if(success != total){
				alert("Data was not saved successfully! Saved " + success + "/" + total + " links");
			}
	 	},15000);
	}
}

$('form').submit(function(e) {
	e.preventDefault();
	
	$.getJSON("../js/json/storeLinks.json", function(json){
		var company = $("#inputCompany").val().toLowerCase().trim();
		var customer = $("#inputAudience").val().toLowerCase().trim();
		var category = $("#inputCategory").val().toLowerCase().trim();
		var url = $("#inputLink").val();		
				
		if(json[company] == undefined){
			json[company] = new Object();
		}
		
		if(json[company][customer] == undefined){
			json[company][customer] = new Object();
		}			
		
		json[company][customer][category] = url;
		
		firebase.$.child("spider").child(company).child(customer).child(category).set(url, function(error){
		  if (!error){
		      getLinks();
		      alert("Added!");		      
   			  $("#inputLink").val("");
   			  $("#inputCategory").val("");		
		  }
		});
			
		var store = JSON.stringify(json);	
		$.post("updateStoreLinks.php", {j:store}, function(data){														
			/*
			if(data == 1){
				getLinks(json);
				alert("Added!");
				$("#inputLink").val("");
				$("#inputCategory").val("");		
			}else{
				alert(data);	
			}
			*/
		});
	
	});
					
	return false;
});


function getProductTemplate(product, company, audience, category){
    if (product == null){
        return $("");    
    }
    
	var link = product.link;
	var image = product.image;
	var name = product.name;		
	var id = product.sku;
	var price = product.price == null || isNaN(product.price) ? "" : "$" + Math.round(product.price);		 	

	var rand = Math.floor(Math.random() * 3) + 1;
	var shadow = "";
	if(rand == 1){
		shadow = 'shadow';	
	}		
		 			
		//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
		var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
	var html ='<div class="outfit" '+attr+'>';
			html +='<div class="picture"><a href="'+link+'" pid="'+id+'" target="_blank"><img src="' + image + '" class="'+shadow+'" onerror="return pagePresenter.handleImageNotFound(this)"/></a></div>';			
			html +='<div class="overlay">';
				html +='<div class="topleft">';										
					html +='<div class="tagOutfitBtn" data-toggle="tooltip" data-placement="left" title="Tagitt"><i class="icon-tags icon-white"></i></div>';
				html += '</div>';
				html +='<div class="topright">';										
					html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Clositt"><img id="hanger-'+id+'" class="hanger-icon" src="css/images/hanger-icon-white.png" /><i class="icon-plus-sign icon-white hanger-plus"></i></div>';
				html += '</div>';
				html +='<div class="bottom">';						    					    
				    html += '<div class="productActions" >';
				       html += '<div data-toggle="tooltip" data-placement="top" title="Show Comments" class="showComments"><span class="numReviews">0</span><i class="icon-comment icon-white"></i></div>';
				    html += '</div>';													    				    				    		
					html +='<div class="companyName">' + company + '</div>';
					html +='<div class="price">' +  price + '</div>';
					html +='<div class="name">' + name + '</div>';
				html += '</div>';
				html += '<div class="product-comments"></div>';
			html += '</div>';
			html += '<div class="clear"></div>';				
		html +='</div>';
		
	return $(html);
}


$('#selectall').click(function () {
    $("#links").find(':checkbox').prop('checked', true);
});

$('#deselectall').click(function () {
    $("#links").find(':checkbox').prop('checked', false);
});