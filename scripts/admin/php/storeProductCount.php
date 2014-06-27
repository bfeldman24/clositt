<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../../app/globals.php');
include(dirname(__FILE__) . '/../../../static/meta.php');   
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
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Store Product Count</h2>
    
    <p>
    <label for="amount">Filter By Product Count:</label>
    <input type="text" id="amount" style="border:0; color:#f6931f; font-weight:bold;">
    </p>
    <div id="slider-range"></div>
    
    <br><br>
    <ul id="links"><li id="loadingMask"><img src="../../../css/images/loading.gif" style="height:50px;"/></li></ul>                                       
</div>

<?php include(dirname(__FILE__) . '/../../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script src="../js/storeSelectors.js"></script>
<script type="text/javascript">
$(document).ready(function(){
   

    $.getJSON( window.HOME_ROOT + "spider/storeproductcount", function( data ) {
       
       $.each( Companies, function( companyName, storeObject ) {    	   
            if (data[companyName] == null){
                data[companyName] = 0;
            }
       });
       
       var stores = Object.keys(data).sort();
       var max = -1;
        	
       for(var i=0; i < stores.length; i++){   	   
           var companyName = stores[i];
           var count = parseInt(data[companyName]);
           
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
       
       $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: max,
            step: 25,
            values: [0, max],
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
         
       $("#loadingMask").hide();      	  
    });	    
    


});
</script>
</body>
</html>
