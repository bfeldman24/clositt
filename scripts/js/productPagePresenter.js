var productPagePresenter = {

	init: function(){
        $(document).on("click",".productPage", productPagePresenter.showProductPage);
        $(document).on("click","#page-mask", productPagePresenter.hide);
        $(document).on("click",".productPageClose", productPagePresenter.hide);        
        $(document).on("click",".productPageClositt", productPagePresenter.showClosetForm); 
        $(document).on("click",".productPageTagitt", productPagePresenter.showTagForm);
        $(document).on("click",".productPageComments", productPagePresenter.showReview);   
        
        $(document).on("keydown", productPagePresenter.hideOnEsc);                     
	},
	
	showProductPage: function(el){
	   var sku = $(el.currentTarget).parents(".item").attr("pid");
	   
	   if (sku != null && sku != ""){
	          productPagePresenter.show(sku);                
	   }
	},
	
	getProductPageTemplate: function(product){	    
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
				
			 			
		var html ='<div class="productPageContainer item" pid="'+id+'" style="top:'+scrollLocation+'">';
				html +='<div class="productPageClose">x</div>';
				html +='<div class="productPageTop">';				
				    html +='<div class="productPageImage">';				
				        html +='<a class="productPagePicture" target="_blank" href="'+link+'">';
				            html += '<img src="'+image+'" onerror="return pagePresenter.handleImageNotFound(this)" />';	
				        html += '</a>';
    				html +='</div>';
    				
    				html +='<div class="productPageContent">';
        				html +='<div class="productPageDesc">';
        				    				
        				    html +='<div class="productPageName">' + name;				
            				html +='</div>';
            				
            				html +='<div class="productPagePrice">' + price;				
            				html +='</div>';
            				
            				html +='<div class="productPageStore">' + company;				
            				html +='</div>';
        				html +='</div>';
        				
        				html +='<div class="productPageActions">';
        				    				
        				    html +='<a class="productPageBuyLink" target="_blank" href="'+link+'"><div class="productPageBuy"><img src="/css/images/cart-empty.png" /><span>SHOP IT</span><br><span class="productPageBuySiteName">on '+ shortLink + '</span>';				
            				html +='</div></a>';
            				
            				html +='<div class="productPageClositt"><img class="productPageHanger" src="/css/images/hanger-icon.png" /> <span>CLOSITT</span>';
            				    html +='<div class="addToClosetForm" style="display:none;"></div>';
            				html +='</div>';
            				
            				html +='<div class="productPageTagitt"><img src="/css/images/price-tag.png" /> <span>TAGITT</span>';	   
            				    html += '<div class="addTagForm" style="display:none;"></div>';         				    
            				html +='</div>';
        				html +='</div>';
        			html +='</div>';
				html +='</div>';
				
				html +='<div class="productPageMiddle">';				
				    html +='<div class="productPageRating">';
				        html +='<span class="review-average-stars"></span>';
				        html +='<span class="review-average"></span>';
    				html +='</div>';
    				
    				html +='<div class="productPageOptions">';				
    				html +='</div>';
				html +='</div>';
				
				html +='<div class="productPageBottom">';
				    html +='<div class="productPageSwatches">';				
    				html +='</div>';				
    				
    				html +='<div class="productPageComments">Talkitt <span class="productPageCommentCount">(' + reviewCount + ")</span>";				
    				    html += '<div class="product-comments" style="display:none"></div>';			
    				html +='</div>';
    				
    				html +='<div class="productPageClosittCount"><img class="productPageHanger" src="/css/images/hanger-icon.png" /> ' + closetCount;				
    				html +='</div>';
				html +='</div>';
			html +='</div>';	
							
		return $(html);
	},
	
	
	show: function(sku){
	   $("#page-mask").show();	  
	   sku = productPresenter.formatSku(sku);
	   
	   $.post( window.HOME_ROOT + "p/lookup", {sku: sku}, function( product ) {
            var item = productPagePresenter.getProductPageTemplate(product);	   
    	    reviewsPresenter.populateProductPageReview(item, product.s);
    	    $("#product-module").html(item);	   
    	    $("#product-module").show('fade');
        }
        , "json"
        );
	   
//	   firebase.$.child("clositt").child(firebase.productsPath).child(sku).once('value', function(snapshot){
//    	   var product = snapshot.val();
//    	   
//    	   var item = productPagePresenter.getProductPageTemplate(product);	   
//    	   reviewsPresenter.populateProductPageReview(item, snapshot.name());
//    	   $("#product-module").html(item);	   
//    	   $("#product-module").show('fade');
//	   });
	   	   	   
	},
	
	hide: function(){
	   $("#page-mask").hide();
	   $("#product-module").hide('fade');
	},
	
	hideOnEsc: function(e){	   	   
	   
	   if ($("#page-mask").is(":visible") && !$(e.target).is(":input")){
	       	   
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
