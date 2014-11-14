<?php include(dirname(__FILE__) . '/modals.php');   ?>

<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/jquery-ui-1.11.2.custom.min.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/bootstrap.min.js"></script>
<?php echo CLOSITT_JS; ?>

<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/jquery.flexslider-min.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/highcharts.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/exporting.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/owl.carousel.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/jquery.mCustomScrollbar.concat.min.js"></script>



<script type="text/javascript">
    var sessionInit = {            
        <?php if (isset($_SESSION['active']) && $_SESSION['active'] === true){ ?>            
            active: true,
            userid: <?php echo $_SESSION["userid"]; ?>, 
            email: '<?php echo $_SESSION["email"]; ?>',
            name: '<?php echo $_SESSION["name"]; ?>',
            pricealerts: '<?php echo $_SESSION["pricealerts"]; ?>',
        <?php }else{ ?>
            active: false
        <?php } ?>                                    
    };
</script>
<script type="text/javascript">
$(document).ready(function() {    
    session.init();
    Messenger.init();       
    footer.init();
});
</script>

<?php if(ENV == "PROD"){ ?>
    <script type="text/javascript">
      var vglnk = { api_url: '//api.viglink.com/api', key: 'ace9fa11ba4e122d7318924968832a6d' };
    
      (function(d, t) {
        var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
        s.src = ('https:' == document.location.protocol ? vglnk.api_url : '//cdn.viglink.com/api') + '/vglnk.js';
        var r = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r);
      }(document, 'script'));
    </script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    
      ga('create', 'UA-39518320-1', 'auto');
      ga('send', 'pageview');
    
    </script>
<?php } 

global $mdb2;
$mdb2->disconnect();
?>