var pagePresenter = {
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    $("#brand").css("position", "fixed");
        $("#user-dropdown").css("position", "fixed");
                        
        $(document).ready(function(){
            $(window).scroll(pagePresenter.handleScrollEvents);
            pagePresenter.handleScrollEvents();    
        });
        
    },
    
    handleScrollEvents: function(){
        pagePresenter.toggleHeader();

        if(typeof gridEvents == 'object'){
            gridEvents.continuousScroll();          
        }        
    },
    
    toggleHeader: function(){
                
	   var defaultHeaderHeight = 45;
	   var scrollLocation = $(window).scrollTop();	  
	   
	   if (scrollLocation > defaultHeaderHeight && $("#subheader-navbar").css('position') != 'fixed'){	       
	       $("#subheader-navbar").css('position', 'fixed');
	       $("#subheader-navbar").css('top', '0');	       
	       $("#filter-float").css("top", defaultHeaderHeight + "px");	
	       $("#brand-fixed-background").show("blind","fast");      
	   } else if (scrollLocation <= defaultHeaderHeight){
	       $("#filter-float").css("top", (84 - scrollLocation) + "px");
	       
	       if($("#subheader-navbar").css('position') == 'fixed')
	       {
    	       $("#subheader-navbar").css('position', 'relative');
    	       $("#subheader-navbar").css('top', '30px');	       
    	       $("#brand-fixed-background").hide("blind","fast");
	       }
	   } 
	},
    
    handleImageNotFound:  function(e) {
        $(e).attr( "src", "css/images/missing.png" );
//        var randomSku = Object.keys(productPresenter.filterStore)[Object.keys(productPresenter.filterStore).length - 1];
//        var sku = $(e).parent().attr("pid");
//        $(e).parents(".outfit").replaceWith(productPresenter.getProductTemplate(randomSku));
        
        return true;
    }
};
