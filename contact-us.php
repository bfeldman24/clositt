<?php include(dirname(__FILE__) . '/app/globals.php'); ?> 
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>	
</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>


<div class="row" style="margin-top:80px;">
    <div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
        <div class="panel panel-clositt-theme">
            <div class="panel-heading">
                  <h1 class="panel-title">Contact Us</h1>
            </div>
            <div class="panel-body">
                <form class="form-horizontal" role="form">
                  <div class="form-group">
                    <label for="inputName" class="col-sm-2 control-label">Name</label>
                    <div class="col-sm-5">
                      <input type="text" class="form-control" id="inputName" placeholder="Name">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputEmail" class="col-sm-2 control-label">Email</label>
                    <div class="col-sm-5">
                      <input type="email" class="form-control" id="inputEmail" placeholder="Email">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputSubject" class="col-sm-2 control-label">Subject</label>
                    <div class="col-sm-5">
                      <input type="text" class="form-control" id="inputSubject" placeholder="Subject">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputMessage" class="col-sm-2 control-label">Message</label>
                    <div class="col-sm-10">
                        <textarea rows="5" id="inputMessage" class="form-control"></textarea>
                    </div>                    
                  </div>                  
                  <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                      <button type="submit" id="submitBtn" class="btn btn-clositt-theme">Send</button>
                    </div>
                  </div>                                                      
                </form>
                
            </div>
        </div>	
    </div>
</div>    

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">

$("form").on("submit",function(event){
	 event.preventDefault();
	 $("#submitBtn").addClass("disabled").text("Sending...");	 
	 
	var email = $("#inputEmail").val();
	var subject = $("#inputSubject").val();
	var name = $("#inputName").val();
	var message = $("#inputMessage").val();
	
	if(email.length > 0 && subject.length > 0 && name.length > 0 && message.length > 0){
		$.post("app/email.php", { e: email, n: name, i: firebase.userid, s: subject, m: message }, function(data) {
			if(data == "success"){
				Messenger.alert("Your message was sent successfully! Thank you!");
				$("#inputEmail").val("");
				$("#inputSubject").val("");
				$("#inputName").val("");
				$("#inputMessage").val("");
				$("#submitBtn").removeClass("disabled").text("Send");				
			}else{
				Messenger.error("There was a problem sending that message. Please try again.");	
				$("#submitBtn").removeClass("disabled").text("Send");
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
