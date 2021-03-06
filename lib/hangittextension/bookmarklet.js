if (typeof $ == "function" && typeof $.noConflict == "function" && typeof $(document).on != "function"){        
    $.noConflict();
    $("scripts").remove();
    console.log("removing scripts");
}

var hangitt = {
    ENV: "http://clositt.com/",
    user: null,
    
    init: function(){       
        hangitt.close();
                    
        $(document).off("click","img", hangitt.showDialog);        
        $(document).off("click","#hangitt-submit", hangitt.submit);        
        $(document).off("click","#hangitt-cancel", hangitt.cancel);        
        $(document).off("click","#close-itt", hangitt.close);
        
        $(document).on("click","#close-itt", hangitt.close);
                                
        hangitt.initMouseEvents();                        
        hangitt.showBanner(); 
            
        console.log(hangitt.ENV + "hangitt");                
        $.post(hangitt.ENV + "hangitt", function(data) {
            
            console.log(data);
            
            if (data != null){
                if (data.error != null){
                    $("#hangitt-msg").html('<span style="color: #008800;">Please <a href="'+hangitt.ENV+'signup" target="_blank" style="text-decoration:underline;color:#000088;">Sign in</a> to add hang items in your clositt</span>');
                     
                }else if (data.success != null){
                    hangittClosets = data.success;
                    hangitt.user = data.user;
                                        
                    $("#hangitt-msg").text("Click on an image to add it to your clositt");                                        
                    hangitt.showMask();
                    
                    $(document).on("click","img", hangitt.showDialog);
                    $(document).on("click","#hangitt-submit", hangitt.submit);
                    $(document).on("click","#hangitt-cancel", hangitt.cancel);
                    $(document).on("mouseover","img", function(e){
                           e.preventDefault();
                           return false;
                    });
            
                }else{
                    console.log("issue getting data values...");
                }
            }else{
                console.log("issue getting data...");   
            }
        },"json");
    },
    
    testJQuery: function(){         
         
         if (typeof $ != "function" || 
             typeof $(document).on != "function" || 
             typeof $(document).off != "function" || 
             typeof $('a').removeAttr != "function"){
                 
             var jq = document.createElement('script');
             
             jq.src = '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';
             document.documentElement.appendChild(jq);        

             return false;
         } 
         
         return true;
    },        
    
    showBanner: function(e){                            
        /* show top panel */                
        $("body").append(
            $("<div>").attr("id","hangitt").attr("style","position: fixed !important;z-index:9999999 !important;top:0px !important;left:0px !important;right:0px !important;width:100% !important;height:100px !important;background:#FFFFFF !important;border-bottom:5px solid #6cf !important;font-size:14px !important;color:#333 !important")
            .append(
                $("<img>").attr("id","hangitt-logo").attr("src","http://www.clositt.com/css/images/logo.png").attr("alt", "Clositt.com").attr("style", "position: absolute !important; top: 15px !important; left: 20px !important;")
            ).append(
                $("<div>").attr("id","hangitt-msg").attr("style","position: absolute; left: 35%; top: 40px; color: #CCC; font-size: 18px;font-family: Open Sans;")
            ).append(
                $("<div>").addClass("hangitt-btn").attr("id","close-itt").attr("style","position: absolute; top: 15px; right: 20px; border: 1px solid rgb(204, 204, 204); border-radius: 5px; padding: 5px 10px; color: rgb(204, 204, 204); cursor: pointer;font-family: Open Sans;line-height: 1;").text("Close")            
            )
        );                        
    },
    
    showMask: function(e){                    $("img").parents().css("z-index", "auto");
        $("body").append(
            $("<div>").attr("id","hangitt-mask").attr("style","background: none repeat scroll 0 0 rgba(240, 240, 240, 0.95);left: 0;position: absolute;top: 0;height:5000%;width: 100%;z-index: 10000;padding: 150px 10px 0;")
        );
        
        //$("img").css("z-index", "20000").css("position", "relative").css("cursor","pointer");
        var $images = $("<div>");
        $("img:not(#hangitt-logo):visible").each(function(){
            var src = $(this).attr("src");
            if($(this).width() > 50 && $(this).height() > 50 && src != null 
                && src.indexOf("clear") < 0 && src.indexOf("empty") < 0 
                && $(this).parents(".header").length <= 0 && $(this).parents(".footer").length <= 0
                && $(this).parents("#header").length <= 0 && $(this).parents("#footer").length <= 0){    
                    
                var link = $(this).parents("a").first().attr("href");            
                $images.append(
                   $("<img>").attr("src", $(this).attr("src")).attr("link",link).attr("style","max-width:20%;z-index:20000;position:relative;cursor:pointer;margin: 10px;vertical-align: top;")
                );
            }
        });
        
        $("#hangitt-mask").append($images);        
        window.scrollTo(0, 0);    },
    
    showDialog: function(e){
        e.preventDefault();   
        if ($(this).parents("#hangitt-dialog").length > 0){ return; }
                
        var src = $(this).attr("src");
        var link = $(this).attr("link");
        
        var $closets = $("<div>").attr("id","hangitt-dialog").attr("style","position: fixed; top: 20%; border: 1px solid rgb(204, 204, 204); background: none repeat scroll 0% 0% rgb(255, 255, 255); z-index: 30000; border-radius: 5px; padding: 10px; width: 450px; left: 35%;").append(
            $("<div>").attr("style","font-size:28px;color:#999;font-weight:bold;text-align:center;").text("Add to your Clositt:")
        );
        
        if (hangittClosets != null){
            var $select = $("<select>").attr("style","margin: 20px 0; width: 100%; background: none !important;outline: 0 !important;");                
                    
            for (var i=0; i < hangittClosets.length; i++){
                $select.append(            
                    $("<option>").attr("value", hangittClosets[i].title)
                                    .attr("number", hangittClosets[i].id)
                                    .attr("style","margin: 5px 0; color: #999;font-size:14px;outline: 0 !important")
                                    .text(hangittClosets[i].title)
                );
            }
        }else{
            var $select = $("<div>").text("You must create a clositt. Go to Clositt.com/myclositt");   
        }
        
        var $img = $("<img>").attr("src",src).attr("link",link).attr("style","max-height: 250px;text-align:center; margin: 20px 20%;");
        
        var $cancel = $("<div>").addClass("hangitt-btn").attr("id","hangitt-cancel").attr("style","border: 1px solid rgb(170, 170, 170); border-radius: 4px; color: rgb(170, 170, 170); display: inline; padding: 8px 30px; margin: 0px 5px;cursor: pointer;").text("Cancel");
        
        var $submit = $("<div>").attr("id","hangitt-submit").attr("style","border: 1px solid #6cf; border-radius: 4px; color: #6cf; display: inline; padding: 8px 30px; margin: 0px 5px;cursor: pointer;").text("Submit");
        
        var $buttons = $("<div>").attr("style","margin: 20px auto;text-align:center").append($cancel).append($submit);
        
        $("body").append($closets.append($select).append($img).append($buttons));
            
        //alert("src: " + src + ". link: " + link + ". current: " + location.href);
        //$("#close-itt").trigger("click");        
        return false;
    },
    
    initMouseEvents: function(){
        // grey buttons
        $(document).on("mouseenter", ".hangitt-btn", function(){
            $(this).css("border","1px solid #999").css("color","#999");
        });    
        $(document).on("mouseleave", ".hangitt-btn", function(){
            $(this).css("border","1px solid #CCC").css("color","#CCC").css("background-color","#FFF");
        });
                
        $(document).on("mousedown", ".hangitt-btn", function(){
            $(this).css("background-color","#F5F5F5");
        });  
        
        $(document).on("mouseup", ".hangitt-btn", function(){
            $(this).css("background-color","#FFF");
        });    
        
        // blue buttons
        $(document).on("mouseenter", "#hangitt-submit", function(){
            $(this).css("border","1px solid #4ad").css("color","#4ad");
        });
        
        $(document).on("mouseleave", "#hangitt-submit", function(){
            $(this).css("border","1px solid #6cf").css("color","#6cf").css("background-color","#FFF");
        });
        
        $(document).on("mousedown", "#hangitt-submit", function(){
            $(this).css("background-color","#E0FFFF");
        });  
        
        $(document).on("mouseup", "#hangitt-submit", function(){
            $(this).css("background-color","#FFF");
        });
    },
    
    submit: function(e){
        e.preventDefault();
        
        var closet = $("#hangitt-dialog > select > option:selected").first().attr("number");
        var src = $("#hangitt-dialog img").first().attr("src");
        var link = $("#hangitt-dialog img").first().attr("link");        
        
        if (closet != null && src != null){        
            var url = hangitt.ENV + "hangitt/"+hangitt.user+"/"+closet;
            url += "?src=" + src.replace(/\?/g, '~q~').replace(/&/g, '~a~').replace(/#/g, '~p~');
            
            if (link != null){
                url += "&link=" + link.replace(/\?/g, '~q~').replace(/&/g, '~a~').replace(/#/g, '~p~');
            }
            
            url += "&page=" + location.href.replace(/\?/g, '~q~').replace(/&/g, '~a~').replace(/#/g, '~p~');
            
            console.log(url);
            $("#hangitt-dialog img").first().attr("src", url);
            $("#hangitt-dialog img").on("load", function(){
                $("#hangitt-cancel").text("Ok");     
                $("#hangitt-dialog img").off("load");
            });
                        
            $("#hangitt-cancel").text("Saving...");
            $("#hangitt-dialog select").remove();
            $(this).remove(); 
        }
        
        return false;
    },
    
    cancel: function(e){
         $("#hangitt-dialog").remove();   
    },
    
    close: function(e){
        $("#hangitt").remove();
        $("#hangitt-mask").remove();
        $("#hangitt-dialog").remove();
        $(document).off("click","img");
        $("img").css("z-index", "1").css("position", "inherit").css("cursor","auto");
    }
}         

if(hangitt.testJQuery()){
    hangitt.init();    
}else{
    setTimeout(hangitt.init, 1000);
}

var hangittClosets = [];