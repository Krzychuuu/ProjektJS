function mainPage()
{
	window.location="index.html";
}

function dbShowAll()
{
	document.getElementById("content").innerHTML=books({title:"test1"});
}
