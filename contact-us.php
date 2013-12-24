<?php include(dirname(__FILE__) . '/app/globals.php'); ?> 
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>		
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="signup">

<h1>Contact Us</h1>
	<form class="form-horizontal">
	    <div class="control-group">
		    <label class="control-label" for="inputName">Name</label>
		    <div class="controls">		  	  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-user"></i></span>
				<input type="text" id="inputName" placeholder="Name" class="input-xlarge">
			  </div>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputEmail">Email</label>
		    <div class="controls">		  	  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-envelope"></i></span>
				<input type="text" id="inputEmail" placeholder="Email" class="input-xlarge">
			  </div>
		    </div>
	    </div>
	    <div class="control-group">
		    <label class="control-label" for="inputSubject">Subject</label>
		    <div class="controls">		  	  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-envelope"></i></span>
				<input type="text" id="inputSubject" placeholder="Subject" class="input-xlarge">
			  </div>
		    </div>
	    </div>
	    <div class="control-group">
		    <div class="controls">
		    	<textarea rows="5" id="inputMessage"></textarea>   		
		    </div>
	    </div>
	    <div class="control-group">
		    <div class="controls">		   
		    <button type="submit" class="btn btn-primary">Send</button>
		    </div>
	    </div>
    </form>
</div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">

$("form").on("submit",function(event){
	 event.preventDefault();
	 
	var email = $("#inputEmail").val();
	var subject = $("#inputSubject").val();
	var name = $("#inputName").val();
	var message = $("#inputMessage").val();
	
	if(email.length > 0 && subject.length > 0 && name.length > 0 && message.length > 0){
		$.post("app/email.php", { e: email, n: name, i: firebase.userid, s: subject, m: message }, function(data) {
			if(data == "success"){
				Messenger.alert("Your message was sent successfully! Thank you!");
				$("#inputEmail").val("");
				$("inputSubject").val("");
				$("#inputName").val("");
				$("#inputMessage").val("");				
			}else{
				Messenger.error("There was a problem sending that message. Please try again.");	
			}
		});
	}else{
		Messenger.error("All fields must be filled out!");	
	}
	
	return false;
});

function loggedIn(){
	$("#inputName").val(firebase.username);
	$("#inputEmail").val(firebase.email)
	$("#inputSubject").val("Hey Clositt Team")
}

</script>
</body>
</html>
