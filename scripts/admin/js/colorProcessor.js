var colorProcessor = {	
    limit: 1000,
    count: 0,
    initialColorCount: 0,
    lastColorCount: 0,
    startScript: null,
    startProcessing: null,
    stop: false,

	init: function(){	    
		$("body").append($("<div>").addClass("toggleScript btn btn-success").html("Start Color Script"));		
		$(document).on("click", ".toggleScript", colorProcessor.toggleScript)										
	},
	
	toggleScript: function(){
	    if ($(".toggleScript").hasClass("running")){
	         $(".toggleScript").removeClass("running");
	         $(".toggleScript").removeClass("btn-info");
	         $(".toggleScript").addClass("btn-success");
	         $(".toggleScript").text("Start Color Script");
	         
	         colorProcessor.stop = true;	         
	         Messenger.info("Script will stop after the current step completes");
	         
	    }else{
	         $(".toggleScript").addClass("running");
	         $(".toggleScript").addClass("btn-info");
	         $(".toggleScript").removeClass("btn-success");
	         $(".toggleScript").text("Stop Color Script");
	         
	         colorProcessor.stop = false;	       
	         Messenger.info("Starting Script...");
	         
	         // Steps:
    		// 1) readColorCount - gets the total number of colors from Database
    		// 2) processColors - Get products not in DB, process colors, and save
    		// 3) readResults - print results and start step #1 again
    		colorProcessor.startScript = new Date().getTime();
    		$.post( window.HOME_ROOT + "c/count", colorProcessor.readColorCount);
	    }
	},
	
	readColorCount: function(data){
	   console.log(data);
	   
	   if (isNaN(data)){	        
	        $("body").append($("<div>").html(colorProcessor.count + ") Error getting total colors in database."));
	   }else{	        	       
	         if (colorProcessor.count == 0){
    	           colorProcessor.initialColorCount = parseInt(data);
    	           colorProcessor.lastColorCount = parseInt(data);
    	     }else{    	           
    	           var numberOfNewColors = parseInt(data) - colorProcessor.lastColorCount;
    	           colorProcessor.stop = colorProcessor.stop || numberOfNewColors <= 0;    	           
    	           $("body").append($("<div>").html(colorProcessor.count + ") " + numberOfNewColors + " Colors added in this batch"));    	             	           
    	               	           
    	           colorProcessor.lastColorCount = parseInt(data);
    	           var totalColorCount = colorProcessor.lastColorCount - colorProcessor.initialColorCount;     	   
    	           
    	           $("body").append($("<div>").html(colorProcessor.count + ") " + totalColorCount + " Total Colors added so far"));    
    	     }
	       
    	     $("body").append($("<br>"));    	         	         	         	         	     
    	     $(".spinner").hide();

    	     colorProcessor.count++;
    	     if (!colorProcessor.stop){
          	     
          	     if (colorProcessor.count <= colorProcessor.limit){
            	         colorProcessor.processColors();    
            	 }
    	     }
	   }
	},	
	
	processColors: function(){
	   	     	   	   
	     $("body").append(
	           $("<div>").html(colorProcessor.count + ") Processing Colors (Takes a few minutes)...").append(
     	           $("<img>").addClass("spinner").attr("src","/css/images/loading.gif")
     	     )
	     );	     	     
	     
	     window.scrollTo(0, document.body.scrollHeight);
	     
	     colorProcessor.startProcessing = new Date().getTime();
         $.post( window.HOME_ROOT + "c/get", colorProcessor.readResults);
	},
	
	readResults: function (data){	        
	    var endTime = new Date().getTime();
	    var executionTime = Math.round((endTime - colorProcessor.startProcessing) / 1000);
	    
	    var totalExecutionTime = (endTime - colorProcessor.startScript) / 60000;
	    totalExecutionTime = Math.round(totalExecutionTime * 100) / 100;
	    
	     $("body").append($("<div>").html(colorProcessor.count + ") Finished processing in " + executionTime + " seconds"));
	     $("body").append($("<div>").html(colorProcessor.count + ") Total processing time: " + totalExecutionTime + " minutes"));	     
	    	    
	    $.post( window.HOME_ROOT + "c/count", colorProcessor.readColorCount);
	},
	
						
};

var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};










/****************************
* DEPRECATED
****************************/

var colorProcessorSaveToFirebase = {	

	success: "",
	firebase: null,
	refresh: false,
	maxProductsToLoad: 10000,
	previouslySavedImages: null,
	colorStore: null,	
	interval: null,
	intervalCounter: 0,
	totalImages: 0,	
	saved: false,
	startTime: null,

	init: function(){	    
		console.log("Initializing... Please be patient this could take several minutes...");
		$("body").append($("<div>").html("Initializing... Please be patient this could take several minutes..."));
		
		colorProcessorSaveToFirebase.firebase = new Firebase('https://clothies.firebaseio.com');
		colorProcessorSaveToFirebase.firebase.child('store').once('value', colorProcessorSaveToFirebase.start);	 	 
		
		$(document).on("click",".getColors", colorProcessorSaveToFirebase.getColorsFromSavedFile);
	},
	
	start: function(store){
	   if (colorProcessorSaveToFirebase.refresh){
           colorProcessorSaveToFirebase.colorStore = {};
    	   colorProcessorSaveToFirebase.previouslySavedImages = [];	    	       
	   }else{
    	   // load current saved colors
    	   colorProcessorSaveToFirebase.colorStore = store.child('colors').val();
    	   colorProcessorSaveToFirebase.previouslySavedImages = colorProcessorSaveToFirebase.getColorStore(colorProcessorSaveToFirebase.colorStore);	   
	   }
	   
	   // Get all products from store  	   
	   colorProcessorSaveToFirebase.getProducts(store.child('products').val());
	},	
	
	getColorStore: function(colorListing){
	    var products = [];
	    
	    // Get flat product listing	 	
	 	for(var color in colorListing){	
	 	     for(var sku in colorListing[color]){
	 	            products.push(sku);
	 	     }
	 	}
	 	
	 	return products;
	},
 
 	getProducts: function(store){	 
 		console.log("Getting products...");
 		$("body").append($("<div>").html("Getting products..."));
		var productListing = new Object();	
	 	var d = new Date();
	 	var startTime = d.getTime();
	 	var alreadyInStoreCount = 0;	 	 		 			 	
	 	
	 	// Get flat product listing	 	
	 	for(var company in store){	 			 			 			 		
	 		for(var audience in store[company]){
    	 		for(var category in store[company][audience]){
    	 			for(var sku in store[company][audience][category]){
    	 			   
    	 			    if (colorProcessorSaveToFirebase.maxProductsToLoad > Object.keys(productListing).length){
    	 			       
    	 			       if(colorProcessorSaveToFirebase.previouslySavedImages.indexOf(sku) < 0){
    					       productListing[sku] = store[company][audience][category][sku]['image'];													
    	 			       }else{
    	 			           alreadyInStoreCount++;   
    	 			       }
    	 			    }
	 				}
	 			}
	 		}
	 	}	
	 		 		 	
	 	// Log status update
	 	d = new Date();
	 	var endTime = d.getTime();
	 	
	 	console.log("Loaded " + Object.keys(productListing).length + " products in " + ((endTime - startTime) / 1000) + " seconds");
	 	$("body").append($("<div>").html("Loaded " + Object.keys(productListing).length + " products in " + ((endTime - startTime) / 1000) + " seconds"));
	 	$("body").append($("<div>").html("("+alreadyInStoreCount+" products were previously processed and do not need to process again)"));
	 	
	 	colorProcessorSaveToFirebase.totalImages = Object.keys(productListing).length;	 
	 	
	 	if (colorProcessorSaveToFirebase.totalImages > 0){	
	 	     colorProcessorSaveToFirebase.processImages(productListing);
	 	}else{
	 	     $("body").append($("<div>").html("There is nothing to process. So we are ALL DONE!")); 
	 	}
	 },
	 
	 processImages: function(products){
	       var d = new Date();
	 	   colorProcessorSaveToFirebase.startTime = d.getTime();
	 	   
	 	   console.log("Processing Images...");
	 	   $("body").append($("<div>").html("Processing Images... "));
	 	   $("body").append($("<div>").html("This could take some time... Started at: " + d.toLocaleDateString() + " " + d.toLocaleTimeString()));
	 	   $("body").append($("<div>").html("Go relax and do something else... Come back in a little while B-)"));
	 	   
	   
	       var productStore = JSON.stringify(products);
	       $.post( "colorExtract/colorInspector.php", {store: productStore, numColorsToTag: 2}, function( data ) {
                var colorStore = $.parseJSON(data);
                colorProcessorSaveToFirebase.saveColorTags(colorStore);                                
           });
           
           $("body").append($("<div>").html('<br><br>Number of images processed: ').append($("<h1>").attr("id","counter").css("font-weight","bold").text("0")));   
           $("body").append($("<div>").addClass("progress progress-striped active").append($("<div>").addClass("bar").css("width", "0px")));
           
           colorProcessorSaveToFirebase.interval = setInterval(colorProcessorSaveToFirebase.getProcessedStatus,10000);
           
	 },
	 
	 getProcessedStatus: function(){
            $.getJSON( "colorExtract/colorInspectorSaved.json", function( json ) {               
                var isStaleCounter = json.numProducts == parseInt($("#counter").text());
                
                $("#counter").text(json.numProducts);                    
                var width = parseInt((json.numProducts / colorProcessorSaveToFirebase.totalImages) * 100) ;
                width += "%";
                $(".bar").css("width",width);                
                
                if (json.numProducts == colorProcessorSaveToFirebase.totalImages){
                    clearInterval(colorProcessorSaveToFirebase.interval);                    
                    $("body").append($("<div>").html('All of the images were processed successfully')); 
                    colorProcessorSaveToFirebase.saveColorTags(json);                      
                    
                }else if (isStaleCounter){
                    colorProcessorSaveToFirebase.intervalCounter++;
                    
                    if (colorProcessorSaveToFirebase.intervalCounter > 5){
                        clearInterval(colorProcessorSaveToFirebase.interval);
                        $("body").append($("<div>").html('The script seemed to stop before all images were processed, but we have saved all of the images that were processed up to now.'));   
                        $("body").append($("<button>").addClass("btn btn-large btn-primary getColors").text("Save Processed Images").attr("type","button"));
                    }
                }                             
            });
	 },
	 
	 getColorsFromSavedFile: function(){
	   var str = $(".fileEnding").val();
	   str = str == null ? "" : str;	   	   
	   $.getJSON( "colorExtract/colorInspectorSaved.json" + str, function( json ) {               
	       colorProcessorSaveToFirebase.saveColorTags(json);                                
	   });
	 },
	 
    saveColorTags: function(colorStore){
        if (!colorProcessorSaveToFirebase.saved){                
            colorProcessorSaveToFirebase.saved = true;
                
            if (colorStore == null){
                console.log("Whoops! There was an error!");
    	 	    $("body").append($("<div>").html("Whoops! There was an error!"));
    	 	    $("body").append($("<div>").html(colorStore));       
            }else{
                                
                // Log status update
        	 	d = new Date();
        	 	var endTime = d.getTime();
                console.log("Processed " + colorStore.numProducts + " products in " + ((endTime - colorProcessorSaveToFirebase.startTime) * 1000) + " seconds");
        	 	$("body").append($("<div>").html("Processed " + colorStore.numProducts + " products in " + ((endTime - colorProcessorSaveToFirebase.startTime) * 1000) + " seconds<br><br>"));
        	 	
        	 	console.log("Saving Color Mapping...");    	 	
         	 	$("body").append($("<div>").html("Saving Color Mapping..."));	
        	 	
        	 		 		 		 	
         		if(colorStore != null && Object.keys(colorStore.colors).length > 0){	
         		     
         		    $.extend( true, colorStore.colors, colorProcessorSaveToFirebase.colorStore );
         			colorProcessorSaveToFirebase.firebase.child("store/colors").set(colorStore.colors, function(error) {
         				  if (error) {						
         				        console.log("There was an error while saving to firebase");
         						$("body").append($("<div>").html("There was an error while saving to firebase!"));
         						$("body").append($("<div>").html("Try logining in again."));
         				  }else{
         						console.log("Color mapping was saved successfully. ");
         						$("body").append($("<div>").html("Color mapping was saved successfully."));
         						$("body").append($("<div>").html("ALL DONE!!!"));      
         						
         						colorProcessorSaveToFirebase.firebase.child("store/colorCount").set(Object.keys(colorStore.colors).length);  
         				  }
         			});			
         		}else{
         	      $("body").append($("<div>").html("There were no colors returned from the processing script. It is possible that these images are no longer active or that there is a problem with the image url\'s"));	 
         		}	
            }            	   
        }else{
            $("body").append($("<div>").html("The colors for these products were already saved!"));
        }
    }
};
