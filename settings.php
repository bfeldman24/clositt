<?php require_once(dirname(__FILE__) . '/app/session.php'); ?>
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>	

<style type="text/css">
.form-horizontal .control-label {
    padding-top: 9px !important;
}

.changeSettingCheckbox { 
    margin-right: 10px !important;
}

.form-horizontal .controls {
    margin-left: 150px;
}

.newPasswordGroup {
    margin-left: 176px !important;
    margin-top: 5px !important;
    display:none;
}

#inputPassword2{
    margin-left: 5px;
}   
</style>

</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div id="signup">

<h1>Account Settings</h1>
<br><br>
    
	<form class="form-horizontal">
	    <div class="control-group">
		    <label class="control-label" for="inputName">Change Name</label>
		    <div class="controls">		  	
		      <input type="checkbox" id="changeName" class="changeSettingCheckbox" toggleInputId="inputName">  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-user"></i></span>
				<input type="text" id="inputName" placeholder="Name" class="input-xlarge" disabled="disabled">
			  </div>
		    </div>
	    </div>	    
	    <?php /* ?>
	    <div class="control-group">
		    <label class="control-label" for="inputEmail">Change Email</label>
		    <div class="controls">		  	  
		      <input type="checkbox" id="changeEmail" class="changeSettingCheckbox" toggleInputId="inputEmail">  
			  <div class="input-prepend">
				<span class="add-on"><i class="icon-envelope"></i></span>
				<input type="text" id="inputEmail" placeholder="Email" class="input-xlarge" disabled="disabled">
			  </div>
		    </div>
	    </div>
	    <?php */ ?>
	    <div class="control-group">	        		    
		    <label class="control-label" for="inputPassword">Change Password</label>		    		    
		    <div class="controls">
		        <input type="checkbox" id="changePassword" class="changeSettingCheckbox" toggleInputId="inputOldPassword">  
		    	<div class="input-prepend">
					<span class="add-on"><i class="icon-lock"></i></span>										
					<input type="password" id="inputOldPassword" placeholder="Old Password" class="input-xlarge" disabled="disabled">					
			  	</div>		   		
		    </div>
		    <div class="controls newPasswordGroup">
		    	<div class="input-prepend">
					<span class="add-on"><i class="icon-lock"></i></span>										
					<input type="password" id="inputPassword" placeholder="New Password" class="input-xlarge">
					<input type="password" id="inputPassword2" placeholder="Confirm Password" class="input-xlarge">
			  	</div>		   		
		    </div>
	    </div>
	    <div class="control-group">
		    <div class="controls">		   
		    <button type="submit" class="btn btn-primary" id="save" disabled="disabled">Save</button>
		    </div>
	    </div>
    </form>
</div>

<?php include(dirname(__FILE__) . '/static/footer.php');   ?>


<script type="text/javascript">
function loggedIn(){
	$("#inputName").val(firebase.username);				
}


$("form").on("submit",function(event){
	 event.preventDefault();
	 
	 if($("#inputName").attr("disabled") == "disabled" && $("#inputOldPassword").attr("disabled") == "disabled"){
	       Messenger.info("There is nothing to save! Please enable the fields that you wish to change.");                     
	 }else{
	 
      	 if($("#inputOldPassword").attr("disabled") != "disabled"){
              if($('#inputPassword').val().length > 5 && $('#inputPassword2').val().length > 5){
                      if($('#inputPassword2').val() == $('#inputPassword').val()){                          	
                        var oldPassword = $("#inputOldPassword").val();
                  		var newPassword = $("#inputPassword").val();            		
                  	
                  		firebase.authClient.changePassword(firebase.email, oldPassword, newPassword, function(error, success) {
                            if (error) {
                                  Messenger.error("Your old password is incorrect! Please try again.");
                            }else{
                                  Messenger.success("Password changed successfully!");
                                  $("#changePassword").prop("checked", false);
                                  $("#inputOldPassword").attr("disabled","disabled");
                                  $("#inputOldPassword").val("");
                                  $("#inputPassword").val("");
                                  $("#inputPassword2").val("");
                                  $(".newPasswordGroup").hide();
                            }
                          });
                      }else{
                              Messenger.error("New passwords do NOT match!");                                             
                      }
              }else{
                      Messenger.error("New passwords do NOT match!");        
              }
      	 }
      	 
      	 if($("#inputName").attr("disabled") != "disabled"){
      	    var name = $("#inputName").val();	
      	   
      	    firebase.$.child(firebase.userPath).child(firebase.userid).child('name').set(name, function(error, success) {
                if (error) {
                      Messenger.error("There was a problem saving your new name!");
                }else{
                      Messenger.success("Name changed successfully!");
                      $("#changeName").prop("checked",false);
                      $("#inputName").attr("disabled","disabled");
                }
              });
      	 }	 
	 }
	
	return false;
});


$(".changeSettingCheckbox").change(function(){
   var id = "#" + $(this).attr("toggleInputId");
   
   if($(id).attr("disabled") == "disabled"){
        $(id).removeAttr("disabled");
        
        if(id == "#inputOldPassword"){
            $(".newPasswordGroup").show();
        }
    } else {
        $(id).attr("disabled","disabled");
        
        if(id == "#inputOldPassword"){
            $(".newPasswordGroup").hide();
        }
    }
    
    if ($('input[disabled="disabled"]:visible').length < 2){
        $("#save").removeAttr("disabled");
    }else{
        $("#save").attr("disabled","disabled");
    }
});	
    
</script>
</body>
</html>
