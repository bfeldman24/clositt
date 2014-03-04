// Reorganizes the category links
function reorganizeLinks(){
	
//	firebase.$.child("spider").once('value', function(spider){
//	   spider.forEach(function(company){	       	       
//	       company.forEach(function(customer){	          	           
//	           customer.forEach(function(category){
//	               var catObj = {url: category.val(), status: "works"};
//	               
//	               firebase.$.child("spider")
//	                         .child(company.name())
//	                         .child(customer.name())
//	                         .child(category.name()).remove();
//	                         
//	               firebase.$.child("spider")
//	                         .child(company.name())
//	                         .child(customer.name())
//	                         .child(category.name()).set(catObj);
//	                         
//	               console.log(company.name() + " -> " + customer.name() + " -> " + category.name());	               
//	           });
//	       });
//	   });	  
//	});		
}							


// Gets the category links
function getLinks(){
    $("#loadingMask").show();
	$("#links").html("");	
	
	firebase.$.child("spider").once('value', function(spider){
	   spider.forEach(function(company){
	       $("#links").append(
	           $("<div>").addClass("company").append(
	               $("<a>").attr("name",company.name())
	            ).append(
	               $("<div>").addClass("companyName").html("&bull; " + company.name().replace("_","."))
	            )
	        );   
	       
	       company.forEach(function(customer){
	           $("#links > .company").last().append($("<div>").addClass("customer").append($("<div>").addClass("customerName").html("&raquo; " + customer.name())));
	           
	           customer.forEach(function(category){
	               var statusText = " - " + category.child("status").val();
	               
	               if (category.hasChild("count")){
	                   statusText += ' (' + category.child("count").val() + ' products)';
	               }
	               
	               var statusColor = "red";
	               
	               if (category.child("status").val() == "Works!" || category.child("status").val() == "works"){
	                   statusColor = "green";
	               }
	               
	               var $tags = $('<span>').addClass("tags");
	               var taglist = "";
	               category.child("tags").forEach(function(tag){
	                   $tags.append(
	                       $('<span>').addClass("label").text(tag.val())
	                   );
	                   
	                   taglist += tag.val() + ",";
	               });
	               
	               taglist = taglist.substring(0, taglist.length - 1);
	               	               
	               $("#links > .company > .customer").last().append(
    					$("<div>").addClass("category").css("display","none").append(
    						$("<input>")
    							.attr("type","checkbox")
    							.attr("company",company.name())
    							.attr("customer",customer.name())
    							.attr("category",category.name())
    							.attr("tags", taglist)
    							.attr("url",category.child("url").val())
    						).append(
    						      $("<a>").attr("href",category.child("url").val()).html(category.name())
    						).append(
    						      $("<span>").addClass("isvalid").css("color",statusColor).html(statusText)
    						).append(
    						      $tags
    						).append(
    						      $("<span>").addClass("removeCategory").html("x")
    						)
    				);
	           });
	       });
	   });
	   
	   $("#loadingMask").hide();	  
	});		
}	  				   				    						
				

// Gets the checked prdocuts frm the link, validates them, and shows a sampling of them
function testProductsFromLinks(showData, showSample, save){
	$("#loadingMask").show();
	$("#json-products").html("");
	
	var total = $("#links > .company > .customer > .category > input:checked").size();
	var count = 0;
	var validCount = 0;
	
	if (total <= 0){
		alert("Please select a product store > category");	
		$("#loadingMask").hide();		
	}else{
				
		$("#links > .company > .customer > .category > input:checked").each(function(){	
		    $(this).siblings(".isvalid").remove();
		  
		    var link = $(this);
			var company = link.attr("company");
			var customer = link.attr("customer");
			var category = link.attr("category");
			var tags = link.attr("tags");
			var url = link.attr("url");
			url = storeApi.getFullUrl(company, url);
			
			$.post("webProxy.php", {u:url}, function(data){																		    if (data == null || data.trim() == ""){
			         console.log("webProxy returned nothing. Make sure the URL is correct and does not redirect.");
			     }   
			 
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
				                
				                var price = testProduct.price + "";
				                price = parseFloat(price.replace("$",""));
        				        price = parseFloat(price);       
        				        
        				        if(!isNaN(price)){
            				        isValid = true;  
            				        itemCount = Object.keys(data).length;
            				        validCount++;
            				        
            				        if (showSample && validCount == 1){
            				            showSampleProducts(data, company, customer, category);   
            				        }
        				        }
				            }else{
				                console.log("one or more of the fields in the product entity are null");   
				            }
				    }
				}catch(err){
				    // do nothing
				    console.log("Whoops ran into a problem: " + err);
				}
				
				count++;				
				if (isValid){				    
				    link.siblings("a").after('<span class="isvalid" style="color:green">&nbsp;- Works! ('+itemCount+' products)</span>');
				    
				    var statusObj = {status: "Works!", count: itemCount};
				    
				    firebase.$.child("spider")
	                         .child(company)
	                         .child(customer)
	                         .child(category).update(statusObj);	                             	                
    			 
    			    if (save){
    			        var storeProducts = data;
    			     
    			        company = company.replace("_",".");
    			     
    			        for (var i=0; i < Object.keys(storeProducts).length; i++){
        			         var sku = Object.keys(storeProducts)[i];
        			         storeProducts[sku]['company'] = company;
        			         storeProducts[sku]['customer'] = customer;
        			         storeProducts[sku]['category'] = category;
        			         storeProducts[sku]['tags'] = tags.split(","); 
        			    }
    			     
    			        // Used for firebase
        				$("#json-output").append(
        					$("<div>")
        						.attr("company", company)
        						.attr("customer", customer)
        						.attr("category", category)
        						.html( storeProducts )
        				);	
        				
        				// Used for database
        				if ($("#json-products").text() != ""){
            				var jsonProducts = $.parseJSON($("#json-products").text());
            				$.extend(storeProducts, jsonProducts);        				
        				}
        				    				
        				$("#json-products").text(JSON.stringify(storeProducts));	
        				
        				if(count == total){					
        				    saveAllProducts();    				    
        				}		
    			    }else{

        				if(count == total){					
    			             alert(company + " > " + customer + " > " + category + ": " + JSON.stringify(data));
        				}
    			    }         
				    
				}else{
				    link.siblings("a").after('<span class="isvalid" style="color:red">&nbsp;- BROKEN :(</span>');
				    
				    var statusObj = {status: "BROKEN :(", count: itemCount};
				    
				    firebase.$.child("spider")
	                         .child(company)
	                         .child(customer)
	                         .child(category).update(statusObj);
				}
								
				if(count == total){
					alert(validCount + "/" + total + " catgeories were valid");	
					$("#loadingMask").hide();				
				}														
			});
		});
	}
}

// Gets the products from the selected links and optionally saves them				
//function getProductsFromLinks(save){
//    $("#loadingMask").show();
//	$("#json-output").html("");
//	
//	var total = $("#links > .company > .customer > .category > input:checked").size();
//	var count = 0;
//	
//	if (total <= 0){
//		alert("Please select a product store > category");	
//	}else{
//				
//		$("#links > .company > .customer > .category > input:checked").each(function(){	
//			var company = $(this).attr("company");
//			var customer = $(this).attr("customer");
//			var category = $(this).attr("category");
//			var url = $(this).attr("url");
//			url = storeApi.getFullUrl(company, url);
//			
//			$.post("webProxy.php", {u:url}, function(data){		
//			    if (data == null || data.trim() == ""){
//			         console.log("webProxy returned nothing. Make sure the URL is correct and does not redirect.");
//			     }
//			     												
//			    var jsonProducts = storeApi.getProducts(company, data, url);
//			    var storeProducts = $.parseJSON(jsonProducts);
//			    
//			    for (var i=0; i < Object.keys(storeProducts).length; i++){
//			         var sku = Object.keys(storeProducts)[i];
//			         storeProducts[sku]['company'] = company;
//			         storeProducts[sku]['customer'] = customer;
//			         storeProducts[sku]['category'] = category; 
//			    }
//			 
//			    if (save){
//			        // Used for firebase
//    				$("#json-output").append(
//    					$("<div>")
//    						.attr("company", company)
//    						.attr("customer", customer)
//    						.attr("category", category)
//    						.html( storeProducts )
//    				);	
//    				
//    				// Used for database
//    				if ($("#json-products").text() != ""){
//        				var jsonProducts = $.parseJSON($("#json-products").text());
//        				$.extend(storeProducts, jsonProducts);        				
//    				}
//    				    				
//    				$("#json-products").text(JSON.stringify(storeProducts));	
//    				
//    				count++;
//    				if(count == total){					
//    				    saveAllProducts();    				    
//    				}		
//			    }else{
//			         alert(company + " > " + customer + " > " + category + ": " + JSON.stringify(storeProducts));
//			    }						
//			    
//			    $("#loadingMask").hide();
//			});
//		});
//	}
//}

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

// Saves the products
function saveAllProducts(){
	var total = $("#links > .company > .customer > .category > input:checked").size();
	var fireBaseStore = new Firebase('https://clothies.firebaseio.com/store/products');
 	var success = 0;
 	
 	if (total <= 0){
		alert("There is nothing to save! Please add product data.");	
	}else{ 	
	    var tags = {};
	    var products = $.parseJSON($("#json-products").text());
	    
	    for (var i=0; i < Object.keys(products).length; i++){
	           var product = products[Object.keys(products)[i]];
	    }
	   
	    $.post( window.HOME_ROOT + "spider/update", { products: products}, function( result ) {                        
            console.log(result);                       
            
            var output = "";
            
            if (result == null){
                output += "Data was NOT saved successfully! ";
            }else{
                if (result['clearProducts'] != null && result['clearProducts']){

                    if (result['new'] != null && !isNaN(result['new']) &&
                        result['updated'] != null && !isNaN(result['updated']) && 
                        result['historicalPrices'] != null && !isNaN(result['historicalPrices'])){
                        
                            output += " Success! ";
                            output += " Processed " + result['numProducts'] + " products! ";
                    }
                    
                    if (result['new'] == null || isNaN(result['new'])){
                        output += "Error adding new products! ";
                    }else{
                        output += "Added " + result['new'] + " new products. ";    
                    }
                    
                    if (result['updated'] == null || isNaN(result['updated'])){
                        output += "Error updating existing products! ";
                    }else{
                        output += "Updated " + result['updated'] + " products! ";   
                    }
                    
                    if (result['historicalPrices'] == null || isNaN(result['historicalPrices'])){
                        output += "Error getting historical prices! ";
                    }else{
                        output += "Added " + result['historicalPrices'] + " historical prices! ";                        
                    }
                }else{
                    output += "There was an issue saving the products. Data was NOT saved successfully! ";        
                }                
            }
            
            alert(output);
        }
        , "json"
        );	   
	}
}


$('form').submit(function(e) {
	e.preventDefault();
	
	var company = $("#inputCompany").val().trim();
	var customer = $("#inputAudience").val().toLowerCase().trim();
	var category = $("#inputCategory").val().toLowerCase().trim();		
	
	var tags = [];
	$('.tagCheckbox:checked').each(function(){
	   tags.push($(this).val());
	});
	
	var catObj = {url: $("#inputLink").val(), status: "not tested", tags: tags};
	
	firebase.$.child("spider").child(company).child(customer).child(category).set(catObj, function(error){
	  if (!error){
	      getLinks();
	      alert("Added!");		      
		  $("#inputLink").val("");
	      $("#inputCategory").val("");	
	      $(".tagCheckbox:checked").prop('checked', false);	
	  }
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
	var price = product.price + "";
	price = "$" + Math.round(parseInt(price.replace("$","").trim()));		 	

	var rand = Math.floor(Math.random() * 3) + 1;
	var shadow = "";
	if(rand == 1){
		shadow = 'shadow';	
	}		
		 			
		//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
		var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
	var html ='<div class="outfit" '+attr+'>';
			html +='<div class="picture"><a href="'+link+'" pid="'+id+'" target="_blank"><img src="' + image + '" class="'+shadow+'"/></a></div>';			
			html +='<div class="overlay">';
				html +='<div class="topleft">';										
					html +='<div class="tagOutfitBtn" data-toggle="tooltip" data-placement="left" title="Tagitt"><i class="icon-tags icon-white"></i></div>';
				html += '</div>';
				html +='<div class="topright">';										
					html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Clositt"><img id="hanger-'+id+'" class="hanger-icon" src="../../css/images/hanger-icon-white.png" /><i class="icon-plus-sign icon-white hanger-plus"></i></div>';
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

function getTotalProductCount(){
    $.post( window.HOME_ROOT + "spider/count", function( result ) {                        
            console.log(result);
            
            if (isNaN(result)){
                alert("There was an error getting the total product count!");
            }else{
                alert("There are currently " + result + " products in the database");
            }
    });
}


$('#selectall').click(function () {
    $(".category").show();
    $("#links").find(':checkbox').prop('checked', true);    
});

$('#deselectall').click(function () {
    if ($("#links :checkbox:checked").length > 0){  
        $("#links").find(':checkbox').prop('checked', false);
    }else{                  
        $(".category").hide();
    }
});

$('#selectallvalid').click(function () {
    $("#links").find(':checkbox').prop('checked', false);
    
    $("#links").find(':checkbox:visible').each(function(){
        var valid = $(this).siblings(".isvalid").text();
        
        if (valid.indexOf("Works") > 0){
            $(this).prop('checked', true);       
        } 
    });
});

$(document).on("click",".companyName", function(el){
    if ($(el.currentTarget).parent(".company").find(':checkbox').first().prop('checked')){
        $(el.currentTarget).parent(".company").find(':checkbox').prop('checked', false);
    }else{
        $(el.currentTarget).parent(".company").find(':checkbox').prop('checked', true);
    }
});

$(document).on("click",".customerName", function(el){
    if ($(el.currentTarget).next(".category").is(":visible")){    
        if ($(el.currentTarget).parent(".customer").find(':checkbox').first().prop('checked')){
            $(el.currentTarget).parent(".customer").find(':checkbox').prop('checked', false);
            $(el.currentTarget).data("click",3);
        }else if ($(el.currentTarget).data("click") < 2){
            $(el.currentTarget).parent(".customer").find(':checkbox').prop('checked', true);
            $(el.currentTarget).data("click",2);
        }else{
            $(el.currentTarget).siblings(".category").hide();    
            $(el.currentTarget).data("click",0);
        }
    }else{
        $(el.currentTarget).siblings(".category").show();
        $(el.currentTarget).data("click",1);
    }
});

$(document).on("click",".removeCategory", function(el){
    var category = $(el.currentTarget).siblings(':checkbox');    
    
    var dialog = confirm("Are you sure you want to remove " + category.attr("company") + " -> " + category.attr("customer") + " -> " + category.attr("category") + "? ");
      
    if (dialog==true){
        firebase.$.child("spider")
                  .child(category.attr("company"))
                  .child(category.attr("customer"))
                  .child(category.attr("category"))
                  .remove(function(error) {
                      if (error){
                        alert("There was a problem removing this category")
                      }else{
                        $(el.currentTarget).parents(".category").remove();   
                        alert("Category was removed! (This only deletes the category. It does not delete products that were already added to this category)")
                      }
                   });        
    }
    
});


$(document).find(".feedback-maximize").hide('fade');
$(document).find(".feedback-minimized").show('fade');

$(document).on("change", "#selectStores", function(e){
   location.href = "#" + $("#selectStores").val();
   $("#selectStores").val("Go To") 
});

$(document).ready(function(){
    var storeSelect = $("#inputCompany").clone();
    storeSelect.attr("id","selectStores");
    
    storeSelect.find("option").first().before(
        $("<option>").attr("value","store").text("Go To")
    );
    
    storeSelect.val("store");    
    storeSelect.css("float","right")
     .css("margin","0 10px 0 0")
     .css("padding","2px 4px")
     .css("height","26px")
     .css("width","80px");         
    
    $(".actionButtons button").last().after(
        storeSelect    
    ); 
});