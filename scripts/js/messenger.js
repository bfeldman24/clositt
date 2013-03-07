var Messenger = {
	
	id: 'messenger',
	position: 'top',
	align: 'center',	
	timeout: 4000,
	width: 300, 
	height: 75,
	
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
			var left = ($(document).width() / 2) - (Messenger.width / 2);
		}else{
			var left = 100;
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
			.css("left",left + "px")
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
		$("#" + Messenger.id).css("display","block");
		
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
