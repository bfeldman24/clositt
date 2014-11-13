<?php require_once(dirname(__FILE__) . '/../app/session.php'); ?>
<!DOCTYPE HTML>
<html>
<head>    
    <?php     
        $product = null;
    
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
                        
            echo '<title>' . $product->o . ': ' . $product->n . ' for $' . $product->p . '. Found it on Clositt.com</title>';
            echo '<meta property="og:image" content="'.$product->i.'" />';
            echo '<meta property="og:image:secure_url" content="'.$product->i.'" />';
            echo '<meta name="twitter:image:src" content="'.$product->i.'" />';
                 
        }else{
            echo '<title>Find IT on Clositt.com</title>';   
        }
        
        if (isset($_GET['pricealerts']) && !isset($_SESSION['clickedPriceAlertsForProductPage'])){            
            require_once(dirname(__FILE__) . '/../app/Controller/StatsController.php');
            $sku = $product != null ? $product->s : "unknown";
            StatsController::addItemAction("Clicked Price Alerts Email", $sku);
            $_SESSION['clickedPriceAlertsForProductPage'] = true;
        }
        
        include(dirname(__FILE__) . '/static/meta.php');
    ?>           
    		
</head>
<body>
<div class="wrapper">
    <?php 
        $productPage = true;        
        
        include(dirname(__FILE__) . '/static/header.php');
        include(dirname(__FILE__) . '/static/footerMeta.php');
        include(dirname(__FILE__) . '/product-modal.php');
        include(dirname(__FILE__) . '/static/footer.php');
    ?>
</div>

<script type="text/javascript">
 $(".badData").tooltip(); 
</script>
</body>
</html>
