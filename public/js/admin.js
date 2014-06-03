var socket = io.connect('http://' + location.host);

$(document).ready(function () {
	var actual_user;
	if($('#username_place').length > 0){
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
	$('#give_book_list_admin').click(function(event)
	{
		$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		$.getJSON("/book_list_all", function(data)
			{
				$(".jumbotron > .container").html("<h4>Wszystkie książki w bazie:</h4>");
				$(".jumbotron > .container").append("<table id='booklist_admin' class='booklist'><tbody><tr class='booklist_top_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
				for(var i = 0; i < data.length ; i++){
					$("#booklist_admin").append("<tr class='book_title_author_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
					$("#booklist_admin").append("<tr><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
					if(data[i].status == "yes"){
						$("#booklist_admin").append("<tr class='book_status_td'><td colspan='2'>- wypożyczona -</td></tr>");
					}
					
				}
			});
	});
	$('#show_logged_users').click(function(event)
	{
		socket.emit('socket_show_logged_users');
		$(".jumbotron > .container").html("<ul id='logged_user_list'>Zalogowani użytkownicy:</ul>");
	});	
	socket.on('logged users', function(logged_users)
	{
		if($('#logged_user_list').length > 0)
		{
		$("#logged_user_list > li").empty();
		for (i=0;i<logged_users.length;i++){
			$("#logged_user_list").append("<li>"+logged_users[i]+"</li>");
		}
		};
	});

	$('#show_lended_admin').click(function(event)
	{
		$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		$.getJSON("/show_lended_admin_userlist", function(data)
		{
			$(".jumbotron > .container").html("<h4>Użytkownicy wraz z wypożyczeniami:</h4>");
			for(var i = 0; i < data.length ; i++){
				$(".jumbotron > .container").append("<table class='lended_admin' id='lended_admin_"+data[i].user+"'><tbody></tbody></table><br>");
				$("#lended_admin_"+data[i].user).append("<tr class='lended_admin_username'><td colspan='2'>"+data[i].user+"</td></tr>");
				$("#lended_admin_"+data[i].user).append("<tr class='lended_admin_username'><td>Tytuł</td><td>Autor</td></tr>");
				var tmp_username = data[i].user;
				get_books_for_user(tmp_username);
			}
		});
		
			
	});

	$('#logout').click(function(event)
	{
		socket.emit('user_logout', actual_user);
		$.get("/logout");
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
			$(".jumbotron > .container").append("<br><h4>Książki wypożyczone:</h4><h5>(Naciśnij książkę by zobaczyć opis.)");
			$(".jumbotron > .container").append("<table id='booklist2' class='booklist'><tbody><tr class='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
			for(var i = 0; i < data.length ; i++){
				$("#booklist2").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr><tr style='display:none'><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
			}
		booksDescribe();
		});
	};