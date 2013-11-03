function getLinks(store){
	$("#links").html("");
	
	$.each( store, function( company, customers ) {			
		$("#links").append($("<div>").addClass("company").append($("<div>").html("&bull; " + company)));
			
		$.each( customers, function( customer, categories ) {					
			$("#links > .company").last().append($("<div>").addClass("customer").append($("<div>").html("&raquo; " + customer)));
				
			$.each( categories, function( category, url ) {
				$("#links > .company > .customer").last().append(
					$("<div>").addClass("category").append(
						$("<input>")
							.attr("type","checkbox")
							.attr("company",company)
							.attr("customer",customer)
							.attr("category",category)
							.attr("url",url)
						).append($("<a>").attr("href",url).html(category))
				);
			});
		});
	});		
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
				$("#json-output").append(
					$("<div>")
						.attr("company", company)
						.attr("customer", customer)
						.attr("category", category)
						.html( storeApi.getProducts(company, data, url) )
				);		
				
				count++;
				if(count == total){
					if(save){								
						saveAllProducts(total);
					}else{
						alert(company + " > " + customer + " > " + category + ": " + $("#json-output").children().first().text());						
					}
				}								
			});
		});
	}
}

function testProductsFromLinks(){
	
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
				
				try{
				    var dataString = storeApi.getProducts(company, data, url);
				    var data = $.parseJSON(data);
				    
				    if (data != null && data.constructor === {}.constructor){
				        isValid = true;
				        validCount++;
				    }
				}catch(err){
				    // do nothing
				    console.log("Whoops ran into a problem: " + err);
				}
								
				if (isValid){				    
				    link.siblings("a").after('<span class="isvalid" style="color:green">&nbsp;- Works!</span>');
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
			
		var store = JSON.stringify(json);	
		$.post("updateStoreLinks.php", {j:store}, function(data){														
			if(data == 1){
				getLinks(json);
				alert("Added!");
				$("#inputLink").val("");
				$("#inputCategory").val("");		
			}else{
				alert(data);	
			}
		});
	
	});
					
	return false;
});


$('#selectall').click(function () {
    $("#links").find(':checkbox').attr('checked', 'checked');
});

$('#deselectall').click(function () {
    $("#links").find(':checkbox').removeAttr('checked');
});