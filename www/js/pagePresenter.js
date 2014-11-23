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
    navScrollHeight: 600,    
    isStickyNavAlwaysShown: false,
    
    
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
            
        });
        
        $("#header").mouseenter(function() {
            if (!pagePresenter.isStickyNavAlwaysShown && $("#nav").hasClass("sticky") && !$("#nav").hasClass("show")){                                
                $("#nav").stop().addClass("show");
                
                $(".brand-box-narrow-btn").each(function(){
                    if ($(this).offset().left > 300){
                        $(this).parent().find(".brand-box-narrow").addClass("right-align");
                    }else{
                        $(this).parent().find(".brand-box-narrow").removeClass("right-align");
                    }
                });
            }
        });
                
        $("#nav").mouseleave(function() {
            if (!pagePresenter.isStickyNavAlwaysShown && $("#nav").hasClass("sticky")){
                $("#nav.sticky").css("top", (-1 * $("#filters").height()) + 25);
                                
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
        if (!pagePresenter.isStickyNavAlwaysShown){
            if ($(window).scrollTop() > pagePresenter.navScrollHeight && !$("#nav").hasClass("sticky")){
                $("#nav").stop().addClass("sticky");
                $(".filter-btn").addClass("sticky");
                $("#nav.sticky").css("top", (-1 * $("#filters").height()) + 25);
                                
            }else if ($(window).scrollTop() <= pagePresenter.navScrollHeight && $("#nav").hasClass("sticky")){
                //$("#nav").stop().removeClass("sticky").show("blind", "fast");
                $("#nav").stop().removeClass("sticky show");
                $(".filter-btn").removeClass("sticky");
            }    
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
