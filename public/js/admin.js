/*jshint globalstrict: true, devel: true, browser: true, jquery: true */
/* global io */

var socket = io.connect();


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
	$('#give_book_list_admin').click(function()
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
	$('#show_logged_users').click(function()
	{
		socket.emit('socket_show_logged_users');
		$(".jumbotron > .container").html("<ul id='logged_user_list'>Zalogowani użytkownicy (odświeżanie real time):</ul>");
	});	
	socket.on('logged users', function(logged_users)
	{
		if($('#logged_user_list').length > 0)
		{
			$("#logged_user_list > li").remove();
			for (var i=0;i<logged_users.length;i++){
				$("#logged_user_list").append("<li>"+logged_users[i]+"</li>");
			}
		}
	});
	$('#show_lended_admin').click(function()
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
	$('#logout').click(function()
	{
		if (confirm("Pewien?")){
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
