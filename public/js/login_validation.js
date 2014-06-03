/*jshint globalstrict: true, devel: true, browser: true, jquery: true */

$( document ).ready(function() {

	$( "#send_login" ).click(function(event) {
    $('.error').empty();
    var nick = $("#username").val();
    var password = $("#password").val();
    var errorOccured = false;
    
    if(nick.length === 0 || password.length === 0){
      $('#error_message').html("Pola nie mogą być puste.");
      errorOccured = true;
    }
    else
    {
      console.log("sprawdzam hasło "+password+" dla "+nick);
      $.getJSON("/password_existance", function(data)
        {
        	if(data.length === 0)
        	{
	            errorOccured = true;
	            $('#error_message').html("Złe hasło lub nazwa użytkownika.");
            }
        });
    }
    
    if(!errorOccured)
    {
      console.log("Loguję.");
      alert("Sukces");
    }
    else
	{
		event.preventDefault();
	}

	});
});
