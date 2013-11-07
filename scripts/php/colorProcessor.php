<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
?>
</head>
<body>


<!--<script src="http://www.bprowd.com/lib/javascript/jquery-1.7.2.min.js"></script>-->
<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="/lib/javascript/jquery-ui-1.10.1.custom/js/jquery-ui-1.10.1.custom.min.js"></script>
<script src="/lib/javascript/bootstrap.min.js"></script>

<script src='https://cdn.firebase.com/v0/firebase.js'></script>
<script type='text/javascript' src='https://cdn.firebase.com/v0/firebase-auth-client.js'></script>
-->

<script src="../js/firebaseExtension.js"></script>
<script type="text/javascript">
var colorProcessor = {	

	success: "",
	firebase: null,
	refresh: true,
	maxProductsToLoad: 3000,
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
		colorProcessor.firebase = new Firebase('https://clothies.firebaseio.com');
		colorProcessor.firebase.child('store').once('value', colorProcessor.start);	 	 
		$(document).on("click",".getColors", colorProcessor.getColorsFromSavedFile);
	},
	
	start: function(store){
	   if (colorProcessor.refresh){
           colorProcessor.colorStore = {};
    	   colorProcessor.previouslySavedImages = [];	    	       
	   }else{
    	   // load current saved colors
    	   colorProcessor.colorStore = store.child('colors').val();
    	   colorProcessor.previouslySavedImages = colorProcessor.getColorStore(colorProcessor.colorStore);	   
	   }
	   
	   // Get all products from store  	   
	   colorProcessor.getProducts(store.child('products').val());
	},	
	
	getColorStore: function(store){
	    var products = [];
	    
	    // Get flat product listing	 	
	 	for(var color in store){	
	 	     for(var sku in store[color]){
	 	            products.push(store[color][sku]);
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
    	 			   
    	 			    if (colorProcessor.maxProductsToLoad > Object.keys(productListing).length){
    	 			       
    	 			       if(colorProcessor.previouslySavedImages.indexOf(sku) < 0){
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
	 	
	 	colorProcessor.totalImages = Object.keys(productListing).length;	 
	 	
	 	if (colorProcessor.totalImages > 0){	
	 	     colorProcessor.processImages(productListing);
	 	}else{
	 	     $("body").append($("<div>").html("There is nothing to process. So we are ALL DONE!")); 
	 	}
	 },
	 
	 processImages: function(products){
	       var d = new Date();
	 	   colorProcessor.startTime = d.getTime();
	 	   
	 	   console.log("Processing Images...");
	 	   $("body").append($("<div>").html("Processing Images... "));
	 	   $("body").append($("<div>").html("This could take some time... Started at: " + d.toLocaleDateString() + " " + d.toLocaleTimeString()));
	 	   $("body").append($("<div>").html("Go relax and do something else... Come back in a little while B-)"));
	 	   
	   
	       var productStore = JSON.stringify(products);
	       $.post( "colorExtract/colorInspector.php", {store: productStore, numColorsToTag: 2}, function( data ) {
                var colorStore = $.parseJSON(data);
                colorProcessor.saveColorTags(colorStore);                                
           });
           
           $("body").append($("<div>").html('<br><br>Number of images processed: ').append($("<h1>").attr("id","counter").css("font-weight","bold").text("0")));   
           $("body").append($("<div>").addClass("progress progress-striped active").append($("<div>").addClass("bar").css("width", "0px")));
           
           colorProcessor.interval = setInterval(colorProcessor.getProcessedStatus,10000);
           
	 },
	 
	 getProcessedStatus: function(){
            $.getJSON( "colorExtract/colorInspectorSaved.json", function( json ) {               
                var isStaleCounter = json.numProducts == parseInt($("#counter").text());
                
                $("#counter").text(json.numProducts);                    
                var width = parseInt((json.numProducts / colorProcessor.totalImages) * 100) ;
                width += "%";
                $(".bar").css("width",width);                
                
                if (json.numProducts == colorProcessor.totalImages){
                    clearInterval(colorProcessor.interval);                    
                    $("body").append($("<div>").html('All of the images were processed successfully')); 
                    colorProcessor.saveColorTags(json);                      
                    
                }else if (isStaleCounter){
                    colorProcessor.intervalCounter++;
                    
                    if (colorProcessor.intervalCounter > 5){
                        clearInterval(colorProcessor.interval);
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
	       colorProcessor.saveColorTags(json);                                
	   });
	 },
	 
    saveColorTags: function(colorStore){
        if (!colorProcessor.saved){                
            colorProcessor.saved = true;
                
            if (colorStore == null){
                console.log("Whoops! There was an error!");
    	 	    $("body").append($("<div>").html("Whoops! There was an error!"));
    	 	    $("body").append($("<div>").html(colorStore));       
            }else{
                                
                // Log status update
        	 	d = new Date();
        	 	var endTime = d.getTime();
                console.log("Processed " + colorStore.numProducts + " products in " + ((endTime - colorProcessor.startTime) * 1000) + " seconds");
        	 	$("body").append($("<div>").html("Processed " + colorStore.numProducts + " products in " + ((endTime - colorProcessor.startTime) * 1000) + " seconds<br><br>"));
        	 	
        	 	console.log("Saving Color Mapping...");    	 	
         	 	$("body").append($("<div>").html("Saving Color Mapping..."));	
        	 	
        	 		 		 		 	
         		if(colorStore != null && Object.keys(colorStore.colors).length > 0){	
         		     
         		    $.extend( true, colorStore.colors, colorProcessor.colorStore );
         			colorProcessor.firebase.child("store/colors").set(colorStore.colors, function(error) {
         				  if (error) {						
         				        console.log("There was an error while saving to firebase");
         						$("body").append($("<div>").html("There was an error while saving to firebase!"));
         						$("body").append($("<div>").html("Try logining in again."));
         				  }else{
         						console.log("Color mapping was saved successfully. ");
         						$("body").append($("<div>").html("Color mapping was saved successfully."));
         						$("body").append($("<div>").html("ALL DONE!!!"));         						
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
}

var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};

</script>


<script type="text/javascript">
firebase.init();

<?php if ($_GET['manual'] == "y"){ ?>
    $("body").append($("<input>").attr("type","text").addClass("fileEnding").css("height","30px"));
    $("body").append($("<button>").addClass("btn btn-large btn-primary getColors").text("Save Processed Images").attr("type","button"));
    
    colorProcessor.firebase = new Firebase('https://clothies.firebaseio.com'); 	 
	$(document).on("click",".getColors", colorProcessor.getColorsFromSavedFile);    
<?php }else{ ?>
    colorProcessor.init();
<?php } ?>

</script>

</body>
</html>