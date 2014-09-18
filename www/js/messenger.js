var Messenger = {
	
	id: 'messenger',
	position: 'top',
	align: 'center',	
	timeout: 4000,
	defaultTimeout: 4000,
	width: 300, 
	height: 75,
	debug: false,
	
	messageBoxTemplate: $('<ul class="messenger messenger-fixed messenger-theme-future"></ul>'),
				
	alertTemplate: $('<li class="messenger-message-slot  ">' +
						'<div class="messenger-message">' +
							'<div class="messenger-message-inner"></div>' +
							'<div class="messenger-spinner">' +
								'<span class="messenger-spinner-side messenger-spinner-side-left">' +
						        	'<span class="messenger-spinner-fill"></span>' +
    							'</span>' +
							    '<span class="messenger-spinner-side messenger-spinner-side-right">' +
							        '<span class="messenger-spinner-fill"></span>' +
							    '</span>' +
							'</div>' +
						'</div>' +
					'</li>'),
				
	
	init: function(){
		if(Messenger.align == 'center'){
			var left = 50;
		}else{
			var left = 0;
		}
		
		if(Messenger.position == 'top'){
			var top = 50;
		}else{
			var top = $(document).height() - Messenger.height;
		}
		
		$('body').append(Messenger.messageBoxTemplate
			.attr("id",Messenger.id)
			.css("display","none")
			.css("top",top + "px")
			.css("left",left + "%")
			.css("min-width",Messenger.width + "px")
		);
	},
	
	alert: function(msg, statusCode){
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
		$("#" + Messenger.id).css("margin-left", "-" + ($("#" + Messenger.id).width() / 2) + "px");		
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
			
		}, Messenger.timeout );
		
		return true;
	},
	
	success: function(msg){
		Messenger.alert(msg, "success");	
	},
	
	error: function(msg){
		Messenger.alert(msg, "error");	
	},
	
	info: function(msg){
		Messenger.alert(msg, "info");	
	}
}
