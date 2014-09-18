$(document).ready(function () {
	
	$('.back_to_top').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
	
	function bindremove() {
	
	$('.tag span a').click(function(){
		$(this).parent().remove();
		return false;
	});
	};
	bindremove();
	
	$('.select_filter').click(function(){
	  var gettag = $(this).html();
	  
	  $(".tag").append($('<span>' + gettag +'<a href="javascript:void();" class="icon-svg4"></a></span>'));
	  bindremove();
	  
	});
	
	$('.imagewrap').click(function () {
	
		$('#myModal').modal("show");

	});
	
	
	$(".drop-search").click(function(e){
	e.preventDefault();
	return false;
				});
				
	
	
	$('.mainwrap .more-opt').hover(function (e) {
		 e.stopPropagation();
			var mainitem = $(this).parent().parent().parent();
                $(mainitem).find(".hover_more").addClass('open');
            }, function () {
				var mainitem = $(this).parent().parent().parent();
                $(mainitem).find(".hover_more").removeClass('open');
            });
			
	
	 
	 $('.hover_more').hover(function (e) {
		 e.stopPropagation();
				 $(this).parent().find(".more-opt i").addClass('hover');
                $(this).addClass('open');
            }, function () {
				 $(this).parent().find(".more-opt i").removeClass('hover');
                $(this).removeClass('open');
            });
			
		
		
	$('.product-slider').owlCarousel({
    loop:true,
    margin:16,
    responsiveClass:true,
    items:3,
    nav:true,			
	
	});
		
	
	
		
	 });
	 
	
	
	
	
	
				
	 
	$(function () {
    $('#chart-container').highcharts({
        title: {
            text: '',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },  
		credits: {
            enabled: false
        },   
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
		colors: ['#f455a6', '#67ccff'],
        tooltip: {
            valueSuffix: '',
			backgroundColor: 'rgba(0,0,0,0.75)',
			borderColor: 'rgba(0,0,0,0.75)',
			style: {
                padding: 10,
                color: '#fff'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
			enabled: false
			
        },
		exporting: {
            enabled: false
        },
        series: [{
            name: 'Lorem Ipsum',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 11.5]
        }, {
            name: 'Lorem Ipsum',
            data: [-0.2, 30.8, 25.7, 11.3, 17.0, 22.0]
        }]
    });        		
    
});	 

			
	$(".search-results").mCustomScrollbar();
	
	
	$(".scrollTo li a").click(function(e){
					e.preventDefault();
						var $this=$(this),
						rel=$this.attr("rel")
						
					$(".search-results").mCustomScrollbar("scrollTo",rel);
		
		return false;
				});
				
	
	
