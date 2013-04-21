<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
?>
<style type="text/css">
.company{
	margin: 0 0 20px 5px;	
}

.customer{
	margin-left:15px;
}

.category{
	margin-left:25px;	
}

input{
	margin-right:5px !important;	
}

#saveProducts input{
	height: 30px !important;	
}

body{
	margin: 20px;
	font-size:16px;	
}
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
<br><br><h2>Product Genie</h2>
<button id="selectall">Select All</button>
<button id="deselectall">Deselect All</button>
<br>
<div id="links"><img src="../../css/images/loading.gif" style="height:50px;"/></div>
<button onclick="getProductsFromLinks()">Get Products</button>
<button onclick="getProductsFromLinks(true)">Get Products and Save</button>
<button onclick="saveAllProducts()">Save</button>
<br><br>
<p>*** <a href="preload.php">UPDATE WEBSITE WITH NEW PRODUCTS</a> ***</p>


<hr>
<h2>Add New Product Page Link:</h2>
<form class="form-horizontal" id="saveProducts">
	    <div class="control-group">
	   		<label class="control-label" for="inputCompany">Company</label>
		    <div class="controls">
		    	<!--<input type="text" id="inputCompany" placeholder="Company" class="input-xxlarge" name="company" required>-->
		    	<select id="inputCompany" name="company">
				  <option value="gap">Gap (json link)</option>
				  <option value="old navy">Old Navy (json link)</option>
				  <option value="banana">Banana (json link)</option>
				  <option value="piperlime">piperlime (json link)</option>
				  <option value="athleta">Athleta (json link)</option>
				  <option value="jcrew">JCrew</option>
				  <option value="ann taylor">Ann Taylor</option>
				  <option value="loft">Loft</option>
				  <option value="urban outfitters">Urban Outfitters</option>
				  <option value="zara">Zara</option>
				  <option value="hm">H&M (json link)</option>
				  <option value="tory burch">Tory Burch</option>
				</select> 
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputAudience">Target Consumers</label>
		    <div class="controls">
		   		<input type="text" id="inputAudience" placeholder="Target Consumers (i.e. Women, Men, Boys, Girls, etc...)"  class="input-xxlarge"  name="consumer" required>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputCategory">Category</label>
		    <div class="controls">
		   		<input type="text" id="inputCategory" placeholder="Category (i.e. Dresses, Pants, Shoes, Hats, etc...)" class="input-xxlarge" name="category" required>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputLink">Link to Products Page</label>
		    <div class="controls">
		   		<input type="text" id="inputLink" placeholder="Link to Products Page" name="link" class="input-xxlarge" required>
		    </div>
	    </div>
	    <div class="control-group">
		    <div class="controls"> 
		    	<button class="btn" id="save">Save</button>
	    	</div>
	    </div>
    </form>
<hr>

<div id="main-workspace" style="display:none;"></div>
<div id="json-output" style="display:none;"></div>

<?php include(dirname(__FILE__) . '/../../static/footer.php');   ?>

<script src="/lib/javascript/jquery-1.7.2.min.js"></script>
<script src='https://cdn.firebase.com/v0/firebase.js'></script>
<script src="../js/storeApi.js"></script>
<script src="../js/firebaseExtension.js"></script>
<script type="text/javascript">
firebase.init();

setTimeout(function(){
if(firebase.userid == null){
	alert("You must be logged in to save products. Go back to the login page and then come here.");
}
},7000);
$(document).ready(function() {	
	$.getJSON("../js/json/storeLinks.json", function(json){
		getLinks(json);	
	});
});

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

function saveAllProducts(){
	var total = $("#links > .company > .customer > .category > input:checked").size();
	var fireBaseHome = new Firebase('https://clothies.firebaseio.com/store/');
 	var success = 0;
 	
 	if (total <= 0){
		alert("There is nothing to save! Please add product data.");	
	}else{ 	
	 	$("#json-output").children().each(function(){			
			fireBase = fireBaseHome.child($(this).attr("company").toLowerCase());		
			fireBase = fireBase.child($(this).attr("customer").toLowerCase());
			fireBase = fireBase.child($(this).attr("category").toLowerCase());
			
			var jsonObj = $.parseJSON($(this).text());
			
			// firebase.update
			fireBase.set({products : jsonObj}, function(error) {
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
	
	
</script>
</body>
</html>
