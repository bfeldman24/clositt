var colorPresenter = {
    
    init: function(){
      $(document).on("click",".colorFilter", colorPresenter.filterColor);
      $(document).on("click", "#product-grid .outfit", colorPresenter.correctColor);    
    },
    
    filterColor: function(el){
                
        if($(el.target).hasClass("selectedColor")){            
            $(".selectedColor").removeClass("selectedColor");            
        }else{
            $(".selectedColor").removeClass("selectedColor");
            $(el.target).addClass("selectedColor");            
        }
        
        filterPresenter.onFilterSelect();
    },
    
    getSelectedColors: function(){
        var selectedColors = [];
        
        $(".selectedColor").each(function(){
            filterPresenter.createSelectedFilter($(this).attr("data-original-title"), $(this).attr("data-original-title"));
            var color = $(this).attr("data-original-title").toLowerCase();
            selectedColors.push(color);
        });
        
        return selectedColors;
    },     
    
    removeSelectedColor: function(value){ 	    
 	    $("#filter-float").find('.selectedColor[data-original-title="'+value+'"]').removeClass("selectedColor");
 	},   
    
    getColorNames: function(){
        var colorNames = [];
        
        for(var color in colorPresenter.allColors){
            colorNames.push(color); 
        }
        
        return colorNames;
    },
    
    getColorFilters: function(){
        var $colorPallet = $("<div>").attr("id","colorPallet");
        var $colorGroup = null;
        var i=0;
        var total = Object.keys(colorPresenter.allColors).length;
        
        for(var color in colorPresenter.allColors){                        
            if (i % 4 == 0){
                $colorGroup = $("<div>").addClass("colorFilterGroup");
            }               
            
            $colorGroup.append(
                $("<div>").addClass("colorFilter").addClass(color.toLowerCase()).addClass(colorPresenter.getShadowPositionClass(i, total))
                    .attr("data-toggle","tooltip").attr("data-placement",colorPresenter.getTooltipPosition(i, total))
                    .attr("data-original-title",color).css("background-color",colorPresenter.allColors[color].h)
            );
            
            if (i % 4 == 3){
                $colorPallet.append($colorGroup);
            }
            i++;
        }
        
        setTimeout(function(){
            $(".colorFilter").tooltip();    
        },3000);        
        
        return $colorPallet;
    },
   
    getShadowPositionClass: function(i, total){
        var verticalPosition = "";  
        var horizontalPosition = "";        
        
        switch(i % 4){
            case 0:
               horizontalPosition = "left";
               break;
            case 1:
            case 2:
               horizontalPosition = "middle";
               break;
            case 3:
               horizontalPosition = "right";
               break;                   
        }
        
        switch(i){
           case 0:
           case 1:
           case 2:
           case 3:
               verticalPosition = "top";
               break;
           case total - 1:
           case total - 2:
           case total - 3:
           case total - 4:
               verticalPosition = "bottom";
               break;
        }
        
        var position = "";
        if (verticalPosition != "" && horizontalPosition != ""){            
            position = verticalPosition + "-" + horizontalPosition;
        }else if(verticalPosition != ""){
            position = verticalPosition;
        }else{
            position = horizontalPosition;
        } 
        
        return position;
    },
    
    getTooltipPosition: function(i, total){
        var position = "";  
        
        switch(i){
           case 0:
           case 1:
           case 2:
               position = "top";
               break;
           case total - 2:
           case total - 3:
           case total - 4:
               position = "bottom";
               break;              
        }
        
        if (position == ""){
            switch(i % 4){
                case 0:
                case 1:
                case 2:
                   position = "top";
                   break;
                case 3:
                   position = "right";
                   break;                   
            }
        }
        
        return position;                
    },
    
    correctColor: function(e){ 
       
        if (e.altKey && e.shiftKey){
            e.preventDefault();
            e.stopPropagation();            

            setTimeout(function(){
                productPagePresenter.hide();
            }, 500); 
                        
            var sku = $(e.currentTarget).attr("pid");            
            var oldColor = $(".selectedColor").first().attr("data-original-title");
            
            if (sku != null && sku.length > 3 && oldColor != null && oldColor.length > 2){
                oldColor = oldColor.toLowerCase();
                
                $.post( window.HOME_ROOT + "c/correct", {sku: sku, oldColor: oldColor}, function(data){
                    console.log(data);
                    
                    if(isNaN(data)){
                        Messenger.error("Color was NOT removed! " + data);
                    }else{
                        Messenger.success("REMOVED COLOR!");
                    }
                });           
            }else{
                Messenger.error("You must select a color!");
            }
    
        }else if (e.altKey){
            e.preventDefault();
            e.stopPropagation();  
            
            setTimeout(function(){
                productPagePresenter.hide();
            }, 500);             
            
            var html = '<select id="selectCorrectColor" name="selectCorrectColor">';
            html += '<option value="none">None</option>';
        
            var colors = [];
            
            for(var color in colorPresenter.allColors){
                colors.push(color);
            }
            
            colors.sort();
        
            for(var c in colors){
                html += '<option value="'+colors[c]+'">'+colors[c]+'</option>';
            }   
                        
            html += '</select>';     
            
            var sku = $(e.currentTarget).attr("pid");            
    
            bootbox.dialog({
                message: html,
                title: "Correct the Color",
                buttons: {                
                    main: {
                        label: "Cancel",
                        callback: function() {
                            productPagePresenter.hide();                                                    
                        }
                    },
                    success: {
                      label: "Submit",
                      className: "btn-success",
                      callback: function() {                        
                        
                        var oldColor = $(".selectedColor").first().attr("data-original-title");
                        var newColor = $("#selectCorrectColor").val().toLowerCase();
                        
                        if (sku != null && sku.length > 3 && oldColor != null && oldColor.length > 2){
                            oldColor = oldColor.toLowerCase();                        
                            
                            $.post( window.HOME_ROOT + "c/correct", {sku: sku, oldColor: oldColor, newColor: newColor}, function(data){
                                console.log(data);
                                
                                if(isNaN(data)){
                                    Messenger.error("Color was NOT saved! " + data);
                                }else{
                                    Messenger.success("SAVED!");
                                }
                            });           
                                         
                          }else{
                                Messenger.error("You must select a color!");
                          }
                      }
                    },
                }
            });                             
        }                                       
    },
           
    allColors: {
        "Red": {          
            "h": "#f33",
            "r": 255,
            "g": 51,
            "b": 51
        },
        "Orange": {          
            "h": "#f93",
            "r": 255,
            "g": 153,
            "b": 51
        },    
        "Yellow": {          
            "h": "#ff0",
            "r": 255,
            "g": 255,
            "b": 0
        },    
        "Green": {          
            "h": "#3c3",
            "r": 51,
            "g": 204,
            "b": 51
        },    
        "Teal": {          
            "h": "#088",
            "r": 0,
            "g": 136,
            "b": 136
        },     
        "Blue": {          
            "h": "#00F",
            "r": 0,
            "g": 255,
            "b": 255
        },    
        "Purple": {          
            "h": "#939",
            "r": 153,
            "g": 51,
            "b": 153
        },       
        "Pink": {          
            "h": "#ff98bf",
            "r": 255,
            "g": 152,
            "b": 191
        },    
        "White": {         
            "h": "#f0f0f0",
            "r": 255,
            "g": 255,
            "b": 255
        },        
        "Grey": {          
            "h": "#999",
            "r": 153,
            "g": 153,
            "b": 153
        },    
        "Black": {
            "h": "#000",
            "r": 0,
            "g": 0,
            "b": 0
        },
        "Brown": {
            "h": "#963",
            "r": 153,
            "g": 102,
            "b": 51
        }    
    }           
}














    
    