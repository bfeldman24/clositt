var firebase = {

	$: null,
	authClient: null,
	userid: null,
	username: null,
	email: null,
	isLoggedIn: false,
	url: 'https://clothies.firebaseio.com/',
	userPath: 'userdata',
		
	init: function(){
		firebase.$ = new Firebase(firebase.url);	
		firebase.authClient = new FirebaseSimpleLogin(firebase.$, firebase.checkActiveUser);
	},
		
	checkActiveUser: function(error, user){
	  	if (error) {
		    // an error occurred while attempting login
		    console.log(error);
		    Messenger.error("Incorrect login information");
		    firebase.loggedOutErrorCallback();
		} else if (user) {
		    // user authenticated with Firebase		    
		    firebase.handleUserData(user);		    				    			  			    
	        firebase.updateLoggedInDropdownMenu();
	        firebase.isLoggedIn = true;
		       	       				
	  	} else {
		    // user is logged out		    
		    console.log("logged out");
		    firebase.loggedOutCallback();
		}
	 
		if(error || !user){
			firebase.updateLoggedOutDropdownMenu();
			firebase.isLoggedIn = false;
		}
	},
	
	handleUserData: function(user){
		firebase.$.child(firebase.userPath).child(user.id).child('name').on('value',function(snapshot){	
			firebase.username = snapshot.val();
			firebase.userid = user.id;
			firebase.email = user.email;
			
			if( firebase.username === null) {
			    console.log("No User Found")
			} else {
			  	$("#user-name").html(firebase.username.split(" ")[0]);	    			  	
			  	firebase.userDataAvailableCallback(firebase.username);
			}
			
			firebase.logginCallback();
		});
	},
	
	login: function(email, password, remember){
		
		firebase.authClient.login('password', {
          email: email,
          password: password,
          rememberMe: remember
        });     	
	},
	
	signup: function(email, password, remember, name, username){
		firebase.authClient.createUser(email, password, function(error,user){
			firebase.register(error, user, password, remember, name, username);
		});
	},
	
	register: function(error, user, password, remember, name, username){
		 if (!error) {		  			  			  
		 	var firstname = stringFunctions.toTitleCase(name);
		 	
		 	var userData = {"email":user.email,"name":firstname};
		 	
		 	if (username != null){
    		 	username = username.toLowerCase();
    		 	userData['username'] = username;
		 	}
		 	
		 	firebase.$.child(firebase.userPath).child(user.id).set(userData);
		 	
		  	firebase.login(user.email, password, remember);		  			  	

		  }else{		  	
		  		Messenger.error(error);	
		  }
	},
	
	addToWaitingList: function(email, callback){
	   var success = false;
	   
	   if (email.length > 3 && email.indexOf("@") > 0 && email.indexOf(".") > 0){
	       firebase.$.child("waitinglist").push(email);
	       Messenger.success("Thanks for joining Clositt! You have been placed on our waiting list!");		       	        
	       success = true;
	   }else{
	       Messenger.error("Your email address is not valid! Please try again.");		       	           
	   }
	   
	   if(typeof callback == 'function')
	   {
		 callback(success);
	   }
	},
	
	logginCallback: function(){	    	   
		if(typeof loggedIn == 'function')
		{
			loggedIn();
		}  
	},
	
	loggedOutCallback: function(){	    	   
		if(typeof loggedOut == 'function')
		{
			loggedOut();
		}  
		
		firebase.sendToWelcomePage();
	},
	
	loggedOutErrorCallback: function(){	   
		if(typeof loggedOutError == 'function')
		{
			loggedOutError();
		}  
		
		firebase.sendToWelcomePage();
	},
	
	userDataAvailableCallback: function(username){
		if(typeof userDataReady == 'function')
		{
			userDataReady(username);
		}   
	},
	
	updateLoggedInDropdownMenu: function(){
		$("#account-dropdown").html("")
	    	//.append($('<li><a href="closet.php">My Closet</a></li>'))    	
	    	.append($('<li><a href="settings.php">Account Settings</a></li>'))
	    	.append($('<li class="divider"></li>'))
	    	.append($('<li><a href="javascript:firebase.logout();">Logout</a></li>')); 
	},
	
	updateLoggedOutDropdownMenu: function(){
		$("#account-dropdown").html("")
	  		.append($('<li><a href="login.php">Login</a></li>'))
	    	.append($('<li class="divider"></li>'))
	    	.append($('<li><a href="signup.php">Sign Up</a></li>'));
	},	

 	logout: function(){
		firebase.authClient.logout();	

		$.post("../../auth.php", function(){
			location.href= "../../";
		}).fail(function() {
			 $.post("auth.php", function(){
                        	location.href= "./";
                	}) 
		});
	},
	
	sendToWelcomePage: function(){
	   if (location.href.indexOf("signup") < 0 &&
	       location.href.indexOf("welcome") < 0 &&
	       location.href.indexOf("login") < 0 && 
	       location.href.indexOf("contact") < 0){
	       
          	   if (location.href.indexOf("welcome.php") < 0){
          	       location.href = "/welcome.php";
          	   }
      	}
	}
};


var stringFunctions = {	
	 toTitleCase: function(str){
		return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
	 }
};
var Messenger = {
	
	id: 'messenger',
	position: 'top',
	align: 'center',	
	timeout: 4000,
	defaultTimeout: 4000,
	width: 300, 
	height: 75,
	
	messageBoxTemplate: $('<ul class="messenger messenger-fixed messenger-theme-future"></ul>'),
				
	alertTemplate: $('<li class="messenger-message-slot  ">' +
						'<div class="messenger-message">' +
							'<div class="messenger-message-inner"></div>' +
							'<div class="messenger-spinner">' +
								'<span class="messenger-spinner-side messenger-spinner-side-left">' +
						        	'<span class="messenger-spinner-fill"></span>' +
    							'</span>' +
							    '<span class="messenger-spinner-side messenger-spinner-side-right">' +
							        '<span class="messenger-spinner-fill"></span>' +
							    '</span>' +
							'</div>' +
						'</div>' +
					'</li>'),
				
	
	init: function(){
		if(Messenger.align == 'center'){
			var left = ($(document).width() / 2) - (Messenger.width / 2);
		}else{
			var left = 100;
		}
		
		if(Messenger.position == 'top'){
			var top = 50;
		}else{
			var top = $(document).height() - Messenger.height;
		}
		
		$('body').append(Messenger.messageBoxTemplate
			.attr("id",Messenger.id)
			.css("display","none")
			.css("top",top + "px")
			.css("left",left + "px")
			.css("min-width",Messenger.width + "px")
		);
	},
	
	alert: function(msg, statusCode){
		var status = "alert-success";
		
		if(statusCode == "error"){
			status = "alert-error";
		}else if(statusCode == "info"){
			status = "alert-info";
		}
		
		var $alertMessage = Messenger.alertTemplate.clone();
		
		$alertMessage.children("div").first().addClass(status);
		$alertMessage.find(".messenger-message-inner").first().text(msg);		
		
		$("#" + Messenger.id).append($alertMessage);
		$("#" + Messenger.id).css("display","block");
		
		setTimeout(function(){
			$alertMessage.remove();
			
			if($(".messenger-message-slot").size() <= 0){
				$("#" + Messenger.id).css("display","none");			
			}
			
		}, Messenger.timeout );
		
		return true;
	},
	
	success: function(msg){
		Messenger.alert(msg, "success");	
	},
	
	error: function(msg){
		Messenger.alert(msg, "error");	
	},
	
	info: function(msg){
		Messenger.alert(msg, "info");	
	}
}
var pagePresenter = {
    
    init: function(){
        $("#subheader-navbar").show('fast');
   	    $("#brand").css("position", "fixed");
        $("#user-dropdown").css("position", "fixed");
                        
        $(document).ready(function(){
            $(window).scroll(pagePresenter.handleScrollEvents);
            pagePresenter.handleScrollEvents();    
        });
        
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
	       $("#brand-fixed-background").show("blind","fast");      
	       
	       if ($("#filter-float").length > 0){
	           $("#filter-float").css("top", defaultHeaderHeight + "px");	    
	       }
	       
	       if ($("#feedSettings-float").length > 0){
	           $("#feedSettings-float").css("top", defaultHeaderHeight + "px");	    
	       }
	   } else if (scrollLocation <= defaultHeaderHeight){
	       if ($("#filter-float").length > 0){
	           $("#filter-float").css("top", (84 - scrollLocation) + "px");
	       }
	       
	       if ($("#feedSettings-float").length > 0){
	           $("#feedSettings-float").css("top", (84 - scrollLocation) + "px"); 
	       }
	       
	       if($("#subheader-navbar").css('position') == 'fixed')
	       {
    	       $("#subheader-navbar").css('position', 'relative');
    	       $("#subheader-navbar").css('top', '30px');	       
    	       $("#brand-fixed-background").hide("blind","fast");
	       }
	   } 
	},
    
    handleImageNotFound:  function(e) {
        $(e).attr( "src", "css/images/missing.png" );
//        var randomSku = Object.keys(productPresenter.filterStore)[Object.keys(productPresenter.filterStore).length - 1];
//        var sku = $(e).parent().attr("pid");
//        $(e).parents(".outfit").replaceWith(productPresenter.getProductTemplate(randomSku));
        
        return true;
    }
};
var gridPresenter = {	
	
	init: function(){				
		gridEvents.init();
	},			

	alignDefaultGrid: function(gridName){
	    if (gridName == null){
	       gridName = "product-grid";  
	    }
	   
		var columns = gridPresenter.getDefaultColumns();
		$(".addToClosetBtn").tooltip();
		$(".tagOutfitBtn").tooltip();
		$(".showComments").tooltip();
					
		gridPresenter.alignGrid(gridName, columns, 200, 270, 25);						
		closetFormPresenter.markUsersClositItems();
	}, 
	
	getDefaultColumns: function(){
		var columns = 1;
		var screenWidth = $(document).width();
		
		if(screenWidth > 975){
			columns = 4;	
		}else if(screenWidth > 750){
			columns = 3;	
		}else if(screenWidth > 525){
			columns = 2;	
		}
		
		/*
		2) 200 + 25 + 200 = 425 + 400 = 825
		3) 200 + 25 + 200 + 25 + 200 = 650 + 400 = 1050
		4) 200 + 25 + 200 + 25 + 200 + 25 + 200 = 875 + 400 = 1275
		5) 200 + 25 + 200 + 25 + 200 + 25 + 200 + 25 + 200 = 1100 + 400 = 1500
		*/
		
		return columns;	
	},

	alignGrid: function(/*string*/ id, /*int*/ cols, /*int*/ cellWidth, /*int*/ cellHeight, /*int*/ padding, /*int*/ verticalMargin) {
   
		var x = 0;
		var y = 0;		
		var count = $("#" + id).children("div[aligned=true]").size();
		var unit = "px";	
		verticalMargin = typeof verticalMargin !== 'undefined' ? verticalMargin : 0;					
		
		var n=count;
		$("#" + id).children("div[aligned=true]").slice(-1 * cols).each(function() {
			var colNum = n++ % cols;
			if (colNum >= cols - 1) {
				x = 0;
				y = parseFloat($(this).css("top"),10) + cellHeight + padding + verticalMargin;
			}else{
				x = parseInt($(this).css("left"),10) + cellWidth + padding;	
				y = parseFloat($(this).css("top"),10);			
			}
		});
				
		$("#" + id).css("position", "relative").css("margin","0 auto").css("width", (cols * (cellWidth + padding)) + "px");
		
		$(".pageEndSpacer").remove();
		    
		$("#" + id).children("div[aligned!=true][ignore!=true]").each(function() {
		        var colNum = count % cols;		   
		        $(this).find(".picture").css("width", cellWidth + unit);
		        $(this).find(".picture").css("height", cellHeight + unit); 			    			    
		    	
		        $(this).css("position", "absolute");		        
		        
		        $(this).css("left", x + unit);
		        $(this).css("top", y + unit);	        
		        $(this).attr("aligned",true);
		        		        		        
		        if (colNum >= cols - 1) {
		            x = 0;	           
		            y += cellHeight + padding + verticalMargin;
		        } else {
		            x += cellWidth + padding;
		        }
		        		        		        
		        count++;
	    });
	    
	    $("#" + id).append(
	    	$("<div>").addClass("pageEndSpacer")	    		
	    		.css("top", y + "px")
	    );
	},
	
	// This is currently not called anywhere, but may be needed in the future
	resizeImages: function(el){
	    var image = $(el.currentTarget);
	    var imgHeight = image.css("height");
    	var imgWidth = image.css("width");
    	
    	if(imgHeight == undefined || imgHeight == null || imgHeight.trim() == ""){
			imgHeight = cellHeight;	    	
	    	imgWidth = cellWidth;  	
    	}else{		    	
	    	imgHeight = parseFloat(imgHeight,10);	    	
	    	imgWidth = parseFloat(imgWidth,10);		    				    				    	
    	}		    
    	
    	var newHeight = cellWidth * (imgHeight / imgWidth);
    	
    	if (newHeight <= cellHeight){		              
              image.css("width", cellWidth + unit);
    	}else{
    	     var newWidth = cellHeight / (imgHeight / imgWidth); 		    	     
             image.css("height", cellHeight + unit);  		    	     
    	}
	},					
	
	showContent: function(numElements){
		var lastHeight = $("#product-grid").children("div[aligned=true]").last().css("top");
		
		if(lastHeight == undefined || lastHeight == null || lastHeight.trim() == ""){
			lastHeight = 0;
		}else{
			lastHeight = parseFloat(lastHeight,10);	
		}
		
		if(lastHeight <= ($(window).height() + $(window).scrollTop() + 125)){			
			
			if(productPresenter.filterStore != null){							
				var $items = $();
				var el=productPresenter.filterStore;
				var index = productPresenter.productIndex;
				
				for(var i = index; i < index + numElements;i++){
					
					if(el[Object.keys(el)[i]] != null){
						var html = productPresenter.getProductTemplate(Object.keys(el)[i]).css("position","absolute").css("left","-9999px");
						$items = $items.add(html);
					}
				}
				
				productPresenter.productIndex += numElements;				
				$("#product-grid").append($items);								
				gridPresenter.alignDefaultGrid();
				$("#loadingMainContent").hide();	
			}		
		}
	},
	
	beginTask: function(){
	   $("#product-grid").children().remove();	 		 	
       $("#product-grid").append($("<br><br><br><br>"));
       $("#loadingMainContent").show();	
	},
	
	endTask: function(){
	   $("#loadingMainContent").hide();	
	}
};var gridEvents = {	
	
	init: function(){
		gridEvents.overlayEvent();				
		$(document).on("click",".addToClosetBtn",closetFormPresenter.showClosetForm);		
		$(document).on("submit",".addToClosetForm > form",closetFormPresenter.addToCloset);
		$(document).on("click",'.addToClosetForm > form input[type="radio"]',function(el){
			$(el.currentTarget).closest("form").submit();
		});		
		
		$(document).on("click",".tagOutfitBtn",tagPresenter.showTagForm);		
		$(document).on("submit",".addTagForm > form",tagPresenter.addTag);				
	},
	
	overlayEvent: function(){
		$(document).on("mouseenter",".outfit", gridEvents.showOverlay).on("mouseleave",".outfit", gridEvents.hideOverlay);	
	},
	
	showOverlay: function() {			
			$(this).children(".overlay").not(".alwaysVisible").first().fadeIn('slow');
	},
	
	hideOverlay: function() {			
			$(this).children(".overlay").not(".alwaysVisible").first().fadeOut('slow');
			
			if (reviewsPresenter != null){
			     var sku = $(this).find('a[pid]').first().attr("pid");			     			     
			     reviewsPresenter.hideReview(reviewsPresenter.getReviewBlock(sku));
			}
	}, 
	
	continuousScroll: function(){		 
		gridPresenter.showContent(15);
	}		
};var productPresenter = {	
	splitValue: 30, 
	productIndex: 0,
	clothingStore: [], 
	filterStore: [], 
	populateStoreCallback: null,	
	
	init: function(){		
		firebase.$.child('clositt').once('value', productPresenter.setup);	 	 
	},
	
	setup: function(snapshot){		
		productPresenter.showCompanyProducts(snapshot);
	 	gridPresenter.alignDefaultGrid();
		$('body').css("min-height",$(window).height());	
		productPresenter.productIndex += productPresenter.splitValue;	
	},
	
	populateStore: function(callback){
	    productPresenter.populateStoreCallback = callback;
	    firebase.$.child('clositt').once('value', productPresenter.closetSetup);			 	 
	},
	
	closetSetup: function(store){
	   productPresenter.clothingStore = store.child("products").val();
	   
	   if (productPresenter.populateStoreCallback != null && typeof productPresenter.populateStoreCallback == 'function'){
	       productPresenter.populateStoreCallback();
	   }	   	   
	},	
 
 	showCompanyProducts: function(store){	 		 	
	 	productPresenter.clothingStore = store.child("products").val();	
	 	productPresenter.filterStore = store.child("products").val();	
	 	var companies = store.child("companies").val();
	 	var customers = store.child("customers").val();
	 	var categories = store.child("categories").val();
	 	var prices = store.child("prices").val();									
	 		 	
        productPresenter.refreshProducts();	 	
	 	filterPresenter.createFilters(companies, customers, categories, prices);
	 },
 
	getProductTemplate: function(sku){
	    sku = productPresenter.formatSku(sku);
	    var product = productPresenter.clothingStore[sku];
		var company = product.o;
		var audience = product.u;
		var category = product.a;
		var link = product.l;
		var image = product.i;
		var name = product.n;		
		var reviewCount = product.rc == null ? '' : product.rc;
		var id = product.s;
		var price = product.p == null || isNaN(product.p) ? "" : "$" + Math.round(product.p);		 	
 		var filterPrice = product.fp; 		 		
 		var feedOwner = product.owner;
		var feedCloset = product.closet;

		var rand = Math.floor(Math.random() * 3) + 1;
		var shadow = "";
		if(rand == 1){
			shadow = 'shadow';	
		}		
			 			
 		//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
 		var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
		var html ='<div class="outfit" '+attr+'>';
				html +='<div class="picture"><a href="'+link+'" pid="'+id+'" target="_blank"><img src="' + image + '" class="'+shadow+'" onerror="return pagePresenter.handleImageNotFound(this)"/></a></div>';			
				html +='<div class="overlay">';
					html +='<div class="topleft">';										
						html +='<div class="tagOutfitBtn" data-toggle="tooltip" data-placement="left" title="Tagitt"><i class="icon-tags icon-white"></i></div>';
					html += '</div>';
					html +='<div class="topright">';										
						html +='<div class="addToClosetBtn" data-toggle="tooltip" data-placement="right" title="Add to Closet"><img id="hanger-'+id+'" class="hanger-icon" src="css/images/hanger-icon-white.png" /><i class="icon-plus-sign icon-white hanger-plus"></i></div>';
					html += '</div>';
					html +='<div class="bottom">';						    					    
					    html += '<div class="productActions" >';
					       html += '<div data-toggle="tooltip" data-placement="top" title="Show Comments" class="showComments"><span class="numReviews">'+reviewCount+'</span><i class="icon-comment icon-white"></i></div>';
					    html += '</div>';									
					    
					    if(feedOwner != null && feedCloset != null){
					       html += '<div class="productSubHeader" >';
	   				            html += '<div class="outfitFeedOwner"><span class="outfitOwner">'+feedOwner+'\'s</span><span>&nbsp;\"'+feedCloset+'\" clositt</span></div>';
    					    html += '</div>';  
					    }
					    					
						html +='<div class="companyName">' + company + '</div>';
						html +='<div class="price">' +  price + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
					html += '<div class="product-comments"></div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
		return $(html);
	},
	
	getClosetItemTemplate: function(sku){
	    var product = productPresenter.clothingStore[sku];	
		var company = product.o;
		var link = product.l;
		var image = product.i;
		var name = product.n;
			 			
		var html ='<div class="outfit">';
				html +='<div class="picture"><a href="'+link+'" target="_blank" pid="'+sku+'"><img src="' + image + '" /></a></div>';							
				html +='<div class="overlay">';
					html +='<div class="bottom">';										
						html +='<div class="companyName">' + company + '</div>';
						html +='<div class="name">' + name + '</div>';
					html += '</div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
		return $(html);
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
	    gridPresenter.showContent(15);	    
	},
	
	refreshProducts: function(){
	    gridPresenter.beginTask();
	    var grid = $("#product-grid");

		for(var i=0; i<productPresenter.splitValue;i++){
			var rand = Math.floor(Math.random() * Object.keys(productPresenter.clothingStore).length);
			var outfit = productPresenter.getProductTemplate(Object.keys(productPresenter.clothingStore)[rand]);								
			grid.append(outfit);		 								
		}
	 	 		 			 		 	
	 	gridPresenter.endTask();
	 	gridPresenter.alignDefaultGrid();	
     	productPresenter.productIndex = 0;      	
	 	productPresenter.filterStore = productPresenter.clothingStore;		 		 	
	},
	
	getProductsFromSkuList: function(skus){
	     var products = new Object;
	   
         for(var i=0; i < skus.length; i++){
             var sku = productPresenter.formatSku(skus[i]);
	         products[skus[i]] = productPresenter.clothingStore[sku];
         }
         
         return products;
	},
	
	formatSku: function(sku){
	   return sku.substring(sku.indexOf("_") + 1);  
	}
};
var filterPresenter = {
    
    allFilters: null,
	
	init: function(){		
	    filterPresenter.allFilters = [];
	   
		$(document).on("click","#filter-toggle", filterPresenter.filterPanelToggle);
		$("#filter-float").on("click","input", function(){
			setTimeout(filterPresenter.onFilterSelect, 50);			
		});				
	},
 
	createFilters:  function(companies, customers, categories, prices){
 		prices = prices.sort(function(a,b){return parseInt(a)-parseInt(b)});
 		companies = companies.sort();
 		customers = customers.sort();
 		categories = categories.sort();
 		
 		var priceBuckets = new Array();
 		
 		var priceCount = prices.length;

 		priceBuckets[0] = 0;
 		var i=0;
 		while(priceBuckets[i] < prices[priceCount - 1] && i < 5){
 			priceBuckets[i+1] = priceBuckets[i] + 50;
 			i++;
 		}
 		
 		if(priceBuckets[i] < prices[priceCount - 1]){
 			priceBuckets[i]	= (Math.round(prices[priceCount - 1] / 50) * 50) + 50;
 		}
 		
 		
 		$("#filter-float").append($("<h4>").html("Shop For:"));
 		
 		$.each(customers, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		    
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","customer").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		});
 		
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Category:"));
 		$.each(categories, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		     
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","category").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		});  		 		
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Brands:"));
 		$.each(companies, function(index, value) {
 		    filterPresenter.allFilters.push(value);
 		    
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","company").attr("value",value)
 					).append($("<span>").html(value))
 				)
 			)
 		}); 
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Price:"));		 		 		
 		for(var i=0;i<priceBuckets.length-1;i++){
 			$("#filter-float").append(
 				$("<div>").addClass("controls").append(
 					$("<label>").addClass("checkbox").append(
 						$("<input>").attr("type","checkbox").attr("name","filterprice").attr("value",priceBuckets[i]).attr("max",priceBuckets[i+1])
 					).append($("<span>").html("$"+priceBuckets[i]+" - $"+priceBuckets[i+1]))
 				)
 			)
 		}
 		
 		$("#filter-float").append($("<br>")).append($("<h4>").html("Colors:"));		 		 		 		
		$("#filter-float").append(colorPresenter.getColorFilters());
 		 		
 		$("#filter-float").append($("<br><br><br><br><br><br><br>"));
 		filterPresenter.showFilter();
 	},
 
 	
 	onFilterSelect: function(){
 	    productPresenter.filterStore = [];
 	    window.scrollTo(0, 0);
 	    gridPresenter.beginTask(); 	       	    
 	    
	 	var criteria = new Object();
	 	var isSearch = $( "#search-bar" ).val().trim().length > 0;
	 	var areAnyFiltersChecked = false;
	 	var filters = new Array("customer","filterprice","category","company");
	 	
	 	$.each(filters, function(index, filterName) {
	 		criteria[filterName] = new Array();
	 		
		 	$("#filter-float").find('input[name="'+filterName+'"]:checked').each(function(){
		 	    areAnyFiltersChecked = true;
		 		var name = $(this).attr("name");
		 		var value = $(this).val().toLowerCase();
		 		var value = value.replace(/'/g, "\\'");
		 		
		 		if(name == "filterprice"){
		 			var abovePrice = parseInt(value);
		 			var belowPrice = parseInt($(this).attr("max"));
		 					 			   
	 			   if(criteria['belowPrice'] == null || belowPrice > criteria['belowPrice']){
	 			      criteria['belowPrice'] = belowPrice;
	 			   }
	 			   
	 			   if(criteria['abovePrice'] == null || abovePrice < criteria['abovePrice']){
	 			      criteria['abovePrice'] = abovePrice;
	 			   }
		 		}else{
			 		criteria[filterName].push(value);
		 		}
		 	});	 	
	 	});	 		 	
	 		 	
	 	criteria['colors'] = colorPresenter.getSelectedColors();
	 	
	 	if (criteria['colors'] != null && criteria['colors'].length > 0){     
	 	     areAnyFiltersChecked = true;
	 	}
	 	
	 	if (isSearch){
	 	     searchController.search(criteria);
	 	     
	 	}else if (areAnyFiltersChecked){	 		 	 	 		 		 	
            searchController.getProducts(criteria, null, searchController.showResults);
	 	}else{
	 	      $(".noresults").remove();
	 	      productPresenter.refreshProducts();
	 	}	 		 	
 	},
 	
 	formatSelectedValued: function(group){ 
 		var params = "";
 				
 		if(group != null && group.length > 0){
 			params += "( ";
 			
 			$.each(group, function(index, p) {	
 				params += p + " || ";
 			});	
 			
 			params = params.substring(0,params.length-4); 	 	
		 	params += ") && ";
 		}	
 		
 		return params;
 	},
 	
 	filterPanelToggle: function(){
 	 		
	 	 $("#filter-float").toggle('slide',1000);	 	 
			 
	 	 if(isNaN(parseInt($("#product-grid").css("left"))) || parseInt($("#product-grid").css("left")) == 0){
	 	 	$("#product-grid").animate({left: '100px'}, 1000);
	 	 	$("#filter-toggle").animate({left: '165px'}, 1000);
	 	 	$("#filter-toggle").text('Hide Filter');
	 	 }else{
	 	 	$("#product-grid").animate({left: '0px'}, 1000);
	 	 	$("#filter-toggle").animate({left: '-37px'}, 1000);
	 	 	$("#filter-toggle").text('Show Filter');
	 	 } 		
	 },
	 
	 clearFilters: function(){
	   $("#filter-float").find("input").prop("checked", false);
	 },
	 
	 hideFilterPanel: function(){
	 	if($("#filter-float").is(":visible")){
		 	 $("#filter-float").hide('slide',500);
		 	 $("#product-grid").animate({left: '0px'}, 500);
		 	 $("#filter-toggle").animate({left: '-37px'}, 500);
		 	 $("#filter-toggle").text('Show Filter');
	 	}
	 },
	 
	 showFilter: function(){
	   if(!$("#review-form").is(":visible")){ 
	        $("#filter-float").show('slide',500);
	 	 	$("#product-grid").animate({left: '100px'}, 500);
	 	 	$("#filter-toggle").animate({left: '165px'}, 500);
	 	 	$("#filter-toggle").text('Hide Filter');    
	   }
	 }
};var tagPresenter = {	

	allTags: null,
	
	init: function(){		
		tagPresenter.getAllTagNames();		
	},
	
	showTagForm: function(el){
		var element = el.currentTarget;					
		
		if($(element).parent().parent().find(".addTagForm").length > 0){						
			$(element).parent().parent().children(".addToClosetForm").tooltip('destroy');
			$(element).parent().parent().children(".addToClosetForm").remove();
			$(element).parent().parent().children(".addTagForm").tooltip('destroy');
			$(element).parent().parent().children(".addTagForm").remove();
			$(element).parent().parent().children(".topright").show();
		}else{														
			$(element).parent().siblings(".topright").hide();
					
			$(element).parent().parent().append(
				$("<div>").addClass("addTagForm").append(
					$("<form>").append(
						$("<div>").addClass("controls").append(					
							$("<input>").attr("type","text").attr("name","newTag").addClass("newTag")
						)
					).append(
						$("<input>").attr("type","submit").css("display","none")				
					)
				)
			);
			
			var $tagForm = $(element).parent().parent().children(".addTagForm");
			
			$tagForm.tooltip({title:"Press Enter to add tag",placement:"bottom"});
			$tagForm.show();
			$tagForm.find("input").first().focus();
		}
	},
	
	addTag: function(el){
		el.preventDefault();				
		var element = el.currentTarget;
		var itemid = $(element).parent().parent().prev().find("a").attr("pid");		
		var tagInput = $(element).find('input[name="newTag"]').val().trim();		
				
		if(tagInput.length > 0){								
			try{		
				firebase.$.child("store/tags").child(tagInput.toLowerCase()).child("items").push(itemid, function(error) {
				  if (error) {
						Messenger.error('Tag could not be saved. ' + error);
				  } else {
				  		Messenger.timeout = 1750;
						Messenger.success('Tag \"'+tagInput+'\" was saved!');					
						Messenger.timeout = Messenger.defaultTimeout;
						$(element).parent().prevAll(".topright").show();
						$(element).parent().remove();
				  }
				});	
			}catch(err){
				Messenger.error('Tag could not be saved. ' + err);
				return false;
			}					
		}
		
		return false;
	},
	
	getAllTagNames: function(){
		firebase.$.child("store/tags").once('value',function(snapshot){
			tagPresenter.allTags = new Array();
			
			snapshot.forEach(function(tag){
				tagPresenter.allTags.push(tag.name());
			});
			
			$( "#tags" ).autocomplete({
				source: tagPresenter.allTags
			});
		});
	}
};
var searchController = {
    
    results: null,
    
    init: function(){
        $("#search-bar").on("keyup", searchController.showClearBtn);
        $("#search-bar").on("keypress", searchController.searchOnEnter);
        $("#search-form").submit(searchController.search);
		$("#seach-bar-icon").on("click", searchController.searchBarSubmit);
		$("#search-clear-btn").click(searchController.clearSearch);
		$("#search-bar-sort").change(searchController.sortBy);
    },
    
    searchOnEnter: function(el){        
        // on enter button
        if (el.which == 13) {
            searchController.searchBarSubmit(el);
        }
    },
    
    searchBarSubmit: function(el){
		el.preventDefault();
		var searchTerm = $( "#search-bar" ).val().trim();
		
		if (searchTerm.charAt(0) == '#'){
		  var tag = searchTerm.substring(1);
		  searchController.getProductsWithTag(tag, searchController.showResults);
		}else if (searchTerm == ''){
		  filterPresenter.onFilterSelect();
		}else{
		  searchController.search();  
		}		
    },
    
    search: function(criteria){
		var searchTerm = $( "#search-bar" ).val().toLowerCase().trim();		
		var belowPrice = null;
		var abovePrice = null;
		var cleanSearchTerm = searchTerm;
		
		// log search term
		var logSearchTerm = searchTerm.replace(/[^A-Za-z0-9\w\s]/gi,'');
		var timestamp = new Date().getTime();
		firebase.$.child("search").child(logSearchTerm).child(timestamp).set({user: firebase.userid});
		
		// get price if there is one
		if(searchTerm.indexOf("$") > 0 || searchTerm.indexOf("dollar") > 0){  
		      // Get start and end positions of price string
		      var prices = searchTerm.match(/\d+/g);
		      prices.sort(searchController.sortLowestToHighest);
		      
		      var priceA = parseInt(prices[0]);
		      var priceB = parseInt(prices[prices.length - 1]);
              
              // if above price 
              if(prices.length > 1 && (/between|from/gi).test(searchTerm)){
                abovePrice = priceA;
                belowPrice = priceB;
              }else if((/above|over|more than|more then/gi).test(searchTerm)){
                    abovePrice = priceA;
                    belowPrice = 99999;
              }else{
                    belowPrice = priceA;
                    abovePrice = 0;                     
              }
		      
		      // remove the price and price direction indicator
		      var priceRegex = new RegExp("\\$|dollar|above|over|under|below|more than|more then|less than|less then|between|from|to|" + priceA + "|" + priceB, 'gi');
		      cleanSearchTerm = cleanSearchTerm.replace(priceRegex,'').trim();		      
		}
		
		// remove all non alphanumeric characters except spaces
		cleanSearchTerm = cleanSearchTerm.replace(/[^A-Za-z0-9\w\s]/gi,''); 
		
		// remove words less than 3 characters long
        cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,'');
        
        // remove common words
        cleanSearchTerm = cleanSearchTerm.replace(/(for|with|that|has|like)(\s|$)/gi,'');                
        
        var tags = cleanSearchTerm.split(" ");
        var matchingFilters = null;
        
        if (criteria == null){
            var filters = filterPresenter.allFilters.join("|").toLowerCase().trim();
            filters = filters.replace(/s?(?=\s|\||$)/gi, ""); // remove trailing 's' form every word
            filters = filters.replace(/sse/gi, "ss"); // remove 'es' from applicable words        
            
            var regex = new RegExp(searchController.regexEscape(filters), 'gi');
            matchingFilters = cleanSearchTerm.match(regex);
            
            // Get additional filters based on key words
            if(matchingFilters == null){
                matchingFilters = [];   
            }        
                        
            searchController.getAdditionalFiltersFromTags(matchingFilters, tags);
                    
            filterPresenter.clearFilters();
            criteria = {};
            if (matchingFilters != null && matchingFilters.length > 0){
                
                searchController.getAdditionalFilters(matchingFilters);                                          
                
                for(var i=0; i < matchingFilters.length; i++){
                   var filter = $("#filter-float").find('input[value^="' + searchController.toTitleCase(matchingFilters[i]) + '"]');
                
                   if (filter != null){
                       filter.prop('checked', true);
                       var filterName = filter.attr("name").toLowerCase();
                       
                       if (criteria[filterName] == null){
                           criteria[filterName] = [];                    
                       }
                       
                       criteria[filterName].push(filter.val().toLowerCase());
                   }
               }                      
            }
            
            if (abovePrice != null || belowPrice != null){
                var filter = $("#filter-float").find('input[name="filterprice"]');                 
                criteria['belowPrice'] = belowPrice;
                criteria['abovePrice'] = abovePrice;                
            
                filter.each(function() {  
                    var filterMin = parseInt($(this).val());
                    var filterMax = parseInt($(this).attr('max'));
                        
                    if(filterMin < belowPrice && filterMax > abovePrice){                        
                        $(this).prop('checked', true);                                                
                    }
                });               
            }
            
            if (matchingFilters != null && matchingFilters.length > 0){
                // remove filters in the search string
                regex = new RegExp(searchController.regexEscape(matchingFilters.join('|')), 'gi');
                cleanSearchTerm = cleanSearchTerm.replace(regex, '');
                cleanSearchTerm = cleanSearchTerm.replace(/(\b(\w{1,2})\b(\s|$))/gi,''); // remove words less than 3 chars
                cleanSearchTerm = cleanSearchTerm.trim(); 
                tags = cleanSearchTerm.split(" ");       
            }
            
            
            // Seach for colors
            var colors = colorPresenter.getColorNames().join("|").toLowerCase().trim();            
            var regex = new RegExp(searchController.regexEscape(colors), 'gi');
            matchingColors = cleanSearchTerm.match(regex);
            
            if(matchingColors == null){
                matchingColors = [];   
            }   
            
            searchController.getAdditionalColorsFromTags(matchingColors, tags);                                                
            
            if (matchingColors != null && matchingColors.length > 0){
                criteria['colors'] = matchingColors;                                       
            }              
        }
          
        searchController.getProducts(criteria, tags, searchController.showResults);
    },             
    
    getProducts: function(criteria, tags, callback){     
        var products = {};         
        
        gridPresenter.beginTask();                
        var hasTags = tags != null && tags != "" && !(tags.length == 1 && tags[0] == "") && tags.length > 0;               
        var tagsRegex = null;
        
        if (hasTags){
            var tagsRegexString = tags.join("|").toLowerCase().trim();        
            tagsRegex = new RegExp(searchController.regexEscape(tagsRegexString), 'gi'); 
        }
           
        // criteria has -> "company","customer","category","price","underprice"        
        if (criteria != null){
            var hasCriteria = (criteria.company != null && Object.keys(criteria.company).length > 0) || 
                              (criteria.customer != null && Object.keys(criteria.customer).length > 0) ||
                              (criteria.category != null && Object.keys(criteria.category).length > 0);                           
                              
            var hasColors = criteria.colors != null && criteria.colors.length > 0;
            
            // search store for all matching products
            firebase.$.child("store").once('value',function(store){                
                
                store.child("products").forEach(function(company) {
                    
                    if (criteria.company == null || criteria.company.length <= 0 || $.inArray(company.name(), criteria.company) >= 0){                    
                        company.forEach(function(customer) {
                            
                            if (criteria.customer == null || criteria.customer.length <= 0 || $.inArray(customer.name(), criteria.customer) >= 0){                        
                                customer.forEach(function(category) {
                                    
                                    if (criteria.category == null || criteria.category.length <= 0 || $.inArray(category.name(), criteria.category) >= 0){                                            
                                        category.forEach(function(item) {
                                            var sku = item.name();
                                            var product = products[sku];
                                            
                                            if (product == null){
                                                product = productPresenter.clothingStore[sku];
                                                
                                                if (product != null){
                                                    product.rank = 0;
                                                }
                                            }else{
                                                // product matches multiple criteria
                                                product.rank += 1;
                                            }
                                                           
                                            if(product != null){ 
                                                
                                                // matches price
                                                if((!criteria.belowPrice || product.p <= criteria.belowPrice) &&
                                                       (!criteria.abovePrice || product.p >= criteria.abovePrice)){
                                    
                                                    // product name ranking    
                                                    var foundMatchInName = false;          
                                                    if(hasTags){                                         				    
                                                        var matches = product.n.toLowerCase().match(tagsRegex);
                                                        
                                                        if (matches != null){
                                         			        product.rank += matches.length * 2;
                                         			        foundMatchInName = true;
                                                        }
                                                    }
                                                    
                                                    // matches color
                                                    var matchesColor = false;
                                                    if(hasColors){ 
                                                        for(var i=0; i < criteria.colors.length; i++){
                                                            var color = criteria.colors[i].toLowerCase();
                                          		    
                                          		            if (store.hasChild("colors/" + color + "/" + sku)){
                                          		                var percent = store.child("colors/" + color + "/" + sku).val();
                                                  				product.rank += percent; 	
                                                  				matchesColor = true;
                                          			        }	
                                          		        }
                                                    }
                                                    
                                                    // Add product
                                                    if((matchesColor || !hasColors) &&                                                        
                                                       (hasCriteria || hasColors || foundMatchInName)){                                                                
                                                            products[sku] = product;                                                       
                                                    }
                                                }
                                            }                                              	                                                                                            
                                        });        
                                    }
                                });                                 
                            }
                        });    
                    }              
                });                                                                                                                     
                
                // Get product with tags and add ranking
                if(hasTags){ 
                    // remove all non alphanumeric characters with a few exceptions                                
                    for(var i=0; i < tags.length; i++){
                        var tag = tags[i].replace(/[^A-Za-z0-9\w\s '\-\$\.]/gi,'').toLowerCase();
                        var items = searchController.getMatchingChild(store.child("tags"), tag);    
        		    
        		        if (items != null){
                			items.forEach(function(item){
                				var sku = item.val();
                				var product = products[sku];
                				
                				if (product == null && !hasCriteria){                    				                    				
                				   product = productPresenter.clothingStore[sku];
                				   
                				   if (product != null){
                                        product.rank = 1;    
                				   }            				                       				
                				}else if(product != null){
                				   product.rank += 5; 
                				}
                				
                				// Add product only if there is no criteria
                                if (product != null && !hasCriteria){
                                    // matches price
                                    if((!criteria.belowPrice || product.p <= criteria.belowPrice) &&
                                        (!criteria.abovePrice || product.p >= criteria.abovePrice) ){
                    
                                        // product name ranking    
                                        var foundMatchInName = false;                                                  				    
                                        var matches = product.n.toLowerCase().match(tagsRegex);
                                        
                                        if (matches != null){
                            			        product.rank += matches.length * 2;                            	
                                        }
                                        
                                        // matches color
                                        var matchesColor = false;
                                        if(hasColors){ 
                                            for(var i=0; i < criteria.colors.length; i++){
                                                var color = criteria.colors[i].toLowerCase();
                                		    
                            		            if (store.hasChild("colors/" + color + "/" + sku)){
                            		                var percent = store.child("colors/" + color + "/" + sku).val();
                                    				product.rank += percent; 	
                                    				matchesColor = true;
                            			        }	
                            		        }
                                        }
                            
                                        if(matchesColor || !hasColors){
                                            products[sku] = product;
                                        }
                                    }
                                }
        			        });		
        		        }					
                    }
                }                                
                
                callback(products);
            });                                                 
        }
    },    
    
    getProductsWithTag: function(tagName, callback){	                        
		$("#product-grid").children().remove();
		$("#loadingMainContent").show();
		    
		firebase.$.child("store/tags").once('value',function(snapshot){
		    var results = {};
		    
		    // remove all non alphanumeric characters with a few exceptions
            var tag = tagName.replace(/[^A-Za-z0-9\w\s '\-\$\.]/gi,'').toLowerCase();                                                
            var items = searchController.getMatchingChild(snapshot, tag);                
	    
	        if (items != null){		        
        			items.forEach(function(item){
        				var sku = item.val();
        				var product = productPresenter.clothingStore[sku];            				
        				
        				if (product != null){
            				if(product.s in results){
            				   product = results[product.s];
            				   product.rank += 10;
            				
            				}else{        				    
                				product.rank = 0;                				
                				results[product.s] = product;                				
            				}
        				}
        			});		
	        }					            
			
			callback(results);                 			
            
		}, this);				
	},		
	
	showResults: function(products){	  
	    products = searchController.orderResults(products);	    
		productPresenter.filterStore = products;
		$("#loadingMainContent").hide();
		
		if( Object.keys(products).length > 0){
		    productPresenter.refreshFilteredProducts();
		}else{
		    var searchTerm = $( "#search-bar" ).val().trim();
		    var errorMessage = '';
		    
		    if (searchTerm == ""){
		        errorMessage = "There are no macthing outfits!";
		    }else{
		        errorMessage = "There are no outfits that matched: \'" + searchTerm + "\'! Try using another way to describe what you are looking for.";
		    }
		  
			$("#product-grid").html($("<div>").text(errorMessage));
		}
	},
	
	showClearBtn: function(){
	    if(!$("#search-clear-btn").is(":visible") && $("#search-bar").val().trim().length > 0){
	       $("#search-clear-btn").show();       
	    }
	},
	
	sortBy: function(){	   
	   gridPresenter.beginTask();
	   searchController.showResults(productPresenter.filterStore);
	},
	
	getSortFunction: function(){
	   var sort = $("#search-bar-sort").val();
	   var sortFunction = null;
	   	 
	   switch(sort){	       	           
	       case "pricelowtohigh":
	           sortFunction = searchController.sortPriceLowToHigh;
	           break;
	       case "pricehightolow":
    	       sortFunction = searchController.sortPriceHighToLow;
    	       break;
    	   case "mostpopular":
    	       sortFunction = searchController.sortMostPopular;
    	       break;
    	   case "mostdiscussed":
    	       sortFunction = searchController.sortMostDiscussed;
    	       break;
    	   default:
    	       sortFunction = searchController.sortRanks;
	           break;
	   }
	   
	   return sortFunction;
	},
	
	orderResults: function(products){
	   var rankedProducts = [];
	   var orderedProducts = {};
	   
	   // convert object to array
	   for(var i=0; i < Object.keys(products).length; i++){
	       rankedProducts.push(products[Object.keys(products)[i]]);
	   }   
	   
	   var sortFunction = searchController.getSortFunction();
	   rankedProducts.sort(sortFunction);
	   
	   for(var i=0; i < rankedProducts.length; i++){
	          orderedProducts[i + "_" + rankedProducts[i]['s']] = rankedProducts[i];
	   } 

       return orderedProducts;
	},
	
	sortRanks: function(a, b){
	   return b.rank - a.rank; 
	},
	
	sortPriceLowToHigh: function(a, b){
	   return a.p - b.p; 
	},
	
	sortPriceHighToLow: function(a, b){
	   return b.p - a.p; 
	},
	
	sortMostPopular: function(a, b){
	   return b.cc - a.cc;
	},
	
	sortMostDiscussed: function(a, b){
	   return b.rc - a.rc;
	},
	
	sortLowestToHighest: function(a, b){
	   return a - b; 
	},		
	
	clearSearch: function(el){
		el.preventDefault();
		$( "#search-bar" ).val("");
		$("#loadingMainContent").show();
		$("#search-clear-btn").hide();
		filterPresenter.clearFilters();
		
		productPresenter.refreshProducts();
	},
	
	getAdditionalFilters: function(matchingFilters){
	   
	   if (($.inArray("dress", matchingFilters) >= 0 ||
	        $.inArray("skirts", matchingFilters)  >= 0 ||
	        $.inArray("ann taylor", matchingFilters)  >= 0 ||
	        $.inArray("loft", matchingFilters) >= 0) &&
	        $.inArray("women", matchingFilters)  < 0){
	           
	            matchingFilters.push("women");  
	        }
	},
	
	getAdditionalFiltersFromTags: function(matchingFilters, tags){
	   if ($.inArray("top", tags) >= 0 || $.inArray("tops", tags) >= 0){	  	       	                
            matchingFilters.push("polos");
            matchingFilters.push("shirts");
            matchingFilters.push("sweaters");
            matchingFilters.push("t's & tops");
            matchingFilters.push("top");  
        }
        
        if ($.inArray("bottom", tags) >= 0 || $.inArray("bottoms", tags) >= 0){	           
            matchingFilters.push("jeans");
            matchingFilters.push("pants");
            matchingFilters.push("skirts");
            matchingFilters.push("bottom");  
        }  
	},
	
	getMatchingChild: function(snapshot, tag){
	    var item = null;
	    
	    if(tag == null || tag.trim() == ""){
	       return null;  
	    }
	   
	    if (snapshot.hasChild(tag)){
            item = snapshot.child(tag + "/items");
        
        // add 's'
        }else if (snapshot.hasChild(tag + 's')){
            item = snapshot.child(tag + "s/items");
        
        // add 'es'
        }else if (snapshot.hasChild(tag + 'es')){
            item = snapshot.child(tag + "es/items");                
            
        // add 'ed'
        }else if (snapshot.hasChild(tag + 'ed')){
            item = snapshot.child(tag + "ed/items");                    
        
        // remove trailing 's' or 'y'
        }else if ((tag.charAt(tag.length - 1) == 's' || 
                   tag.charAt(tag.length - 1) == 'y') && 
                   snapshot.hasChild(tag.substring(0, tag.length - 1))){
                    
            item = snapshot.child(tag.substring(0, tag.length - 1) + "/items");
        
        // remove trailing 'es'
        }else if (tag.lastIndexOf("es") == (tag.length - 2) && snapshot.hasChild(tag.substring(0, tag.length - 2))){
            item = snapshot.child(tag.substring(0, tag.length - 2) + "/items");
        
        // remove trailing 'ed' and add an 'es'
        }else if (tag.lastIndexOf("ed") == (tag.length - 2) && snapshot.hasChild(tag.substring(0, tag.length - 2) + 'es')){
            item = snapshot.child(tag.substring(0, tag.length - 2) + "es/items");                
        
        // remove trailing 'y' and add an 's'
        }else if (tag.charAt(tag.length - 1) == 'y' && snapshot.hasChild(tag.substring(0, tag.length - 1) + 's')){
            item = snapshot.child(tag.substring(0, tag.length - 1) + "s/items");
          
        
        // remove trailing 'y' and add an 'es'
        }else if (tag.charAt(tag.length - 1) == 'y' && snapshot.hasChild(tag.substring(0, tag.length - 1) + 'es')){
            item = snapshot.child(tag.substring(0, tag.length - 1) + "es/items");
        }  
        
        return item;
    },
    
    getAdditionalColorsFromTags: function(matchingColors, tags){          
    },
    
    regexEscape: function(str) {
        return str.replace(/[-\/\\^$*+?.()[\]{}]/g, '\\$&')
    },
    
    toTitleCase: function(str)
    {
         return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
};var reviewsPresenter = {	
	cachedReviews: null,	
	currentReviewFB: null,	
	 
	 init: function(){
	    reviewsPresenter.cachedReviews = new Object();
	    $(document).on("click",".showComments",reviewsPresenter.showReview);
//	 	$(document).on("click", ".picture > a", reviewsPresenter.showReview);
	 	$(document).on("click", ".review-add-btn", reviewsPresenter.saveReview);	
	 	$(document).on("click", ".review-mask", reviewsPresenter.hideReview);		 		 
	 	
	 	$(document).on("mouseenter", ".review-rating .review-star", reviewsPresenter.showFilledStars);		 		 
	 	$(document).on("mouseleave", ".review-rating", reviewsPresenter.resetRating);		 		 	 	
	 	$(document).on("click", ".review-rating .review-star", reviewsPresenter.chooseRating);		 		 	 	
	 },
	 
	 showReview: function(e){
	       var targetOutfit = $(e.target).parent().parent().parent().parent().parent();
	       var sku = targetOutfit.find('a[pid]').first().attr("pid");
	       var reviewBlock = reviewsPresenter.getReviewBlock(sku);
	       
	       if(reviewBlock.is(":visible")){	 	 		 	
	 	 	       reviewsPresenter.hideReview(reviewBlock);	 	   
	 	   }else{	 	   	 	 	  	 	       	 	
	 	       targetOutfit.find(".product-comments").html(reviewBlock);
	 	              	 	       
      	 	   reviewBlock.find(".review-rating").attr("userRating",0);      	 	   
      	 	   reviewsPresenter.refreshRating(reviewBlock, 0);
      	 	   reviewsPresenter.showAverageRating(reviewBlock);
      	 	   
      	 	   reviewsPresenter.currentReviewFB = firebase.$.child("reviews/"+sku);      	 	         	 	        	 	   
      	 	   reviewsPresenter.currentReviewFB.on('child_added', reviewsPresenter.addReview);	 
	 	 	   
    	       reviewBlock.show('blind');
	 	   }
	 },
	 	 
	 hideReview:function(review){
	     if (reviewsPresenter.currentReviewFB != null){
     	     reviewsPresenter.currentReviewFB.off('child_added', reviewsPresenter.addReview);	
     	     reviewsPresenter.currentReviewFbUrl = null;
	     }
 	     
 	     if(review != null && review.is(":visible")){
	 	 	   review.hide('blind');
	 	 	   review.find(".review-comments").html("");
 	     }
	 },	 	 
	 
	 saveReview: function(e){
	    var targetOutfit = $(e.target).parent().parent().parent().parent().parent();
	   
	 	var comment = targetOutfit.find(".review-add-comment").val();
	 	
	 	if(comment.trim() != ""){	 		
		 	var now = new Date();
		 	var ampm = now.getHours() >= 12 ? "PM" : "AM";
		 	var hour = now.getHours() % 12;
		 	hour = hour == 0 ? 12 : hour;
		 	hour = reviewsPresenter.addZero(hour);
		 	var minute = reviewsPresenter.addZero(now.getMinutes());
		 	
		 	var nowString = (now.getMonth() + 1) +"/"+ now.getDate() +"/"+ now.getFullYear() + " " + hour +":"+ minute + " " + ampm;
		 	var user = firebase.username == null ? "Guest" : firebase.username;
		 	var rating = targetOutfit.find(".review-rating").attr("userRating");
		 	rating = rating == undefined ? 0 : rating;
		 	
		 	var sku = targetOutfit.find('a[pid]').first().attr("pid");
		 	reviewsPresenter.currentReviewFB = firebase.$.child("reviews/"+sku);	 	 	
		 	reviewsPresenter.currentReviewFB.push({name:user, rating:rating, comment: comment, date:nowString, sku:sku});	 	
		 	
		 	targetOutfit.find(".review-add-comment").val("");		 	
		 	var review = targetOutfit.find(".review-float");
		 	reviewsPresenter.refreshRating(review, 0);
		 	
		 	// update review count
		 	firebase.$.child("clositt/products/"+sku+"/rc").transaction(function(value) {
		 	   var newValue = 1;
		 	   
		 	   if(value == null){		 	       
    	 	       firebase.$.child("clositt/products/"+sku+"/rc").set(newValue);
		 	   }else{
		 	        newValue = value +1;		 	        
		 	   } 		 	            
		 	   
		 	   targetOutfit.find(".numReviews").text(newValue);
		 	   return newValue;       
            });
		 	
	 	}else{
	 		Messenger.info("Please enter a comment");
	 	}
	 },
	 
	 addReview: function(snapshot){
		var review = snapshot.val();
		if(review != null){		
		    var reviewBlock = reviewsPresenter.getReviewBlock(review.sku);		  	
			
			if(!reviewBlock.find(".review-comments > li").length){
				reviewBlock.find(".review-comments").html("");	
			}
				
			reviewBlock.find(".review-comments").append(
				$("<li>").append(
					reviewsPresenter.getReviewHeader(review)
				).append(				
					$("<span>").addClass("review-text").append( 
					   $("<span>").addClass("review-comment-user").text(review.name + ": ")
					).append(
					   $("<pre>").text(review.comment) 
					)
				)
			);
			
			reviewsPresenter.showAverageRating(reviewBlock);	
		}	
	 },
	 
	 getReviewHeader: function(review){
	    var isToday = reviewsPresenter.isDateToday(review.date);	    
	    var dateTimeSplitIndex = review.date.indexOf(" ");
	    var reviewDate = "";
	    
	    if (isToday){
	       reviewDate = review.date.substring(dateTimeSplitIndex + 1);  
	    }else{
	       reviewDate = review.date.substring(0,dateTimeSplitIndex);
	    }	    	    
	   
	 	return $("<div>").addClass("review-header").append(
	 		$("<span>").addClass("review-comment-date").text(reviewDate)	 		
	 	).append(
		 		reviewsPresenter.getReviewRating(review.rating)
	 	);
	 },	 	 
	 
	 getReviewRating: function(numStars){
	 	var rating = $("<span>").addClass("review-comment-rating").attr("rating",numStars);
	 	var count = 0;
	 	
	 	if(numStars == null || numStars <= 0 || numStars > 5){
	 	     return null;
	 	}
	 	
	 	for(var r=1; r <= numStars; r++){
	 		rating.append(
	 			$("<i>").addClass("star-small-full")
	 		);
	 		count++;
	 	}	
	 	
	 	if(count < 5 && numStars % .5 == 1){
	 		rating.append(
	 			$("<i>").addClass("star-small-half")
	 		)
	 		count++;
	 	}
	 	
	 	while(count < 5){
	 		rating.append(
		 		$("<i>").addClass("star-small-empty")
		 	)
	 		count++;
	 	}		 		 		 		 		 	
	 	
	 	return rating;	
	 },
	 
	 showAverageRating: function(review){	 	
	    // remove to get average rating
	    return null;
	    
	 	var aveRating = reviewsPresenter.getAverageRating(review);		 	
		
		if(aveRating >= 0 && aveRating <=5){
		 	review.find(".review-average").text(aveRating);
		 	review.find(".review-average").show();
		}else{
			review.find(".review-average").text(0);
		 	review.find(".review-average").hide();
		}
	 	
//	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){	 	
//		 	var aveRating = reviewsPresenter.getAverageRating();
//		 	
//		 	if(aveRating >= 0 && aveRating <=5){
//			 	reviewsPresenter.refreshRating(aveRating);
//		 	}else{
//		 		reviewsPresenter.refreshRating(0);
//		 	}	 		 		 		
//	 	}
	 },
	 
	 getAverageRating: function(review){	 
	 	var totalRatings = 0;
	 	var numRatings = 0;
	 		
	 	review.find(".review-comments .review-comment-rating").each(function(){
	 		var val = $(this).attr("rating");
	 		val = val < 0 ? 0 : val;
	 		val = val > 5 ? 5 : val;
	 		
	 		totalRatings += parseFloat(val);
	 		numRatings++;	 		
	 	});
	 	
	 	if(numRatings > 0){
	 		var ave = totalRatings / numRatings;	
	 		return Math.round( ave * 10 ) / 10;
	 	}
	 	
	 	return -1;
	 },
	 
	 showFilledStars: function(e){	 	
	 	var star = $(e.target).attr("star");
	 	star = star > 5 ? 5 : star;
	 	
	 	var userRating = $(".review-rating").attr("userRating");
	 	
	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){
	 	    var outfit = $(e.target).parent().parent().parent();
	 		reviewsPresenter.refreshRating(outfit, star);	 	
	 	}
	 },
	 
	 refreshRating: function(review, star){	 
	 	star = parseFloat(star);
	 	var count = 0;
	 	 	
	 	// Full Stars
	 	for(var i=1; i<= star; i++){
	 		var targetStar = review.find('.review-rating .review-star[star="'+i+'"]');
	 		targetStar.removeClass("star-small-empty star-small-half");
	 		targetStar.addClass("star-small-full");
	 		count++;
	 	}	 
	 	
	 	// Half Stars
	 	if(count < 5 && star % .5 == 1){
	 		var targetStar = review.find('.review-rating .review-star[star="'+count+'"]');
	 		targetStar.removeClass("star-small-empty star-small-full");
	 		targetStar.addClass("star-small-half");
	 		count++;
	 	}		 	
	 	
	 	// Empty Stars
	 	for(var i=count+1; i<= 5; i++){
	 		var targetStar = review.find('.review-rating .review-star[star="'+i+'"]');
	 			 		
	 		targetStar.removeClass("star-small-full star-small-half");
	 		targetStar.addClass("star-small-empty");
	 	} 
	 },
	 
	 chooseRating: function(e){
	 	var star = $(e.target).attr("star");	 	
	 	
	 	if($(".review-rating").attr("userRating") == star){
	 		star = 0;
	 	}

		$(".review-rating").attr("userRating",star);
		var outfit = $(e.target).parent().parent().parent();	 			 	
	 	reviewsPresenter.refreshRating(outfit, star);
	 },
	 
	 resetRating: function(e){
	    var outfit = $(e.target).parent().parent().parent();
	 	var userRating = outfit.find(".review-rating").attr("userRating");
	 	
	 	if(userRating == undefined || isNaN(userRating) || userRating <= 0){
	 		reviewsPresenter.refreshRating(outfit, 0);	 	
	 	}else{
		 	reviewsPresenter.refreshRating(outfit, userRating);	 		
	 	}
	 },
	 
	 getReviewBlock: function(id){
	   if (reviewsPresenter.cachedReviews[id] != null){
	       return reviewsPresenter.cachedReviews[id];
	   }
	   
	   var reviewRating = $("<div>").addClass("review-rating");
	   
	   for (var i=1; i <= 5; i++){
	       reviewRating.append(
                $("<i>").addClass("review-star star-small-empty").attr("star",i)
            )
	   }
	   
	   //reviewRating.append($("<span>").addClass("review-average label label-info").text("0"));    
	   	   
       var reviewBlock = $("<div>").attr("id",id + "-review-float").addClass("review-float").css("display","none").append(
            $("<div>").addClass("review-form").append(
                $("<textarea>").addClass("review-add-comment").attr("rows","3").attr("placeholder","Add a Comment...")
            ).append(reviewRating).append(
                $("<button>").addClass("review-add-btn btn btn-success btn-mini").attr("type","button").text("Add Comment")
            )                       
       ).append(
            $("<ul>").addClass("review-comments")
       ); 	          
       
       reviewsPresenter.cachedReviews[id] = reviewBlock;
       return reviewBlock;        	   
	 },
	 
	 isDateToday: function(d){
	   var date = new Date(d);
	   var today = new Date();
	   
	   return date.getUTCFullYear() == today.getUTCFullYear() &&
	          date.getUTCMonth() == today.getUTCMonth() &&
	          date.getUTCDate() == today.getUTCDate();	   
	 },
	 
	 addZero: function(i){
		if(isNaN(i)){
			i = 0;
		}	
	 	
		if (i<10){
		  i="0" + i;
		}
		
		return i;
	}
};	var closetPresenter = {
	share: '1212000',	
	carouselLeft: null,	
	carouselRight: null,
	user: null,

	init: function(){
		var u = closetPresenter.user == undefined ? undefined : closetPresenter.user.toString().replace(closetPresenter.share,'');
		closetPresenter.getClosets(u);
		$(document).on("mousedown",".carousel-left", closetPresenter.leftAnimation);
		$(document).on("mousedown",".carousel-right", closetPresenter.rightAnimation);
		$(document).on("mouseup",".carousel-left", closetPresenter.stopCarouselLeft);
		$(document).on("mouseup",".carousel-right", closetPresenter.stopCarouselRight);
		
		$("#closet-settings > .settings-minicon").on("click", closetPresenter.showSettings);
		$(document).on("click", "#closet-settings > .save-minicon", closetPresenter.saveClosets);
		$(document).on("click", "#closet-share > .share-freeiconsweb", closetPresenter.shareCloset);
		$(document).on("click",".delete-outfit", closetPresenter.removeOutfit);		
		$(document).keypress(closetPresenter.saveClosetsOnEnter);				
	},
	
	setUser: function(user){
	   closetPresenter.user = user;
	},
	
	getClosets: function(){
		if(closetPresenter.user != undefined){
			firebase.$.child(firebase.userPath).child(closetPresenter.user).child("closets").once('value', closetPresenter.showClosets);
			firebase.$.child(firebase.userPath).child(closetPresenter.user).child("name").once('value', function(data){
				$("#user-closet-title").text(data.val() + "'s Closet");
			});
		}else if(firebase.isLoggedIn){
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").once('value', closetPresenter.showClosets);		
			 $("#user-closet-title").text(firebase.username + "'s Closet");
		}else{
			Messenger.info("Please login or sign up to add items to your closet!");	
		}
	},
	
	showClosets: function(closets){							
		closets.forEach(function(closet){
		      closetPresenter.getClosetTemplate("closet-list", closet, true);				
		});	
		
		$(".closetName").last().attr("last",true);
	},		
	
	getClosetTemplate: function(parentId, closet, includeClosetName){
	    var $itemlist = $("<div>").addClass("items");
			
		var rand = Math.floor(Math.random() * 3) + 1;
		var textColor = rand > 1 ? 'orange' : rand > 0 ? 'red' : '';
		var closetHeader = null;
		
		if (includeClosetName){
		  closetHeader = $("<h1>").addClass("closetName").append($("<span>").addClass(textColor).attr("closetid",closet.name()).text(closet.val().name));
		}
		
		$("#"+parentId).append($("<hr>")).append(		
			$("<div>").addClass("closet").addClass("clearfix").append(closetHeader).append(
				$("<div>").addClass("carousel").append(
					$("<div>").addClass("carousel-left").append(
						$("<div>").addClass("left-arrow")
					)
				).append($itemlist).append(
					$("<div>").addClass("carousel-right").append(
						$("<div>").addClass("right-arrow")
					)						
				)
			)
		);
		
		closet.child("items").forEach(function(item){
			$itemlist.append(
				productPresenter.getClosetItemTemplate(item.val()).prepend(
					$("<div>").addClass("hanger").append(
						$("<img>").attr("src","css/images/hanger.png")
					)
				)
			); 				
		});	
	},
	
	stopCarouselLeft: function(el){
		$(el.currentTarget).next(".items").first().stop();
		$(el.currentTarget).animate({opacity: .5},500);
	},
	
	stopCarouselRight: function(el){
		$(el.currentTarget).prev(".items").first().stop();
		$(el.currentTarget).animate({opacity: .5},500);
	},
	
	leftAnimation: function(el){		
		$(el.currentTarget).next(".items").first().animate({left:  -1 * $(document).width() - $(this).width()},7000);		
		$(el.currentTarget).animate({opacity: 1},500);
	},
	
	rightAnimation: function(el){
		$(el.currentTarget).prev(".items").first().animate({left: $(document).width() - $(this).width()},7000);	
		$(el.currentTarget).animate({opacity: 1},500);
	},
	
	showSettings: function(){
		if( !$(".settings-minicon").hasClass("active") && $(".outfit").length > 0){
			$(".settings-minicon").addClass("active");

			$("#closet-share > .share-freeiconsweb").animate({
				right: '+=50'
			}, 50);			
	
			$("#closet-settings").prepend(
				$("<i>").addClass("minicon-single save-minicon")
			);
			
			$(".picture").append(
				$("<div>").addClass("delete-outfit").append(
					$("<i>").addClass("icon-remove icon-white")
				)
			);			
				
			$(".closetName > span").replaceWith(function() {
				return $("<span>").append(
						$("<input>").addClass("closetNameInput")
							.attr("type","text")
							.attr("name","closetName")
							.attr("closetid",$(this).attr("closetid"))
							.attr("original",$(this).text())
							.attr("value",$(this).text()));
			});			
		}else{
			closetPresenter.hideSettings();	
		}
	},
	
	hideSettings: function(){
		if( $(".settings-minicon").hasClass("active") ){
			$(".settings-minicon").removeClass("active");

			$("#closet-settings .save-minicon").remove();

			$("#closet-share > .share-freeiconsweb").animate({
                                right: '-=50'
                        }, 50);
			
			$(".picture .delete-outfit").remove();
				
			$(".closetName > span").replaceWith(function() {
				return $("<span>").attr("closetid",$(this).children("input").attr("closetid")).text($(this).children("input").attr("original"));
			});			
		}
	},
	
	saveClosets: function(){	
		if( $(".settings-minicon").hasClass("active") ){			    
		  		
			$(".closetName input").each(function(){
				var closetid = $(this).attr("closetid");
				var original = $(this).attr("original");
				var newName = $(this).val().trim();
				var $closetNameInput = $(this);
				var success = true;
								
				firebase.$.child(firebase.userPath).child(firebase.userid).child("closets/"+closetid+"/name").set(newName, function(error){
					  if (error) {
					    	Messenger.error('Item could not be removed.' + error);
					    	success = false;
		 			  } else {						
							$closetNameInput.attr("original",newName);
							$closetNameInput.attr("value",newName);
																															
							if ($closetNameInput.parent().parent().attr("last")){
								if(success){
									Messenger.success("Closet Names were saved!");
									closetPresenter.hideSettings();	
								}else{
									Messenger.error("Error! Closet Names were not saved!");	
								}
							}	
					  }									
				});																
			});	
		}			
	},

	saveClosetsOnEnter: function(e){
		// 13 == Enter
		if( $(".settings-minicon").hasClass("active") ){
			if(e.which == 13) {			
				closetPresenter.saveClosets();
			}	
		}
	},
	
	removeOutfit: function(el){
		var sku = $(el.currentTarget).prev("a").attr("pid");
		var closetName = $(el.currentTarget).parent().parent().parent().parent().prev(".closetName").find("input").attr("original");
		var closetId = $(el.currentTarget).parent().parent().parent().parent().prev(".closetName").find("input").attr("closetid");
		
		firebase.$.child(firebase.userPath).child(firebase.userid).child("closets/"+closetId+"/items").once('value', function(items){
		      items.forEach(function(item){
		          if(item.val() == sku){
		              firebase.$.child(firebase.userPath).child(firebase.userid).child("closets/"+closetId+"/items/"+item.name()).remove(function(error){
                		  if (error) {
                		    	Messenger.error('Item could not be removed.' + error);
                		  } else {
                		  		$(el.currentTarget).parent().parent().css("display","none");
                		    	Messenger.success('This item was removed from "' + closetName +'"');		    	
                		  }
                	  });
                	  
                	  return true;                 
		          } 
		      });
		});
			
	},

	shareCloset: function(){
		if($("#share-url").length){
			$("#share-url").remove();
		}else{
			var query = location.href.toString().replace("closet.php",("!" + closetPresenter.share) + firebase.userid)

			$("#closet-share > .share-freeiconsweb").before(
      			  $('<input type="text">')
            		 	.attr("id","share-url")
            			.attr("value",query)
            			.css("position","absolute")
           			    .css("top","110px")
            			.css("right","185px")
            			.css("height","30px")
            			.css("width","200px")
        		);

			$("#share-url").focus();
		}
	}
}





var closetFormPresenter = {

	closetIds: null,
	closetNames: null, 
	closetItems: null,
	closetItemsMapping: null,
	darkHangerImg: "/css/images/hanger-icon.png",
	lightHangerImg: "/css/images/hanger-icon-white.png",
	
	getClosetInfo: function(){
		if(closetFormPresenter.closetNames == null && firebase.isLoggedIn){
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").on('value', function(snapshot){
				var closetIds = new Array();
				var closetNames = new Array();
				var closetItems = new Array();
				var closetItemsMapping = new Array();
				var i=0;
				
				snapshot.forEach(function(closet){
					closetIds[i] = closet.name();
					closetNames[i] = closet.val().name;
					
					closet.child("items").forEach(function(item){
						closetItems.push(item.val());
						closetItemsMapping.push(closetNames[i]);							
					});
					
					i++;
				});	
				
				closetFormPresenter.closetIds = closetIds;
				closetFormPresenter.closetNames = closetNames;
				closetFormPresenter.closetItems = closetItems;
				closetFormPresenter.closetItemsMapping = closetItemsMapping;
				closetFormPresenter.markUsersClositItems();
			});		
		}
	},
	
	showClosetForm: function(el){
		if(!firebase.isLoggedIn){
			Messenger.info("Please login or sign up to add items to your closet!");	
		}else{
			if(closetFormPresenter.closetNames == null){
				closetFormPresenter.getClosetInfo();
			}			
			
			var element = el.currentTarget;					
			
			if($(element).parent().parent().find("form").length > 0){
				$(element).children(".hanger-plus").addClass("icon-white");
				$parent = $(element).parent().parent();
				$parent.children(".addToClosetForm").tooltip('destroy');
				$parent.children(".addToClosetForm").remove();
				$parent.children(".addTagForm").tooltip('destroy');
				$parent.children(".addTagForm").remove();
				$parent.children(".bottom").show();			
			}else{
				$(element).children(".hanger-plus").removeClass("icon-white");			
				var $checkboxes = $();		
				
				for(var i=0; i< closetFormPresenter.closetNames.length; i++){
					var $input = $("<input>").attr("type","radio").attr("name","closet").attr("value",closetFormPresenter.closetIds[i])
					                   .attr("closetName",closetFormPresenter.closetNames[i]);

					var index = closetFormPresenter.closetItems.indexOf($(element).children("img").attr("id").substring(7)); // hanger- = 7
					if(index >= 0 && index < closetFormPresenter.closetItemsMapping.length &&
						closetFormPresenter.closetNames[i] == closetFormPresenter.closetItemsMapping[index]){
						$input.attr("checked","checked");
					}	
				
					$checkboxes = $checkboxes.add(
						$("<div>").addClass("controls").append(
							$("<label>").addClass("radio").append( $input								
							).append($("<span>").html(closetFormPresenter.closetNames[i]))
						)
					);
				}		
				
				$(element).parent().next(".bottom").hide();
						
				$(element).parent().parent().append(
					$("<div>").addClass("addToClosetForm").append(
						$("<form>").append(
							$("<div>").addClass("controls").append(
								$("<label>").addClass("control-label").text("New Clositt: ").append(						
									$("<input>").attr("type","text").attr("name","newCloset").addClass("newCloset")
								)
							)
						).append(
							$("<div>").addClass("selectCloset").append($checkboxes)
						).append(
							$("<input>").attr("type","submit").css("display","none")				
						)
					)
				);
				
				var $closetForm = $(element).parent().parent().children(".addToClosetForm");
				
				$closetForm.tooltip({title:"Press Enter to add item",placement:"bottom"});
				$closetForm.show();
			}
		}
	},	
	
	addToCloset: function(el){
		el.preventDefault();								
		var sku = $(el.currentTarget).parent().parent().prev().find("a").attr("pid");
		
		var closetName = $(el.currentTarget).find('input[name="newCloset"]').val();
		var closetId = $(el.currentTarget).find('input[name="closet"]:checked').val();				
		
		if(closetName.trim().length > 0){
			closetName = closetName.trim();
			closetId = new Date().getTime();			
			firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(closetId).child("name").set(closetName);		
		}else if(closetId != null){		  
		    closetName = $(el.currentTarget).find('input[name="closet"]:checked').attr("closetName").trim();
		}
		
		if (closetName.length > 0){				
			var index = closetFormPresenter.closetItems.indexOf(sku);
			
			if(index < 0 || closetFormPresenter.closetItemsMapping[index] != closetName){			
			 
				firebase.$.child(firebase.userPath).child(firebase.userid).child("closets").child(closetId).child("items").push(sku, function(error) {
				  if (error) {
						Messenger.error('Closet could not be saved. ' + error);
				  } else {
						Messenger.success('This item was added to "' + closetName + '"');
						closetFormPresenter.showClosetForm(el);
						closetFormPresenter.updateClosetCount(sku);																		
				  }
				});
			}else{
				Messenger.success('This item is already in your closet "' + closetName + '"');
			}
		}				
		
		return false;
	},
	
	markUsersClositItems: function(){
		if(closetFormPresenter.closetItems != null && firebase.isLoggedIn){
			var $closetItems = $("#hanger-" +  closetFormPresenter.closetItems.join(", #hanger-") );
			$closetItems.attr("src",closetFormPresenter.darkHangerImg);
			$closetItems.parent().tooltip('destroy');
			$closetItems.parent().tooltip({title:"In my Closet"});	
		}
	},
	
	updateClosetCount: function(sku){
	   
	 	firebase.$.child("clositt/products/"+sku+"/cc").transaction(function(value) {
	 	   var newValue = 1;
	 	   
	 	   if(value == null){		 	       
	 	       firebase.$.child("clositt/products/"+sku+"/cc").set(newValue);
	 	   }else{
	 	        newValue = value +1;		 	        
	 	   } 		 	            
	 	   
	 	   //targetOutfit.find(".numReviews").text(newValue);
	 	   return newValue;       
        });
	}
}

var colorPresenter = {
    
    init: function(){
      $(document).on("click",".colorFilter", colorPresenter.filterColor);
    },
    
    filterColor: function(el){
                
        if($(el.target).hasClass("selectedColor")){            
            $(".selectedColor").removeClass("selectedColor");            
        }else{
            $(".selectedColor").removeClass("selectedColor");
            $(el.target).addClass("selectedColor");            
        }
        
        filterPresenter.onFilterSelect();
    },
    
    getSelectedColors: function(){
        var selectedColors = [];
        
        $(".selectedColor").each(function(){
            var color = $(this).attr("data-original-title").toLowerCase();
            selectedColors.push(color);
        });
        
        return selectedColors;
    },        
    
    getColorNames: function(){
        var colorNames = [];
        
        for(var color in colorPresenter.allColors){
            colorNames.push(color); 
        }
        
        return colorNames;
    },
    
    getColorFilters: function(){
        var $colorPallet = $("<div>").attr("id","colorPallet");
        var $colorGroup = null;
        var i=0;
        var total = Object.keys(colorPresenter.allColors).length;
        
        for(var color in colorPresenter.allColors){            
            if (i % 4 == 0){
                $colorGroup = $("<div>").addClass("colorFilterGroup");
            }               
            
            $colorGroup.append(
                $("<div>").addClass("colorFilter").addClass(color.toLowerCase()).addClass(colorPresenter.getShadowPositionClass(i, total))
                    .attr("data-toggle","tooltip").attr("data-placement",colorPresenter.getTooltipPosition(i, total))
                    .attr("data-original-title",color).css("background-color",colorPresenter.allColors[color].h)
            );
            
            if (i % 4 == 3){
                $colorPallet.append($colorGroup);
            }
            i++;
        }
        
        setTimeout(function(){
            $(".colorFilter").tooltip();    
        },3000);        
        
        return $colorPallet;
    },
   
    getShadowPositionClass: function(i, total){
        var verticalPosition = "";  
        var horizontalPosition = "";        
        
        switch(i % 4){
            case 0:
               horizontalPosition = "left";
               break;
            case 1:
            case 2:
               horizontalPosition = "middle";
               break;
            case 3:
               horizontalPosition = "right";
               break;                   
        }
        
        switch(i){
           case 0:
           case 1:
           case 2:
           case 3:
               verticalPosition = "top";
               break;
           case total - 1:
           case total - 2:
           case total - 3:
           case total - 4:
               verticalPosition = "bottom";
               break;
        }
        
        var position = "";
        if (verticalPosition != "" && horizontalPosition != ""){            
            position = verticalPosition + "-" + horizontalPosition;
        }else if(verticalPosition != ""){
            position = verticalPosition;
        }else{
            position = horizontalPosition;
        } 
        
        return position;
    },
    
    getTooltipPosition: function(i, total){
        var position = "";  
        
        switch(i){
           case 0:
           case 1:
           case 2:
               position = "top";
               break;
           case total - 2:
           case total - 3:
           case total - 4:
               position = "bottom";
               break;              
        }
        
        if (position == ""){
            switch(i % 4){
                case 0:
                case 1:
                case 2:
                   position = "top";
                   break;
                case 3:
                   position = "right";
                   break;                   
            }
        }
        
        return position;                
    },
           
    allColors: {
        "Red": {          
            "h": "#f33",
            "r": 255,
            "g": 51,
            "b": 51
        },
        "Orange": {          
            "h": "#f93",
            "r": 255,
            "g": 153,
            "b": 51
        },    
        "Yellow": {          
            "h": "#ff0",
            "r": 255,
            "g": 255,
            "b": 0
        },    
        "Green": {          
            "h": "#3c3",
            "r": 51,
            "g": 204,
            "b": 51
        },    
        "Teal": {          
            "h": "#088",
            "r": 0,
            "g": 136,
            "b": 136
        },     
        "Blue": {          
            "h": "#00F",
            "r": 0,
            "g": 255,
            "b": 255
        },    
        "Purple": {          
            "h": "#939",
            "r": 153,
            "g": 51,
            "b": 153
        },       
        "Pink": {          
            "h": "#ff98bf",
            "r": 255,
            "g": 152,
            "b": 191
        },    
        "White": {         
            "h": "#f0f0f0",
            "r": 255,
            "g": 255,
            "b": 255
        },        
        "Grey": {          
            "h": "#999",
            "r": 153,
            "g": 153,
            "b": 153
        },    
        "Black": {
            "h": "#000",
            "r": 0,
            "g": 0,
            "b": 0
        },
        "Brown": {
            "h": "#963",
            "r": 153,
            "g": 102,
            "b": 51
        }    
    }           
}














    
    