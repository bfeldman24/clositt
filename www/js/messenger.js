var Messenger = {	
	id: 'messenger',
	top: 65,
	timeout: 4000,
	defaultTimeout: 4000,
	debug: false,
	
	messageBoxTemplate: $('<ul class="messenger messenger-fixed messenger-theme-block"></ul>'),
				
	alertTemplate: $('<li class="messenger-message-slot  ">' +
						'<div class="messenger-message">' +
							'<div class="messenger-message-inner"></div>' +							
						'</div>' +
					'</li>'),
				
	
	init: function(){
		
		$('body').append(Messenger.messageBoxTemplate
			.attr("id", Messenger.id)
			.css("display","none")
			.css("top", Messenger.top + "px")
		);
	},
	
	alert: function(msg, statusCode, timeout){
		var status = "alert-success";
		
		if(statusCode == "error"){
			status = "alert-error";
		}else if(statusCode == "info"){
			status = "alert-info";
		}
		
		var $alertMessage = Messenger.alertTemplate.clone();
		
		$alertMessage.children("div").first().addClass(status);
		$alertMessage.find(".messenger-message-inner").first().text(msg);		
		
		$("#" + Messenger.id).append($alertMessage);
		$("#" + Messenger.id).css("display","block");
		
		if (Messenger.debug){
		      var d = new Date();
		      var logTime = (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + " - ";
		      console.log(logTime + msg);
		}
		
		setTimeout(function(){
			$alertMessage.remove();
			
			if($(".messenger-message-slot").size() <= 0){
				$("#" + Messenger.id).css("display","none");			
			}
			
		}, timeout );
		
		return true;
	},
	
	success: function(msg, timeout){
	    timeout = timeout || Messenger.timeout; 	   
		Messenger.alert(msg, "success", timeout);	
	},
	
	error: function(msg, timeout){
	    timeout = timeout || Messenger.timeout;
		Messenger.alert(msg, "error", timeout);	
	},
	
	info: function(msg, timeout){
	    timeout = timeout || Messenger.timeout;
		Messenger.alert(msg, "info", timeout);	
	}
}
