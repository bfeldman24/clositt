<?php if (ENV == "PROD"){ ?>
<!-- Begin Inspectlet Embed Code -->
<script type="text/javascript" id="inspectletjs">
	window.__insp = window.__insp || [];
	__insp.push(['wid', 1595859288]);
	(function() {
		function __ldinsp(){var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); }
		if (window.attachEvent){
			window.attachEvent('onload', __ldinsp);
		}else{
			window.addEventListener('load', __ldinsp, false);
		}
	})();
</script>
<!-- End Inspectlet Embed Code -->
<?php } ?>

<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/png" href="favicon.ico">

<?php
$metaImage = HOME_PAGE . "css/images/clositt-twitter-header.jpg";
        
if (isset($product) && $product != null){
    $metaImage = $product->i;
}else{
    echo '<title>Clositt Makes Searching for Clothes as Fun as Buying Clothes</title>';   
}
?>

<meta name="twitter:domain" content="<?php echo DOMAIN; ?>">
<meta name="twitter:image:src" content="<?php echo $metaImage; ?>" />
<meta property="og:image" content="<?php echo $metaImage; ?>"/>
<meta property="og:image:secure_url" content="<?php echo $metaImage; ?>" /> 

<link href="<?php echo HOME_ROOT; ?>lib/css/bootstrap.min.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>lib/css/jquery-ui-1.11.2.custom.min.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>lib/css/messenger.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>lib/css/messenger-theme-block.css" rel="stylesheet">
<link href="<?php echo HOME_ROOT; ?>lib/css/jquery.mCustomScrollbar.min.css" rel="stylesheet">


<link href="<?php echo HOME_ROOT; ?>lib/css/iconic-font.css" rel="stylesheet" />
<link href="<?php echo HOME_ROOT; ?>lib/css/icomoon_all.css" rel="stylesheet" />
<link href="<?php echo HOME_ROOT; ?>lib/css/owl.carousel.css" rel="stylesheet" />
<link href="<?php echo CLOSITT_CSS; ?>" rel="stylesheet">


<script type="text/javascript">
    window.HOME_ROOT = "<?php echo HOME_ROOT; ?>";
    window.HOME_URL = "<?php echo HOME_PAGE; ?>";
        
    window.CLOSITT_PAGE = "<?php echo CLOSITT_PAGE; ?>";    
    window.SETTINGS_PAGE = "<?php echo SETTINGS_PAGE; ?>";        
</script>

<?php if (ENV == "PROD"){ ?>
<!-- Begin Heap Analytics Code -->
<script type="text/javascript">
      window.heap=window.heap||[],heap.load=function(t,e){window.heap.appid=t,window.heap.config=e;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"===document.location.protocol?"https:":"http:")+"//cdn.heapanalytics.com/js/heap.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(t){return function(){heap.push([t].concat(Array.prototype.slice.call(arguments,0)))}},p=["clearEventProperties","identify","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
      heap.load("3436049452");
</script>
<!-- End Heap Analytics Code -->
<?php } ?>