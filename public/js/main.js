$( document ).ready(function()
{
	$('#give_book_list_nonadmin').click(function(event)
	{
		$(".jumbotron").html("<h4>Książki dostępne:</h4>");
		$(".jumbotron").append("<table id='booklist'><tbody><tr id='booklist_title_tr'><td>Tytuł</td><td>Autor</td></tr></tbody></table>");
		$.getJSON("/book_list_avaible", function(data)
			{
				for(var i = 0; i < data.length ; i++){
				$("#booklist").append("<tr id='book_description'><td>"+data[i].title+"</td><td>"+data[i].author+"</td></tr><tr display:table-row><td colspan='2'>"+data[i].description+"</td></tr>");
			}
		});
	});
	$('#book_description').each(function(){
	    $(this).click(function(){
	    	if($(this).next().css('display') == 'table-row')
	    	{
	    		$(this).next().css('display','none');   
	    	}
	    	else
	    	{
	    		$(this).next().css('display','table-row');  
	    	}
	    });
	});
	$('#give_rented_books_list_nonadmin').click(function(event){
		$(".jumbotron").html("psikus");
	});
});
