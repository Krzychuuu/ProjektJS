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
	socket.on('rented change', function () {
	   give_book_list_nonadmin_out();
	});
	socket.on('returned change', function () {
	   give_rented_books_list_to_return_nonadmin_out();
	});
	$('#give_book_list_nonadmin').click(function()
	{
		if(actual_user===undefined)
		{
			$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		}
		else
		{
			give_book_list_nonadmin_out(actual_user);
		}
	});
	
	$('#give_rented_books_list_nonadmin').click(function()
	{
		if(actual_user===undefined)
		{
			$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		}
		else
		{
			give_rented_books_list_nonadmin_out();
		}
	});
	$('#give_rented_books_list_to_return_nonadmin').click(function()
	{
		if(actual_user===undefined)
		{
			$(".jumbotron > .container").html("<p>Zalgouj się cwaniaczku.</p>");
		}
		else
		{
			give_rented_books_list_to_return_nonadmin_out(actual_user);
		}
	});
	$('#logout').click(function()
	{
		if (confirm("Pewien?")){
			socket.emit('user_logout', actual_user);
			$.get("/logout");
			$(location).attr('href','login.html');
		}
	});
});
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
		$(".jumbotron > .container").append("<table id='booklist2' class='booklist'><tbody><tr class='booklist_top_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		for(var i = 0; i < data.length ; i++){
			$("#booklist2").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr><tr style='display:none'><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
		}
	booksDescribe();
	});
};
var give_book_list_nonadmin_out = function(actual_user)
{
	$.getJSON("/book_list_avaible", function(data)
	{
		$(".jumbotron > .container").html("<h4>Książki dostępne:</h4><h5>(Naciśnij książkę by zobaczyć opis.)");
		$(".jumbotron > .container").append("<table id='booklist1' class='booklist'><tbody><tr class='booklist_top_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		for(var i = 0; i < data.length ; i++){
			$("#booklist1").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
			$("#booklist1").append("<tr style='display:none'><td class='book_description_td' colspan='2'>"+data[i].description+"</td></tr>");
			$("#booklist1").append("<tr class='rent_button'><td colspan='2'><button class='wypożyczenie' title='"+data[i].title+"' author='"+data[i].author+"'>WYPOŻYCZ</button></td></tr>");
		}
		$(".wypożyczenie").click(function()
		{
			var hidden_title = $(this).attr("title");
			var hidden_author = $(this).attr("author");
			$.ajax(
			{
				type: "POST",
				url: "/rent",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({hidden_title: hidden_title, hidden_author:hidden_author}),
				async: false, 
			});
			var data = {
				socket_hidden_title:hidden_title,
				socket_hidden_author:hidden_author,
				socket_actual_user:actual_user,
			};
			socket.emit("rented",data);
			alert("Wypożyczyłeś "+hidden_title+", "+hidden_author);
		});
	});	
	books_rented();
};
var give_rented_books_list_nonadmin_out = function()
{
	$.getJSON("/rented_book_list", function(data)
	{
		$(".jumbotron > .container").html("<h4>Wypożyczone przez Ciebie książki:</h4>");
		$(".jumbotron > .container").append("<table id='booklist' class='booklist'><tbody><tr class='booklist_top_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		for(var i = 0; i < data.length ; i++){
			$("#booklist").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
			//$("#booklist").append("<tr class='rent_button'><td colspan='2'><form action='/rent' method='post'><input type='hidden' value='"+data[i].title+"' id='hidden_title' name='hidden_title'/><input type='hidden' value='"+data[i].author+"' id='hidden_author' name='hidden_author'/><input id='' type='submit' value='wypożycz'/></form></td></tr>");
		}
	});	
};
var give_rented_books_list_to_return_nonadmin_out = function(actual_user)
{
	$.getJSON("/rented_book_list", function(data)
	{
		$(".jumbotron > .container").html("<h4>Wypożyczone przez Ciebie książki:</h4>");
		$(".jumbotron > .container").append("<table id='booklist' class='booklist'><tbody><tr class='booklist_top_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		for(var i = 0; i < data.length ; i++){
			$("#booklist").append("<tr class='book_description_hide_show_tr'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr>");
			$("#booklist").append("<tr class='rent_button'><td colspan='2'><button class='zwrot' title='"+data[i].title+"' author='"+data[i].author+"'>ZWRÓĆ</button></td></tr>");
		}
		$(".zwrot").click(function()
		{
			var hidden_title = $(this).attr("title");
			var hidden_author = $(this).attr("author");
			$.ajax(
			{
				type: "POST",
				url: "/return",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({hidden_title: hidden_title, hidden_author:hidden_author}),
				async: false, 
			});
			var data = {
				socket_hidden_title:hidden_title,
				socket_hidden_author:hidden_author,
				socket_actual_user:actual_user,
			};
			socket.emit("returned",data);
			alert("Zwróciłeś "+hidden_title+", "+hidden_author);
		});
	});	
};
