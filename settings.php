<?php require_once(dirname(__FILE__) . '/app/session.php'); ?>
<!DOCTYPE>
<html>
<head>

<?php include(dirname(__FILE__) . '/static/meta.php'); ?>	

<style type="text/css">
input[type='checkbox']{
    margin-top:10px;   
}

.newPasswordGroup {
    display:none;
}

.newPasswordGroup input{
     margin-bottom: 10px;   
}

#inputPassword, #inputPassword2{
    margin-left: 5px;
}   
</style>

</head>
<body>

<?php include(dirname(__FILE__) . '/static/header.php');   ?>

<div class="row" style="margin-top:80px;">
    <div class="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
        <div class="panel panel-clositt-theme">
            <div class="panel-heading">
                  <h1 class="panel-title">Account Settings</h1>
            </div>
            <div class="panel-body">
                <form class="form-horizontal" role="form">
                  <div class="form-group">
                    <label for="inputName" class="col-xs-12 col-sm-4 control-label">Change Name</label>
                    <div class="col-xs-12 col-sm-7">       
                        <div class="row">
                            <div class="col-xs-2">
                                  <input type="checkbox" id="changeName" class="changeSettingCheckbox" toggleInputId="inputName">
                            </div>
                            <div class="col-xs-10">      
                                  <input type="text" id="inputName" placeholder="Name" class="input-xlarge form-control" disabled="disabled">                     
                            </div>
                        </div>      
                    </div>
                  </div>
                  
                  <?php /* ?>
                  <div class="form-group">
                    <label for="inputEmail" class="col-xs-12 col-sm-4 control-label">Change Email</label>
                    <div class="col-xs-12 col-sm-7">       
                        <div class="row">
                            <div class="col-xs-2">
                                  <input type="checkbox" id="changeEmail" class="changeSettingCheckbox" toggleInputId="inputEmail">
                            </div>
                            <div class="col-xs-10">      
                                  <input type="text" id="inputEmail" placeholder="Email" class="input-xlarge form-control" disabled="disabled">                     
                            </div>
                        </div>      
                    </div>
                  </div>                                      
                  <?php */ ?>

                  <div class="form-group">
                    <label for="inputOldPassword" class="col-xs-12 col-sm-4 control-label">Change Password</label>
                    <div class="col-xs-12 col-sm-7">
                        <div class="row">
                            <div class="col-xs-2">
                              <input type="checkbox" id="changePassword" class="changeSettingCheckbox" toggleInputId="inputOldPassword">  
                            </div>
                            <div class="col-xs-10">
                              <input type="password" id="inputOldPassword" placeholder="Old Password" class="input-xlarge form-control" disabled="disabled">
                            </div>
                        </div>		
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="col-xs-12 col-sm-6 col-sm-offset-5 newPasswordGroup">							
    					<input type="password" id="inputPassword" placeholder="New Password" class="input-xlarge form-control">
    					<input type="password" id="inputPassword2" placeholder="Confirm Password" class="input-xlarge form-control">
                    </div>
                  </div>                                   
                  <div class="form-group">
                    <div>
        		      <button type="submit" class="btn btn-clositt-theme center-block" id="save" disabled="disabled">Save</button>                      
                    </div>
                  </div>                                                      
                </form>
                
            </div>
        </div>	
    </div>
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
