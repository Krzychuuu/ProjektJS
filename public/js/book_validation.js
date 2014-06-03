/*jshint globalstrict: true, devel: true, browser: true, jquery: true */

$(document).ready(function()
{
	$('#confirm_add_book').click(function(event) 
	{
		$('.error').empty();
		console.log("Validating registration form:");
		var title = $("#title").val();
		var author = $("#author").val();
		var description = $("#description").val();
		
		if(title.length === 0 || author.length === 0 || description.length === 0)
		{
			$('#error_message').html("Pola nie mogą być puste.");
			event.preventDefault();
		}
		else
		{
			alert("Dodano: "+title+" autorstwa: "+author+", z opisem: "+description);
		}
	});
});