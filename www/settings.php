<style type="text/css">
input[type='checkbox']{
    margin-top:18px;   
}

.newPasswordGroup {
    display:none;
}
</style>


<button type="button" class="close modal_close" data-dismiss="modal">
    <span class="icon-times close-modal" aria-hidden="true"></span>
</button>

<!-- Nav tabs -->   
<section id="login_box">    
    <!-- Tab panes -->  
    <div class="tab-content">  
        <div class="tab-pane active" id="loginModalTab">                
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="login">
                            <h1>Account Settings</h1>
                                                                                    
                            <form  class="form-horizontal" role="form">
                                 <div class="form-group">
                                    <div class="col-xs-12">
                                        <p class="log" style="margin-bottom:10px;">Change Name</p>
                                    </div>
                                    <div class="col-xs-12">       
                                        <div class="row">
                                            <div class="col-xs-1">
                                                  <input type="checkbox" id="changeName" class="changeSettingCheckbox" toggleInputId="inputName">
                                            </div>
                                            <div class="col-xs-11">      
                                                  <input type="text" id="inputName" placeholder="Name" class="input-xlarge form-control" disabled="disabled">                     
                                            </div>
                                        </div>      
                                    </div>
                                  </div>
                                  
                                  <?php /* ?>
                                  <div class="form-group">
                                    <div class="col-xs-12">
                                        <p class="log" style="margin-bottom:10px;">Change Email</p>
                                    </div>
                                    <div class="col-xs-12">       
                                        <div class="row">
                                            <div class="col-xs-1">
                                                  <input type="checkbox" id="changeEmail" class="changeSettingCheckbox" toggleInputId="inputEmail">
                                            </div>
                                            <div class="col-xs-11">      
                                                  <input type="text" id="inputEmail" placeholder="Email" class="input-xlarge form-control" disabled="disabled">                     
                                            </div>
                                        </div>      
                                    </div>
                                  </div>                                      
                                  <?php */ ?>
                
                                  <div class="form-group">
                                    <div class="col-xs-12">
                                        <p class="log" style="margin-bottom:10px;">Change Password</p>
                                    </div>
                                    <div class="col-xs-12">
                                        <div class="row">
                                            <div class="col-xs-1">
                                              <input type="checkbox" id="changePassword" class="changeSettingCheckbox" toggleInputId="inputOldPassword">  
                                            </div>
                                            <div class="col-xs-11">
                                              <input type="password" id="inputOldPassword" placeholder="Old Password" class="input-xlarge form-control" disabled="disabled">
                                            </div>
                                        </div>		
                                    </div>
                                  </div>
                                  <div class="form-group">
                                    <div class="col-xs-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-xs-offset-1 newPasswordGroup">							
                            					<input type="password" id="inputPassword" placeholder="New Password" class="input-xlarge form-control">
                            					<input type="password" id="inputPassword2" placeholder="Confirm Password" class="input-xlarge form-control">
                                            </div>
                                        </div>
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
        </div>                                   
    </div>                   
    
</section>
    




<script type="text/javascript">
    if (typeof session == "object" && session.isLoggedIn){
        $("#inputName").val(session.name);
    }
    
    var isUpdatePassBusy = false;
    var isUpdateNameBusy = false;

    $("form").on("submit",function(event){
    	 event.preventDefault();    	      
    	 
    	 if($("#inputName").attr("disabled") == "disabled" && $("#inputOldPassword").attr("disabled") == "disabled"){
    	       Messenger.info("There is nothing to save! Please enable the fields that you wish to change.");                     
    	 }else{
    	 
          	 if(!isUpdatePassBusy && $("#inputOldPassword").attr("disabled") != "disabled"){
                  if($('#inputPassword').val().length >= 7 && $('#inputPassword2').val().length >= 7){
                          if($('#inputPassword2').val() == $('#inputPassword').val()){                          	
                            var oldPassword = $("#inputOldPassword").val();
                      		var newPassword = $("#inputPassword").val();            		
                      	
                      	    isUpdatePassBusy = true; 
                      	    $.post( window.HOME_ROOT + "u/updatepass", {p: newPassword, op: oldPassword }, function(result){
                      	          if (result != "success"){
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
                       			  
                       			  isUpdatePassBusy = false; 
                      		});	
                      	                  		
                          }else{
                                  Messenger.error("New passwords do NOT match!");                                             
                          }
                  }else{
                          Messenger.error("Passwords must be at least 7 characters long!");        
                  }
          	 }
          	 
          	 if(!isUpdateNameBusy && $("#inputName").attr("disabled") != "disabled"){
          	    var name = $("#inputName").val();	
          	    
          	    isUpdateNameBusy = true;
          	    $.post( window.HOME_ROOT + "u/update", {id: session.userid, n: name, e: session.email }, function(result){
        	          if (result != "success"){
        	             Messenger.error("There was a problem saving your new name!");
        	          }else{
                        Messenger.success("Name changed successfully!");
                        session.name = name;
                        session.nickname = session.name.split(" ")[0];
                          $("#changeName").prop("checked",false);
                          $("#inputName").attr("disabled","disabled");                           	               
        			  }	
        			  
        			  isUpdateNameBusy = false;
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