$(document).on("mouseenter",".mainwrap .more-opt", function(e){
   e.stopPropagation();
    var $mainitem = $(e.currentTarget).parents(".item").first();
    $mainitem.find(".hover_more").addClass('open');
});

$(document).on("mouseleave",".mainwrap .more-opt", function(e){
   var $mainitem = $(e.currentTarget).parents(".item").first();
    $mainitem.find(".hover_more").removeClass('open');
});


$(document).on("mouseenter",".hover_more", function(e){
   e.stopPropagation();
    var $mainitem = $(e.currentTarget).parents(".item").first();
    $mainitem.find(".more-opt i").addClass('hover');
    $(e.currentTarget).addClass("open");
});

$(document).on("mouseleave",".hover_more", function(e){
   var $mainitem = $(e.currentTarget).parents(".item").first();
    $mainitem.find(".more-opt i").removeClass('hover');
    $(e.currentTarget).removeClass("open");
});
		 

$(document).ready(function(){				
	
	$(".drop-search").click(function(e){
    	e.preventDefault();
    	return false;
	});						
	
	/*
	$('.more-opt').hover(function (e) {
        e.stopPropagation();
	    var mainitem = $(this).parents(".mainwrap").first();
        $(mainitem).find(".hover_more").addClass('open');
    }, function () {
		var mainitem = $(this).parents(".mainwrap").first();
        $(mainitem).find(".hover_more").removeClass('open');
    });					     
    */
							
	$('.product-slider').owlCarousel({
        loop:true,
        margin:16,
        responsiveClass:true,
        items:3,
        nav:true,				
	});			
});			
	 	
