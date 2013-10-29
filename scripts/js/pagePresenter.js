var pagePresenter = {
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    $("#brand").css("position", "fixed");
        $("#user-dropdown").css("position", "fixed");
        
        $(document).on("error","img", pagePresenter.handleImageNotFound);
        $(window).scroll(pagePresenter.handleScrollEvents);
        
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
    
    handleImageNotFound:  function() {
        $( this ).attr( "src", "../../css/images/missing.png" );
    }
};
