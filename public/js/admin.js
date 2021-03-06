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
	socket.on('admin status panel change return', function (data) {
		$('#whats_going_on_status').html("Użytkownik "+data.socket_actual_user+" zwrócił "+data.socket_hidden_title+" autorstwa "+data.socket_hidden_author);
		if($('#booklist_admin').length > 0)
		{
			give_book_list_admin_out();
		}
		if($('#lended_admin').length > 0)
		{
			show_lended_admin_out();
		}
	});
	socket.on('admin status panel change rent', function (data) {
		$('#whats_going_on_status').html("Użytkownik "+data.socket_actual_user+" wypożyczył "+data.socket_hidden_title+" autorstwa "+data.socket_hidden_author);
		if($('#booklist_admin').length > 0)
		{
			give_book_list_admin_out();
		}
	});
	socket.on('rented_change', function()
	{
		if($('#lended_admin').length > 0)
		{
			show_lended_admin_out();
		}
	});
	socket.on('returned_change', function()
	{
		if($('#lended_admin').length > 0)
		{
			show_lended_admin_out();
		}
	});
	socket.on('admin status user logged', function (data) {
		$('#whats_going_on_status').html(data+" zalogował się.");
	});
	socket.on('admin status user loggedout', function (data) {
		$('#whats_going_on_status').html(data+" wylogował się.");
	});
	$('#give_book_list_admin').click(function()
	{
		if(actual_user===undefined)
		{
			$(".jumbotron > .container").html("<p>Zaloguj się cwaniaczku.</p>");
		}
		else
		{
			give_book_list_admin_out();
		}
	});
	$('#show_logged_users').click(function()
	{
			$(".jumbotron > .container").html("<ul id='logged_user_list'>Zalogowani użytkownicy (odświeżanie real time):</ul>");
			socket.emit('socket_show_logged_users');			
	});	
	socket.on('logged users', function(logged_users)
	{
		if(actual_user===undefined)
		{
			$(".jumbotron > .container").html("<p>Zaloguj się cwaniaczku.</p>");
		}
		else
		{
		if($('#logged_user_list').length > 0)
		{
			$("#logged_user_list > li").remove();
			for (var i=0;i<logged_users.length;i++){
				$("#logged_user_list").append("<li>"+logged_users[i]+"</li>");
			}
		}
		}
	});
	$('#show_lended_admin').click(function()
	{
		if(actual_user===undefined)
		{
			$(".jumbotron > .container").html("<p>Zaloguj się cwaniaczku.</p>");
		}
		else
		{
			show_lended_admin_out();
		}			
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
			if(data[j].user === tmp_username){
				$("#lended_admin"+data[j].user).append("<tr class='lended_admin_book'><td>"+data[j].title+"</td><td>"+data[j].author+"</td><td class='admin_return_td'><button class='zwrot_admin' title='"+data[j].title+"' author='"+data[j].author+"' user='"+data[j].user+"'>ZWROT</button></td></tr>");
			}
		}
	get_return_admin_button();
	});
};
var give_book_list_admin_out = function()
{
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
};
var show_lended_admin_out = function()
{
	$.getJSON("/show_lended_admin_userlist", function(data)
	{
		$(".jumbotron > .container").html("<h4>Użytkownicy wraz z wypożyczeniami:</h4>");
		for(var i = 0; i < data.length ; i++){
			$(".jumbotron > .container").append("<table class='lended_admin' id='lended_admin"+data[i].user+"'><tbody></tbody></table><br>");
			$("#lended_admin"+data[i].user).append("<tr class='lended_admin_username'><td colspan='2'>"+data[i].user+"</td></tr>");
			$("#lended_admin"+data[i].user).append("<tr class='lended_admin_username'><td>Tytuł</td><td>Autor</td></tr>");
			var tmp_username = data[i].user;
			get_books_for_user(tmp_username);
		}
	});
};
var get_return_admin_button = function()
{
		$(".zwrot_admin").click(function()
			{
				var hidden_title = $(this).attr("title");
				var hidden_author = $(this).attr("author");
				var hidden_user = $(this).attr("user");
				$.ajax(
				{
					type: "POST",
					url: "/admin_return",
					dataType: "json",
					contentType: "application/json",
					data: JSON.stringify({hidden_title: hidden_title, hidden_author:hidden_author, hidden_user:hidden_user}),
					async: false, 
				});
				var data = {
					socket_hidden_title:hidden_title,
					socket_hidden_author:hidden_author,
					socket_actual_user:hidden_user,
				};
				socket.emit("returned",data);
				alert("done");
		});
};
