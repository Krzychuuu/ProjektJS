$(document).ready(function()
{
	$('#confirm_registration').click(function(event) 
	{
		$('.error').empty();
		var errorOccured = false;
		console.log("Validating registration form:");
		var Regex = /[^0-9]+/g;
		var nick = $("#nick").val(),
		password = $("#password").val();
		pw_confirm = $("#confirm_password").val();
		if(nick.length === 0 || password.length === 0 || pw_confirm.length === 0)
		{
			$('#error_message').html("Pola nie mogą być puste.");
			errorOccured = true;
		}
		if(!Regex.test(nick))
		{
			$('#error_message').html("Nick nie może zaczynać się od cyfry.");
			errorOccured = true;
			console.log("Nick zaczyna sie od cyfry.");
		}
		$.ajax(
			{
				type: "POST",
				url: "/user_existance",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({nick: nick}),
				async: false, 
				success: function (response)
				{             
					if(response)
					{
						$('#error_message').html('Nick zajęty.');
						errorOccured = true;
					}
				}
			});
		if(password !== pw_confirm)
        {
			errorOccured = true;
			$('#error_message').html("Hasła się nie zgadzają.");
			console.log("Hasła się nie zgadzają.");
		}
		if(!errorOccured)
		{
			console.log("Dodaję.");
			alert("Dodano użytkownika: "+nick+" Możesz się zalogować.");
		}
		else
		{
			event.preventDefault();
		}
	});
});



