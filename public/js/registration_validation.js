$(document).ready(function()
{
	$('#confirm_registration').click(function(event) 
	{
		$('.error').empty();
		console.log("Validating registration form:");
		var Regex = /[^0-9]+/g;
		var nick = $("#nick").val(),
		password = $("#password").val();
		pw_confirm = $("#confirm_password").val();
		if(nick.length === 0 || password.length === 0 || pw_confirm.length === 0)
		{
			$('#error_message').html("Pola nie mogą być puste.");
			event.preventDefault();
		}
		if(!Regex.test(nick))
		{
			$('#error_message').html("Nick nie może zaczynać się od cyfry.");
			event.preventDefault();
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
						event.preventDefault();
					}
				}
			});
		if(password !== pw_confirm)
        {
			event.preventDefault();
			$('#error_message').html("Hasła się nie zgadzają.");
			console.log("Hasła się nie zgadzają.");
		}
		console.log("Dodaję.");
		alert("Dodano użytkownika: "+nick_to_check);
	});
});



