<footer>
	<div id="footer-wrapper">
		<div class="center">Clositt.com Inc &copy; 2013</div>
		<div><a href="#">Contact Us</a></div>
		<div><a href="#">About Us</a></div>
		<div><a href="/acknowledgements.php">Shout Outs</a></div>
		
		<?php
		if((isset($_GET['ben']) && $_GET['ben'] != "") || (isset($_GET['eli']) && $_GET['eli'] != "")){
		?>
		<div class="last"><a href="/scripts/php/productSpider.php" style="margin: 0 5px;">Upload</a></div>
		<?php } ?>
	</div>
</footer>

<script src="/scripts/js/firebaseExtension.js"></script>
<script src="/scripts/js/messenger.js"></script>
<script type="text/javascript">
firebase.init();
Messenger.init();
</script>
