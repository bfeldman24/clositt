<?php include(dirname(__FILE__) . '/modals.php');   ?>

<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/jquery-ui-1.11.2.custom.min.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>lib/js/bootstrap.min.js"></script>
<?php echo CLOSITT_JS; ?>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>new/js/jquery.flexslider.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>new/js/jquery.flexslider-min.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>new/js/highcharts.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>new/js/exporting.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>new/js/owl.carousel.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>new/js/jquery.mCustomScrollbar.concat.min.js"></script>
<script type="text/javascript" src="<?php echo HOME_ROOT; ?>new/js/custom.js"></script>



<script type="text/javascript">
    var sessionInit = {            
        <?php if (isset($_SESSION['active']) && $_SESSION['active'] === true){ ?>            
            active: true,
            userid: <?php echo $_SESSION["userid"]; ?>, 
            email: '<?php echo $_SESSION["email"]; ?>',
            name: '<?php echo $_SESSION["name"]; ?>',
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
    <script type="text/javascript">
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-39518320-1']);
      _gaq.push(['_trackPageview']);
    
      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
<?php } ?>