<?php require_once(dirname(__FILE__) . '/scripts/php/session.php'); ?>		
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
<style type="text/css">
.typeahead {
    font-size: 14px;
}

.feedCloset{     
     position: relative;
     width: 200px;   
}

.feedClosetName{
    height: 90px;       
    position: relative;
}

.closetName{
    bottom: 0;
    position: absolute;
    text-align: center;
    width: 100%; 
}

#Search {
    margin-left: 0;
}

.feedCloset .bottom > div {
    display: inline;
    padding: 0 12px;
    position: relative;
    top: 20px;
    cursor: pointer;
}

.feedCloset .bottom > div:hover {
    color: #008800;
}

.feedClosetItems{
    background-color: #FFFFFF;
    position: absolute;
    top: 355px;
    width: 100%;   
}

.noOutfits{
    left: 300px;
    position: absolute;
    top: 150px;   
}
</style>
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="left-nav" style="display:none;"></div>

<div id="wrapper">

    <div class="search" id="Search" style="display:none;">
      	<form id="search-form">
      		<div class="form-search input-append">
      		    <div id="seach-bar-icon"><img src="css/images/Search.png" /></div>
      			<input id="search-bar" placeholder="Search for a user or brand" class="input-xxlarge search-query" autocomplete="off"/>
      			<button id="search-clear-btn" style="display:none;" class="close">&times;</button>      			
      		</div>
      		<input type="submit" style="display:none;" />
      	</form>
    </div>
    
    <div id="main-content" class="container main-container">
        <!-- <div id="loadingMainContent"><img src="css/images/loading.gif"/></div> -->
        <div id="feed-grid"></div>
    </div>
</div>

<br><br><br><br>

<div id="feedSettings-toggle" class="clositt-green" style="display:none">Edit Feed</div>
<div id="feedSettings-float" style="display:none;">
</div>


<?php include(dirname(__FILE__) . '/static/footer.php');   ?>

<script src="<?php echo HOME_ROOT; ?>scripts/js/pagePresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/productPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/gridPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/gridEvents.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/closetPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/filterPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/reviewsPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>scripts/js/tagPresenter.js"></script>
<script src="<?php echo HOME_ROOT; ?>lib/javascript/typeahead.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {	
	
	pagePresenter.init();
    productPresenter.populateStore(closetSearchController.init);	
    feedPresenter.init();
    gridEvents.init();
    tagPresenter.init();	
	reviewsPresenter.init();
    window.scrollTo(0, 0);	
});

function loggedIn(){
    feedPresenter.getFeeds(feedPresenter.getItemsFromFeeds);
    $("#feedSettings-toggle").show();
    $(window).scroll(feedPresenter.handleScrollEvent);
    closetFormPresenter.getClosetInfo(); 
}

$("#subheader-navbar li a").removeClass();
$('#subheader-navbar li a[href="feeds.php"]').addClass("active");

</script>
<script>
var closetSearchController = {
      typeaheadOptions: null,
      currentClosetsUser: null,
      currentClosetsName: null,
  
      init: function(){
            $("#search-bar").on("keyup", closetSearchController.showClearBtn);
            $("#search-bar").on("keypress", closetSearchController.searchOnEnter);
            $("#search-form").submit(closetSearchController.search);
    		$("#seach-bar-icon").on("click", closetSearchController.searchBarSubmit);
    		$("#search-clear-btn").click(closetSearchController.clearSearch); 
    		$(document).on("mouseenter",".feedCloset", gridEvents.showOverlay)
    		           .on("mouseleave",".feedCloset", gridEvents.hideOverlay);
    		           
    		$(document).on("click",".feedViewCloset", closetSearchController.showClosetItems);
    		$(document).on("click",".addClosetToFeed", closetSearchController.addClosetToFeed);
    		$(document).on("mousedown",".carousel-left", closetPresenter.leftAnimation);
    		$(document).on("mousedown",".carousel-right", closetPresenter.rightAnimation);
    		$(document).on("mouseup",".carousel-left", closetPresenter.stopCarouselLeft);
    		$(document).on("mouseup",".carousel-right", closetPresenter.stopCarouselRight);
    		
    		$('#search-bar').typeahead({
                  minLength:2,
                  items: 8,
                  updater: function (item) {                 
                        $('#search-bar').val($(item).text());
                        closetSearchController.getUserClosets(item);
                  },
                  source: function (query, callback) {
                        closetSearchController.getUserList(query, callback, 8);   
                  }
            });            
      },         
      
      getUserClosets: function(item){
            var user = $(item);
            var userid = user.attr("user");
            
            firebase.$.child(firebase.userPath).child(userid).once('value',function(userdata){
                closetSearchController.currentClosetsUser = userid;
                closetSearchController.currentClosetsName = userdata.child("name").val();
                closetSearchController.showClosets(userdata.child("closets").val());
            });
      },
      
      getUserList: function(query, callback, maxItems){
            var searchString = query.toLowerCase();
            
    		firebase.$.child(firebase.userPath).once('value',function(users){
    		      var matchingUsers = [];
    		      var count = 0;
    		      
    		      users.forEach(function(userid){
    		          var user = userid.val();
    		          
    		          if(user.email.toLowerCase().indexOf(searchString) == 0 || user.name.toLowerCase().indexOf(searchString) == 0){
    		              matchingUsers.push('<span user="'+userid.name()+'">' + user.name + " &lt;" + user.email + "&gt;</span>");
    		              count++;
    		              
    		              if (count >= maxItems){
    		                  callback(matchingUsers);
    		                  return true;
    		              }
    		          }
    		      });
    		      
    		      callback(matchingUsers);
    		});
      },
      
      showClosets: function(closets){
            $("#feed-grid").children().remove();
            
            var columns = gridPresenter.getDefaultColumns();
            var i = 0;
                    
            for (var closetid in closets){
                var closet = closets[closetid];    
                var sku = closet.items[Object.keys(closet.items)[0]];
                var item = productPresenter.clothingStore[sku];
                var row = Math.floor(i / columns);                                
                
                $("#feed-grid").append(
                    closetSearchController.getClosetTemplate(closetSearchController.currentClosetsUser, closetid, closet.name, item.i, row)
                );         
                
                i++;
                if (i % columns == 0){
                    $("#feed-grid").append(
                       $("<div>").attr("id","feedClosetItems-" +row).addClass("feedClosetItems").attr("row",row).attr("ignore","true").css("display","none")
                   );
                }
            }
            
            // add after last item
            if (i % columns != 0){
                $("#feed-grid").append(
                    $("<div>").attr("id","feedClosetItems-" + Math.floor((i-1) / columns)).addClass("feedClosetItems").attr("row",row).attr("ignore","true").css("display","none")
                );
            }
            
            gridPresenter.alignGrid("feed-grid", columns, 200, 270, 25, 65);	
      },
      
      showClosetItems: function(el){
            var closet = $(el.currentTarget).parents(".feedCloset");
            var closetRef = closet.attr("ref");
            var row = parseInt(closet.attr("row"));
            $("#feedClosetItems-" +row).children().remove();
            $('.feedCloset[row='+row+']').find(".feedViewCloset").text("View Clositt");
            $('.feedCloset[row='+row+']').find(".overlay").removeClass("alwaysVisible");
            $('.feedCloset[row='+row+']').find(".arrow-down").remove();

            // move other rows             
            var rowsBelow = $(".feedCloset, .feedClosetItems").filter(function() {
                return  $(this).attr("row") > row;
            });
            
            if (closetRef == $("#feedClosetItems-" +row).attr("activeRef")){
                $("#feedClosetItems-" +row).hide();                 
                 rowsBelow.animate({top:'-=285'},500);
                 $("#feedClosetItems-" +row).attr("activeRef", "");                 
            }else{
                 var topPosition = parseInt($("#feedClosetItems-" +row).prev().css("top")) + 370;
                 $("#feedClosetItems-" +row).css("top",topPosition);                 
                 
                 if($("#feedClosetItems-" +row).attr("activeRef") == null || $("#feedClosetItems-" +row).attr("activeRef") == ""){
                     rowsBelow.animate({top:'+=285'},500);
                 }
                 
                 firebase.$.child(firebase.userPath).child(closetSearchController.currentClosetsUser).child("closets")
                            .child(closetRef).once('value',function(closetSnapshot){
                     closetPresenter.getClosetTemplate("feedClosetItems-" +row, closetSnapshot, false);
                 });
                                  
                 $("#feedClosetItems-" +row).show();
                 $("#feedClosetItems-" +row).attr("activeRef", closetRef);
                 closet.find(".feedViewCloset").text("Hide Closet"); 
                 $('.feedCloset[row='+row+']').find(".overlay").hide();
                 closet.find(".overlay").addClass("alwaysVisible");
                 closet.find(".overlay").after($("<div>").addClass("arrow-down"));                 
                 closet.find(".overlay").show();
            }
      },
      
      getClosetTemplate: function(userid, closetid, closetName, image, row){
            var rand = Math.floor(Math.random() * 3) + 1;
			var textColor = rand > 1 ? 'orange' : rand > 0 ? 'red' : '';        
        
            var html ='<div class="feedCloset" row="'+row+'" ref="'+closetid+'">';
                html += '<div class="feedClosetName"><h1 class="closetName"><span class="'+textColor+'">'+ closetName +'</span></h1></div>';
				html +='<div class="picture"><img src="' + image + '" /></div>';							
				html +='<div class="overlay">';
					html +='<div class="bottom">';										
						html +='<div class="feedViewCloset">View Clositt</div>';
						html +='<div class="addClosetToFeed">Add Feed</div>';
					html += '</div>';
				html += '</div>';
				html += '<div class="clear"></div>';				
			html +='</div>';
			
			return $(html);
      },
      
      addClosetToFeed: function(el){
            var closet = $(el.currentTarget).parents(".feedCloset");
            var closetRef = closet.attr("ref");
            var closetName = closet.find(".closetName").text();  
            
                      
            firebase.$.child(firebase.userPath).child(firebase.userid).child("feeds/main")
                .child(closetSearchController.currentClosetsUser).child("username")
                .set(closetSearchController.currentClosetsName, function(error){
            
                    if (error){
                        Messenger.error("There was a problem saving that closet to your feed");   
                    }else{
                        firebase.$.child(firebase.userPath).child(firebase.userid).child("feeds/main")
                            .child(closetSearchController.currentClosetsUser).child("closets")
                            .child(closetRef).set(closetName,function(error){
                        
                            if(error){
                                Messenger.error("There was a problem saving that closet to your feed!");   
                            }else{
                                Messenger.success("Closet \"" + closetName + "\" was added to your feed!");   
                            }
                        });  
                    }
            });
      },
      
      searchOnEnter: function(el){        
            // on enter button
            if (el.which == 13) {
                closetSearchController.searchBarSubmit(el);
            }
      },
        
      searchBarSubmit: function(el){
    		el.preventDefault();
    		var searchTerm = $( "#search-bar" ).val().trim();
    				
    		if (searchTerm == ''){
    		      Messenger.info("Enter a user's name or email address to search");
    		}else{
    		      closetSearchController.search();  
    		}		
      },
          
      showClearBtn: function(){
            if(!$("#search-clear-btn").is(":visible") && $("#search-bar").val().trim().length > 0){
                $("#search-clear-btn").show();       
            }
      },  
      
      clearSearch: function(el){
    		el.preventDefault();
    		$( "#search-bar" ).val("");
    		$("#search-clear-btn").hide();		
      }		
};


var feedPresenter = {
    
    feedStore: null,
    feedItemStore: null,
    productIndex: 0,
    isEditingFeedMode: false,
 
    init: function(){
        $(document).on("click","#feedSettings-toggle", feedPresenter.toggleFeedListing);
        $(document).on("click",".removeClosetFeedBtn", feedPresenter.removeClosetFromFeed);      	    
    },
    
    handleScrollEvent: function(){
        feedPresenter.showContent(15);
    },
    
    getItemsFromFeeds: function(){
        var closets = feedPresenter.feedStore;
                              
        firebase.$.child(firebase.userPath).once('value', function(users){
            feedPresenter.feedItemStore = {};
            
            for(var i=0; i < closets.length; i++){
                users.child(closets[i].owner).child("closets").child(closets[i].closetid).child("items").forEach(function(item){
                     var product = productPresenter.clothingStore[item.val()];
                     product['owner'] = closets[i].ownername;
                     product['closet'] = closets[i].closetname;
                     
                     feedPresenter.feedItemStore[item.val()] = product;
                });
            }      
            
            feedPresenter.productIndex = 0;
            feedPresenter.showContent(15);
        });               
    },      
    
    showContent: function(numElements){
        if(!feedPresenter.isEditingFeedMode){
        
      		var lastHeight = $("#feed-grid").children("div[aligned=true]").last().css("top");
      		
      		if(lastHeight == undefined || lastHeight == null || lastHeight.trim() == ""){
      			lastHeight = 0;
      		}else{
      			lastHeight = parseFloat(lastHeight,10);	
      		}
      		
      		if(lastHeight <= ($(window).height() + $(window).scrollTop() + 125)){			
      			
      			if(feedPresenter.feedItemStore != null && Object.keys(feedPresenter.feedItemStore).length > 0){							
      				var $items = $();
      				var el=feedPresenter.feedItemStore;
      				var index = feedPresenter.productIndex;
      				
      				for(var i = index; i < index + numElements;i++){					
      					if(el[Object.keys(el)[i]] != null){
      						var html = productPresenter.getProductTemplate(Object.keys(el)[i]).css("position","absolute").css("left","-9999px");
      						$items = $items.add(html);
      					}
      				}
      				
      				feedPresenter.productIndex += numElements;				
      				$("#feed-grid").append($items);								
      				gridPresenter.alignDefaultGrid("feed-grid");
      				$("#loadingMainContent").hide();	
      			
      			}else if($(".noOutfits").length <= 0){			    
      			    $("#feed-grid").append($("<div>").addClass("noOutfits").text("There are no closets in your feed! To add closets into your feed click on the \"Edit Feed\" button on the left."));   
      			}		
      		}
        }
	},
    
    getFeeds: function(callback){
                
        firebase.$.child(firebase.userPath).child(firebase.userid).child("feeds/main").on('value', function(feeds){
            var allFeeds = [];
            
            feeds.forEach(function(feed){
               var username = feed.child("username").val();
               var user = feed.name();
               
               feed.child("closets").forEach(function(closet){
                    var item = {"owner": user, "ownername": username, "closetid":closet.name(), "closetname": closet.val()};                    
                    allFeeds.push(item);
               });
            });
            
            feedPresenter.feedStore = allFeeds;
            
            if (typeof callback == 'function'){
                callback();   
            }
        });
     },
    
    feedSettingsShowClosetSearch: function(){
        if (!$("#Search").is(":visible")){
            $("#Search").show();
            $("#feed-grid").children().remove();        
        }
    },
    
    feedSettingsHideClosetSearch: function(){
        if ($("#Search").is(":visible")){
            $("#Search").hide();
            $("#feed-grid").children().remove();        
        }
    },
    
    showFeedSettingsPanel: function(){
                
        if(!feedPresenter.isEditingFeedMode){
            $("#feedSettings-float").show('slide',1000);	 	 
     	 	$("#feed-grid").animate({left: '100px'}, 1000);
     	 	$("#feedSettings-toggle").animate({left: '165px'}, 1000);
     	 	$("#feedSettings-toggle").text("Show Feed");
     	 	$("#feed-grid").css("top","0px");
     	 }
    },
    
    hideFeedSettingsPanel: function(){     		
     	 	 	     		 
     	 if(feedPresenter.isEditingFeedMode){
     	    $("#feedSettings-float").hide('slide',1000);
     	 	$("#feed-grid").animate({left: '0px'}, 1000);
     	 	$("#feedSettings-toggle").animate({left: '-37px'}, 1000);
     	 	$("#feedSettings-toggle").text("Edit Feed");
     	 	$("#feed-grid").css("top","100px");
     	 } 		
     },
     
     toggleFeedListing: function(){
         if(!feedPresenter.isEditingFeedMode){            
            
            if ($("#feedSettings-float").attr("ready") != "true"){
               feedPresenter.getFeeds(feedPresenter.showFeedsInSettingsPanel);
            }else{                          
               feedPresenter.showFeedSettingsPanel();
               feedPresenter.feedSettingsShowClosetSearch();
            }
         }else{
            feedPresenter.hideFeedSettingsPanel();
            feedPresenter.feedSettingsHideClosetSearch();
            feedPresenter.getFeeds(feedPresenter.getItemsFromFeeds);                        
         }
         
         feedPresenter.isEditingFeedMode = !feedPresenter.isEditingFeedMode;
     },               
     
     showFeedsInSettingsPanel: function(){
        var listing = $("<ul>");
        var closets = feedPresenter.feedStore;
        
        if(closets.length > 0){
            for(var i=0; i < closets.length; i++){
                listing.append(
                    $("<li>").addClass("feedListing").append(
                        $("<span>").addClass("feedListingOwner").attr("owner",closets[i].owner).text(closets[i].ownername)
                    ).append(
                        $("<span>").addClass("feedListingSpacer").text(" - ")
                    ).append(
                        $("<span>").addClass("feedListingCloset").attr("closet",closets[i].closetid).text(closets[i].closetname)
                    ).append(
                        $("<button>").addClass("close removeClosetFeedBtn").text("x")                    
                    )
                );   
            }
        }else{
            listing.append($("<li>").addClass("feedListing").text("Search for a user or brand to add a new feed"));
        }
        
        $("#feedSettings-float").html("");
        $("#feedSettings-float").append($("<h4>").text("Feed"));
        $("#feedSettings-float").append(listing);
        $("#feedSettings-float").attr("ready","true");
        feedPresenter.showFeedSettingsPanel();
        feedPresenter.feedSettingsShowClosetSearch();
     },
     
     removeClosetFromFeed: function(el){
            var closetid = $(el.currentTarget).siblings(".feedListingCloset").attr("closet");
            var closetname = $(el.currentTarget).siblings(".feedListingCloset").text();
            var owner = $(el.currentTarget).siblings(".feedListingOwner").attr("owner");
            var ownername = $(el.currentTarget).siblings(".feedListingOwner").text();
            
            firebase.$.child(firebase.userPath).child(firebase.userid).child("feeds/main")
                .child(owner).child("closets").child(closetid).remove(function(error){
                    if(error){
                        Messenger.error("There was a problem removing that closet from your feed!");   
                    }else{
                        Messenger.success(ownername + "\'s Closet \"" + closetname + "\" was removed from your feed!");   
                    }
            });
     }     
}

</script>
</body>
</html>
