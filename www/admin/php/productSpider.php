<!DOCTYPE>
<html>
<head>
<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 
require_once(dirname(__FILE__) . '/../../../app/session.php');
include(dirname(__FILE__) . '/../../static/meta.php');   



$tags = array('Activewear',
'Basic','Blazers','Blouses','Boyfriend','Button Downs',
'Camisoles','Capris','Cardigans','Cashmere','Casual','Chinos','Coats','Cocktial Dresses','Collared Shirts','Crop Tops', 'Corduroy',
'Denim','Disco','Dress Pants','Dress Shirts','Dresses',
'Evening Dresses','Graphic T Shirts', 'Graphic Tank Tops',
'Flowing','Formal',
'Gowns', 
'Henleys','High Waisted','Hoodies',
'Jackets','Jeans','Jumpsuits',
'Khakis','Knee Length','Knee Length Dress','Knit',
'Leather','Leggings','Linen','Loose Fit','Long Sleeve Shirts','Long Sleeve Tops','Loungewear', 'Low Rise',
'Maxi','Maxi Dresses','Mid-length','Midi','Mini Dresses','Mini Skirts',
'Outerwear','Overalls',
'Pants','Pleats','Polos','Print','Printed','Prints and Stripes','Pullovers',
'Regular Fit','Rompers',
'Shirts','Shorts','Short Sleeve Shirts','Skater Dresses','Skinny','Skinny Jeans','Skirts','Skorts','Sleepwear','Sleeveless','Slim Fit','Sport Coats','Suits','Summer Dresses','Sweaters','Sweatpants','Sweatshirts',
'T Shirts','Tailored Fit','Tank Tops','Tennis Skirts','Trench Coats','Tunics',
'Vests',
'Zip Ups',
'Winter','Spring','Summer','Fall','SALE');


?>
<style type="text/css">
body{
	font-size:16px;	
	line-height: 1.42857;
}

h2 {
    font-size: 30px;
}

h1, .h1, h2, .h2, h3, .h3 {
    margin-bottom: 10px;
    margin-top: 20px;
}

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
    color: inherit;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
}

ul, ol {
    padding-left: 40px;
}

ol li {
    list-style: decimal outside none;
}

ul li{
     list-style: circle outside none;   
}

.wrapper {
    margin: 0;
    padding: 20px 0 0;
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

.overlay{
    display: block;   
}

.overlay .middle{
    background: none repeat scroll 0 0 rgba(239, 239, 239, 0.8);
    overflow: hidden;
    position: absolute;
    top: 100px;
    width: 198px;   
}

.overlay .middle .link, .overlay .middle .sku{
    font-size: 9px;
    word-wrap: break-word;   
}

.overlay > .bottom { 
    width: 198px;
}

.overlay > .bottom, .overlay > .topleft, .overlay > .topright { 
    left: 16px;
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
    background: none repeat scroll 0 0 #fff;
    border-top: 5px solid #66ccff;
    bottom: 0;
    padding: 7px 5px;
    position: fixed;
    width: 100%;
    z-index: 9999;
}
    
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
    font-size: 9px;  
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

.testCategoryLink{
    margin: 0 0 0 5px;
    position: relative;
    top: 5px;   
    cursor: pointer;
}

.lastUpdated{
    font-size: 10px;
    margin: 0 2px 0 5px;   
}

.tagtable tr, .tagtable tr td{
    height: 22px;
    font-size: 11px;
    padding: 0;
    margin: 0;   
    white-space: nowrap;
}

#save{
    width: 20%;   
}

#saveProducts .tagtable input, #editCategoryForm .tagtable input{
     height: 12px !important;   
}

.links{
    font-size: 10px;   
}

#brokenLinks{
    display:none;   
}

.viewlink {
    background: none repeat scroll 0 0 #f5f5f5;
    height: 75px;
    opacity: 0.7;
    overflow: hidden;
    position: absolute;
    top: 15%;
    width: 100%;
    text-align: center;
}

.viewlink .link {
    font-size: 10px;
}

ul.messenger.messenger-theme-block.messenger-fixed .messenger-message {
    padding: 2px;
}

</style>

</head>
<body>
<div class="wrapper">
    <?php include(dirname(__FILE__) . '/../../static/header.php');   ?>
    <div id="mainContent">
        <a href="#" name="top"></a>
        <br><h2>Product Genie</h2>
        <div id="links"><img src="../../css/images/loading.gif" style="height:50px;"/></div>        
        <div id="brokenLinks"></div>
        
        <hr>
        <a name="addCategoryForm"></a>
        <br/><br/>
        <h2>Add New Category Link:</h2>
        <form role="form" id="saveProducts">
            <div class="form-group">
                <label for="inputCompany">Company</label>
                <select id="inputCompany" name="company" class="form-control">              
                      <option value="7 For All Mankind">7 For All Mankind</option> 
                      <option value="Adidas">Adidas</option> 		    	
                      <option value="Aeropostale">Aeropostale</option>
          			  <option value="American Apparel">American Apparel</option>
          			  <option value="American Eagle">American Eagle</option>
          			  <option value="Ann Taylor">Ann Taylor</option>
          			  <option value="Anthropologie">Anthropologie</option>
          			  <option value="Armani">Armani</option>
          			  <option value="Athleta">Athleta (json link)</option>
          			  <option value="Balenciaga">Balenciaga</option>
          			  <option value="Banana Republic">Banana Repulic (json link)</option>
          			  <option value="Betsey Johnson">Betsey Johnson</option>
          			  <option value="BCBG">BCBG</option>    				  
          			  <option value="Bloomingdales">Bloomingdales</option>
          			  <option value="Bonobos">Bonobos</option>      			  
          			  <option value="Brooks Brothers">Brooks Brothers (json link)</option>
          			  <option value="Burberry">Burberry</option>
          			  <option value="Calvin Klein">Calvin Klein</option>
          			  <option value="Canada Goose">Canada Goose</option>
          			  <option value="Charles Tyrwhitt">Charles Tyrwhitt</option>
          			  <option value="Chicos">Chicos</option>
          			  <option value="Columbia">Columbia</option>
          			  <option value="Cusp">Cusp</option>
          			  <option value="Diesel">Diesel</option>
          			  <option value="Dillards">Dillards</option>
          			  <option value="DKNY">DKNY</option>
          			  <option value="Dockers">Dockers</option>
          			  <option value="Elie Tahari">Elie Tahari</option>      			  
          			  <option value="Express">Express</option>
          			  <option value="Forever21">Forever21</option>				  
          			  <option value="Free People">Free People</option>
          			  <option value="Gap">Gap (json link)</option>
          			  <option value="Gucci">Gucci</option>
          			  <option value="GUESS">GUESS</option>
          			  <option value="H&M">H&M (json link)</option>
          			  <option value="Hollister">Hollister</option>
          			  <option value="Hugo Boss">Hugo Boss</option>
          			  <option value="Intermix">Intermix</option>
          			  <option value="JCPenney">JCPenney</option>
          			  <option value="J_Crew">J.Crew</option>
          			  <option value="J_Jill">J.Jill</option>
          			  <option value="Kate Spade">Kate Spade</option>
          			  <option value="Kohls">Kohls</option>
          			  <option value="Lands End">Lands End</option>
          			  <option value="Jockey">Jockey</option>
          			  <option value="Loft">Loft</option>
          			  <option value="Lucky Brand">Lucky Brand</option>
          			  <option value="Lululemon">LuLuLemon</option>			      			  	  
          			  <option value="Lord & Taylor">Lord And Taylor</option>	
          			  <option value="Macys">Macys</option>			      				  
          			  <option value="Madewell">Madewell</option>
          			  <option value="Marc Jacobs">Marc Jacobs</option>
          			  <option value="Michael Kors">Michael Kors</option>
          			  <option value="Nautica">Nautica</option>
          			  <option value="Neiman Marcus">Neiman Marcus</option>
          			  <option value="New Balance">New Balance</option>
          			  <option value="Nike">Nike</option>
          			  <option value="Nordstrom">Nordstrom</option>
          			  <option value="New York & Company">NY and Company</option>
          			  <option value="Oakley">Oakley</option>
          			  <option value="Old Navy">Old Navy (json link)</option>	
          			  <option value="Perry Ellis">Perry Ellis</option>			  
          			  <option value="Piperlime">Piperlime (json link)</option>
          			  <option value="Puma">Puma</option>
          			  <option value="Rag Bone">Rag Bone</option>
          			  <option value="Ralph Lauren">Ralph Lauren</option>
          			  <option value="REI">REI</option>
          			  <option value="Saks Fifth Avenue">Saks Fifth Avenue</option>
          			  <option value="Shinesty">Shinesty</option>
          			  <option value="Target">Target</option>	
          			  <option value="The North Face">The North Face</option>
          			  <option value="Tommy Hilfiger">Tommy Hilfiger</option>      			    				  
          			  <option value="Top Shop">Top Shop</option>      			  	  				  
          			  <option value="Tory Burch">Tory Burch</option>
          			  <option value="True Religion">True Religion</option>
          			  <option value="Ugg Australia">Ugg Australia</option>	  		
          			  <option value="Under Armour">Under Armour</option>		  
          			  <option value="Urban Outfitters">Urban Outfitters</option>
          			  <option value="Van Heusen">Van Heusen</option>
          			  <option value="Victorias Secret">Victorias Secret</option>
          			  <option value="Vineyard Vines">Vineyard Vines</option>
          			  <option value="Zara">Zara</option>
          			</select>
            </div>
            <div class="form-group">            
                <label for="inputAudience">Target Consumers</label>		    
    		   	<!-- <input type="text" id="inputAudience" placeholder="Target Consumers (i.e. Women, Men, Boys, Girls, etc...)"  class="form-control"  name="consumer" required> -->
    		   	<select id="inputAudience" name="consumer" class="form-control">    		    	
          			  <option value="boys">Boys</option>
          			  <option value="girls">Girls</option>
          			  <option value="men">Men</option>
          			  <!--<option value="toddlers">Toddlers</option>-->
          			  <option value="women" selected="selected">Women</option>
                </select>
    		   	
            </div>
            <div class="form-group">            
                <label for="inputCategory">Url Title (Only Used to Organize this Page)</label>
        		<input type="text" id="inputCategory" placeholder="(i.e. Dresses, Pants, Shoes, Hats, etc...)" class="form-control" name="category" required>    		   		
            </div>
            <div class="form-group">                		
        		<label for="inputLink">Link to Products Page</label>
        		<input type="text" id="inputLink" placeholder="Link to Products Page" name="link" class="form-control" required>		   		
            </div>
            <div class="form-group">                		
        		<label for="inputTags">Tags</label>
        		  <table class="tagtable table table-bordered table-condensed table-responsive">
        		      <?php    		            		          
        		          $table = array();  
        		          $colNum = 5;        
                          $numRows = ceil(count($tags) / $colNum);            
    				      $i = 0;        
    
        		          for($c=0; $c < $colNum; $c++){
                                for($r = 0; $r < $numRows; $r++){
    						          if ($i >= count($tags)){ break; }
    
    						          if (!isset($table[$r])){
        		                   	      $table[$r] = array();
        		                	  }	
    
    						          $table[$r][$c] = $tags[$i++]; 
    					        }
    					
    					        if ($i >= count($tags)){ break; }
        		          }
        		          
        		          
        		          for($r=0; $r < count($table); $r++){    		              
        		              echo "<tr>";   
        		              
        		              for($c=0; $c < count($table[$r]); $c++){
        		              
        		                  echo '<td><input type="checkbox" class="tagCheckbox" name="tags" value="'.$table[$r][$c].'"/>'.$table[$r][$c].'</td>';    		              
        		              }
        		                  		              
        		              echo "</tr>";       		              
        		          }
        		      
        		      ?>
        		  </table>
        		
        		   <!--
        		   <select multiple class="form-control" name="tags" id="inputTags" >    		      
        		      <option value="Activewear"/>Activewear</option>
                      <option value="Blazers"/>Blazers</option>
                      <option value="Blouses"/>Blouses</option>
                      <option value="Button Downs"/>Button Downs</option>
                      <option value="Camisoles"/>Camisoles</option>
                      <option value="Capris"/>Capris</option>
                      <option value="Cardigans"/>Cardigans</option>
                      <option value="Cashmere"/>Cashmere</option>
                      <option value="Chinos"/>Chinos</option>
                      <option value="Coats"/>Coats</option>          
                      <option value="Cocktail Dresses"/>Cocktial Dresses</option>
                      <option value="Collared Shirts"/>Collared Shirts</option>
                      <option value="Crop Tops"/>Crop Tops</option>
                      <option value="Denim"/>Denim</option>
                      <option value="Dress Pants"/>Dress Pants</option>
                      <option value="Dress Shirts"/>Dress Shirts</option>
                      <option value="Dresses"/>Dresses</option>
                      <option value="Evening Dresses"/>Evening Dresses</option>
                      <option value="Graphic T Shirts"/>Graphic T Shirts</option>
                      <option value="Gowns"/>Gowns</option>
                      <option value="Henleys"/>Henleys</option>
                      <option value="Hoodies"/>Hoodies</option>
                      <option value="Jackets"/>Jackets</option>
                      <option value="Jeans"/>Jeans</option>
                      <option value="Jumpsuits"/>Jumpsuits</option>
                      <option value="Khakis"/>Khakis</option>
                      <option value="Knit"/>Knit</option>
                      <option value="Leather"/>Leather</option>
                      <option value="Leggings"/>Leggings</option>
                      <option value="Long Sleeve Tops"/>Long Sleeve Tops</option>
                      <option value="Loungewear"/>Loungewear</option>
                      <option value="Mini Skirts"/>Mini Skirts</option>
                      <option value="Outerwear"/>Outerwear</option>
                      <option value="Overalls"/>Overalls</option>
                      <option value="Pants"/>Pants</option>
                      <option value="Polos"/>Polos</option>
                      <option value="Pullovers"/>Pullovers</option>
                      <option value="Rompers"/>Rompers</option>              
                      <option value="Shirts"/>Shirts</option>
                      <option value="Shorts"/>Shorts</option>
                      <option value="Skirts"/>Skirts</option>
                      <option value="Skorts"/>Skorts</option>
                      <option value="Sleepwear"/>Sleepwear</option>
                      <option value="Sleeveless"/>Sleeveless</option>
                      <option value="Sport Coats"/>Sport Coats</option>
                      <option value="Suits"/>Suits</option>
                      <option value="Sweaters"/>Sweaters</option>
                      <option value="Sweatpants"/>Sweatpants</option>
                      <option value="Sweatshirts"/>Sweatshirts</option>
                      <option value="T Shirts"/>T Shirts</option>
                      <option value="Tank Tops"/>Tank Tops</option>
                      <option value="Trench Coats"/>Trench Coats</option>
                      <option value="Tunics"/>Tunics</option>
                      <option value="Vests"/>Vests</option>
                      <option value="Zip Ups"/>Zip Ups</option>
                      <option value="Winter"/>Winter</option>
                      <option value="Spring"/>Spring</option>
                      <option value="Summer"/>Summer</option>
                      <option value="Fall"/>Fall</option>
                      <option value="Sale"/>SALE</option>
                  </select>
                  -->
                            
            </div>
            
            <button type="submit" class="btn btn-success" id="save">Save</button>
        </form>
               
        
        
        <hr>
        <a name="populateCategoriesForm"></a>
        <br/><br/>
        <h2>Auto Populate Categories:</h2>
        <form role="form" id="saveCategories">
            <div class="form-group">
                <label for="inputCompany">Company</label>
                <select id="autoCompanySelect" name="company" class="form-control"></select>
            </div>                        
            
            <button type="submit" class="btn btn-success" id="getCats">Get Categories</button>
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
        
        <br><br><br>
        
        <div id="main-workspace" style="display:none;"></div>
        <div id="json-output" style="display:none;"></div>
        <div id="json-products" style="display:none;"></div>
        
        <section id="sample-grid-container" class="items">
            <div class="container">           
                <div id="sample-grid" class="row box-row"></div>
            </div>
        </section>
            
        
    </div>        
</div>

<div class="actionButtons">
    <a href="#addCategoryForm" style="float: right; margin-right: 10px;"><button class="btn btn-danger btn-small">Upload Form</button></a>
    <a href="#top" style="float: right; margin-right: 10px;"><button class="btn btn-danger btn-small">Top</button></a>
    <button id="selectall" class="btn btn-default btn-sm">Select All</button>
<!--    <button id="selectallvalid" class="btn btn-default btn-sm">Select Valid</button>    -->
    <button id="deselectall" class="btn btn-default btn-sm">Deselect All</button>    
    <!--<button onclick="spider.testProductsFromLinks(true, false, false)" class="btn btn-primary btn-sm">View Category Data</button>-->
    <button onclick="spider.testProductsFromLinks(false, true, false)" class="btn btn-primary btn-sm" tooltip="(1 store at a time)">View Sample Products</button>    
    <button onclick="spider.getSpiderStats()" class="btn btn-info btn-sm">Get Spider Stats</button>
    <button onclick="actionButtons.getTotalProductCount()" class="btn btn-info btn-sm">Get Total Product Count</button>
    <button onclick="spider.testProductsFromLinks(false, false, true)" class="btn btn-success btn-sm">Save Selected</button>
    <button onclick="actionButtons.saveAll()" class="btn btn-success btn-sm">Save All</button>                
</div>

<div id="loadingMask" style="display:none;" >
    <img src="../../css/images/loading.gif"/>
</div>
<div id="transparentLoadingMask" style="display:none;" >
    <img src="../../css/images/loading.gif"/>
</div>

<?php include(dirname(__FILE__) . '/../../static/footerMeta.php');   ?>

<?php echo CLOSITT_JS; ?>
<script src="../js/storeApi.js"></script>
<script src="../js/productSpider.js"></script>
<script src="../js/storeSelectors.js"></script>
</body>
</html>
