
/***************************************
* SPIDER
* 
* handles getting the products and testing the scripts
****************************************/
var spider = {

    // Gets the category links
    getLinks: function(){
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
    	               
    	               if (category.hasChild("lastSaved")){	               
    	                   var lastUpdatedDate = new Date(category.child("lastSaved").val());
    	                   var lastUpdated = lastUpdatedDate.toLocaleDateString();
    	               }else{
    	                   var lastUpdated = "";   
    	               }
    	               	               
    	               $("#links > .company > .customer").last().append(
        					$("<div>").addClass("category").css("display","none").append(
        						$("<input>")
        							.attr("type","checkbox")
        							.attr("company",company.name())
        							.attr("customer",customer.name())
        							.attr("category",category.name())
        							.attr("tags", taglist)
        							.attr("lastUpdated", lastUpdated)
        							.attr("url",category.child("url").val())
        						).append(
        						      $("<a>").attr("href",category.child("url").val()).html(category.name())
        						).append(
        						      $("<span>").addClass("isvalid").css("color",statusColor).html(statusText)
        						).append(
        						      $("<span>").addClass("lastUpdated").text(lastUpdated)
        						).append(
        						      $tags
        						).append(
        						      $("<span>").addClass("editCategory").html($("<i>").addClass("icon-pencil"))
        						).append(
        						      $("<span>").addClass("removeCategory").html("x")
        						)
        				);
    	           });
    	       });
    	   });
    	   
    	   $("#loadingMask").hide();
    	   
    	   if (location.hash == "#saveAllValid"){
               actionButtons.saveAllValid();
           }	  
    	});		
    },	  				   				    						
				

    // Gets the checked prdocuts frm the link, validates them, and shows a sampling of them
    testProductsFromLinks: function(showData, showSample, save, saveCallback){	
    	$("#json-products").html("");
    	
    	if (saveCallback == null){
    	   $("#loadingMask").show();  
    	}
    	
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
                				            spider.showSampleProducts(data, company, customer, category);   
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
            				    spider.saveAllProducts(saveCallback);    				    
            				}		
        			    }else if (showData){
    
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
    	                         
    	                if (saveCallback != null){         
    	                   saveCallback("failed");
    	                }
    				}
    								
    				if(saveCallback == null && count == total){
    					Messenger.info(validCount + "/" + total + " catgeories were valid");	
    					$("#loadingMask").hide();				
    				}														
    			});
    		});
    	}
    },

    showSampleProducts: function (data, company, audience, category){
        if (data != null && Object.keys(data).length > 0){
            gridPresenter.beginTask();
            var grid = $("#sample-grid");        
            grid.html("");
            
        	for(var i=0; i< 28 ;i++){
        		var outfit = spider.getProductTemplate(data[Object.keys(data)[i]], company, audience, category);								
        		grid.append(outfit);
        	}
         	 		 			 		 	
         	gridPresenter.endTask();
         	gridPresenter.alignGrid("sample-grid", 4, 200, 270, 50);	
         	$(document).on("mouseenter",".outfit", gridEvents.showOverlay);     	
        }
    },
    
    getProductTemplate: function(product, company, audience, category){
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
		var html ='<div class="outfit item '+shadow+'" '+attr+' pid="'+id+'" >';
				html +='<div class="picture"><a class="productPage" target="_blank"><img src="' + image + '" /></a></div>';			
				html += '<div class="bottom-block">';
				    html +='<div class="companyName">' + company + '</div>';
					html +='<div class="price">' +  price + '</div>';
				html += '</div>';
				
				html +='<div class="overlay">';
					html +='<div class="topleft">';										
						html +='<div class="shareOutfitBtn" data-toggle="tooltip" data-placement="left" title="Share it!"><img class="social-people-icon" src="/css/images/social/social-people.png" /></div>';						 
					html += '</div>';
					html += '<div class="social-btns" style="display:none;"></div>';
					html +='<div class="topright">';										
						html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Clositt"><img class="hanger-icon" src="/css/images/hanger-icon.png" /><i class="icon-plus-sign hanger-plus"></i></div>';
					html += '</div>';
					html +='<div class="middle">';										
						html +='<div class="link">Link: '+link+'</div>';
					html += '</div>';
					html +='<div class="bottom">';						    					    
					    html += '<div class="productActions" >';					    
					       html += '<span data-toggle="tooltip" data-placement="top" data-animation="false" title="Add to Wish List" class="addToWishList"><i class="icon-gift"></i></span>';
					       html += '<span data-toggle="tooltip" data-placement="top" data-animation="false" title="Show Comments" class="showComments numReviews"><span class="counter" >0</span><i class="icon-comment"></i></span>';
					       html += '<span data-toggle="tooltip" data-placement="top" data-animation="false" title="Added to 0 Clositts" class="numClosets"><span class="counter">0</span><i class="icon-hanger"></i></span>';
					    html += '</div>';														    					    
					    					    					
						//html +='<div class="companyName">' + company + '</div>';
						//html +='<div class="price">' +  price + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
					html += '<div class="product-comments"></div>';
					html += '<div class="addToClosetForm" style="display:none;"></div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
		return $(html);
    },

    // Saves the products
    saveAllProducts: function (saveCallback){
    	var total = $("#links > .company > .customer > .category > input:checked").size();	
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
                
                Messenger.success(output);
                
                if (saveCallback != null){
                    saveCallback();           
                }    
            }
            , "json"
            );	   
    	}
    }
};


/***************************************
* CATEGORY MAINTENANCE
* 
* handles saving, editing, and removing the categories
****************************************/
var categoryMaintenance = {
    init: function(){
        $('form').submit(categoryMaintenance.saveCategory);    
        $(document).on("click",".editCategory", categoryMaintenance.editCategory);
        $(document).on("click",".removeCategory", categoryMaintenance.removeCategory);
    },
    
    saveCategory: function(e) {
    	e.preventDefault();
    	
    	var company = $(e.currentTarget).find("#inputCompany").val().trim();
    	var customer = $(e.currentTarget).find("#inputAudience").val().toLowerCase().trim();
    	var category = $(e.currentTarget).find("#inputCategory").val().toLowerCase().trim();		
    	
    	var tags = [];
    	$(e.currentTarget).find('.tagCheckbox:checked').each(function(){
    	   tags.push($(this).val());
    	});
    	
    	var catObj = {url: $(e.currentTarget).find("#inputLink").val(), status: "not tested", tags: tags};
    	
    	firebase.$.child("spider").child(company).child(customer).child(category).set(catObj, function(error){
    	  if (!error){
    	      spider.getLinks();
    	      Messenger.success("Added!");		      
    		  $(e.currentTarget).find("#inputLink").val("");
    	      $(e.currentTarget).find("#inputCategory").val("");	
    	      $(e.currentTarget).find(".tagCheckbox:checked").prop('checked', false);	
    	  }
    	});					
    					
    	return false;
    },
    
    editCategory: function(el){
        var product = $(el.currentTarget).siblings("input").first();
        
        var productForm = $('#saveProducts').first().clone().attr("id","editCategoryForm");
        productForm.find('select[name=company]').val(product.attr("company"));
        productForm.find('input[name=consumer]').val(product.attr("customer"));
        productForm.find('input[name=category]').val(product.attr("category"));
        productForm.find('input[name=link]').val(product.attr("url"));
        productForm.find("#save").remove();
        
        bootbox.dialog({
            message: productForm,
            title: "Edit the Category",
            buttons: {                
                main: {
                    label: "Cancel"
                },
                success: {
                    label: "Submit",
                    className: "btn-success",
                    callback: function() {                        
                        var company = $("#editCategoryForm #inputCompany").val().trim();
                      	var customer = $("#editCategoryForm #inputAudience").val().toLowerCase().trim();
                      	var category = $("#editCategoryForm #inputCategory").val().toLowerCase().trim();		
                      	
                      	var tags = [];
                      	$('#editCategoryForm .tagCheckbox:checked').each(function(){
                      	   tags.push($(this).val());
                      	});
                      	
                      	var catObj = {url: $("#editCategoryForm #inputLink").val(), status: "not tested", tags: tags};
                      	
                      	firebase.$.child("spider").child(company).child(customer).child(category).set(catObj, function(error){
                      	  if (error){
                      	     alert("Error: Category was NOT saved!");
                      	  }else{
                      	     Messenger.success("Saved! (Refresh to see changes)"); 
                      	  }
                      	});	
                    }
                },
            }
        }); 
    },

    removeCategory: function(el){
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
        
    }
};


/***************************************
* ACTION BUTTONS
* 
* handles the buttons on the bottom bar
****************************************/
var actionButtons = {
    
    init: function(){
           $('#selectall').click(actionButtons.selectAll);
           $('#deselectall').click(actionButtons.deselectAll);
           $('#selectallvalid').click(actionButtons.selectAllValid);
           $(document).on("click",".companyName", actionButtons.toggleCompanySelectAll);
           $(document).on("click",".customerName", actionButtons.toggleCustomerSelectAll);
           $(document).on("change", "#selectStores", actionButtons.selectStoresDropdown);                                 
    },

    getTotalProductCount: function(){
        $.post( window.HOME_ROOT + "spider/count", function( result ) {                        
                console.log(result);
                
                if (isNaN(result)){
                    alert("There was an error getting the total product count!");
                }else{
                    alert("There are currently " + result + " products in the database");
                }
        });
    },
    
    selectAll: function(){
        $(".category").show();
        $("#links").find(':checkbox').prop('checked', true);    
    },
    
    deselectAll: function(){
        if ($("#links :checkbox:checked").length > 0){  
            $("#links").find(':checkbox').prop('checked', false);
        }else{                  
            $(".category").hide();
        }    
    },
    
    selectAllValid: function(){
        $("#links").find(':checkbox').prop('checked', false);
    
        $("#links").find(':checkbox:visible').each(function(){
            var valid = $(this).siblings(".isvalid").text();
            
            if (valid.indexOf("Works") > 0){
                $(this).prop('checked', true);       
            } 
        });
    },
    
    toggleCompanySelectAll: function(el){
        if ($(el.currentTarget).parent(".company").find(':checkbox').first().prop('checked')){
            $(el.currentTarget).parent(".company").find(':checkbox').prop('checked', false);
        }else{
            $(el.currentTarget).parent(".company").find(':checkbox').prop('checked', true);
        }
    },
    
    toggleCustomerSelectAll: function(el){
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
    },
    
    selectStoresDropdown: function(e){
        location.href = "#" + $("#selectStores").val();
        $("#selectStores").val("Go To") 
    },

    saveAllValid: function(){
         // show  and uncheck all categories
         $(".category").show();
         $("#links").find(':checkbox').prop('checked', false);          
         
         window.totalToSave = $(".category").length;
         window.saveCounter = 0;
         window.saveValidStartTime = new Date().getTime();
         
         var d = new Date();
         window.todaysDate = d.toLocaleDateString();
         
         $("#transparentLoadingMask").show(); 
         Messenger.timeout = 15000;
         
         $("#links").find(':checkbox').each(function(){
            var valid = $(this).siblings(".isvalid").text();
            
            if (valid.indexOf("Works") >= 0 || valid.indexOf("not tested") >= 0){
                
                if ($(this).attr("lastUpdated") == "" || $(this).attr("lastUpdated") != window.todaysDate){                                
        
                    $(this).prop('checked', true);                                
                    return false;       
                }else{
                    window.saveCounter++;   
                }                        
            } 
        });       
                    
        if($("#links").find(':checkbox:checked').length > 0){            
            spider.testProductsFromLinks(false, false, true, actionButtons.saveNextValidCategory);    
        }else{
            alert("All working categories are saved for today! Try again tomorrow.");   
            $("#transparentLoadingMask").hide(); 
        }
    },

    saveNextValidCategory: function(status){
        var foundValid = false;
        var hasAnotherValid = false;
        var currentCategory = null;
        
        $("#links").find(':checkbox').each(function(){
            if (foundValid){
                var valid = $(this).siblings(".isvalid").text();
            
                if (valid.indexOf("Works") >= 0 || valid.indexOf("not tested") >= 0){
                    
                    if ($(this).attr("lastUpdated") == "" || $(this).attr("lastUpdated") != window.todaysDate){
                        $(this).prop('checked', true);
                        hasAnotherValid = true;                
                        return false;       
                    }
                }   
            }
            
            if ($(this).prop('checked')){
                $(this).prop('checked', false);
                currentCategory = $(this);            
                foundValid = true;   
            }                
        }); 
        
        if (hasAnotherValid){
            $('html, body').animate({
                scrollTop: currentCategory.offset().top
            }, 500);
            
            if (status != "failed"){
                var company = currentCategory.attr("company");
                var customer = currentCategory.attr("customer");
                var category = currentCategory.attr("category");
                
                var d = new Date();        
                firebase.$.child("spider").child(company).child(customer).child(category).child("lastSaved").set(d.toJSON());
                currentCategory.siblings(".lastUpdated").text(d.toLocaleDateString());
        
                window.saveCounter++;
                Messenger.info(window.saveCounter + "/" + window.totalToSave + " categories saved! " + company + " " + customer + " " + category);
            }else{
                Messenger.error(company + " " + customer + " " + category + " - BROKEN LINK!");   
            }
            
            spider.testProductsFromLinks(false, false, true, actionButtons.saveNextValidCategory);                
        }else{
            $("#transparentLoadingMask").hide();
            Messenger.timeout = 4000;
            var endTime = new Date().getTime();        
            var executionTime = (endTime - window.saveValidStartTime) / 1000;
            
            alert("COMPLETE!!! " + window.saveCounter + "/" + window.totalToSave + " categories saved in " + executionTime + " seconds!");
        }
    }
};



/***************************************
* ADMIN FUNCTIONS
* 
* used for manually modifying the data. 
* not called anywhere in the code. must be called manually
****************************************/
var adminFunctions = {
    enabled: false,
    
    reorganizeLinks: function(){
        if (!enabled){ return; }
	
    	firebase.$.child("spider").once('value', function(spider){
    	   spider.forEach(function(company){	       	       
    	       company.forEach(function(customer){	          	           
    	           customer.forEach(function(category){
    	               var catObj = {url: category.val(), status: "works"};
    	               
    	               firebase.$.child("spider")
    	                         .child(company.name())
    	                         .child(customer.name())
    	                         .child(category.name()).remove();
    	                         
    	               firebase.$.child("spider")
    	                         .child(company.name())
    	                         .child(customer.name())
    	                         .child(category.name()).set(catObj);
    	                         
    	               console.log(company.name() + " -> " + customer.name() + " -> " + category.name());	               
    	           });
    	       });
    	   });	  
    	});		
    },		

    guessTags: function(){
        if (!enabled){ return; }
        
        $(".category").each(function(){        
           var company = $(this).find('input[type=checkbox]').attr("company");
           var customer = $(this).find('input[type=checkbox]').attr("customer");
           var category = $(this).find('input[type=checkbox]').attr("category");
           
           $(".tagCheckbox").each(function(){
               var tag = $(this).val();
               
               if (category.toLowerCase() == tag.toLowerCase()){                    
            	
                   var tags = [];
                   tags.push(tag);        	
            	   firebase.$.child("spider").child(company).child(customer).child(category).child("tags").set(tags);
            	   console.log("Added: " + company + " " + customer + " " + category + ": " + tag);        	       
            	   return false;
        	   }
    	   });	          
        });   
    }					
};



/***************************************
* INITIALIZE FUNCTIONS
* 
* used for setting up the page and initializing the above functions
****************************************/
$(document).ready(function(){
    // Hide the feedback popup
    $(document).find(".feedback-maximize").hide('fade');
    $(document).find(".feedback-minimized").show('fade');    
    
    // Clone the form store dropdown to the action bar
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
    
    // Initialize the functions
    categoryMaintenance.init();
    actionButtons.init();
    spider.getLinks();
});


// Fix for Forever21 onerror issue
var $j = $;