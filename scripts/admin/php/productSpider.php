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

.company{
	margin: 0 0 10px 5px;	
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

#saveProducts input, #editCategoryForm input{
	height: 30px !important;	
}

#sample-grid-container{
    left: 300px;
    position: absolute;
    top: 100px;
    width: 900px;   
}

#sample-grid .picture {
    border: 1px solid #CBCBCB;
    height: 270px;
    max-height: 400px;
    max-width: 300px;
    overflow: hidden;
    width: 200px;
}

.overlay .middle{
    background: none repeat scroll 0 0 rgba(239, 239, 239, 0.8);
    overflow: hidden;
    position: absolute;
    top: 100px;
    width: 200px;   
}

.customerName, .companyName{
    cursor: pointer;   
}

.removeCategory{ 
    margin-left:5px;
    font-size:12px;
    cursor: pointer;
}

.removeCategory:hover{ 
    color: #ccc;   
}

.actionButtons{
    background: linear-gradient(to bottom, #666666 0%, #111111 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
    bottom: 30px;
    padding: 7px 5px;
    position: fixed;
    width: 100%;}
    
.isvalid{
    font-size: 9px;   
}       

#loadingMask{
    background: none repeat scroll 0 0 rgba(70, 70, 70, 0.8);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;   
} 

#loadingMask img, #transparentLoadingMask img{
    height: 50px;
    left: 48%;
    position: fixed;
    top: 48%;
    width: 50px;   
}

#saveProducts .tagCheckbox, #editCategoryForm .tagCheckbox{
    height: 25px !important;
    margin-top: -3px !important;
}

.tags .label{
    margin-left: 3px;   
}

.modal {
    left: 500px;
    width: 1060px;
}

#signinModal{
    width: 460px;   
}

.modal-body {
    text-align: left;
}

.editCategory{
    margin: 0 0 0 5px;
    position: relative;
    top: 5px;   
    cursor: pointer;
}

.lastUpdated{
    font-size: 10px;
    margin: 0 2px 0 5px;   
}
</style>

</head>
<body>
<?php include(dirname(__FILE__) . '/../../../static/header.php');   ?>
<div id="mainContent">
    <a href="#" name="top"></a>
    <br><h2>Product Genie</h2>
    <div id="links"><img src="../../../css/images/loading.gif" style="height:50px;"/></div>        
    
    <hr>
    <a name="addCategoryForm"></a>
    <h2>Add New Category Link:</h2>
    <form class="form-horizontal" id="saveProducts">
    	    <div class="control-group">
    	   		<label class="control-label" for="inputCompany">Company</label>
    		    <div class="controls">
    		    	<!--<input type="text" id="inputCompany" placeholder="Company" class="input-xxlarge" name="company" required>-->
    		    	<select id="inputCompany" name="company">
    		    	
    				  <option value="American Apparel">American Apparel</option>
    				  <option value="American Eagle">American Eagle</option>
    				  <option value="Ann Taylor">Ann Taylor</option>
    				  <option value="Anthropologie">Anthropologie</option>
    				  <option value="Athleta">Athleta (json link)</option>
    				  <option value="Banana Republic">Banana Repulic (json link)</option>
    				  <option value="BCBG">BCBG</option>    				  
    				  <option value="Bloomingdales">Bloomingdales</option>
    				  <option value="Brooks Brothers">Brooks Brothers (json link)</option>
    				  <option value="Burberry">Burberry</option>
    				  <option value="Charles Tyrwhitt">Charles Tyrwhitt</option>
    				  <option value="Chicos">Chicos</option>
    				  <option value="Cusp">Cusp</option>
    				  <option value="Dillards">Dillards</option>
    				  <option value="Forever21">Forever21</option>				  
    				  <option value="Free People">Free People</option>
    				  <option value="Gap">Gap (json link)</option>
    				  <option value="H&M">H&M (json link)</option>
    				  <option value="Hollister">Hollister</option>
    				  <option value="Intermix">Intermix (json link)</option>
    				  <option value="JCPenney">JCPenney</option>
    				  <option value="J_Crew">J.Crew</option>
    				  <option value="J_Jill">J.Jill</option>
    				  <option value="Kate Spade">Kate Spade</option>
    				  <option value="Kohls">Kohls</option>
    				  <option value="Loft">Loft</option>
    				  <option value="Lululemon">LuLuLemon</option>				  
    				  <option value="Lord & Taylor">Lord And Taylor</option>	
    				  <option value="Macys">Macys</option>			      				  
    				  <option value="Madewell">Madewell</option>
    				  <option value="Michael Kors">Michael Kors</option>
    				  <option value="Neiman Marcus">Neiman Marcus</option>
    				  <option value="Nike">Nike</option>
    				  <option value="Nordstrom">Nordstrom</option>
    				  <option value="New York & Company">NY and Company</option>
    				  <option value="Old Navy">Old Navy (json link)</option>				  
    				  <option value="Piperlime">Piperlime (json link)</option>
    				  <option value="Target">Target</option>	  				  
    				  <option value="Top Shop">Top Shop</option>	  				  
    				  <option value="Tory Burch">Tory Burch</option>	  				  
    				  <option value="Urban Outfitters">Urban Outfitters</option>
    				  <option value="Zara">Zara</option>
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
    		    <label class="control-label" for="inputCategory">Url Title</label>
    		    <div class="controls">
    		   		<input type="text" id="inputCategory" placeholder="(i.e. Dresses, Pants, Shoes, Hats, etc...)" class="input-xxlarge" name="category" required>    		   		
    		    </div>
    	    </div>
    	    <div class="control-group">
    	       <label class="control-label">Categories</label>
    	       <div class="controls">
    				    <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Activewear"/>Activewear
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Blazers"/>Blazers
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Blouses"/>Blouses                                              
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Button Downs"/>Button Downs
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Capris"/>Capris
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Cardigans"/>Cardigans
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Cashmere"/>Cashmere
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Chinos"/>Chinos
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Coats"/>Coats
                        <br />
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Collared Shirts"/>Collared Shirts
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Denim"/>Denim
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Dress Pants"/>Dress Pants
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Dress Shirts"/>Dress Shirts
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Dresses"/>Dresses
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Evening Dresses"/>Evening Dresses
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Graphic T Shirts"/>Graphic T Shirts
                        <br />
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Henleys"/>Henleys
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Hoodies"/>Hoodies
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Jackets"/>Jackets
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Jeans"/>Jeans
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Jumpsuits"/>Jumpsuits
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Knit"/>Knit
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Leather"/>Leather
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Leggings"/>Leggings
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Loungewear"/>Loungewear
                        <br />
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Outerwear"/>Outerwear
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Pants"/>Pants
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Polos"/>Polos                        
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Shorts"/>Shorts
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Skirts"/>Skirts
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Skorts"/>Skorts
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Sleepwear"/>Sleepwear
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Sport Coats"/>Sport Coats
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Suits"/>Suits
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Sweaters"/>Sweaters
                        <br />
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Sweatpants"/>Sweatpants
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Sweatshirts"/>Sweatshirts
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="T Shirts"/>T Shirts
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Tank Tops"/>Tank Tops
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Trench Coats"/>Trench Coats
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Vests"/>Vests
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Zip Ups"/>Zip Ups
                        <input type="checkbox" class="tagCheckbox" name="categoryTag" value="Sale"/>SALE
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
    <h2>Workflow:</h2>
    <ol>
        <li><h3>Add new categories</h3>
            <ul>
                <li>Use the "Add New Product Page Link" form</li>
            </ul>
        </li>
        
        <li><h3>Test the categories (make sure the script works)</h3>
            <ul>
                <li>Check the category and click "Test Category" or "View Sample Products"</li>
                <li>If the link is "Broken" report it</li>
                <li>Verfiy that the amount of products are what you expect</li>
                <li>Verify that the image, name, and price are present and look correct</li>
                <li>(The "View Sample Products" button only works for one category at a time)</li>
            </ul>
        </li>
        <li><h3>Save the products found in the categories</h3>
            <ul>
                <li>Check the categories for which you want to save products</li>            
                <li>Click "Get Products and Save"</li>
                <li>All products that were previously saved from other categories will not be effected</li>
                <li>All products that were previously saved from your currently selected categories will be OVERRIDDEN</li>
                <li>Note: this action does not make the products live on the site</li>            
            </ul>
        </li>
        <li><h3>Update product colors</h3>
            <ul>
                <li>clik the link <a href="colorProcessor.php">UPDATE NEW PRODUCT COLORS</a></li>
                <li>This goes through all of the products that are saved, but are not live, detects the top 2 colors in the image, and stores them in a searchable format</li>
                <li>Note: this script can take a while to complete depending on the number of images it has to process</li>
            </ul>
        </li>
        <li><h3>Update website with all of the products that were saved thus far</h3>
            <ul>
                <li>Click the link "UPDATE WEBSITE WITH NEW PRODUCTS"</li>
                <li>This replaces all of the products that are live on the site with the products that are saved, but not live</li>
                <li>The also creates the lists for the filter options (Categories, Companies, etc)</li>
            </ul>
        </li>    
    </ol>
    
        <!--<p>*** <a href="preload.php">UPDATE WEBSITE WITH NEW PRODUCTS</a> ***</p>-->
    <br><br><br>
    
    <div id="main-workspace" style="display:none;"></div>
    <div id="json-output" style="display:none;"></div>
    <div id="json-products" style="display:none;"></div>
    <div id="sample-grid-container"><div id="sample-grid"></div></div>
    
</div>

<div class="actionButtons">
    <a href="#addCategoryForm" style="float: right; margin-right: 10px;"><button class="btn btn-danger btn-small">Upload Form</button></a>
    <a href="#top" style="float: right; margin-right: 10px;"><button class="btn btn-danger btn-small">Top</button></a>
    <button id="selectall" class="btn btn-small">Select All</button>
    <button id="selectallvalid" class="btn btn-small">Select Valid</button>    
    <button id="deselectall" class="btn btn-small">Deselect All</button>
    <button onclick="spider.testProductsFromLinks()" class="btn btn-primary btn-small">Test Category</button>
    <!--<button onclick="spider.testProductsFromLinks(true, false, false)" class="btn btn-primary btn-small">View Category Data</button>-->
    <button onclick="spider.testProductsFromLinks(false, true, false)" class="btn btn-primary btn-small" tooltip="(1 store at a time)">View Sample Products</button>    
    <button onclick="actionButtons.getTotalProductCount()" class="btn btn-info btn-small">Get Total Product Count</button>
    <button onclick="spider.testProductsFromLinks(false, false, true)" class="btn btn-success btn-small">Save Selected</button>
    <button onclick="actionButtons.saveAllValid()" class="btn btn-success btn-small">Save All Valid</button>                
</div>

<div id="loadingMask" style="display:none;" >
    <img src="../../../css/images/loading.gif"/>
</div>
<div id="transparentLoadingMask" style="display:none;" >
    <img src="../../../css/images/loading.gif"/>
</div>

<?php include(dirname(__FILE__) . '/../../../static/footer.php');   ?>

<?php echo CLOSITT_JS; ?>
<script src="../js/storeApi.js"></script>
<script src="../js/productSpider.js"></script>
<script type="text/javascript">

setTimeout(function(){
    if(firebase.userid == null){
    	Messenger.info("You must be logged in to save products.");
    	$("#signinModal").modal('show');  
    }
},7000);
	
</script>
</body>
</html>
