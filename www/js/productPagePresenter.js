var productPagePresenter = {

	init: function(){
        $(document).on("click",".productPage", productPagePresenter.showProductPage);
        $(document).on("click","#page-mask", productPagePresenter.hide);
        $(document).on("click",".productPageClose", productPagePresenter.hide);        
        $(document).on("click",".productPageClositt", productPagePresenter.showClosetForm); 
        $(document).on("click",".productPageTagitt", productPagePresenter.showTagForm);
        $(document).on("click",".productPageComments", productPagePresenter.showReview);   
        
        $(document).on("keydown", productPagePresenter.hideOnEsc);  
        
        $('#productModal').on('shown.bs.modal', function (e) {
            if ($("#productModal .historicalPrices .sparkChart").attr("values") != null &&
                $("#productModal .historicalPrices .sparkChart").attr("values") != ""){
                    
                    $("#productModal .historicalPrices .sparkChart").sparkline('html', { 
                            enableTagOptions: true, 
                            disableHiddenCheck: true,
                            tooltipFormatter: function(sparkline, options, fields){                        
                                var dates = $("#productModal .historicalPrices .sparkChart").attr("dates").split(",");
                                return dates[fields.x] + ": <strong>$" + fields.y + "</strong>";
                            } 
                    });
            }
            
        });
                                   
	},
	
	showProductPage: function(el){
	   var sku = $(el.currentTarget).parents(".item").attr("pid");
	   
	   if (sku != null && sku != ""){
	          productPagePresenter.show(sku);                
	   }
	},			
	
	getProductPageTemplate: function(data){	
	    var product = data.product;
	       
        if (product == null){
            return $("");    
        }
        
		var company = product.o;
		var audience = product.u;
		var category = product.a;
		var link = product.l;
		var image = product.i;
		var name = product.n;		
		var reviewCount = product.rc == null ? 0 : product.rc;
		var closetCount = product.cc == null ? 0 : product.cc;
		var closetCountPlural = closetCount == 1 ? "" : "s"; 
		var id = product.s;
		var price = product.p == null || isNaN(product.p) ? "" : "$" + Math.round(product.p);		 	
 		var filterPrice = product.fp; 		 		
 		var feedOwner = product.owner;
		var feedCloset = product.closet;
		var scrollLocation = $(window).scrollTop() + 100;
		
		var shortLink = link.substring(link.indexOf(".")+1, link.indexOf("/", link.indexOf(".") ));								  
		
		$("#productModal").attr("pid", id);  		
		$("#productModal .modal-title").text(name);
		$("#productModal .productPagePicture").attr("href",link);
		$("#productModal .productPagePicture img").attr("src",image);
		$("#productModal .productPageName").text(name);
		$("#productModal .productPagePrice").text(price);
		$("#productModal .productPageStore").text(company);
		$("#productModal .productPageBuyLink").attr("href",link);		
		$("#productModal .productPageBuySiteName").text("on " + shortLink);
		$("#productModal .productPageCommentCount").text("(" + reviewCount + ")");
		$("#productModal .productPageClosittCount .counter").text(closetCount);
		
		// Historical Prices
		var priceHistory = data.historicalPrices;
		if (priceHistory != null && priceHistory.prices.length > 0 && priceHistory.dates.length > 0){
		      var yValues = priceHistory.prices;
		      var xValues = priceHistory.dates;
		      
		      for (var i=0; i < yValues.length; i++){
		          yValues[i] = parseFloat(yValues[i]);   		             
		      }		      
		      
		      $("#productModal .historicalPrices .sparkChart").attr("values",yValues.toString()).attr("dates", xValues.toString());
		      $("#productModal .historicalPrices .sparkChartTitle").html("Price Trends: ");
		}else{
		      $("#productModal .historicalPrices .sparkChart").attr("values","");
		      $("#productModal .historicalPrices .sparkChart").html("");
		      $("#productModal .historicalPrices .sparkChartTitle").html("");
		}
							
		return $("#productModal");
	},
	
	
	show: function(sku){
	   sku = productPresenter.formatSku(sku);
	   
	   $.post( window.HOME_ROOT + "p/lookup", {sku: sku}, function( data ) {	                    	   
            
            if (data != null && data.product != null){     
                var productModal = productPagePresenter.getProductPageTemplate(data);
        	    reviewsPresenter.populateProductPageReview(productModal, data.product.s);    	    
        	    productModal.modal('show');
	        }else{
	           Messenger.error("Sorry. That product no longer exists!");  
	        }	            	    
        }
        , "json"
        );	   	   	   	   
	},
	
	hide: function(){
	   $("#productModal").modal('hide');
	},
	
	hideOnEsc: function(e){	   	   
	   
	   if ($("#productModal").is(":visible") && !$(e.target).is(":input")){
	       	   
    	   // Esc, Enter, or Spacebar respectively
    	   if (e.keyCode == 27 || e.keyCode == 13 || e.keyCode === 32){
    	       productPagePresenter.hide();
    	       e.preventDefault();
    	   }  
	   }
	},
	
	showClosetForm: function(e){
	   if($(e.target).parents(".addToClosetForm").length <= 0){
	       closetFormPresenter.showClosetForm(e); 
	   }  
	},
	
    showTagForm: function(e){
       if($(e.target).parents(".addTagForm").length <= 0){
           tagPresenter.showTagForm(e); 
       }
    },
    
    showReview: function(e){
       if($(e.target).parents(".review-float").length <= 0){             
           
           if($(e.currentTarget).parents(".item").find(".product-comments").is(":visible")){
               $(e.currentTarget).parents(".item").find(".product-comments").hide();            
           }else{
               $(e.currentTarget).parents(".item").find(".product-comments").show();
               $(e.currentTarget).parents(".item").find(".review-add-comment").attr("rows","1");
           }
       }               
    }
};
