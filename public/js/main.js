var socket = io.connect('http://' + location.host);
$(document).ready(function () {
	var actual_user;
	if($('#username_place')){
		$.getJSON("/show_username", function(data)
		{
			$('#username_place').html("Zalogowano jako: "+data.username);
			actual_user = data.username;
		});	
	}
	socket.on('connect', function () {
	    console.log("socket dziala");
	    socket.emit('new_user_logged', actual_user);
	});
	$('#give_book_list_nonadmin').click(function(event)
	{
		$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		$.getJSON("/book_list_avaible", function(data)
			{
				$(".jumbotron").html("<h4>Książki dostępne:</h4><h5>(Naciśnij książkę by zobaczyć opis.)");
				$(".jumbotron").append("<table id='booklist1' class='booklist'><tbody><tr class='booklist_top_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
				for(var i = 0; i < data.length ; i++){
					$("#booklist1").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					$("#booklist1").append("<tr style='display:none'><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
					$("#booklist1").append("<tr class='rent_button'><td colspan='2'><form action='/rent' method='post'><input type='hidden' value='"+data[i].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[i].author+"' id='hidden_author' name='hidden_author'/><input id='' type='submit' value='wypożycz'/></form></td></tr>");
				}
			});	
			books_rented();
	});
	$('#give_rented_books_list_nonadmin').click(function(event)
	{
		$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		$.getJSON("/rented_book_list", function(data)
		{
				$(".jumbotron").html("<h4>Wypożyczone przez Ciebie książki:</h4>");
				$(".jumbotron").append("<table id='booklist' class='booklist'><tbody><tr class='booklist_top_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
				for(var i = 0; i < data.length ; i++){
					$("#booklist").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					//$("#booklist").append("<tr class='rent_button'><td colspan='2'><form action='/rent' method='post'><input type='hidden' value='"+data[i].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[i].author+"' id='hidden_author' name='hidden_author'/><input id='' type='submit' value='wypożycz'/></form></td></tr>");
				}
		});	
	});
	$('#give_rented_books_list_to_return_nonadmin').click(function(event)
	{
		$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		$.getJSON("/rented_book_list", function(data)
		{
				$(".jumbotron").html("<h4>Wypożyczone przez Ciebie książki:</h4>");
				$(".jumbotron").append("<table id='booklist' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
				for(var i = 0; i < data.length ; i++){
					$("#booklist").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					$("#booklist").append("<tr class='rent_button'><td colspan='2'><form action='/return' method='post'><input type='hidden' value='"+data[i].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[i].author+"' id='hidden_author' name='hidden_author'/><input id='' type='submit' value='zwróć'/></form></td></tr>");
				}
		});	
	});
	$('#logout').click(function(event)
	{
		if (confirm("Pewien?")){
			socket.emit('user_logout', actual_user);
			$.get("/logout");
			$(location).attr('href','login.html');
		}
	});
});
var get_books_for_user = function(tmp_username){
	$.getJSON("/show_lended_admin_booklist_user", function(data)
				{
					for(var j = 0; j < data.length ; j++)
					{
						if(data[j].user == tmp_username){
							$("#lended_admin_"+data[j].user).append("<tr class='lended_admin_book'><td>"+data[j].title+"</td><td>"+data[j].author+"</td><td class='admin_return_td'><form action='/admin_return' method='post'><input type='hidden' value='"+data[j].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[j].author+"' id='hidden_author' name='hidden_author'/><input type='hidden' value='"+data[j].user+"' id='hidden_user' name='hidden_user'/><input id='' type='submit' value='ZWROT'/></form></td></tr>");
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
	var books_rented = function()
	{
		$.getJSON("/book_list_rented", function(data)
		{
			$(".jumbotron").append("<br><h4>Książki wypożyczone:</h4><h5>(Naciśnij książkę by zobaczyć opis.)");
			$(".jumbotron").append("<table id='booklist2' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
			for(var i = 0; i < data.length ; i++){
				$("#booklist2").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr><tr style='display:none'><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
			}
		booksDescribe();
		});
	};
