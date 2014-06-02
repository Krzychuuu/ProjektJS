$(document).ready(function () {
	$.getJSON("/show_username", function(data)
	{
		$('#username_place').html("Zalogowano jako: "+data.username);
		var actual_user = data.username;
	});	
	$('#give_book_list_nonadmin').click(function(event)
	{
		$(".jumbotron").html("<h4>Książki dostępne:</h4><h5>(Naciśnij książkę by zobaczyć opis.)");
		$(".jumbotron").append("<table id='booklist1' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		$.getJSON("/book_list_avaible", function(data)
			{
				for(var i = 0; i < data.length ; i++){
					$("#booklist1").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					$("#booklist1").append("<tr style='display:none'><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
					$("#booklist1").append("<tr class='rent_button'><td colspan='2'><form action='/rent' method='post'><input type='hidden' value='"+data[i].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[i].author+"' id='hidden_author' name='hidden_author'/><input id='' type='submit' value='wypożycz'/></form></td></tr>");
				}
			});	
		$(".jumbotron").append("<br><h4>Książki wypożyczone:</h4><h5>(Naciśnij książkę by zobaczyć opis.)");
		$(".jumbotron").append("<table id='booklist2' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		$.getJSON("/book_list_rented", function(data)
			{
				for(var i = 0; i < data.length ; i++){
					$("#booklist2").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr><tr style='display:none'><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
				}
			booksDescribe();
			});
	});
	$('#give_book_list_admin').click(function(event)
	{
		$(".jumbotron").html("<h4>Wszystkie książki w bazie:</h4>");
		$(".jumbotron").append("<table id='booklist_admin' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		$.getJSON("/book_list_all", function(data)
			{
				for(var i = 0; i < data.length ; i++){
					$("#booklist_admin").append("<tr class='book_description_admin'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					$("#booklist_admin").append("<tr><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
					if(data[i].status == "yes"){
						$("#booklist_admin").append("<tr class='book_status_td'><td colspan='2'>- wypożyczona -</td></tr>");
					}
					
				}
			});
			
	});
	$('#show_lended_admin').click(function(event)
	{
		$(".jumbotron").html("<h4>Użytkownicy wraz z wypożyczeniami:</h4>");
		$.getJSON("/show_lended_admin_userlist", function(data)
		{
			for(var i = 0; i < data.length ; i++){
				$(".jumbotron").append("<table class='lended_admin' id='lended_admin_"+data[i].user+"'><tbody></tbody></table><br>");
				$("#lended_admin_"+data[i].user).append("<tr class='lended_admin_username'><td colspan='2'>"+data[i].user+"</td></tr>");
				$("#lended_admin_"+data[i].user).append("<tr class='lended_admin_username'><td>Tytuł</td><td>Autor</td></tr>");
				var tmp_username = data[i].user;
				get_books_for_user(tmp_username);
			}
		});
		
		
	});
	$('#give_rented_books_list_nonadmin').click(function(event)
	{
		$(".jumbotron").html("<h4>Wypożyczone przez Ciebie książki:</h4>");
		$(".jumbotron").append("<table id='booklist' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		$.getJSON("/rented_book_list", function(data)
		{
				for(var i = 0; i < data.length ; i++){
					$("#booklist").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					//$("#booklist").append("<tr class='rent_button'><td colspan='2'><form action='/rent' method='post'><input type='hidden' value='"+data[i].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[i].author+"' id='hidden_author' name='hidden_author'/><input id='' type='submit' value='wypożycz'/></form></td></tr>");
				}
		});	
	});
	$('#give_rented_books_list_to_return_nonadmin').click(function(event)
	{
		$(".jumbotron").html("<h4>Wypożyczone przez Ciebie książki:</h4>");
		$(".jumbotron").append("<table id='booklist' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		$.getJSON("/rented_book_list", function(data)
		{
				for(var i = 0; i < data.length ; i++){
					$("#booklist").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					$("#booklist").append("<tr class='rent_button'><td colspan='2'><form action='/return' method='post'><input type='hidden' value='"+data[i].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[i].author+"' id='hidden_author' name='hidden_author'/><input id='' type='submit' value='zwróć'/></form></td></tr>");
				}
		});	
	});
	
});
var get_books_for_user = function(tmp_username){
	$.getJSON("/show_lended_admin_booklist_user", function(data)
				{
					for(var j = 0; j < data.length ; j++)
					{
						if(data[j].user == tmp_username){
							$("#lended_admin_"+data[j].user).append("<tr class='lended_admin_book'><td>"+data[j].title+"</td><td>"+data[j].author+"</td><td><form action='/admin_return' method='post'><input type='hidden' value='"+data[j].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[j].author+"' id='hidden_author' name='hidden_author'/><input type='hidden' value='"+data[j].user+"' id='hidden_user' name='hidden_user'/><input id='' type='submit' value='ZWROT'/></form></td></tr>");
						}
					}
				});
};
	var booksDescribe = function()
	{
		console.log("funkcja");
		$('.book_description_hide_show_tr').each(function()
		{
			$(this).click(function()
			{
				$(this).next().css('background','white');	
				if($(this).next().css('display') == 'table-row')
				{
					$(this).next().css('display','none');
					$(this).css('background','lightgray');
				}
				else
				{
					$(this).next().css('display','table-row');  
					$(this).css('background','darkgray');
				}
			});
		});	 
	};