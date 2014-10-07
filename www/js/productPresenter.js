var productPresenter = {	
    isLoaded: false,    
	splitValue: 30, 
	productIndex: 0,
	filterStore: null, 
	populateStoreCallback: null,		
	
	init: function(){	
	    $(document).on('click','.imagewrap', productPresenter.showProductModal);
	},		 			
	
	refreshImages: function(){	   
	     var date = new Date();
	     
         $(".picture > a > img").each(function(){
             var src = $(this).attr("src");
             var sign = '?';
             var pos = src.indexOf(sign);
             if (pos >= 0) {
                sign = '&';
             }
             
             $(this).attr("src", src + sign + 'rldimg=' + date.getTime());
         });
         
         return true;
	},
	
	refreshFilteredProducts: function(){
	    gridPresenter.endTask();
	    productPresenter.productIndex = 0;
	    searchController.pageIndex = 0;
	    gridPresenter.showContent(15);
	},
	
	refreshProducts: function(){
	    gridPresenter.endTask();     	      	
	 	productPresenter.filterStore = null;	
	 	searchController.criteria = null;
	 	productPresenter.productIndex = 0;
        searchController.pageIndex = 0;
        gridPresenter.productIndex = 0; 	 		 	
	 	gridPresenter.showContent(15);
	},		
	
	formatSku: function(sku){
	   return sku.substring(sku.indexOf("_") + 1);  
	},
	
	showProductModal: function (e) {		   
	    if ($(e.currentTarget).parents("#product").length > 0){
	         // Do not open the modal if you are clicking from within the modal already
	         return;
	    }
	   
	    var sku = $(e.currentTarget).parents(".outfit").attr("pid");
	    
	    if ( $("#productModal #product").length <= 0){
	       $('#productModal').modal("show");
	    }
	    
	    $("#productModal .modal-content").load( window.HOME_ROOT + "d/" + sku, function(response, status, xhr) {
	        if (status == "success"){
                $('#productModal').modal("show");
	        }else{
	           $('#productModal').modal("hide");
	        }
        });	   		    
    },
    
    showImageCallback: function(){
        
        $(this).on("load", function(){
            $(this).prev().remove();
            $(this).show(); 
            $(this).parents(".mainwrap").first().find(".detail h4").tooltip({delay: { "show": 1500, "hide": 0 }});
        });
        
        return true;
    },
    
    handleImageNotFound:  function(img) {
        var sku = $(img).parents(".outfit").attr("pid");
        $(img).removeAttr("data-src");
        $(img).removeAttr("onerror");
        $(img).attr( "src", window.HOME_ROOT + "i/" + sku);  
        $(img).parents(".mainwrap").first().find(".detail h4").tooltip({delay: { "show": 1500, "hide": 0 }});                     
        return true;
    }	   			
};
