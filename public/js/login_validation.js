$( document ).ready(function() {

  
 	$( "#send_login" ).click(function(event) {
  		
  		var username = $("#username").val();
  		var password = $("#password").val();

  		if(username.length === 0 || password.length === 0){
  			$('#error_message').html("Pola nie mogą być puste.");
  			event.preventDefault();
  		}
	});
});
