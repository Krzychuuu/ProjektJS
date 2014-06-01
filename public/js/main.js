$( document ).ready(function()
{
	$('#give_book_list_nonadmin').click(function(event)
	{
		$(".jumbotron").html("<table id='booklist'><tbody><tr><td>Tytuł</td><td>Autor</td><td>Opis</td></tr>");
		$.getJSON("/book_list_avaible", function( data )
			{
				for(var i = 0; i < data.length ; i++){
				$("#booklist").append("<tr><td>"+data[i].title+"</td><td>"+data[i].author+"</td><td>"+data[i].description+"</td></tr>");
			}
		});
	});
});