var pagePresenter = {
    lastExecTime: 0,    
    waitTime: 500,
    enableLazyLoading: true,
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    $("#brand").css("position", "fixed");
        $("#user-dropdown").css("position", "fixed");
        
        $("#scroll-to-top").on("click", pagePresenter.scrollToTop);
                        
        $(document).ready(function(){
            $(window).scroll(pagePresenter.handleScrollEvents);
            pagePresenter.handleScrollEvents();    
        });
        
    },
    
    handleScrollEvents: function(){
        pagePresenter.toggleHeader();

        if(pagePresenter.enableLazyLoading && typeof gridPresenter == 'object' && Date.now() - pagePresenter.lastExecTime > pagePresenter.waitTime){
            pagePresenter.lastExecTime = Date.now();
            gridPresenter.showContent(15);            
        }                       
    },
    
    toggleHeader: function(){
                
	   var defaultHeaderHeight = 45;
	   var scrollLocation = $(window).scrollTop();	  
	   
	   if(scrollLocation > 300 && !$("#scroll-to-top").is(":visible") && $("#scroll-to-top").length > 0){
            $("#scroll-to-top").show('fade');   
        }
	   
	   if (scrollLocation > defaultHeaderHeight && $("#subheader-navbar").css('position') != 'fixed'){	       
	       $("#subheader-navbar").css('position', 'fixed');
	       $("#subheader-navbar").css('top', '0');	 	            	        	       
	       $("#brand-fixed-background").show("blind","fast");      
	       
	       if ($("#filter-float").length > 0){
	           $("#filter-float").css("top", defaultHeaderHeight + "px");	    
	       }
	       
	       if ($("#feedSettings-float").length > 0){
	           $("#feedSettings-float").css("top", defaultHeaderHeight + "px");	    
	       }	       	       
	   } else if (scrollLocation <= defaultHeaderHeight){
	       if ($("#filter-float").length > 0){
	           $("#filter-float").css("top", (84 - scrollLocation) + "px");
	       }
	       
	       if ($("#feedSettings-float").length > 0){
	           $("#feedSettings-float").css("top", (84 - scrollLocation) + "px"); 
	       }
	       
	       if($("#subheader-navbar").css('position') == 'fixed')
	       {
    	       $("#subheader-navbar").css('position', 'relative');
    	       $("#subheader-navbar").css('top', '30px');	       
    	       $("#brand-fixed-background").hide("blind","fast");
	       }
	       
	       if($("#scroll-to-top").length > 0){
               $("#scroll-to-top").hide('fade');   
           }
	   } 
	},
    
    handleImageNotFound:  function(e) {
        $(e).attr( "src", "css/images/missing.png" );
//        var randomSku = Object.keys(productPresenter.filterStore)[Object.keys(productPresenter.filterStore).length - 1];
//        var sku = $(e).parent().attr("pid");
//        $(e).parents(".outfit").replaceWith(productPresenter.getProductTemplate(randomSku));
        
        return true;
    },
    
    scrollToTop: function(e){
        e.preventDefault();
        
        //window.scrollTo(0, 0);
        
        $('body,html').animate({
			scrollTop: 0
		}, 800);
			
	   return false;
    }    
};
