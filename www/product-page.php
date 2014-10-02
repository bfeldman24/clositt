<?php require_once(dirname(__FILE__) . '/../app/session.php'); ?>
<!DOCTYPE HTML>
<html>
<head>
    <title>Find IT on Clositt.com</title>
    <?php     
        if (isset($_GET['s'])){             
            require_once(dirname(__FILE__) . '/../app/Controller/ProductController.php');
            $productController = new ProductController();
            
            //echo "Method: " . $_GET['method'];                
            //echo "<br>Param: " . $_GET['paramA'];      
            //echo "<br>Criteria: " . print_r($_POST, true);                
                
            $productJson = $productController->getProduct($_GET['s']);        
            $productData = json_decode($productJson);      
            
            if (!isset($productData) || !isset($productData->product) || 
                !isset($productData->product->s) || !isset($productData->product->i) || !isset($productData->product->l)){
                echo "Sorry! It looks like that product no longer exists! ";           
                exit(1);
            } 
            
            $product = $productData->product;            
        }
        
        include(dirname(__FILE__) . '/static/meta.php');
    ?>           
    		
</head>
<body>
<div class="wrapper">
    <?php 
        $productPage = true;        
        
        include(dirname(__FILE__) . '/static/header.php');
        include(dirname(__FILE__) . '/product-modal.php');
        include(dirname(__FILE__) . '/static/footer.php');
    ?>
</div>
<?php include(dirname(__FILE__) . '/static/footerMeta.php'); ?>	
</body>
</html>
