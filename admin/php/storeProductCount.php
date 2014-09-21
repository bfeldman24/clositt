<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../app/globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
?>
<style type="text/css">
body{
	font-size:16px;	
}

#mainContent{
  padding: 20px;      
}

li{
    list-style: decimal outside none;   
}

.company div{
	margin: 0 0 10px 5px;
	display: inline;
}

.companyName{
    color: #444;
}

.productCount{
    color: #44a;
    margin-left: 10px;  
    font-weight: bold; 
}

#totalProductCount{
    color: #44a; 
    font-weight: bold;    
}
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Store Product Count<span id="totalProductCount"></span></h2>
    
    <p>
        <div class="btn-group product-statuses" data-toggle="buttons">
            <label class="btn btn-primary active">
                <input type="radio" name="options" id="live" checked="checked"> Live Products
            </label>
            <label class="btn btn-primary">
                <input type="radio" name="options" id="nonlive"> Non Live/ Old Products
            </label>
        </div>
    </p>
    <p>
    <label for="amount">Filter By Product Count:</label>
    <input type="text" id="amount" style="border:0; color:#f6931f; font-weight:bold;">
    </p>
    <div id="slider-range"></div>
    
    <br><br>
    <ul id="links"><li id="loadingMask"><img src="../../css/images/loading.gif" style="height:50px;"/></li></ul>                                       
</div>

<?php include(dirname(__FILE__) . '/../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script src="../js/storeSelectors.js"></script>
<script type="text/javascript">
var StoreProductCount = {
    liveProducts: true,
    
    init: function(){
        $(document).on("click",".product-statuses label",StoreProductCount.changeProductStatus);
        StoreProductCount.getLiveProductCount();
    },
    
    getLiveProductCount: function(){
        StoreProductCount.liveProducts = true;
        $.getJSON( window.HOME_ROOT + "spider/storeproductcount", StoreProductCount.handleProductCount);  
    },
    
    getNonLiveProductCount: function(){
        StoreProductCount.liveProducts = false;
        $.getJSON( window.HOME_ROOT + "spider/storenonliveproductcount", StoreProductCount.handleProductCount);  
    },
    
    changeProductStatus: function(e){
        var active = $(e.currentTarget).parents(".product-statuses").find(".active input");        
        var clicked = $(e.currentTarget).find("input"); 
        
        if (clicked != null && clicked.attr("id") == "live"){
            StoreProductCount.getLiveProductCount();
        }else{
            StoreProductCount.getNonLiveProductCount();      
        } 

    },
    
    handleProductCount: function(data){
        $("#loadingMask").show();
        $("#links").html('');
        
        $.each( Companies, function( companyName, storeObject ) {    	   
            if (data[companyName] == null){
                data[companyName] = 0;
            }
       });
       
       var stores = Object.keys(data).sort();      
       var max = -1;
       var totalCount = 0;
        	
       for(var i=0; i < stores.length; i++){   	   
           var companyName = stores[i];
           var count = parseInt(data[companyName]);
           totalCount += count;
           
           if (count > max){
                max = count;
           }
        
           $("#links").append(
               $("<li>").addClass("company").attr("count",count).append(
                   $("<div>").addClass("companyName").html(companyName)
                ).append(                   
                   $("<div>").addClass("productCount").html(count)
                )
            );   
       }     
       
       var startingMinPos = StoreProductCount.liveProducts ? 0 : 5;
       var startingMaxPos = StoreProductCount.liveProducts ? 75 : max;
       var step = StoreProductCount.liveProducts ? 25 : 5;
       
       $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: max,
            step: step,
            values: [startingMinPos, startingMaxPos],
            slide: function( event, ui ) {
                $( "#amount" ).val( ui.values[0] + " - " + ui.values[1] );
                
                $filterStores = $(".company").filter(function(){
                    var count = parseInt($(this).attr("count"));
                    return count <= ui.values[1] && count >= ui.values[0];
                });
                
                $(".company").hide();
                $filterStores.show();
            }
        });
        
        $( "#amount" ).val( $("#slider-range").slider("values",0) + " - " + $("#slider-range").slider("values",1) );        
                
        $filterStores = $(".company").filter(function(){
            var count = parseInt($(this).attr("count"));
            return count <= startingMaxPos && count >= startingMinPos;
        });
        
        $(".company").hide();
        $filterStores.show(); 
        $("#totalProductCount").text(" - " + StoreProductCount.numberWithCommas(totalCount));
         
       $("#loadingMask").hide(); 
    },  
    
    numberWithCommas: function(x) {
       return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }  
};

    	    
    

$(document).ready(function(){
   StoreProductCount.init();
});
</script>
</body>
</html>
