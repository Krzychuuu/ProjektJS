$(document).ready(function() {
	$('#confirm_registration').click(function(event) {
		$('.error').empty();
      var nick = $("#nick").val(),
          password = $("#password").val();
          pw_confirm = $("#confirm_password").val();
          if(nick.length === 0 || password.length === 0 || pw_confirm.length === 0){
            	$('#error_message').html("Pola nie mogą być puste");
            	event.preventDefault();
          }else{
          	validate(event,[nick,password,confirm]);
          }
   });

	 var validate = function (event,data) {
		var Regex = /^[a-z]*/;
		var ErrorOccured = false;
		if(!Regex.test(data[0])){
			$('#nick_error').html("Nie wprowadzaj cyfr.");
			ErrorOccured = true;
		}
		if(!NickExists(data[0])){
			ErrorOccured = true;
			$("#nick_error").html("Nick zajęty.");
		}
		if(!confirmPasswords(data[1],data[2])){
			ErrorOccured = true;
			$("#confirm_password_error").html("Nie zgadza się.");
		}
		if(ErrorOccured){
			event.preventDefault();
		}else{
			alert("Dodano");
		}
	 };

	 var confirmPasswords = function (a, b) {
	 	if(a === b)
	 	{
	 		return true;
	 	}
	 	else
	 	{
	 		return false;
	 	}
	 };

	 var NickExists = function(nick) {
	 	return true;
	 }
});




