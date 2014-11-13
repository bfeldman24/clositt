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
                                 <div class="form-group" style="margin-bottom: 0px;">
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
                
                                  <div class="form-group" style="margin-bottom: 0px;">
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
                                  <div class="form-group" style="margin-bottom: 0px;">
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
                                    <div class="col-xs-12">
                                        <p class="log" style="margin-bottom:10px;">Price Alerts Email Frequency</p>
                                        <small class="log">*You will only be emailed when prices in your clositt drop</small>
                                    </div>
                                    <div class="col-xs-12 text-center">
                                        <div class="btn-group priceAlertFrequency">
                            		      <div class="btn btn-clositt-theme center-block" frequency="1">Daily</div>
                            		      <div class="btn btn-clositt-theme center-block" frequency="2">Weekly</div>
                            		      <div class="btn btn-clositt-theme center-block" frequency="3">Monthly</div>
                                        </div>
                                    </div>
                                  </div><br />
                                  <div class="form-group">
                                    <div class="col-xs-12 text-center">
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
var settings = {
    isUpdateBusy: false,
    priceAlertFrequency: null,  
    
    init: function(){
        $(document).on("click", ".priceAlertFrequency .btn", settings.changePriceFrequency);  
        $(".changeSettingCheckbox").change(settings.toggleInputVisibility);
        $("form").on("submit", settings.submitForm);
                
        if (typeof session == "object" && session.isLoggedIn){
           $("#inputName").val(session.name);
        }
                 
        $(".priceAlertFrequency .btn").each(function(){
            if ($(this).attr("frequency") == session.priceAlertFrequency){
                $(this).addClass("active");   
            } 
        });
    },
    
    changePriceFrequency: function(e){
        e.preventDefault();
        
        $(".priceAlertFrequency .btn").removeClass("active");
        $(e.currentTarget).addClass("active");        
        $("#save").removeAttr("disabled");    
                
        return false;     
    },
    
    toggleInputVisibility: function(e){
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
        
        if ($('input[disabled="disabled"]:visible').length < 2 || 
            closetPresenter.priceAlertFrequency != settings.priceAlertFrequency){
                
            $("#save").removeAttr("disabled");
        }else{
            $("#save").attr("disabled","disabled");
        }
    },
    
    submitForm: function(event){        
        event.preventDefault();          
        settings.priceAlertFrequency = $(".priceAlertFrequency > .btn.active").first().attr("frequency");
        settings.priceAlertFrequency = settings.priceAlertFrequency == null || settings.priceAlertFrequency.length <= 0 ? null : settings.priceAlertFrequency;
    	 
    	 if($("#inputName").attr("disabled") == "disabled" && $("#inputOldPassword").attr("disabled") == "disabled"
    	       && closetPresenter.priceAlertFrequency == settings.priceAlertFrequency){
    	       Messenger.info("There is nothing to save! Please enable the fields that you wish to change.");                     
    	 }else{
    	     var settingsAreValid = true;
    	     var oldPassword = null;
    	     var newPassword = null;
    	     var name = null;
    	   
          	 if($("#inputOldPassword").attr("disabled") != "disabled"){
                  if($('#inputPassword').val().length >= 7 && $('#inputPassword2').val().length >= 7){
                          if($('#inputPassword2').val() == $('#inputPassword').val()){                          	
                                oldPassword = $("#inputOldPassword").val();
                      		    newPassword = $("#inputPassword").val();            		
                      	                      	    
                          }else{
                                  settingsAreValid = false;
                                  Messenger.error("New passwords do NOT match!");                                             
                          }
                  }else{
                          settingsAreValid = false;
                          Messenger.error("Passwords must be at least 7 characters long!");        
                  }
          	 }
          	 
          	 if($("#inputName").attr("disabled") != "disabled"){
          	    var name = $("#inputName").val().trim();	
          	    
          	    if (name.length <= 1){
          	         settingsAreValid = false;
                     Messenger.error("Please enter your name! It is too short!");        
          	    }          	              	   	         	    
          	 }	
          	 
          	 if(settingsAreValid){
          	     if (!settings.isUpdateBusy){
          	           var frequency = closetPresenter.priceAlertFrequency == settings.priceAlertFrequency ? null : settings.priceAlertFrequency;
          	         
          	            var userData = {
          	                 id: session.userid, 
          	                 p: newPassword, 
          	                 op: oldPassword,
          	                 id: session.userid, 
          	                 n: name, 
          	                 //e: session.email,
          	                 f: frequency
          	            };

                        settings.isUpdateBusy = true;
                   	    $.post( window.HOME_ROOT + "u/update", userData, function(result){
                 	          if (result == null || result.f != null){
                 	             Messenger.error("There was a problem saving your settings!");
                 	          }else{ 
                 	              var success = true;
                 	             
                 	             if (result.p != null){
                 	                  if (result.p != "success"){
                          	             Messenger.error("Your old password is incorrect! Please try again.");	
                          	             success = false;
                          	          }else{
                                          $("#changePassword").prop("checked", false);
                                          $("#inputOldPassword").attr("disabled","disabled");
                                          $("#inputOldPassword").val("");
                                          $("#inputPassword").val("");
                                          $("#inputPassword2").val("");
                                          $(".newPasswordGroup").hide();                           	               
                           			  }	
                 	             }
                 	             
                 	             if (result.u != null){
                 	                  if (result.u != "success"){
                 	                      
                 	                     // if either the user changed or the alerts changed 
                 	                     if (user != null || closetPresenter.priceAlertFrequency != settings.priceAlertFrequency){
                                             Messenger.error("There was a problem saving your name!");
                            	             success = false;  
                 	                     }                 	                                              	             
                        	          }else{                        	                                       	            
                        	               if (name != null){                        	                                       	              
                                                session.name = name;                                                                                    
                                                session.nickname = session.name.split(" ")[0];
                                                $("#changeName").prop("checked",false);
                                                $("#inputName").attr("disabled","disabled");
                        	               }                                                                                    
                        	               
                        	               if (closetPresenter.priceAlertFrequency != settings.priceAlertFrequency){
                        	                   session.priceAlertFrequency = settings.priceAlertFrequency;
                        	                   closetPresenter.updatePriceAlertFrequency();
                        	               }
                        	               
                        	               // if passwords failed
                        	               if (!success){
                        	                   var message = "Your ";
                        	                   message += name != null ? "name and " : "";
                        	                   message += "price alerts settings were saved successfully!"
                        	                   
                        	                   Messenger.success(message);           
                        	               }
                        			  }                        			  
                 	             }
                 	             
                 	             if (success){                 	              
                                    Messenger.success("All of your settings were saved successfully!");
                                    $('#userModal').modal('hide');
                 	             }                 	                                              
                 			  }	
                 			  
                 			  settings.isUpdateBusy = false;
                 		}, "json");
                 }                
          	 }
    	 }
    	
    	return false;
    },
    
    oldSubmitForm: function(event){
        event.preventDefault();    	      
    	 
    	 if($("#inputName").attr("disabled") == "disabled" && $("#inputOldPassword").attr("disabled") == "disabled"
    	       && closetPresenter.priceAlertFrequency == settings.priceAlertFrequency){
    	       Messenger.info("There is nothing to save! Please enable the fields that you wish to change.");                     
    	 }else{
    	     var settingsAreValid = false;
    	   
          	 if(!settings.isUpdatePassBusy && $("#inputOldPassword").attr("disabled") != "disabled"){
                  if($('#inputPassword').val().length >= 7 && $('#inputPassword2').val().length >= 7){
                          if($('#inputPassword2').val() == $('#inputPassword').val()){                          	
                            var oldPassword = $("#inputOldPassword").val();
                      		var newPassword = $("#inputPassword").val();            		
                      	
                      	    settings.isUpdatePassBusy = true; 
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
                       			  
                       			  settings.isUpdatePassBusy = false; 
                      		});	
                      	                  		
                          }else{
                                  Messenger.error("New passwords do NOT match!");                                             
                          }
                  }else{
                          Messenger.error("Passwords must be at least 7 characters long!");        
                  }
          	 }
          	 
          	 if(!settings.isUpdateNameBusy && $("#inputName").attr("disabled") != "disabled"){
          	    var name = $("#inputName").val();	
          	    
          	    settings.isUpdateNameBusy = true;
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
        			  
        			  settings.isUpdateNameBusy = false;
        		});	         	    
          	 }	 
    	 }
    	
    	return false;
    }   
};


settings.init();                  	
</script>