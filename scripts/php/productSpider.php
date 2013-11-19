<!DOCTYPE>
<html>
<head>
<?php 
require_once(dirname(__FILE__) . '/../../globals.php');
include(dirname(__FILE__) . '/../../static/meta.php');   
?>
<style type="text/css">
.company{
	margin: 0 0 20px 5px;	
}

.customer{
	margin-left:15px;
	color: #999;
}

.category{
	margin-left:25px;	
}

input{
	margin-right:5px !important;	
}

#saveProducts input{
	height: 30px !important;	
}

body{
	margin: 20px;
	font-size:16px;	
}

#sample-grid-container{
    left: 300px;
    position: absolute;
    top: 100px;
    width: 900px;   
}
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
<br><br><h2>Product Genie</h2><br>
<div id="links"><img src="../../css/images/loading.gif" style="height:50px;"/></div>
<button id="selectall">Select All</button>
<button id="deselectall">Deselect All</button><br><br>
<button onclick="testProductsFromLinks()">Test Category</button>
<button onclick="getProductsFromLinks()">View Category Data</button>
<button onclick="testProductsFromLinks(true)">View Sample Products</button><span> (1 store at a time)</span><br><br>
<button onclick="getProductsFromLinks(true)">Get Products and Save</button>
<br><br>
<p>*** <a href="preload.php">UPDATE WEBSITE WITH NEW PRODUCTS</a> ***</p>
<p>*** <a href="colorProcessor.php">UPDATE NEW PRODUCT COLORS</a> ***</p>


<hr>
<h2>Add New Product Page Link:</h2>
<form class="form-horizontal" id="saveProducts">
	    <div class="control-group">
	   		<label class="control-label" for="inputCompany">Company</label>
		    <div class="controls">
		    	<!--<input type="text" id="inputCompany" placeholder="Company" class="input-xxlarge" name="company" required>-->
		    	<select id="inputCompany" name="company">
		    	
				  <option value="american apparel">American Apparel</option>
				  <option value="ann taylor">Ann Taylor</option>
				  <option value="anthropologie">Anthropologie</option>
				  <option value="athleta">Athleta (json link)</option>
				  <option value="banana republic">Banana Repulic (json link)</option>
				  <option value="bcbg">BCBG</option>
				  <option value="bloomingdales">Bloomingdales</option>
				  <option value="brooks brothers">Brooks Brothers (json link)</option>
				  <option value="charles tyrwhitt">Charles Tyrwhitt</option>				  
				  <option value="gap">Gap (json link)</option>
				  <option value="h&m">H&M (json link)</option>
				  <option value="intermix">Intermix (json link)</option>
				  <option value="j crew">JCrew</option>
				  <option value="loft">Loft</option>
				  <option value="lord and taylor">Lord And Taylor</option>				  
				  <option value="madewell">Madewell</option>
				  <option value="nordstrom">Nordstrom</option>
				  <option value="old navy">Old Navy (json link)</option>				  
				  <option value="piperlime">Piperlime (json link)</option>
				  <option value="tory burch">Tory Burch</option>	  				  
				  <option value="urban outfitters">Urban Outfitters</option>
				  <option value="zara">Zara</option>
				</select> 
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputAudience">Target Consumers</label>
		    <div class="controls">
		   		<input type="text" id="inputAudience" placeholder="Target Consumers (i.e. Women, Men, Boys, Girls, etc...)"  class="input-xxlarge"  name="consumer" required>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputCategory">Category</label>
		    <div class="controls">
		   		<input type="text" id="inputCategory" placeholder="Category (i.e. Dresses, Pants, Shoes, Hats, etc...)" class="input-xxlarge" name="category" required>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputLink">Link to Products Page</label>
		    <div class="controls">
		   		<input type="text" id="inputLink" placeholder="Link to Products Page" name="link" class="input-xxlarge" required>
		    </div>
	    </div>
	    <div class="control-group">
		    <div class="controls"> 
		    	<button class="btn" id="save">Save</button>
	    	</div>
	    </div>
    </form>
<hr>

<div id="main-workspace" style="display:none;"></div>
<div id="json-output" style="display:none;"></div>
<div id="sample-grid-container"><div id="sample-grid"></div></div>

<?php include(dirname(__FILE__) . '/../../static/footer.php');   ?>

<!--<script src="/lib/javascript/jquery-1.7.2.min.js"></script>-->
<!--<script src='https://cdn.firebase.com/v0/firebase.js'></script>-->
<?php echo CLOSITT_JS; ?>
<script src="../js/storeApi.js"></script>
<script src="../js/productSpider.js"></script>
<script type="text/javascript">
firebase.init();

setTimeout(function(){
if(firebase.userid == null){
	alert("You must be logged in to save products. Go back to the login page and then come here.");
}
},7000);
$(document).ready(function() {	
	$.getJSON("../js/json/storeLinks.json", function(json){
		getLinks(json);	
	});
});	
	
</script>
</body>
</html>
