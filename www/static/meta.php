<title>Clositt Makes Searching for Clothes as Fun as Buying Clothes</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" href="http://clositt.com/favicon.ico">

<?php
$metaImage = HOME_PAGE . "css/images/clositt-twitter-header.jpg";
        
if (isset($product) && $product != null){
    $metaImage = $product->i;
}
?>

<meta name="twitter:domain" content="<?php echo DOMAIN; ?>">
<meta name="twitter:image:src" content="<?php echo $metaImage; ?>" />
<meta property="og:image" content="<?php echo $metaImage; ?>"/>
<meta property="og:image:secure_url" content="<?php echo $metaImage; ?>" /> 

<link href="<?php echo HOME_ROOT; ?>lib/css/bootstrap.min.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>lib/css/jquery-ui-1.10.1.custom.min.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>lib/css/messenger.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>lib/css/messenger-theme-block.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>new/css/jquery.mCustomScrollbar.min.css" rel="stylesheet">
<!-- <link href="<?php echo CLOSITT_CSS; ?>" rel="stylesheet"> -->

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="<?php echo HOME_ROOT; ?>lib/js/jquery-ui-1.10.1.custom.min.js"></script>
<script src="<?php echo HOME_ROOT; ?>lib/js/bootstrap.min.js"></script>


<link href="<?php echo HOME_ROOT; ?>new/css/iconic-font.css" rel="stylesheet" />
<link href="<?php echo HOME_ROOT; ?>new/css/icomoon_all.css" rel="stylesheet" />
<link href="<?php echo HOME_ROOT; ?>new/css/owl.carousel.css" rel="stylesheet" />
<link href="<?php echo HOME_ROOT; ?>new/css/style.css" rel="stylesheet" />


<script type="text/javascript">
    window.HOME_ROOT = "<?php echo HOME_ROOT; ?>";
    window.HOME_URL = "<?php echo HOME_PAGE; ?>";
        
    window.CLOSITT_PAGE = "<?php echo CLOSITT_PAGE; ?>";    
    window.SETTINGS_PAGE = "<?php echo SETTINGS_PAGE; ?>";        
</script>
