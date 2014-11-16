
/***************************************
* SPIDER
* 
* handles getting the products and testing the scripts
****************************************/
var spider = {
    links: null,
    stopSaveAll: false,
    saveAllBatchLimit: 15,
    autoRunHash: '#autoSaveAll',
    testNewProductsHash: '#testNew',
    
    // Gets the category links
    getLinks: function(){
        $("#loadingMask").show();
    	$links = $("<div>");
    	$("#links").html("");
    	spider.links = [];    	
    	
    	if (location.hash == spider.testNewProductsHash){
    	   for(var i=0; i < Object.keys(Companies).length; i++){
    	       var companyName = Object.keys(Companies)[i];
    	       var customerName = "gender";
    	       var categoryName = "test";
    	       var category = Companies[companyName]; 
    	       
    	       $links.append(
    	           $("<div>").addClass("company").append(
    	               $("<a>").attr("name",companyName)
    	            ).append(
    	               $("<div>").addClass("companyName").html("&bull; " + companyName.replace("_","."))
    	            )
    	        );   
    	           	       
	            $links.find(".company").last().append($("<div>").addClass("customer").append($("<div>").addClass("customerName").html("&raquo; " + customerName)));
	       	                          
               var link = {};
               link.company = companyName.replace(/'/g, "\\'");
               link.customer = customerName.replace(/'/g, "\\'");
               link.category = categoryName.replace(/'/g, "\\'");
               link.url = category["url"].replace(/'/g, "\\'");
               spider.links.push(link);
               	               
               $links.find(".company > .customer").last().append(
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
    	 
    	   $("#links").html($links);
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
        							.attr("count", link.count)
        						).append(
        						      $("<a>").attr("href", link.url).attr("target","_blank").html(categoryName)
        						).append(
        						      $("<span>").addClass("isvalid").css("color",statusColor).html(statusText)
        						).append(
        						      $("<span>").addClass("lastUpdated").text(link.lastUpdated)
        						).append(
        						      $("<span>").addClass("tagList").html($tags)
        						).append(
        						      $("<span>").addClass("testCategoryLink").html($("<i>").addClass("icon-wrench"))
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
    			
    			console.log("Getting -> " + company + " - " + customer + " - " + category);
    			
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
                categoryData.link.attr("count", itemCount);
			    
			    var statusObj = {
			        store: categoryData.company, 
			        customer: categoryData.customer,
			        category: categoryData.category,
			        status: 1, 
			        count: itemCount
			    };
			    
			    if (!categoryData.save){
    			    $.post( window.HOME_ROOT + "spider/updatestatus", statusObj, function( data ) {
    			        console.log(JSON.stringify(data));
    			    }); 
			    }
                
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
    				
    				/*
    				// Used for database
    				if ($("#json-products").text().trim() != ""){
        				var jsonProducts = $.parseJSON($("#json-products").text());
        				$.extend(storeProducts, jsonProducts);        				
    				}
    				    				
    				$("#json-products").text(JSON.stringify(storeProducts));	
    				*/
    									
    				spider.saveAllProducts(categoryData.saveCallback, storeProducts);
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
    		 			
    	var html = '<div class="col-xs-12 col-sm-4 col-md-3 col-lg-box box outfit" pid="'+id+'">' +
            '<div class="item" data-url="'+link+'">' +
                '<div class="mainwrap">' +
                    '<div class="imagewrap">' +                                                   
                            '<img src="'+image+'" />' +
                    '</div>' +
                    '<div class="viewlink">' +
                            '<span class="sku">'+id+'</span>' +
                            '<p class="link">'+link+'</p>' +
                    '</div>' +
                    '<div class="detail">' +
                        '<h4 class="productName">'+name+'</h4>' +
                        '<div>' +
                            '<span class="price pull-right">'+price+'</span>' +
                            '<p class="pull-left productStore">'+company+'</p>' +
                        '</div>' +
                        '<div class="clear"></div>' +
                    '</div>' +
                    
                    '<div class="cart_option">' +                        
                            '<div class="addToClosittDropdown">' +
                                '<a class="dropdown-toggle" data-toggle="dropdown"><i class="icon-svg20"></i></a>' +
                                
                                '<div class="dropdown-menu create_new" role="menu">' +
                                    '<input class="pull-left addNewClosetInput" type="text" placeholder="Create New Clositt" />' +
                                    '<a class="create pull-right submitNewCloset"><i class="icon-plus"></i></a>' +
                                    '<div class="clear"></div>' +
                                    
                                    '<div class="my_opt addToClosetOptions"></div>' +
                                '</div>' +
                            '</div>' +
    
                        '<div class="commentDropdown">' +
                            '<a class="dropdown-toggle" data-toggle="dropdown">' +
                                '<i class="icomoon-bubble-dots-4 message-icon"></i>' +
                            '</a>' +
                            
                            '<div class="dropdown-menu comments" role="menu">' +
                                '<textarea class="commentTextArea" type="text" placeholder="#LoveIt..." ></textarea>' +                                
                                '<div class="addCommentBtn"><button class="btn btn-clositt-theme btn-xs">ADD</button></div>' +
                                '<div class="clear"></div>' +
                                                                
                                '<ul class="review-comments"></ul>' +                                
                            '</div>' +
                        '</div>' +
                         
                        '<a class="more-opt"><i class="icomoon-share-2 dots-icon"></i></a>' +
                    '</div>' +
                '</div>' +
                '<div class="hover_more"></div>' +
            '</div>' +
        '</div>';
			
		return $(html);
    },

    // Saves the products
    saveAllProducts: function (saveCallback, storeProducts){
    	var total = $("#links > .company > .customer > .category > input:checked").size();	
     	var success = 0;
     	var batchLimit = 1000;
     	var batch = {};
     	
     	if (storeProducts == null || Object.keys(storeProducts).length <= 0){
    		Messenger.info("There is nothing to save! Please add product data.");	
    	}else{ 	
    	    var tags = {};
    	    var isLastBatch = true;
    	    var products = storeProducts;
    	    var counter = 0;
    	    
    	    for (var i=0; i < Object.keys(products).length; i++){
    	           var sku = Object.keys(products)[i];    	               	               	           
    	           batch[sku] = products[sku];    	           
    	           isLastBatch = i + 1 == Object.keys(products).length;
    	           
    	           if (counter + 1 == batchLimit || isLastBatch){
    	                  $.post( window.HOME_ROOT + "spider/update", { products: batch, isLastBatch: isLastBatch},
    	                   function( result ) {                        
                                console.log(JSON.stringify(result));                       
                                
                                var output = "";
                                
                                if (result == null){
                                    output += "Data was NOT saved successfully! ";
                                }else{
                                    if (result['tempProducts'] != null){
                    
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
                            
                            batch = {};
                            counter = -1;
    	           }    	           
    	           
    	           counter++;   	               	           
    	    }    	        	        	        	        	               	   
    	}
    },
    
    autoRun: function(){                
        
        // Remove Broken Links for AutoRun
        /*
        $brokenLinks = $(".category").filter(function(){
            return $(this).find(".isvalid").text().indexOf("BROKEN") >= 0; 
        });
        
        $("#brokenLinks").append($brokenLinks);        
        */
        
        // Order categories so that the last run shows first
        /*        
        console.log("Sorting Categories by last saved date...");
        var cats = $(".company").sort(function(a, b){
            
            var $aWorks = $(a).find(".isvalid").filter(function(){
                return $(this).text().indexOf("BROKEN") < 0;
            });
            
            var $bWorks = $(b).find(".isvalid").filter(function(){
                return $(this).text().indexOf("BROKEN") < 0;
            });
            
            var textDateA = $aWorks.next(".lastUpdated").first().text();
            var textDateB = $bWorks.next(".lastUpdated").first().text();
            
            if (textDateA == null || textDateA == ""){
                textDateA = 0;
            }
            
            if (textDateB == null || textDateB == ""){
                textDateB = 0;
            }
            
            var dateA = new Date(textDateA);
            var dateB = new Date(textDateB);    
            
            return dateA - dateB;
        });
        
        cats = cats.clone();
        $("#links").html("");
        $("#links").append(cats);
        
        */                    
        
        console.log("Auto Run...");        
        actionButtons.saveAll();
    },
    
    getSpiderStats: function(){
         $.getJSON( window.HOME_ROOT + "spider/getspiderstats", function( data ) {
	          if (data){        	      	              	      
        	      $table = $("<table>").addClass("table table-bordered table-condensed table-responsive") ;
        	      
        	      $table.append(
            	      $("<tr>").append(
    	                   $("<th>").text("Store")
    	               ).append(
    	                   $("<th>").text("Broken Links")
    	               ).append(
    	                   $("<th>").text("Total Links")
    	               ).append(
    	                   $("<th>").text("% Broken")
    	               )
    	          );
    	      
        	      $.each( data, function( store, stats ) {    	   
        	           var percent = Math.round((stats.broken / stats.total) * 100);
        	       
        	           $table.append(
        	               $("<tr>").append(
        	                   $("<td>").text(store)
        	               ).append(
        	                   $("<td>").text(stats.broken)
        	               ).append(
        	                   $("<td>").text(stats.total)
        	               ).append(
        	                   $("<td>").text(percent + "%")
        	               )
        	           );
        	      });
        	              	      
        	      bootbox.dialog({
                      message: $table,
                      title: "Spider Stats",
                      buttons: {                
                          main: {
                              label: "Cancel"
                          }                          
                      }
                  });
        	      
        	  }else{
        	       console.log(JSON.stringify(data));
        	  }
	    });  
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
        $(document).on("click",".testCategoryLink", categoryMaintenance.testCategoryLink);
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
    
    testCategoryLink: function(el){
       var category = $(el.currentTarget).siblings(':checkbox');  
       var store = Companies[category.attr("company")];  
       var phantom = '';
       
       if (store != null && store.usePhantomjs){
            phantom = '&phantom=true';
       }
         
       var url = "webProxy.php?u=" + category.attr("url") + phantom;
       
       window.open(url,'_blank'); 
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
                          'clothes','apparel','jersey','khaki','capris','fleece'];
                          
        var category = new RegExp(dictionary.join("|"));                         
               
        var store = Companies[selectedStore];
        
        if (store != null){
            home = store.url.substring(0, store.url.indexOf("/",store.url.indexOf("//") + 2));
        }

        home = prompt("Please enter the store's homepage url:", home ? home : '');        
        
        if (home == null){
             $("#loadingMask").hide();
             return false;
        }
        
        var data = {u: home};
        
        if (store != null && store.usePhantomjs){
            data.phantom = true;   
        }
        
        $.post("webProxy.php", data, function(data){	
         
            if (data == null || data.trim() == ""){
    			 console.log("webProxy returned nothing. Make sure the URL is correct and does not redirect.");    		
		         Messenger.error("Error: Could not read the store home page. Check to make sure this link is still active.");
		         $("#loadingMask").hide();		         
		    }else{ 
		         var $links = $("<ul>").addClass("links");
		         var linkSet = [];
		         var uniqueCats = [];
		         
		         if (home.indexOf("/", home.indexOf(".")) > 0){
                       home = home.substring(0, home.indexOf("/", home.indexOf(".")));
                  }
	      
		         $("<html>").html(data).find("a[href]:not(:has(*))").each(function(){
		              var url = $(this).attr("href").toLowerCase();	
		              var stripedText = $(this).text().replace(/\W/g, ''); 
		              
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
	                      var cat = null;	    
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
    	                      while (uniqueCats.indexOf(menWomen + cat + stripedText + uniqueId) >= 0){
    	                           uniqueId = parseInt(uniqueId);
    	                               	                       
    	                           if (isNaN(uniqueId)){
    	                               uniqueId = 2;   
    	                           }else{
    	                               uniqueId++;
    	                           }
    	                      }
    	                      
    	                      uniqueCats.push(menWomen + cat + stripedText + uniqueId);
	                      
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
    		                      .attr("category", cat + stripedText + uniqueId)
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
                                   categoryMaintenance.saveCategories();                                          
                             }
                         },
                         successMen: {
                             label: "Submit All As Men",
                             className: "btn-success",
                             callback: function() {   
                                   categoryMaintenance.saveCategories("men");
                             }
                         },
                         successWomen: {
                             label: "Submit All As Women",
                             className: "btn-success",
                             callback: function() {   
                                   categoryMaintenance.saveCategories("women");
                             }
                         },
                     }
                 }); 		          
		    }
        });
        
        return false;
    },
    
    saveCategories: function(customer){
        var cats = [];        
                        
        $("ul.links input:checked").each(function(){
            var client = customer ? customer : $(this).attr("customer");
            
            cats.push({
                store: $(this).attr("store"),
                customer: client,
                category: $(this).attr("category"),
                link: $(this).attr("link"),
                tags: null
            }); 
        });                                                              
        
        $.post( window.HOME_ROOT + "spider/addlinks" ,{links: cats}, function(results){            
                Messenger.info("Saved " + results + " out of " + $("ul.links input:checked").length + " links");                        
        });
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
         Messenger.isSilent = true;
         
         // show  and uncheck all categories
         $(".category").show();
         $("#links").find(':checkbox').prop('checked', false);          
         
         window.totalToSave = $(".category").length;
         window.saveCounter = 0;
         window.saveStartTime = new Date().getTime();
         
         var d = new Date();
         window.todaysDate = d.toLocaleDateString();
         
         $("#transparentLoadingMask").show(); 
         Messenger.timeout = 1500;         
         
         // Reverse the company order every other day:
         // This is so if the script goes through 1/2 of the products every 
         // day before failing or browser crashes, then all of the products
         // will get updated every 2 days. 
         if (location.hash == spider.autoRunHash && d.getDate() % 2 == 0){
            Messenger.info("Reversing the company list (We do this every other day)");
            $("#links").append($(".company").get().reverse());
         }
                  
         var count = 0;
         $("#links").find(':checkbox').each(function(){           
                                    
            if ($(this).attr("lastUpdated") != window.todaysDate){                                
    
                $(this).prop('checked', true);       
                $(this).attr("lastUpdated", window.todaysDate);                         
                count++;      
            }else{
                window.saveCounter++;   
            }
            
            if (count >= spider.saveAllBatchLimit){
                return false;   
            }                                     
        });
        
        var linksNotUpdatedToday = $("#links").find(':checkbox').filter(function(){
             return $(this).attr("lastUpdated") != window.todaysDate;
        });       
                    
        if(linksNotUpdatedToday.length > 0 && $("#links").find(':checkbox:checked').length > 0){            
            spider.testProductsFromLinks(false, false, true, actionButtons.saveNextCategory);    
        }else{
            Messenger.info("All working categories are saved for today! Try again tomorrow.");   
            $("#transparentLoadingMask").hide(); 
        }
    },

    saveNextCategory: function(){
        var areThereMoreCategories = false;
        var foundChecked = false;
        var lastCheckedCategory = null;
        var totalChecked = $("#links > .company > .customer > .category > input:checked").size();
        var categoriesToCheck = spider.saveAllBatchLimit;
        var totalProductsInBatchLimit = 1000;
        var totalProductsInBatch = 0;
        
        
        $("#links").find(':checkbox').each(function(){
                if ($(this).prop('checked')){
                    $(this).prop('checked', false);            
                    
                    var company = $(this).attr("company");
                    var customer = $(this).attr("customer");
                    var category = $(this).attr("category");                        
                    var status = $(this).attr("status");
                    
                    if (status.indexOf("Works") >= 0){                                                                                   
                        var d = new Date();
                        $(this).siblings(".lastUpdated").text(d.toLocaleDateString());
                
                        window.saveCounter++;
                        Messenger.info(window.saveCounter + "/" + window.totalToSave + " categories saved! " + company + " " + customer + " " + category);
                    }else{
                        Messenger.error(company + " " + customer + " " + category + " - BROKEN LINK!");   
                    }
                }else{               

                    if ($(this).attr("lastUpdated") != window.todaysDate){
                        $(this).prop('checked', true);  
                        $(this).attr("lastUpdated", window.todaysDate);
                        areThereMoreCategories = true;     
                        lastCheckedCategory = $(this);
                        var productCount = $(this).attr("count");
                        
                        if (!isNaN(productCount)){
                            totalProductsInBatch += parseInt(productCount); 
                        }                                  
                        
                        if (categoriesToCheck <= 0 || totalProductsInBatch >= totalProductsInBatchLimit){                        
                            return false;       
                        }
                        
                        categoriesToCheck--;
                    }
                }
        }); 
        
        if (areThereMoreCategories){            
            $('html, body').scrollTop($(".category input:checked").first().offset().top - 100);                        
            
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

    guessTags: function(){
        // TODO: implement guess tags for products, not categories
        return false;        
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
