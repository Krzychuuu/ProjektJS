$(document).ready(function()
{
	$('#confirm_registration').click(function(event) 
	{
		$('.error').empty();
		console.log("Validating registration form:");
		var nick = $("#nick").val(),
		password = $("#password").val();
		pw_confirm = $("#confirm_password").val();
		if(nick.length === 0 || password.length === 0 || pw_confirm.length === 0)
		{
			$('#error_message').html("Pola nie mogą być puste.");
			event.preventDefault();
		}
		else
		{
			validate(event,[nick,password,pw_confirm]);
		}
	});

	 var validate = function (event,data)
	 {
		var Regex = /[^0-9]+/g;
		var ErrorOccured = false;
		if(!Regex.test(data[0]))
		{
			$('#error_message').html("Nick nie może zaczynać się od cyfry.");
			ErrorOccured = true;
			console.log("Nick zaczyna sie od cyfry.");
		}
		var nick_to_check = $('#nick').val();
		console.log("Nick do sprawdzenia: "+nick_to_check);
		$.ajax(
			{
				type: "POST",
				url: "/user_existance",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({nick: nick_to_check}),
				async: false, 
				success: function (response)
				{             
					if(response)
					{
						$('#error_message').html('Nick zajęty.');
						ErrorOccured = true;
					}
				}
			});
        if(data[2]!==data[1])
        {
			ErrorOccured = true;
			$('#error_message').html("Hasła się nie zgadzają.");
			console.log("Hasła się nie zgadzają.");
		}
		
		if(ErrorOccured)
		{
			event.preventDefault();
			console.log("Errory, nie mogę dodać.");
		}
		else
		{
			console.log("Dodaję.");
			alert("Dodano");
		}
	 };
});




