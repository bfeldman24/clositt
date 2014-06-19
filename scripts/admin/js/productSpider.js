
/***************************************
* SPIDER
* 
* handles getting the products and testing the scripts
****************************************/
var spider = {
    links: null,
    stopSaveAll: false,
    autoRunHash: '#autoSaveAll',
    testNewProductsHash: '#testNew',
    
    // Gets the category links
    getLinks: function(){
        $("#loadingMask").show();
    	$("#links").html("");	
    	spider.links = [];
    	
    	if (location.hash == spider.testNewProductsHash){
    	   for(var i=0; i < Object.keys(Companies).length; i++){
    	       var companyName = Object.keys(Companies)[i];
    	       var customerName = "gender";
    	       var categoryName = "test";
    	       var category = Companies[companyName]; 
    	       
    	       $("#links").append(
    	           $("<div>").addClass("company").append(
    	               $("<a>").attr("name",companyName)
    	            ).append(
    	               $("<div>").addClass("companyName").html("&bull; " + companyName.replace("_","."))
    	            )
    	        );   
    	           	       
	            $("#links > .company").last().append($("<div>").addClass("customer").append($("<div>").addClass("customerName").html("&raquo; " + customerName)));
	       	                          
               var link = {};
               link.company = companyName.replace(/'/g, "\\'");
               link.customer = customerName.replace(/'/g, "\\'");
               link.category = categoryName.replace(/'/g, "\\'");
               link.url = category["url"].replace(/'/g, "\\'");
               spider.links.push(link);
               	               
               $("#links > .company > .customer").last().append(
					$("<div>").addClass("category").css("display","none").append(
						$("<input>")
							.attr("type","checkbox")
							.attr("company", link.company)
							.attr("customer", link.customer)
							.attr("category", link.category)
							.attr("lastUpdated", '')        							
							.attr("url", link.url)
							.attr("status", '')
						).append(
						      $("<a>").attr("href", "webProxy.php?u=" + link.url).attr("target","_blank").html(categoryName)
						).append(
						      $("<span>").addClass("isvalid")
						).append(
						      $("<span>").addClass("lastUpdated")
						)
				); 	   
    	   }
    	 
    	   $("#loadingMask").hide();  
    	   return true;
    	}
    	
    	$.getJSON( window.HOME_ROOT + "spider/getlinks", function( data ) {
    	
    	   $.each( data, function( companyName, company ) {    	   
    	       $("#links").append(
    	           $("<div>").addClass("company").append(
    	               $("<a>").attr("name",companyName)
    	            ).append(
    	               $("<div>").addClass("companyName").html("&bull; " + companyName.replace("_","."))
    	            )
    	        );   
    	       
    	       $.each( company, function( customerName, customer ) {    
    	           $("#links > .company").last().append($("<div>").addClass("customer").append($("<div>").addClass("customerName").html("&raquo; " + customerName)));
    	       
    	           $.each( customer, function( categoryName, category ) {        
    	               var statusText = " - " + (category["status"] == 1 ? "Works!" : category["status"] == 2 ? "BROKEN :(" : "Not Tested");
    	               
    	               if (category["count"] != null){
    	                   statusText += ' (' + category["count"] + ' products)';
    	               }
    	               
    	               var statusColor = "red";
    	               
    	               if (category["status"] == 1){
    	                   statusColor = "green";
    	               }
    	               
    	               var $tags = $('<span>').addClass("tags");
    	               var taglist = "";
    	               
    	               if (category["tags"] != null){
        	               $.each( category["tags"].split(","), function( index, tag ) {        
        	                   $tags.append(
        	                       $('<span>').addClass("label label-default").text(tag)
        	                   );
        	                   
        	                   taglist += tag + ",";
        	               });
    	               }
    	               
    	               taglist = taglist.substring(0, taglist.length - 1);
    	               
    	               if (category["lastSaved"] != null){	               
    	                   var lastUpdatedDate = new Date(category["lastSaved"]);
    	                   var lastUpdated = lastUpdatedDate.toLocaleDateString();
    	                   var lastUpdatedForDB = category["lastSaved"];
    	               }else{
    	                   var lastUpdated = "";   
    	                   var lastUpdatedForDB = null;
    	               }
    	               
    	               var link = {};
    	               link.company = companyName.replace(/'/g, "\\'");
    	               link.customer = customerName.replace(/'/g, "\\'");
    	               link.category = categoryName.replace(/'/g, "\\'");
    	               link.url = category["link"].replace(/'/g, "\\'");
    	               link.status = category["status"];
    	               link.count = category["count"];
    	               link.lastUpdated = lastUpdated;
    	               link.tags = taglist.replace(/'/g, "\\'");
    	               spider.links.push(link);
    	               	               
    	               $("#links > .company > .customer").last().append(
        					$("<div>").addClass("category").css("display","none").append(
        						$("<input>")
        							.attr("type","checkbox")
        							.attr("company", link.company)
        							.attr("customer", link.customer)
        							.attr("category", link.category)
        							.attr("tags", link.tags)
        							.attr("lastUpdated", link.lastUpdated)        							
        							.attr("url", link.url)
        							.attr("status", statusText)
        						).append(
        						      $("<a>").attr("href", link.url).html(categoryName)
        						).append(
        						      $("<span>").addClass("isvalid").css("color",statusColor).html(statusText)
        						).append(
        						      $("<span>").addClass("lastUpdated").text(link.lastUpdated)
        						).append(
        						      $("<span>").addClass("tagList").html($tags)
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
    	   
    	   if (location.hash == spider.autoRunHash){
    	       spider.autoRun();               
           }	  
    	});		
    },	
    
    // Gets the checked prdocuts from the link, validates them, and shows a sampling of them
    testProductsFromLinks: function(showData, showSample, save, saveCallback){	
    	$("#json-products").html("");
    	$("#sample-grid").html("");
    	
    	if (saveCallback == null){
    	   $("#loadingMask").show();  
    	}
    	
    	var total = $("#links > .company > .customer > .category > input:checked").size();
    	var count = 0;
    	var validCount = 0;
    	
    	if (total <= 0){
    		Messenger.info("Please select a product store > category");	
    		$("#loadingMask").hide();		
    	}else{
    				
    		$("#links > .company > .customer > .category > input:checked").each(function(){	
    		    $(this).siblings(".isvalid").remove();
    		  
    		    var link = $(this);
    			var company = link.attr("company");
    			var customer = link.attr("customer");
    			var category = link.attr("category");
    			var tags = link.attr("tags");
    			var originalUrl = link.attr("url");
    			
    			url = storeApi.getFullUrl(company, originalUrl);
    			
    			if (url != originalUrl){
    			     console.log("Debugging: Just note that the url parameters were updated");
    			}
    			
    			var categoryData = {
    			     "company" : company,
    			     "customer" : customer, 
    			     "category" : category, 
    			     "link" : link, 
    			     "tags" : tags, 
    			     "showData" : showData, 
    			     "showSample" : showSample, 
    			     "save": save, 
    			     "saveCallback" : saveCallback
    			};
    			
    			storeApi.getProducts(company, url, spider.handleProducts(categoryData));			    
    		});
    	}
    },

    handleProducts: function(categoryData){
        return function(data){
            var itemCount = Object.keys(data).length;
            var valid = "valid";
            
            if (data != null && itemCount > 0){
                categoryData.link.siblings("a").after('<span class="isvalid" style="color:green">&nbsp;- Works! ('+itemCount+' products)</span>');
			    
			    var statusObj = {
			        store: categoryData.company, 
			        customer: categoryData.customer,
			        category: categoryData.category,
			        status: 1, 
			        count: itemCount
			    };
			    
			    $.post( window.HOME_ROOT + "spider/updatestatus", statusObj, function( data ) {
			        console.log(JSON.stringify(data));
			    }); 
                
                if (categoryData.showSample){
                    spider.showSampleProducts(data, categoryData.company, categoryData.customer, categoryData.category);
                
                }else if (categoryData.showData){
                    Messenger.info(categoryData.company + " > " + categoryData.customer + " > " + categoryData.category + ": " + JSON.stringify(data));
    				
                }else if (categoryData.save){
                    var storeProducts = data;
			     
			        categoryData.company = categoryData.company.replace("_",".");
			     
			        for (var i=0; i < Object.keys(storeProducts).length; i++){
    			         var sku = Object.keys(storeProducts)[i];
    			         storeProducts[sku]['company'] = categoryData.company;
    			         storeProducts[sku]['customer'] = categoryData.customer;
    			         storeProducts[sku]['category'] = categoryData.category;
    			         storeProducts[sku]['tags'] = categoryData.tags.split(","); 
    			    }			     			        	
    				
    				// Used for database
    				if ($("#json-products").text().trim() != ""){
        				var jsonProducts = $.parseJSON($("#json-products").text());
        				$.extend(storeProducts, jsonProducts);        				
    				}
    				    				
    				$("#json-products").text(JSON.stringify(storeProducts));	
    									
    				spider.saveAllProducts(categoryData.saveCallback);    				        					
                }   
            
			}else{
			    valid = "not valid";
			    
			    categoryData.link.siblings("a").after('<span class="isvalid" style="color:red">&nbsp;- BROKEN :(</span>');    				    
			    
			    var statusObj = {
			        store: categoryData.company, 
			        customer: categoryData.customer,
			        category: categoryData.category,
			        status: 2, 
			        count: itemCount   				            				        
			    };
			    
			    $.post( window.HOME_ROOT + "spider/updatestatus", statusObj, function( data ) {
			        console.log(JSON.stringify(data));
			    });  
                         
                if (categoryData.saveCallback != null){         
                   categoryData.saveCallback("failed");
                }
			}
							
			if(categoryData.saveCallback == null){
				Messenger.info(categoryData.company + " > " + categoryData.customer + " > " + categoryData.category + " was " + valid);
				$("#loadingMask").hide();				
			}	
        };
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
    	var price = product.price == null || isNaN(product.price) ? "" : "$" + Math.round(product.price);		 			 	
    
    	var rand = Math.floor(Math.random() * 3) + 1;
    	var shadow = "";
    	if(rand == 1){
    		shadow = 'shadow';	
    	}		
    		 			
    	//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
 		var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
		var html ='<div class="outfit item col-xs-5 col-xs-offset-1 col-sm-4 col-md-3 col-lg-2 '+shadow+'" '+attr+' pid="'+id+'" >';
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
						html +='<div class="sku">Sku: '+id+'</div>';
						html +='<div class="link">Link: <a href="'+link+'">'+link+'</a></div>';
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
     	var batchLimit = 1000;
     	var batch = {};
     	var nextBatch = {};
     	
     	if (total <= 0){
    		Messenger.info("There is nothing to save! Please add product data.");	
    	}else{ 	
    	    var tags = {};
    	      	  var isLastBatch = true;
    	    var products = $.parseJSON($("#json-products").text());
    	    
    	    for (var i=0; i < Object.keys(products).length; i++){
    	           var sku = Object.keys(products)[i];
    	           
    	           if (i < batchLimit){
    	               batch[sku] = products[sku];
    	           }else{
    	               nextBatch[sku] = products[sku];
    	               isLastBatch = false;
    	           }    	               	           
    	    }
    	    
    	    $("#json-products").text(JSON.stringify(nextBatch));	
    	   
    $.post( window.HOME_ROOT + "spider/update", { products: batch, isLastBatch: isLastBatch}, function( result ) {                        
                console.log(JSON.stringify(result));                       
                
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
                
                if (Object.keys(nextBatch).length > 0){
                    spider.saveAllProducts(saveCallback);
                    
                }else{
                    if (saveCallback != null){
                        saveCallback();           
                    }    
                }
            }
            , "json"
            );	   
    	}
    },
    
    autoRun: function(){        
        console.log("Auto Run...");        
        actionButtons.saveAll();
    }
};


/***************************************
* CATEGORY MAINTENANCE
* 
* handles saving, editing, and removing the categories
****************************************/
var categoryMaintenance = {
    init: function(){
        $('form#saveProducts').submit(categoryMaintenance.saveCategory);    
        $('form#saveCategories').submit(categoryMaintenance.getCategories);    
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
    	
    	var catObj = {
    	       store: company, 
    	       customer: customer, 
    	       category: category,
    	       link: $(e.currentTarget).find("#inputLink").val(),     	       
    	       tags: tags.toString()
    	};    	
	    
	    $.post( window.HOME_ROOT + "spider/addlink", catObj, function( data ) {
	          if (data == "success"){
        	      spider.getLinks();
        	      Messenger.success("Added!");		      
        		  $(e.currentTarget).find("#inputLink").val("");
        	      $(e.currentTarget).find("#inputCategory").val("");	
        	      $(e.currentTarget).find(".tagCheckbox:checked").prop('checked', false);	
        	  }else{
        	       console.log(JSON.stringify(data));
        	  }
	    }); 
	    					
    	return false;
    },
    
    editCategory: function(el){
        var product = $(el.currentTarget).siblings("input").first();
        
        var productForm = $('#saveProducts').first().clone().attr("id","editCategoryForm");
        productForm.find('select[name=company]').val(product.attr("company")).attr("original", product.attr("company"));
        productForm.find('select[name=consumer]').val(product.attr("customer")).attr("original", product.attr("customer"));
        productForm.find('input[name=category]').val(product.attr("category")).attr("original", product.attr("category"));
        productForm.find('input[name=link]').val(product.attr("url"));
        productForm.find("#save").remove();        
        
        var tags = product.attr("tags").split(',');
    	productForm.find('.tagCheckbox').each(function(){
    	   if (tags.indexOf($(this).val()) >= 0){
    	       $(this).prop("checked",true);
    	   }
    	});
        
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
                      	var oldCompany = $("#editCategoryForm #inputCompany").attr("original").trim();
                      	var oldCustomer = $("#editCategoryForm #inputAudience").attr("original").toLowerCase().trim();
                      	var oldCategory = $("#editCategoryForm #inputCategory").attr("original").toLowerCase().trim();	
                      	
                      	var tags = [];
                    	$('#editCategoryForm .tagCheckbox:checked').each(function(){
                    	   tags.push($(this).val());
                    	});
                      	
                      	var catObj = {
                    	       store: company, 
                    	       customer: customer, 
                    	       category: category,
                    	       oldStore: oldCompany, 
                    	       oldCustomer: oldCustomer, 
                    	       oldCategory: oldCategory,
                    	       link: $("#editCategoryForm #inputLink").val(),     	       
                    	       tags: tags.toString()
                    	};    	
                	    
                	    $.post( window.HOME_ROOT + "spider/updatelink", catObj, function( data ) {
                	          if (data == "success"){
                          	     Messenger.success("Saved!"); 
                          	     
                          	     if (catObj.store != catObj.oldStore || catObj.customer != catObj.oldCustomer){
                          	         location.reload(true);
                          	     }
                          	     
                          	     product.parent().find("a").first().attr("href", catObj.link).html(category);
                          	     
                          	     var $tags = $('<span>').addClass("tags");                	             
                	               
                	             if (tags != null){
                    	               for(var i=0; i < tags.length; i++){       
                    	                   $tags.append(
                    	                       $('<span>').addClass("label label-default").text(tags[i])
                    	                   );                    	                   
                    	               }
                    	               
                    	               product.attr("tags",tags.toString().replace(/'/g, "\\'"));
                    	               product.parent().find(".tagList").html($tags);
                	             }                	                               	                               	                               	               
                          	     
                          	  }else{
                          	     Messenger.error("Error: Category was NOT saved!"); 
                          	     
                          	     if (catObj.store != catObj.oldStore || catObj.customer != catObj.oldCustomer){
                          	         Messenger.error("Make sure that the store, customer, and category are unique.");        
                          	     }                         	     
                          	  }
                	    });                      	                      	
                    }
                },
            }
        }); 
    },

    removeCategory: function(el){
        var category = $(el.currentTarget).siblings(':checkbox');    
        
        var dialog = confirm("Are you sure you want to remove " + category.attr("company") + " -> " + category.attr("customer") + " -> " + category.attr("category") + " and ALL of its products? ");
          
        if (dialog==true){
            
            var catObj = {
        	       store: category.attr("company"), 
        	       customer: category.attr("customer"), 
        	       category: category.attr("category")        	       
        	};    	
    	    
    	    $.post( window.HOME_ROOT + "spider/removelink", catObj, function( data ) {
    	          if (isNaN(data)){
                	      Messenger.error("There was a problem removing this category")
                	  }else{                	       
                	      category.parents(".category").remove();   
                          Messenger.success("Category and all of its products were removed! Affected " + (data - 1) + " products!")
                	  }                	  
    	    });            
        }
        
    },
    
    getCategories: function(e){
        e.preventDefault();
        $("#loadingMask").show();
        var selectedStore = $("#autoCompanySelect").val();        
        var home = null;
                
        var dictionary = ['shirt','pant','dresses','polo','knit','suit','blazer','coat',
                          'sweater','vest','sleepwear','swim','loungewear','outerwear',
                          'shorts','blouse','jacket','skirt','petities','trouser','cardigan',
                          'turtleneck','jean','denim','activewear','hoodie','tees','romper',
                          'clothes','apparel','jersey'];
        var category = new RegExp(dictionary.join("|"));                         
               
        var store = Companies[selectedStore];
        
        if (store == null){
            home = prompt("Sorry. We don't have that store's homepage url stored, but you can enter it here:");
        }else{       
            home = store.url.substring(0, store.url.indexOf("/",store.url.indexOf("//") + 2));
        }
        
        if (home == null) return false;
        
        $.post("webProxy.php", {u:home}, function(data){	
         
            if (data == null || data.trim() == ""){
    			 console.log("webProxy returned nothing. Make sure the URL is correct and does not redirect.");    		
		         Messenger.error("Error: Could not read the store home page. Check to make sure this link is still active.");		         
		    }else{ 
		         var $links = $("<ul>").addClass("links");
		         var linkSet = [];
		         var uniqueCats = [];
		      
		         $(data).find("a[href]:not(:has(*))").each(function(){
		              var url = $(this).attr("href").toLowerCase();	
		              
		              var womenRegex = new RegExp("women|gal");
                      var menRegex = new RegExp("men|dude|guy");	                      
                      
                      var isForMen = menRegex.test(url);
                      var isForWomen = womenRegex.test(url);
	                  var menWomen = isForWomen ? "women" : isForMen ? "men" : '';
	                  var absolute = '';
	                  
	                  if (url.indexOf("/") == 0 && url.indexOf("//") != 0){
	                      absolute = home;
	                  }
		              	              
		          
		              if (url != null && url.trim() != "" && url.indexOf("java") < 0 &&
		                  linkSet.indexOf($(this).attr("href")) <= 0){
		                      		                      
	                      linkSet.push($(this).attr("href"));		              
	                      var cat;	    
	                      var uniqueId = '';                   
	                      var isChecked = category.test(url) && menWomen != '';
	                      
	                      var matchesCategories = url.match(category);
	                      
	                      if (matchesCategories == null || matchesCategories.length <= 0){
	                           matchesCategories = $(this).text().match(category);
	                      }
	                      
	                      if (matchesCategories != null && matchesCategories.length > 0){
	                           cat = matchesCategories[0];
	                           
	                           if (matchesCategories.length > 1){
	                               if (cat == "apparel" || cat == "clothes"){
	                                   cat = matchesCategories[1]; 
	                               }
	                               
	                               console.log("More than 1 category detected!")
	                               console.log(matchesCategories);
	                           }
	                      }
	                      
	                      
	                      if (cat != null){
    	                      // Make cats unique
    	                      while (uniqueCats.indexOf(menWomen + cat + $(this).text() + uniqueId) >= 0){
    	                           uniqueId = parseInt(uniqueId);
    	                               	                       
    	                           if (isNaN(uniqueId)){
    	                               uniqueId = 1;   
    	                           }else{
    	                               uniqueId++;
    	                           }
    	                      }
    	                      
    	                      uniqueCats.push(menWomen + cat + $(this).text() + uniqueId);
	                      
	                          cat += " - ";
	                      }else{
	                           cat = '';
	                      }	                      
	                      	                      		          
    		              $links.append(
    		                  $("<li>").addClass("link").append(
    		                      $("<input>").addClass("useLink").prop("checked",isChecked)
    		                      .attr("type","checkbox")
    		                      .attr("store", selectedStore)
    		                      .attr("customer", menWomen)
    		                      .attr("category", cat + $(this).text() + uniqueId)
    		                      .attr("link", absolute + $(this).attr("href"))
    		                  ).append(
    		                      $("<span>").addClass("linkCustomer").text(menWomen + " ")
    		                  ).append(
    		                      $("<span>").addClass("linkCategory").text(cat + " - ")
    		                  ).append(
    		                      $("<span>").addClass("linkText").text($(this).text() + uniqueId + " = ")
    		                  ).append(
    		                      $("<a>").addClass("linkUrl").attr("target","_blank").attr("href",absolute + $(this).attr("href")).text($(this).attr("href"))
    		                  )
    		              ); 		          		       
		              }       
		         });
		         
		         $("#loadingMask").hide();
		         
		         bootbox.dialog({
                     message: $links,
                     title: "Add Categories",
                     buttons: {                
                         main: {
                             label: "Cancel"
                         },
                         success: {
                             label: "Submit",
                             className: "btn-success",
                             callback: function() {   
                                                                                                                     
                                var cats = [];
                                
                                $("ul.links input:checked").each(function(){
                                    cats.push({
                                        store: $(this).attr("store"),
                                        customer: $(this).attr("customer"),
                                        category: $(this).attr("category"),
                                        link: $(this).attr("link"),
                                        tags: null
                                    }); 
                                });                                                              
                                
                                $.post( window.HOME_ROOT + "spider/addlinks" ,{links: cats}, function(results){
                                    
                                     Messenger.info("Saved " + results + " out of " + $("ul.links input:checked").length + " links");                        
                                });
                                
                             }
                         },
                     }
                 }); 		          
		    }
        });
        
        return false;
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
                console.log(JSON.stringify(result));
                
                if (isNaN(result)){
                    Messenger.error("There was an error getting the total product count!");
                }else{
                    Messenger.info("There are currently " + result + " products in the database");
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

    saveAll: function(){
         // show  and uncheck all categories
         $(".category").show();
         $("#links").find(':checkbox').prop('checked', false);          
         
         window.totalToSave = $(".category").length;
         window.saveCounter = 0;
         window.saveStartTime = new Date().getTime();
         
         var d = new Date();
         window.todaysDate = d.toLocaleDateString();
         
         $("#transparentLoadingMask").show(); 
         Messenger.timeout = 15000;         
         
         // Reverse the company order every other day:
         // This is so if the script goes through 1/2 of the products every 
         // day before failing or browser crashes, then all of the products
         // will get updated every 2 days. 
         if (d.getDate() % 2 == 0){
            Messenger.info("Reversing the company list (We do this every other day)");
            $("#links").append($(".company").get().reverse());
         }
         
         $("#links").find(':checkbox').each(function(){           
                            
            if ($(this).attr("lastUpdated") == "" || $(this).attr("lastUpdated") != window.todaysDate){                                
    
                $(this).prop('checked', true);                                
                return false;       
            }else{
                window.saveCounter++;   
            }                                     
        });
        
        var nonBrokenLinksNotUpdatedToday = $("#links").find(':checkbox').filter(function(){
             return ($(this).attr("lastUpdated") == "" || $(this).attr("lastUpdated") != window.todaysDate) && 
                    $(this).attr("status").indexOf("Works") >= 0;
        });       
                    
        if(nonBrokenLinksNotUpdatedToday.length > 0 && $("#links").find(':checkbox:checked').length > 0){            
            spider.testProductsFromLinks(false, false, true, actionButtons.saveNextCategory);    
        }else{
            Messenger.info("All working categories are saved for today! Try again tomorrow.");   
            $("#transparentLoadingMask").hide(); 
        }
    },

    saveNextCategory: function(status){
        var areThereMoreCategories = false;
        var currentCategory = null;
        var foundChecked = false;
        
        $("#links").find(':checkbox').each(function(){
            if (foundChecked){                    
                if ($(this).attr("lastUpdated") == "" || $(this).attr("lastUpdated") != window.todaysDate){
                    $(this).prop('checked', true);  
                    areThereMoreCategories = true;            
                    return false;       
                }        
            }
            
            if ($(this).prop('checked')){
                $(this).prop('checked', false);
                currentCategory = $(this);  
                foundChecked = true;          
            }               
             
        }); 
        
        if (areThereMoreCategories){
            $('html, body').animate({
                scrollTop: currentCategory.offset().top - 100
            }, 500);
            
            var company = currentCategory.attr("company");
            var customer = currentCategory.attr("customer");
            var category = currentCategory.attr("category");
            
            if (status != "failed"){                                                                        
                var statusObj = {
			        store: company, 
			        customer: customer,
			        category: category,
			        status: 1
			    };
			    
			    $.post( window.HOME_ROOT + "spider/updatestatus", statusObj, function( data ) {
			        console.log(JSON.stringify(data));
			    });
            
                var d = new Date();
                currentCategory.siblings(".lastUpdated").text(d.toLocaleDateString());
        
                window.saveCounter++;
                Messenger.info(window.saveCounter + "/" + window.totalToSave + " categories saved! " + company + " " + customer + " " + category);
            }else{
                Messenger.error(company + " " + customer + " " + category + " - BROKEN LINK!");   
            }
            
            if (!spider.stopSaveAll){
                spider.testProductsFromLinks(false, false, true, actionButtons.saveNextCategory);                
            }
        }else{
            $("#transparentLoadingMask").hide();
            Messenger.timeout = 4000;
            var endTime = new Date().getTime();        
            var executionTime = (endTime - window.saveStartTime) / 60000;
                          
            $.get( window.HOME_ROOT + "spider/removeuncategorized", function( data ) {
		        console.log(JSON.stringify(data));
		        Messenger.success("COMPLETE!!! " + window.saveCounter + "/" + window.totalToSave + " categories saved in " + executionTime + " minutes!");
		    });		    		    		    		    
		    
		    
		    /* Construct email notification */		    
		    var message = [];		    
		    message.push(new Date().toString());
		    message.push(window.saveCounter + "/" + window.totalToSave + " categories saved in " + executionTime + " minutes!");		    		    
		    message.push($(".isvalid").length + " total categories.");

            var works = $(".isvalid").filter(function(){
                return $(this).text().indexOf("Works") > 0;
            });
            
            message.push(works.length + " ran successfully.");
            
            var broken = $(".isvalid").filter(function(){
                return $(this).text().indexOf("BROKEN") > 0;
            });
            
            message.push(broken.length + " are broken.");
            
            message.push("");
            message.push("Broken Categories:");
            
            broken.each(function(){
                var company = $(this).siblings("input[type=checkbox]").attr("company");
                var customer = $(this).siblings("input[type=checkbox]").attr("customer");
                var category = $(this).siblings("input[type=checkbox]").attr("category");
                var lastUpdated = $(this).siblings("input[type=checkbox]").attr("lastupdated");
            
                message.push(company + " -> " + customer + " -> " + category + " (" + lastUpdated + ")");
            });
		    
		    console.log("Sending email...");
		    for (var i=0; i < message.length; i++){
			console.log(message[i]);
		    }

		    $.post( window.HOME_ROOT + "notify", {message: message}, function( success ) {
		        console.log("Email status: " + success);
		    });    				        				                                                                          
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
    },
    
    getNextBroken: function(){
        
        console.log("getting next broken link");
        $("#links").find(':checkbox').each(function(){
                var valid = $(this).siblings(".isvalid").text().toLowerCase();
            
                if (valid.indexOf("broken") >= 0){                                        
                        $(this).prop('checked', true);      
                        $(this).parents(".category").show();              
                        
                        $('html, body').animate({
                            scrollTop: $(this).parents(".category").offset().top
                        }, 500); 
                        
                        console.log("Found a broken link!");
                        
                        return false;       
                }                                                                           
        });                       
    },
    
    testNewStoreApi: function(company, url){
        $.post("webProxy.php", {u:url}, function(result){	    			    
			    var data = storeApi.getStore(company.replace(/[\s_&]/g,''), result, url);
			    ;debugger;
        });
   
    },
    
    formatLinksForDB: function(){
        var sql = "";
        
        for(var i=0; i < spider.links.length; i++){
            var link = spider.links[i];            
            sql += "('";
            sql += link.company || "null";
            sql += "','";
    	    sql += link.customer || "null";
    	    sql += "','";
    	    sql += link.category || "null";
    	    sql += "','";
    	    sql += link.url || "null";
    	    sql += "','";
    	    sql += link.tags || "null";    	    
    	    sql += "','";
    	    sql += link.count || "null";
    	    sql += "','";    	    
    	    sql += link.status || "null";
    	    sql += "','";
    	    sql += link.lastUpdated || "null";
            sql += "'),";   
        }
        
        sql = sql.replace(/'null'/g, "null");        
        console.log(sql);   
    },
    
    removeUncheckedItems: function(){
        $("#links").find(':checkbox').filter(function(){
            return !$(this).prop('checked');
        }).parents(".category").remove();   
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
    
    var storeAutoSelect = storeSelect.clone();
    storeAutoSelect.children().first().remove();
    $("#autoCompanySelect").append( storeAutoSelect.children() );
    $("#autoCompanySelect").val(0);
    
    // Initialize the functions
    Messenger.debug = true;
    categoryMaintenance.init();
    actionButtons.init();
    spider.getLinks();
        
});



/***************************************
* MISSING IMAGE CALLBACK FIXES
* 
* some sites have callbacks for missing images
* if they get called while scraping, it will stop
* stop the script. To prevent this, we just initialize
* the callback function below so the script doesn't break
****************************************/
// Fix for Forever21 onerror issue
var $j = $;

// Fix for jcpenny
var loadDefaultSwatchImage = $;

// Fix for Michael Kors
var shimImage = $;
