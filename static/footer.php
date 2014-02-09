<footer class="clositt-theme">
	<div id="footer-wrapper">
		<div class="center footer-item">Clositt Inc &copy; 2014</div>
		<div class="footer-item"><a href="contact-us.php">Contact Us</a></div>
		<div class="footer-item"><a href="terms-of-service.php">Terms</a></div>
		<div class="last footer-item"><a href="shout-outs.php">Shout Outs</a></div>
		
		<?php
		if((isset($_GET['ben']) && $_GET['ben'] != "") || (isset($_GET['eli']) && $_GET['eli'] != "")){
		?>
		<div class="last footer-item"><a href="/scripts/admin/php/productSpider.php" style="margin: 0 5px;">Upload</a></div>
		<?php } ?>						
	</div>
	
	<div class="feedback">
	   <div class="feedback-maximize">
    	   <div class="feedback-popup">
        	  <textarea class="feedback-textarea" rows="3" placeholder="What can we do better?"></textarea>
    	  </div>
    	  <div class="arrow-down"></div>
    	  <button class="feedback-submit-btn btn btn-mini" type="button">Submit</button>
    	  <div class="feedbackMinimize"><div class="minimize">-</div></div>
	  </div>
	  <div class="feedback-minimized" style="display:none;">
	      <button class="feedback-minimized-btn btn btn-success btn-mini" type="button">Feedback</button> 
	  </div>
	</div>
</footer>

<?php echo CLOSITT_JS; ?>

<script type="text/javascript">
$(document).ready(function() {
    firebase.init();
    Messenger.init();       
});

$(".feedback .feedback-submit-btn").on("click",function(e){
	e.preventDefault();

	var feedbackTextArea = $(e.currentTarget).parents(".feedback").find(".feedback-textarea");
	var message = feedbackTextArea.val().trim();
	
	if(message.length > 0){
	    var feedback = { e: firebase.email, n: firebase.username, i: firebase.userid, s: "CLOSITT FEEDBACK", m: message };
	   
		$.post("app/email.php", feedback, function(data) {
			if(data == "success"){
				Messenger.success("Thanks for your feedback!");

				delete feedback.s;
				firebase.$.child("feedback").push(feedback);
				feedbackTextArea.val("");				
			}else{
				Messenger.error("There was a problem sending your feedback. Please try again.");	
			}
		});
	}else{
		Messenger.error("Type your feedback into the input!");	
	}
	
	return false;
});

$(".feedbackMinimize").on("click", function(e){
    var feedbackPopup = $(e.currentTarget).parents(".feedback");
    feedbackPopup.find(".feedback-maximize").hide('fade');
    feedbackPopup.find(".feedback-minimized").show('fade');
});

$(".feedback-minimized-btn").on("click", function(e){
    var feedbackPopup = $(e.currentTarget).parents(".feedback");
    feedbackPopup.find(".feedback-maximize").show('fade');
    feedbackPopup.find(".feedback-minimized").hide('fade');
});

</script>

<script type="text/javascript">
  var vglnk = { api_url: '//api.viglink.com/api',
                key: 'ace9fa11ba4e122d7318924968832a6d' };

  (function(d, t) {
    var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
    s.src = ('https:' == document.location.protocol ? vglnk.api_url :
             '//cdn.viglink.com/api') + '/vglnk.js';
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
