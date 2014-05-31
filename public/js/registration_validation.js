$(document).ready(function() {
	$('#confirm_registration').click(function(event) {
		$('.error').empty();
      var nick = $("#nick").val(),
          password = $("#password").val();
          pw_confirm = $("#confirm_password").val();
          if(nick.length === 0 || password.length === 0 || pw_confirm.length === 0){
            	$('#error_message').html("Pola nie mogą być puste.");
            	event.preventDefault();
          }else{
          	validate(event,[nick,password,pw_confirm]);
          }
   });

	 var validate = function (event,data) {
		var Regex = /^[a-z]*/;
		var ErrorOccured = false;
		if(!Regex.test(data[0])){
			$('#error_message').html("Nie wprowadzaj cyfr.");
			ErrorOccured = true;
		}
		if(!NickExists(data[0])){
			ErrorOccured = true;
			$('#error_message').html("Nick zajęty.");
		}
		if(data[2]!==data[1]){
			ErrorOccured = true;
			$('#error_message').html("Hasła się nie zgadzają.");
		}
		if(ErrorOccured){
			event.preventDefault();
		}else{
			alert("Dodano");
		}
	 };
	 var NickExists = function(nick) {
	 	return true;
	 };
});




