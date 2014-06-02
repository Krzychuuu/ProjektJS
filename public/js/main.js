$( document ).ready(function()
{	
	$.getJSON("/show_username", function(data)
	{
		console.log("probuje pobrac username");
		console.log("data.username:"+data.username);
		$('#username_place').html("Zalogowano jako: "+data.username);
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