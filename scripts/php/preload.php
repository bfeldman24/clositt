<html>
<head></head>
<body>


<!--<script src="http://www.bprowd.com/lib/javascript/jquery-1.7.2.min.js"></script>-->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="/lib/javascript/jquery-ui-1.10.1.custom/js/jquery-ui-1.10.1.custom.min.js"></script>
<script src="/lib/javascript/bootstrap.min.js"></script>


<script src='https://cdn.firebase.com/v0/firebase.js'></script>
<script type='text/javascript' src='https://cdn.firebase.com/v0/firebase-auth-client.js'></script>

<script type="text/javascript">

var storeSetup = {	

	success: "",
	firebase: null,

	setup: function(){
		console.log("Initializing... Please be patient this could take a few minutes...");
		$("body").append($("<div>").html("Initializing..."));
		storeSetup.firebase = new Firebase('https://clothies.firebaseio.com');
		storeSetup.firebase.child('store').once('value', storeSetup.getProducts);	 	 
	},
 
 	getProducts: function(store){	 
 		console.log("Getting products...");
 		$("body").append($("<div>").html("Getting products..."));
		var productListing = new Array();	
	 	var companies = new Array();
	 	var customers = new Array();
	 	var categories = new Array();
	 	var prices = new Array();
	 	var i=0;
	 	var count=0;
	 	var d = new Date();
	 	var startTime = d.getTime();
	 	var start = parseInt(sessionStorage.productIndex);
	 		 	
	 	store.forEach(function(company){	 			 		
	 		var companyName = stringFunctions.toTitleCase(company.name());
	 		
	 		if(companies.indexOf(companyName) < 0){
		 		companies.push(companyName);
	 		}
	 		
	 		company.forEach(function(audience){
	 			var customerName = stringFunctions.toTitleCase(audience.name());
	 			
	 			if(customers.indexOf(customerName) < 0){
		 			customers.push(customerName);
	 			}
	 			
	 			audience.forEach(function(category){
	 				var categoryName = stringFunctions.toTitleCase(category.name()); 				
	 				
	 				if(categories.indexOf(categoryName) < 0){
		 				categories.push(categoryName);
	 				}	 				
	 				 				 				 				
	 				category.child("products").forEach(function(productSnapshot){	 				
							var product = productSnapshot.val();
												
							var priceArray = product.price.split(/[\s-]+/);
							var finalPrice = parseFloat(priceArray[priceArray.length - 1].replace(/[^0-9\.]+/g,""));
							
							var filterPrice = Math.floor(finalPrice/50)*50;
							
							finalPrice = isNaN(finalPrice) ? null : finalPrice;
							filterPrice = isNaN(filterPrice) ? null : filterPrice;
							
							if(prices.indexOf(filterPrice) < 0 && !isNaN(filterPrice)){ 						
								prices.push(filterPrice);
							}
							
							var product = {"o":companyName,"u":customerName,"a":categoryName,"l":product.link,
												"i":product.image,"n":product.name,"p":finalPrice,"fp":filterPrice};
							productListing.push(product);																						
	 				});	
	 			});	
	 		});	
	 	}); 	
	 	
	 	d = new Date();
	 	var endTime = d.getTime();
	 	
	 	console.log("Loaded " + productListing.length + " products in " + ((endTime - startTime) / 1000) + " seconds");
	 	$("body").append($("<div>").html("Loaded " + productListing.length + " products in " + ((endTime - startTime) / 1000) + " seconds"));
	 	
	 	//storeSetup.randomize(productListing, companies, customers, categories, prices);
	 	storeSetup.saveAllProducts(productListing, companies, customers, categories, prices);
	 },
	 
	 randomize: function(products, companies, customers, categories, prices){
	 	var rand = 0;	 			
	 	var temp = null;

		for(var i=0; i< products.length; i++){
			rand = Math.floor(Math.random() * products.length);
			temp = products[i];
			products[i] = products[rand];
			products[rand] = temp; 						
		}
		
		storeSetup.saveAllProducts(products, companies, customers, categories, prices);		
	 },
	 
	 
	 saveAllProducts: function(products, companies, customers, categories, prices){
	 	storeSetup.save("products", products);
		storeSetup.save("companies", companies.sort());
		storeSetup.save("customers", customers.sort());
		storeSetup.save("categories", categories.sort());
		storeSetup.save("prices", prices.sort());		
	 },
	 
	 save: function(name, obj){
	 	console.log("Saving " + obj.length + " " + name  + "...");
	 	$("body").append($("<div>").html("Saving " + obj.length + " " + name + "..."));
	 	
		if(obj.length > 0){																							
			
			storeSetup.firebase.child("clositt").child(name).set(obj, function(error) {
				  if (!error) {						
						console.log(obj.length + " " + name + " saved successfully. ");
						$("body").append($("<div>").html(obj.length + " " + name + " saved successfully."));
				  }
			});
			
		}	
	 }			 
}

var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};

storeSetup.setup();

</script>


</body>
</html>