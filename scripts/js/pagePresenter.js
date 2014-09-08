var pagePresenter = {
    lastExecTime: 0,    
    waitTime: 500,
    enableLazyLoading: true,
    defaultHeaderHeight: 670,
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    //$("#brand").css("position", "fixed");
        //$("#user-dropdown").css("position", "fixed");
        
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
                
	   var defaultFixedHeight = 45;
	   var scrollLocation = $(window).scrollTop();	  
	   
	   if(scrollLocation > pagePresenter.defaultHeaderHeight + 300 && !$("#scroll-to-top").is(":visible") && $("#scroll-to-top").length > 0){
            $("#scroll-to-top").show('fade');   
        }
	   
	   if (scrollLocation > (pagePresenter.defaultHeaderHeight + defaultFixedHeight) && !$("#filter-float-container").hasClass("affix")){	       	       
	       $("#filter-float-container").addClass("affix");
	       
	   } else if (scrollLocation <= pagePresenter.defaultHeaderHeight + defaultFixedHeight && $("#filter-float-container").hasClass("affix")){	       
	       $("#filter-float-container").removeClass("affix");	       
	       	       
	       if($("#scroll-to-top").length > 0){
               $("#scroll-to-top").hide('fade');   
           }
	   } 
	},
    
    handleImageNotFound:  function(e) {
        $(e).attr( "src", "css/images/missing.png" );        
        $(e).removeAttr("onerror");
        return true;
    },
    
    scrollToTop: function(e){
       e.preventDefault();                
       pagePresenter.scrollTo(pagePresenter.defaultHeaderHeight - 75);			
	   return false;
    },
    
    scrollTo: function(scrollHeight){        
        
        $('body,html').animate({
			scrollTop: scrollHeight
		}, 800);			
    }    
};
