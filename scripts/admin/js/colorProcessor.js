var colorProcessor = {	
    limit: 1000,
    count: 0,
    initialColorCount: 0,
    lastColorCount: 0,
    startScript: null,
    startProcessing: null,
    stop: false,
    autoRunHash: '#autoStart',    

	init: function(){	    
		$("body").append($("<div>").addClass("toggleScript btn btn-default btn-success").html("Process New Colors"));		
		$("body").append($("<div>").addClass("verifymapping btn btn-info").html("Verify Color Mapping"));		
		$(document).on("click", ".toggleScript", colorProcessor.toggleScript);												
		
		if (location.hash == colorProcessor.autoRunHash){
	       colorProcessor.toggleScript();               
        }	
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



/**********************
* COLOR MAPPING
********************/

var colorMappingProcessor = {
    parentOptions: null,
    
    init: function(){
        $(document).on("click", ".verifymapping", colorMappingProcessor.getColorMapping);
        $(document).on("click", ".approveColors", colorMappingProcessor.saveColorMapping);
        $(document).on("click", ".toggleSelectAll", colorMappingProcessor.toggleSelectAll);        
        $.getJSON( window.HOME_ROOT + "scripts/admin/php/colorExtract/colors.json", colorMappingProcessor.getParentOptions);
        $.post( window.HOME_ROOT + "c/getmappingcount", colorMappingProcessor.areAnyColorsLeft);
    },
    
    getColorMapping: function(){
        $(".verifymapping").attr("disabled","true");
        $(document).off("click", ".verifymapping");
        
        Messenger.info("Getting Unapproved Colors...");
        $.getJSON( window.HOME_ROOT + "c/createmappings", colorMappingProcessor.showColorMapping);
    },        
    
    showColorMapping: function(colors){
        if (colors.colors != null){
            colors = colors.colors;   
        }    
        
        var table = $("<table>").addClass("colorTable table table-bordered");
        table.append( 
            $("<tr>").append(
                $("<th>").text("Approve")
            ).append(
                $("<th>").text("Color")
            ).append(
                $("<th>").text("ColorHexa Description")
            ).append(
                $("<th>").text("Brightness")
            ).append(
                $("<th>").text("Saturation")
            ).append(
                $("<th>").text("Color Name")
            ).append(
                $("<th>").text("Parent")
            )
        );
        $("body").append( table );
        
        for(var i=0; i < Object.keys(colors).length; i++){
            var color = Object.keys(colors)[i];
        
            table.append(
                $("<tr>").addClass("colorMapping").css("background-color","#"+ color).append(
                    $("<td>").append(
                        $("<input>")
                            .attr("type","checkbox")
                            .addClass("colorMapping-approval")
                            .prop("checked", true)
                    )
                ).append(
                    $("<td>")
                        .css("background-color","#" + color)
                        .addClass("colorMapping-color")
                        .append( $("<a>").attr("href","http://www.colorhexa.com/" + color).text(color) )
//                ).append(
//                    $("<span>")
//                        .addClass("colorMapping-parent")
//                        .html(colorMappingProcessor.parentOptions.clone().val(colors[color]))
                ).append(
                    $("<td>")
                        .addClass("colorMapping-name")
                        .attr("id","colorMapping-name-" + color)
                )
            );
            
            colorMappingProcessor.getColorName(color);
        }
        
        $("body").append(
            $("<button>").addClass("btn btn-default btn-large toggleSelectAll").text("Deselect All")
        ).append(
            $("<button>").addClass("btn btn-success btn-large approveColors").text("Approve Checked Colors")
        );                
    },                
    
    getParentOptions: function(colors){                
        var select = $("<select>").addClass("parentOptions");                        
        var allColors = [];
        
        for(var i=0; i < Object.keys(colors).length; i++){
            allColors.push(Object.keys(colors)[i]);
        }
            
        allColors.sort(); 
        
        for(var i=0; i < allColors.length; i++){
            var color = allColors[i];
            
            select.append(
                $("<option>").attr("value",color.toLowerCase()).text(color)
            );
        }
        
        colorMappingProcessor.parentOptions = select;               
    },
    
    getColorName: function(hex){
        var colorHexaUrl = "http://www.colorhexa.com/" + hex;
        
        $.post( window.HOME_ROOT + "scripts/admin/php/webProxy.php", {u: colorHexaUrl}, function(data){
               var colorName = $(data).find(".color-description strong").text().trim();            
               var id = "#colorMapping-name-" + hex;
               $(id).append( $("<input>").addClass("hexaInput input-sm").val(colorName) );                              
               
               if (colorName.indexOf("(") >= 0){
                    colorName = colorName.substring(0, colorName.indexOf("(")) + colorName.substring(colorName.indexOf(")") + 1);
               }
               
               if (colorName.indexOf("[") >= 0){
                    colorName = colorName.substring(0, colorName.indexOf("[")) + colorName.substring(colorName.indexOf("]") + 1);
               }
               
               colorName = colorName.toLowerCase().trim();                                            
               
               // Dark, light, normal
               var brightness = null;
               if (colorName.indexOf("very dark") >= 0){
                    brightness = "very dark";
                    
               }else if (colorName.indexOf("dark") >= 0){
                    brightness = "dark";
               }else if (colorName.indexOf("light") >= 0){
                    brightness = "light";
               }else if (colorName.indexOf("bright") >= 0){
                    brightness = "bright";
               }else if (colorName.indexOf("pale") >= 0){
                    brightness = "pale";     
               }else{
                    brightness = "normal";
               }    
               
               $(id).parent().append( $("<td>").append( $("<input>").addClass("brightness hexaInput input-sm").val(brightness) ));
               colorName = colorName.replace(brightness,"");                          
               
               // moderdate, 
               var saturation = null;
               if (colorName.indexOf("moderate") >= 0){
                    saturation = "moderate";                    
               }else if (colorName.indexOf("sharp") >= 0){
                    saturation = "sharp";               
               }else if (colorName.indexOf("strong") >= 0){
                    saturation = "strong";
               }else if (colorName.indexOf("soft") >= 0){
                    saturation = "soft";
               }else if (colorName.indexOf("vivid") >= 0){
                    saturation = "vivid";
               }else{
                    saturation = "normal";               
               }       
               
               $(id).parent().append( $("<td>").append( $("<input>").addClass("saturation hexaInput input-sm").val(saturation) ));
               colorName = colorName.replace(saturation,"");       
                                             
               // Parent color
               var colorParts = colorName.split(" ");
               var parentName = colorParts[colorParts.length - 1];
               brightness = brightness.replace("normal","");
               $(id).parent().append( $("<td>").append ($("<input>").addClass("hexaColorName hexaInput input-sm").val(brightness + " " + parentName) ));
               $(id).parent().append( $("<td>").append ($("<input>").addClass("hexaColorParent hexaInput input-sm").css("font-weight","bold").val(parentName) ));
        });
    },
    
    saveColorMapping: function(){
        var colors = {};
        
        $(".colorMapping").each(function(){
             var isApproved = $(this).find(".colorMapping-approval").prop("checked");
             
             if (isApproved){                                  
                 var colorObj = {};
                 colorObj.color = $(this).find(".colorMapping-color a").text().trim();
                 //colorObj.closestParent = $(this).siblings(".colorMapping-parent").find("select").val();
                 colorObj.brightness = $(this).find(".brightness").val().trim();
                 colorObj.saturation = $(this).find(".saturation").val().trim();
                 colorObj.description = $(this).find(".colorMapping-name input").val().trim();
                 colorObj.name = $(this).find(".hexaColorName").val().trim();                 
                 colorObj.parent = $(this).find(".hexaColorParent").val().trim(); 
                 
                 if (colorObj.brightness == "normal"){
                    colorObj.brightness = null;  
                 }
                 
                 if (colorObj.saturation == "normal"){
                    colorObj.saturation = null;  
                 }                                                  
                 
                 colors[colorObj.color] = colorObj;
             }
        });
        
        console.log(JSON.stringify(colors));        
        
        Messenger.info("Saving...");
        
        $.post( window.HOME_ROOT + "c/savemappings", {colors: colors}, function(data){
            console.log(data);
            
            if (data == "success"){
                Messenger.success("Saved!!!");
                    
                // Clean up
                $(".colorTable").remove();
                $(".approveColors").remove();
                $(".toggleSelectAll").remove();
                $(".verifymapping").removeAttr("disabled");
                $(document).on("click", ".verifymapping", colorMappingProcessor.getColorMapping);
                
                $.post( window.HOME_ROOT + "c/getmappingcount", function(count){
                    if (!isNaN(count)){
                        Messenger.info("There are " + count + " more unapproved colors");
                        Messenger.info('Click the "Verify Color Mapping" button to get the next batch');
                    }else{
                        Messenger.error("There was an error getting the number of unapproved colors");
                        Messenger.error("Error: " + count);
                    }
                });
                
            }else{
                Messenger.error("There was a problem saving the colors!");
                Messenger.error("Error: " + data);
            }
        });                        
    },
    
    areAnyColorsLeft: function(count){
        console.log(count);
        
        if (!isNaN(count)){
            if (count <= 0){
                Messenger.info("There are no more unapproved colors...");
                $(".verifymapping").attr("disabled","true");
                $(document).off("click", ".verifymapping");
            }
        }
    },
    
    toggleSelectAll: function(){
        var isSelected = $("input").first().prop("checked");        
        $("input").prop("checked",!isSelected);
        
        if(isSelected){
            $(".toggleSelectAll").text("Select All");   
        }else{
            $(".toggleSelectAll").text("Deselect All");
        }        
    }
           
};