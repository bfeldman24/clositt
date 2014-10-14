var pagePresenter = {
    lastExecTime: 0,    
    waitTime: 1000,
    enableLazyLoading: true,
    defaultHeaderHeight: 525,
    productLoadOffset: '150%',
    areProductsInitialized: false,
    lastScrollHeight: 0,
    viewportHeight: 0,
    productLoaderPosition: 0,
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    //$("#brand").css("position", "fixed");
        //$("#user-dropdown").css("position", "fixed");
        
        $(".back_to_top, .go_to_top").on("click", pagePresenter.scrollToTop);        
        
        $(document).ready(function(){                        
            if ($("#product-loader").length > 0){
                pagePresenter.viewportHeight = $(window).height();
                pagePresenter.productLoaderPosition = $("#product-loader").position().top;
                
                $(window).scroll(pagePresenter.handleScrollEvents);
                pagePresenter.handleScrollEvents();  
            }  
        });
    },
    
    handleScrollEvents: function(){                     

        if(pagePresenter.areProductsInitialized &&
            pagePresenter.enableLazyLoading && 
            typeof gridPresenter == 'object' &&
            pagePresenter.productLoaderPosition < ($(window).scrollTop() + pagePresenter.viewportHeight + 100) &&
            Date.now() - pagePresenter.lastExecTime > pagePresenter.waitTime){
                
            pagePresenter.lastExecTime = Date.now();
            pagePresenter.lastScrollHeight = $(window).scrollTop();
            pagePresenter.viewportHeight = $(window).height(); // reset in case user changed screen size            
            // pagePresenter.productLoaderPosition gets reset in gridPresenter.lazyLoad()
            
            gridPresenter.showContent(15);            
        }else if (!pagePresenter.areProductsInitialized){
            pagePresenter.areProductsInitialized = $(".outfit").length > 0;
        }          
                             
    },                
    
    scrollToTop: function(e){
       e.preventDefault();                
       pagePresenter.scrollTo(pagePresenter.defaultHeaderHeight);			
	   return false;
    },
    
    scrollTo: function(scrollHeight){        
        
        $('body,html').animate({
			scrollTop: scrollHeight
		}, 800);			
    }    
};
