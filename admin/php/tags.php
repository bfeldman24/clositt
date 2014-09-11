<!DOCTYPE>
<html>
<head>
<title>Tags Admin</title>

<?php 
require_once(dirname(__FILE__) . '/../../app/globals.php');
require_once(dirname(__FILE__) . '/../../static/meta.php');   
?>

<style type="text/css">
body{
	font-size:16px;	
}

#mainContent{
  padding: 20px;      
}

#seach-bar-icon {
    cursor: pointer;
    display: block;
    height: auto;
    left: auto;
    padding: 5px 10px;
    position: relative;
    top: auto;
    width: 100%;
    z-index: 10;
}

#gototop{
    bottom: 10px;
    position: fixed;
    right: 10px;
    z-index: 9999;   
}

#clear{
    bottom: 10px;
    position: fixed;
    left: 10px;
    z-index: 9999;      
}

.tagtable tr, .tagtable tr td{
    height: 22px;
    font-size: 11px;
    padding: 0;
    margin: 0;   
    white-space: nowrap;
}

#tagTable input {
    margin-right: 5px;   
}

.productActions {
    min-height: 30px;
    height: auto;
}

.overlay .productActions {
    min-height: 30px;
    height: auto;
}

.approvePrevious, .remove, .removePrevious, .approveTag{
    margin-bottom: 5px;   
}

.h2tag{
    display: inline-block;
    margin: 0;
    padding: 0;
    position: relative;
    top: 5px;
    width: 85px;   
}

.price{
    font-size: 80%;   
}

#product-grid .outfit{
    margin: 0;    
}

#product-grid .picture{
    height: auto;
    width: auto;
}

#product-grid .outfit, .bottom-block, .overlay > .bottom{
    width: 100px;   
}

.overlay > .bottom{
    z-index: 999;   
}

.overlay > .bottom > .name {
    font-size: 8pt;
}

.productActions .btn {
    border-radius: 3px !important;
    font-size: 12px !important;
    line-height: 1.5 !important;
    padding: 1px 5px !important;
}

#loadingMask{
    background: none repeat scroll 0 0 rgba(70, 70, 70, 0.8);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;   
} 

#loadingMask img{
    height: 50px;
    left: 48%;
    position: fixed;
    top: 48%;
    width: 50px;   
}

.approved{
    color: #AAA;
    margin: 0 10px;
}

.name{
    cursor: pointer;   
}

.name:hover{
    color: #428bca;   
}

.modal-title {    
    text-transform: uppercase;
}

.modal-store-title{
    color: #428bca;   
}

.modal-product-name{
    color: #444;   
}
</style>

</head>
<body>
<div id="mainContent">
    <a href="#" name="top" id="top"></a>
    <div class="row" style="display:none;">
        <div class="col-xs-12 col-sm-8">
            <input type="text" class="form-control" id="search-bar"></input>
        </div>
        <div class="col-xs-12 col-sm-4">
            <div class="btn btn-success" id="seach-bar-icon">Search</div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12" style="margin: 5px 0 10px;">
            <h2 class="h2tag">Tags:</h2>
            <div class="btn-group tag-options" data-toggle="buttons">
              <label class="btn btn-primary">
                <input type="radio" name="options" id="all"> View All Tags
              </label>
              <label class="btn btn-primary active">
                <input type="radio" name="options" id="unapproved" checked="checked"> View Only Unapproved Tags
              </label>
            </div>

        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <div id="tagTable" ></div>                        
        </div>
    </div>
    <hr>
    
    <div id="main-workspace" style="display:none;"></div>    
    <div id="sample-grid-container">
        <div id="product-grid"></div>
        <div id="productSpinner" style="display:none;"><img src="../../css/images/loading.gif"/></div>
    </div>
    <a href="#top" id="clear">Clear Results</a>
    <a href="#top" id="gototop">Go To Top</a>    
</div>

<div id="loadingMask">
    <img src="../../css/images/loading.gif"/>
</div>


<?php echo CLOSITT_JS; ?>
<script type="text/javascript">

var tagAdmin = {
    tag: null,
    count: 0,
  
    init: function(){
        $("#clear").click(tagAdmin.clear);           
        $(document).on("change","#tagTable input:radio", tagAdmin.tagClicked);
        $(document).on("click", ".remove", tagAdmin.removeTag);
        $(document).on("click", ".removePrevious", tagAdmin.removePreviousTags);        
        $(document).on("click", ".approveTag", tagAdmin.approveTag);
        $(document).on("click", ".approvePrevious", tagAdmin.approvePrevious);                
        $(document).on("click",".tag-options label",tagAdmin.changeTagOptions);
        $(document).on("click",".name",tagAdmin.viewLargerImage);
        tagAdmin.getTags();
    },
    
    removeTag: function(e){
        var $product = $(e.currentTarget).parents(".outfit");
        var sku = $product.attr("pid");
        var company = $product.attr("company");
        var name = $product.attr("name");        
        
        $.post(window.HOME_ROOT + "t/removetag", {sku: sku, tag: tagAdmin.tag}, function(data){                
                
                if (data == "success"){
                    tagAdmin.count++;
                    Messenger.info("Removed the Tag! (" + tagAdmin.count + " total)");                 
                    $product.remove();
                }else{
                    Messenger.error("There was a problem removing that tag!");                 
                }
        });        
    },
    
    removePreviousTags: function(e){
        var $product = $(e.currentTarget).parents(".outfit");        
        var skus = [];        
        skus.push($product.attr("pid"));
        
        $product.prevAll().each(function(){
            skus.push($(this).attr("pid"));    
        });           
        
        var skipConfirmation = e.altKey || e.shiftKey || e.ctrlKey;                
        var result = false; 
        
        if (!skipConfirmation){
            result = confirm("Are you sure that you want to REMOVE the tag ["+tagAdmin.tag+"] for this product and all of the previous ones? \n(If you do not want to see this message again shift click next time)");
        }
        
        if (skipConfirmation || result) {
            $.post(window.HOME_ROOT + "t/removetags", {skus: skus, tag: tagAdmin.tag}, function(data){                 
                 
                 if (data == "success"){      
                    tagAdmin.count += skus.length;           
                    Messenger.info("Removed all " + skus.length + " Tags! (" + tagAdmin.count + " total)");                 
                    $product.prevAll().remove();
                    $product.remove();               
                 }else{
                    Messenger.error("There was a problem removing those tags!");                                     
                 }
            });
        } 
    },
    
    approvePrevious: function(e){
        var $product = $(e.currentTarget).parents(".outfit");        
        var skus = [];        
        skus.push($product.attr("pid"));
        
        $product.prevAll().each(function(){
            skus.push($(this).attr("pid"));    
        });           
        
        var skipConfirmation = e.altKey || e.shiftKey || e.ctrlKey;                
        var result = false; 
        
        if (!skipConfirmation){
            result = confirm("Are you sure that you want to APPROVE the tag ["+tagAdmin.tag+"] for this product and all of the previous ones? \n(If you do not want to see this message again shift click next time)");
        }
        
        if (skipConfirmation || result) {
            $.post(window.HOME_ROOT + "t/approvetags", {skus: skus, tag: tagAdmin.tag}, function(data){
                 
                 if (data == "success"){
                    tagAdmin.count += skus.length;                    
                    Messenger.info("Approved all " + skus.length + " Tags! (" + tagAdmin.count + " total)");                 
                    $product.prevAll().remove();
                    $product.remove();                
                 }else{
                    Messenger.error("There was a problem approving those tags!");                                     
                 }
            });
        }
    },
    
    approveTag: function(e){
        var $product = $(e.currentTarget).parents(".outfit");        
        var skus = [];        
        skus.push($product.attr("pid"));                         
        
        var skipConfirmation = e.altKey || e.shiftKey || e.ctrlKey;                
        
        $.post(window.HOME_ROOT + "t/approvetags", {skus: skus, tag: tagAdmin.tag}, function(data){            
            
            if (data == "success"){
                tagAdmin.count++;                    
                Messenger.info("Approved the Tag! (" + tagAdmin.count + " total)");                                 
                $product.remove();                
            }else{
                Messenger.error("There was a problem approving that tag!");                                     
            }
        });        
    },
    
    tagClicked: function(e){
        $("#productSpinner").show();
        tagAdmin.clearResults();
        searchController.isSearchActive = true;    
        gridPresenter.maxNumberOfPagesLoadingAtOnce = 1;
     
        tagAdmin.tag = $(e.currentTarget).val();
        tagAdmin.count = 0;
     
        if (tagAdmin.tag != null){
            searchController.hasMoreProducts = true;
            searchController.criteria = {};
            searchController.criteria.category = [];
            searchController.criteria.category.push(tagAdmin.tag);
            searchController.getProducts(searchController.showResults);
            $("#productSpinner").hide();     
        }
    },  
    
    clearResults: function(){
        gridPresenter.endTask();     	      	
	 	productPresenter.filterStore = null;	
	 	searchController.criteria = null;
	 	productPresenter.productIndex = 0;
        searchController.pageIndex = 0;
        gridPresenter.productIndex = 0; 	 		 	
        searchController.isSearchActive = false; 
        $("#product-grid").html("");   
    },          
  
    clear: function(el){        
        gridPresenter.maxNumberOfPagesLoadingAtOnce = -1; 
        tagAdmin.tag = null;
        $("#tagTable input").prop("checked",false);           
    },
    
    getTags: function(){
        $.post(window.HOME_ROOT + "t/getuniquetags", function(data){
   	          tagAdmin.clearResults();
   	          tagAdmin.clear();   
              
              var tags = JSON.parse(data);
              var tagsLength = Object.keys(tags).length;
              var table = [];  
              var colNum = 8;        
              var numRows = Math.ceil(tagsLength / colNum);            
   	          var i = 0;        
   
              for(var c=0; c < colNum; c++){
                     for(var r = 0; r < numRows; r++){
     			          if (i >= tagsLength){ break; }
     
     			          if (table[r] == null){
                               table[r] = [];
                     	  }	
                     	                       	  
                          table[r][c] = [];                     	  
     
                          var tag = Object.keys(tags)[i++];                          
     			          table[r][c]['tag'] = tag;
     			          table[r][c]['approved'] = parseInt(tags[tag]["approved"]);
     			          table[r][c]['total'] = parseInt(tags[tag]["approved"]) + parseInt(tags[tag]["unapproved"]);
     		        }
     		
     		        if (i >= tags.length){ break; }
               }
               
               var tagTable = $("<table>").addClass("tagtable table table-bordered table-striped table-hover table-condensed table-responsive");
               
               
               for(var r=0; r < table.length; r++){    		              
                   var row = $("<tr>");   
                   
                   for(var c=0; c < table[r].length; c++){
                       row.append(
                           $('<td>').append( 
                               $('<input>')
                                   .attr("type","radio")
                                   .attr("class","tagCheckbox")
                                   .attr("name","tags")
                                   .attr("value",table[r][c].tag)                                                                
                           ).append(
                               $("<span>").addClass("tagname").text(table[r][c].tag)
                           ).append(
                               $("<span>").addClass("approved").attr("title","Approved / Total").text("(" + table[r][c].approved + "/" + table[r][c].total + ")")
                           )
                           
                       )
                   }
                   
                   tagTable.append( row );    		                              
               }
               
               $("#loadingMask").hide();
               $("#tagTable").html(tagTable);
       });   
    },
    
    changeTagOptions: function(e){
        var active = $(e.currentTarget).parents(".tag-options").find(".active input");        
        var clicked = $(e.currentTarget).find("input"); 
        
        if (clicked != null && clicked.attr("id") == "all" && active.attr("id") != "all"){
            searchController.url = "spider/searchdb/";    
        }else{
            searchController.url = "spider/searchunapprovedtags/";      
        } 
        
        tagAdmin.clear();
    },
    
    viewLargerImage: function(e){
        var $outfit = $(e.currentTarget).parents(".outfit");
        var $image = $outfit.find(".picture img").clone();
        
        var $message = $("<div>").append(
                            $("<h2>").addClass("modal-store-title").text($outfit.attr("company"))
                         ).append(
                            $("<h2>").addClass("modal-product-name").text($outfit.attr("name"))
                        ).append($image);
        
        bootbox.dialog({
            message: $message,
            title: tagAdmin.tag,
            buttons: {  
                main: {
                    label: "Cancel"
                },              
                approve: {
                    label: "Approve Tag",
                    className: "btn-success",
                    callback: function() {                        
                        //tagAdmin.approveTag($outfit);
                        $outfit.find(".approveTag.btn").trigger("click");
                    },
                },
                reject: {
                    label: "Remove Tag",
                    className: "btn-danger",
                    callback: function() {                        
                        $outfit.find(".remove.btn").trigger("click");
                        //tagAdmin.removeTag($outfit);
                    },
                },                          
            }
        });
    }  
};


productPresenter.getProductTemplate = function(product){
    if (product == null || typeof(product) != "object" || tagAdmin.tag == null){      	
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
	var shortlink = product.sl;
	var price = product.p == null || isNaN(product.p) ? "" : "$" + Math.round(product.p);		 	
	var filterPrice = product.fp; 		 		
	var feedOwner = product.owner;
	var feedCloset = product.closet;
    var score = product.sc;
    var explainUrl = window.HOME_ROOT + '/admin/php/explain.php?sku=' + id + '&query=' + encodeURIComponent($( "#search-bar" ).val()).replace("#","").trim();
    var colors = product.co;

	var rand = Math.floor(Math.random() * 3) + 1;
	var shadow = "";
	if(rand == 1){
		shadow = 'shadow';	
	}		
		 			
	//var attr = 	'company="'+company+'" customer="'+audience+'" category="'+category+'" price="'+filterPrice+'"';
	var attr = 	''; //'company="'+company+'" customer="'+audience+'" category="'+category+'"';
	   var html ='<div class="outfit item '+shadow+'" '+attr+' pid="'+id+'" data-url="'+shortlink+'" company="'+company+'" name="'+name+'">';			        html += '<div class="picture"><img data-src="' + image + '" src="../../css/images/loading.gif"  onerror="return pagePresenter.handleImageNotFound(this)"/></div></a>';
			html += '<div class="bottom-block">';
			    //html +='<div class="companyName">' + company + '</div>';
				html +='<div class="price">' +  tagAdmin.tag + '</div>';
			html += '</div>';
			
			html +='<div class="overlay">';

			    html +='<div class="bottom">';

                    if(category !=undefined){
                        html += '<div class="productActions" >';                        
                            html += '<div class="approveTag btn btn-info">Approve Tag</div>';
                            html += '<div class="approvePrevious btn btn-info">Approve All Previous</div>';
                            html += '<div class="remove btn btn-danger">Remove Tag</div>';
                            html += '<div class="removePrevious btn btn-danger">Remove All Previous</div>';
                        html += '</div>';
                    }

					html +='<div class="name">' + name + '</div>';
				html += '</div>';
			html += '</div>';					
			html += '<div class="clear"></div>';				
		html +='</div>';
		
	return $(html);
};



$(document).ready(function() {  
    Messenger.init();  
    pagePresenter.init();
	gridPresenter.init();
	productPresenter.init();	
	tagPresenter.init();
	searchController.init();	
	reviewsPresenter.init();		
	tagAdmin.init();
	
	// Overrides:
	gridPresenter.maxNumberOfPagesLoadingAtOnce = -1;
    searchController.isSearchActive = true;
    searchController.url = "spider/searchunapprovedtags/";    
});	
</script>

</body>
</html>
