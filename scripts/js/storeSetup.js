var storeSetup = {	

	success: "",
	firebase: null,
	clothingStore: null,

	setup: function(){	    
		console.log("Initializing... Please be patient this could take a few minutes...");
		$("body").append($("<div>").html("Initializing... Please be patient this could take a few minutes..."));
		storeSetup.firebase = new Firebase('https://clothies.firebaseio.com');
		storeSetup.firebase.child('clositt').once('value', storeSetup.start);	 	 
	},
	
	start: function(store){
	   // load current store
	   storeSetup.clothingStore = store.child("products").val();
	   
	   // get new products and save
	   storeSetup.firebase.child('store/products').once('value', storeSetup.getProducts);	 	 
	},	
 
 	getProducts: function(store){	 
 		console.log("Getting products...");
 		$("body").append($("<div>").html("Getting products..."));
		var productListing = new Object();	
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
	 				 				 				 				
	 				category.forEach(function(productSnapshot){	 				
							var product = productSnapshot.val();
							
							// get Price and filer price					
							var priceArray = product.price.trim().split(/[\s-]+/);
							var finalPrice = parseFloat(priceArray[priceArray.length - 1].replace(/[^0-9\.]+/g,""));
							
							var filterPrice = Math.floor(finalPrice/50)*50;
							
							finalPrice = isNaN(finalPrice) ? null : finalPrice;
							filterPrice = isNaN(filterPrice) ? null : filterPrice;
							
							if(prices.indexOf(filterPrice) < 0 && !isNaN(filterPrice)){ 						
								prices.push(filterPrice);
							}
							
							// get reviewCount and Clositt Count
							var currentProduct = storeSetup.clothingStore[product.sku];
							var reviewCount = 0;
							var closittCount = 0;
							
							if (currentProduct != null){
							     reviewCount = currentProduct.rc == null ? 0 : currentProduct.rc;
							     closittCount = currentProduct.cc == null ? 0 : currentProduct.cc;
							}
							
							var item = {"s":product.sku,"o":companyName,"u":customerName,"a":categoryName,
									    "l":product.link,"i":product.image,"n":product.name,"p":finalPrice,"fp":filterPrice,
									    "rc":reviewCount,"cc":closittCount};
							productListing[product.sku] = item;				
	 				});	
	 			});	
	 		});	
	 	}); 	
	 	
	 	d = new Date();
	 	var endTime = d.getTime();
	 	
	 	console.log("Loaded " + productListing.length + " products in " + ((endTime - startTime) / 1000) + " seconds");
	 	$("body").append($("<div>").html("Loaded " + productListing.length + " products in " + ((endTime - startTime) / 1000) + " seconds<br><br>"));
	 	
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
	 	var i=1;
	 	storeSetup.save("clositt/products", products, i++);
		storeSetup.save("clositt/companies", companies.sort(), i++);
		storeSetup.save("clositt/customers", customers.sort(), i++);
		storeSetup.save("clositt/categories", categories.sort(), i++);
		storeSetup.save("clositt/prices", prices.sort(), i++);		

		//var categoryStore = storeSetup.getCategoryStore(products);
		//storeSetup.save("categoryStore", categoryStore, i++);		
	 },
	 
	 save: function(name, obj, i){
	    var cleanName = name.indexOf("/") >= 0 ? name.substring(name.indexOf("/") + 1) : name;
	   
	 	console.log(i + ") Saving " + Object.keys(obj).length + " " + cleanName  + "...");
	 	$("body").append($("<div>").html(i + ") Saving " + Object.keys(obj).length + " " + cleanName + "..."));
	 		 	
	 	var count = 0;	 	
		if(obj != null && Object.keys(obj).length > 0){																					
			storeSetup.firebase.child(name).set(obj, function(error) {
				  if (!error) {						
						console.log(i + ") " + Object.keys(obj).length + " " + cleanName + " saved successfully. ");
						$("body").append($("<div>").html(i + ") " + Object.keys(obj).length + " " + cleanName + " saved successfully."));
						
						count++;
						if (count == 5){
						  $("body").append($("<div>").html("DONE!"));  
						}
				  }
			});
			
		}	
	 },
	 
	 getCategoryStore: function(products){
	       var categoryStore = new Object();
	       
	       if (products != null){    	       
    	       var skus = Object.keys(products);
    	       
    	       for(var i=0; i < skus.length; i++){
    	           var product = products[skus[i]];
    	           
    	           // add category 
    	           if (!(product.a in categoryStore)){
    	               categoryStore[product.a] = new Object();   
    	           }
    	           
    	           // add customer
    	           if (!(product.u in categoryStore[product.a])){
    	               categoryStore[product.a][product.u] = new Object();   
    	           }
    	           
    	           // add store
    	           if (!(product.o in categoryStore[product.a][product.u])){
    	               categoryStore[product.a][product.u][product.o] = new Object();   
    	           }
    	           
    	           // add skus
    	           if (!(product.s in categoryStore[product.a][product.u][product.o])){
    	               categoryStore[product.a][product.u][product.o][product.s] = product;  
    	           }
    	       }     	           	       
	       }
	       
	       return categoryStore;
	 }	 
}

var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};
