<footer class="clositt-theme">
	<div id="footer-wrapper">
		<div class="center">Clositt.com Inc &copy; 2013</div>
		<div><a href="contact-us.php">Contact Us</a></div>
		<!--<div><a href="#">About Us</a></div>-->
		<div class="last"><a href="acknowledgements.php">Shout Outs</a></div>
		
		<?php
		if((isset($_GET['ben']) && $_GET['ben'] != "") || (isset($_GET['eli']) && $_GET['eli'] != "")){
		?>
		<div class="last"><a href="/scripts/php/productSpider.php" style="margin: 0 5px;">Upload</a></div>
		<?php } ?>
	</div>
</footer>

<?php echo CLOSITT_JS; ?>

<script type="text/javascript">
firebase.init();
Messenger.init();
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
