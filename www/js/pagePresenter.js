var pagePresenter = {
    lastExecTime: 0,    
    waitTime: 1000,
    enableLazyLoading: true,
    defaultHeaderHeight: 525,
    productLoadOffsetPercentage: '3', // x viewport height
    productLoadOffset: 0,
    areProductsInitialized: false,
    lastScrollHeight: 0,
    viewportHeight: 0,
    productLoaderPosition: 0,
    navScrollHeight: 530,
    isNavHiding: false,
    isStickyNavEnabled: false,
    
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    //$("#brand").css("position", "fixed");
        //$("#user-dropdown").css("position", "fixed");
        
        $(".back_to_top, .go_to_top").on("click", pagePresenter.scrollToTop);        
        
        $(document).ready(function(){                        
            if ($("#product-loader").length > 0 && typeof gridPresenter == 'object'){
                pagePresenter.viewportHeight = $(window).height();
                pagePresenter.productLoadOffset = pagePresenter.productLoadOffsetPercentage * pagePresenter.viewportHeight;                
                pagePresenter.productLoaderPosition = $("#product-loader").position().top;
                
                $(window).scroll(pagePresenter.handleScrollEvents);
                pagePresenter.handleScrollEvents();  
            }  
            
            // pagePresenter.navScrollHeight = Math.max($("#nav").position().top, pagePresenter.navScrollHeight);
        });
        
        $("#header").mouseenter(function() {
            if (!pagePresenter.isStickyNavEnabled && $("#nav").hasClass("sticky")){
                //$("#nav").stop().show("blind", "fast");
                $("#nav").stop().addClass("show");
            }
        });
        
        $("#nav").mouseleave(function() {
            if (!pagePresenter.isStickyNavEnabled && $("#nav").hasClass("sticky") && !pagePresenter.isNavHiding){
                //$("#nav").stop().hide("blind","slow");
                $("#nav").stop().removeClass("show");
                $("#nav .btn-group.open").removeClass("open");
            }
        });
    },
    
    handleScrollEvents: function(){                     

        // Lazy Load Products
        if(pagePresenter.areProductsInitialized &&
            pagePresenter.enableLazyLoading &&             
            pagePresenter.productLoaderPosition - pagePresenter.productLoadOffset < ($(window).scrollTop() + pagePresenter.viewportHeight + 100) &&
            Date.now() - pagePresenter.lastExecTime > pagePresenter.waitTime){            
              
                pagePresenter.lastExecTime = Date.now();
                pagePresenter.lastScrollHeight = $(window).scrollTop();
                pagePresenter.viewportHeight = $(window).height(); // reset in case user changed screen size            
                pagePresenter.productLoadOffset = pagePresenter.productLoadOffsetPercentage * pagePresenter.viewportHeight;
                // pagePresenter.productLoaderPosition gets reset in gridPresenter.lazyLoad()
                
                gridPresenter.showContent(15);            
        }else if (!pagePresenter.areProductsInitialized){
            pagePresenter.areProductsInitialized = $(".outfit").length > 0;
        }          
         
        // Sticky Navigation Header  
        if ($(window).scrollTop() > pagePresenter.navScrollHeight && !$("#nav").hasClass("sticky")){
            $("#nav").stop().addClass("sticky show");
            
            pagePresenter.isNavHiding = true;
            setTimeout(function(){
                if (!pagePresenter.isStickyNavEnabled && $("#nav").hasClass("sticky")){
                    //$("#nav").stop().hide("blind", "slow");       
                    $("#nav").stop().removeClass("show");       
                }                         
                
                pagePresenter.isNavHiding = false;
            }, 5000);            
            
        }else if ($(window).scrollTop() <= pagePresenter.navScrollHeight && $("#nav").hasClass("sticky")){
            //$("#nav").stop().removeClass("sticky").show("blind", "fast");
            $("#nav").stop().removeClass("sticky show");
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
