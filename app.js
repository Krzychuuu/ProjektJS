var http = require('http');

var express = require('express');
var app = express();

var connect = require('connect');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var url = require('url');

var mysql = require('mysql');
var sqlInfo = {
  host: 'localhost', port: '3306',
  user: 'tswbd',
  password: 'tswbd',
  database: 'tsw'
 };

var sessionStore = new connect.session.MemoryStore();
var sessionSecret = 'Sekrecik';
var sessionKey = 'connect.sid';
var server;
var sio;

app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.session({
    store: sessionStore,
    key: sessionKey,
    secret: sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(express.json());

///////////////////////////////////////////
//     logowanie - passport

passport.serializeUser(function (user, done)
{
    done(null, user);
});

passport.deserializeUser(function (obj, done)
{
  done(null, obj);
});

passport.use(new LocalStrategy(function (username, password, done)
{
	client = mysql.createConnection(sqlInfo);
	client.query("select nick,admin from users where nick='"+username+"' AND password='"+password+"';",function (err,rows)
	{
		var user;
		console.log("loguję:");
		console.log(rows);
		if(typeof rows !== 'undefined')
		{
			user = rows[0];
		}
		if(err)
		{
			return done(err);           
		}
		if(!user)
		{
			return done(null, false);           
		}
		return done(null, {username: user.nick, admin: user.admin});
	});
}));

app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.session({
    store: sessionStore,
    key: sessionKey,
    secret: sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

///////////////////////////////////////////
//     przekierowania
app.post('/login', passport.authenticate('local',
{
	successRedirect: '/logged',
	failureRedirect: '/fail',
	failureFlash: true 
}));

app.get('/login', function (req, res)
{
	return res.redirect('login.html');
});

app.get('/fail', function (req, res)
{
	return res.redirect('/login');
});
app.disable('admin.html');
app.get('/admin.html', function (req, res)
{
	return res.redirect('/');
});

app.get('/', function(req, res)
{
    if (req.user) {
		return res.redirect('/logged');
    } 
    else 
    {
        return res.redirect('/login');
    }
});

app.get('/logout', function (req, res)
{
	console.log('Zakończenie sesji');
	req.logout();
	client.end(function(err)
	{
		console.log("Rozłączono z mysql");
	});
	return res.redirect('/');
});

app.get('/logged', function (req, res)
{
  if(req.user && req.user.admin === 'admin')
  {
      return res.redirect('admin.html');
  }
  else
  {
     return res.redirect('logged.html');
  }
});
app.get('/show_username', function (req, res)
{
	console.log("aktualnie jako: "+req.user.username);
	return res.send({username: req.user.username});
});


app.get('/book_list_all', function (req, res) {
	if(req.user && req.user.admin === 'admin')
	{
	    client = mysql.createConnection(sqlInfo);
	    if(req.user)
	    client.query('SELECT title,author,description,status FROM books ;',function (err,rows){
	    if(err){
	      console.log(err);           
	    }
	       return res.send(rows);  
	    });
	}
	else
	{
		 return res.redirect('/login');
	}

});
app.get('/show_lended_admin_userlist', function (req, res) {
	if(req.user && req.user.admin === 'admin')
	{
		client1 = mysql.createConnection(sqlInfo);
		client1.query('SELECT DISTINCT user FROM lended ;',function (err,rows)
			{
			if(err){
			console.log(err);           
			}
			return res.send(rows);  
		});		
	}
	else
	{
		 return res.redirect("/login");
	}

});
app.get('/show_lended_admin_booklist_user', function (req, res) {
	client1 = mysql.createConnection(sqlInfo);
	client1.query('SELECT user,title,author FROM lended ;',function (err,rows)
		{
		if(err){
		console.log(err);           
		}
		return res.send(rows);  
	});
});

app.get('/rented_book_list', function (req, res) {
    if(req.user)
    {
    		    client = mysql.createConnection(sqlInfo);
	    console.log(req.user);
	    client.query('SELECT title,author FROM lended WHERE user ="'+req.user.username+'";',function (err,rows){
	    if(err){
	      console.log(err);           
	    }
	       return res.send(rows);  
	    });
    }
    else
    {
    	return res.redirect("/login");
    }

});
app.get('/book_list_avaible', function (req, res) {
    if(req.user)
    {
	    client = mysql.createConnection(sqlInfo);
	    client.query('SELECT title,author,description FROM books WHERE status ="not";',function (err,rows){
	    if(err){
	      console.log(err);           
	    }
	       return res.send(rows);  
	    });
    }
    else
    {
    	return res.redirect("/login");
    }

});

app.get('/book_list_rented', function (req, res) {
    if(req.user)
    {
		client = mysql.createConnection(sqlInfo);
	    client.query('SELECT title,author,description FROM books WHERE status ="yes";',function (err,rows){
	    if(err){
	      console.log(err);           
	    }
	       return res.send(rows);  
	    });
    }
	else
	{
		return res.redirect("/login");
	}
});
///////////////////////////////////////////
//     zwrot książki

app.post('/return', function (req, res)
{
	var rented_title = req.body.hidden_title;
	var rented_author = req.body.hidden_author;
	console.log("trying to return: "+rented_title+", "+rented_author);
	client = mysql.createConnection(sqlInfo);
   	var sql = client.query('UPDATE books SET status ="not" WHERE title = "'+rented_title+'" AND author = "'+rented_author+'";',function(err, result) {});
   	var to_return = {
   		user: req.user.username,
   		title: rented_title,
   		author: rented_author
   		};
   	var sql1 = client.query('DELETE FROM lended WHERE user = "'+req.user.username+'" AND title = "'+rented_title+'" AND author = "'+rented_author+'" ;', function (err,rows)
   	{
   		console.log(rented_title+", "+rented_author+" rented to: "+req.user.username);
	    if(err)
	    {
	    	console.log(err);           
	    }
   	});
	return res.redirect('/');
});
///////////////////////////////////////////
//     zwrot książki przez admina

app.post('/admin_return', function (req, res)
{
	var rented_title = req.body.hidden_title;
	var rented_author = req.body.hidden_author;
	var renting_user = req.body.hidden_user;
	console.log("trying to return: "+rented_title+", "+rented_author);
	client = mysql.createConnection(sqlInfo);
   	var sql = client.query('UPDATE books SET status ="not" WHERE title = "'+rented_title+'" AND author = "'+rented_author+'";',function(err, result) {});
   	var sql1 = client.query('DELETE FROM lended WHERE user = "'+renting_user+'" AND title = "'+rented_title+'" AND author = "'+rented_author+'" ;', function (err,rows)
   	{
   		console.log(rented_title+", "+rented_author+" rented to: "+req.user.username);
	    if(err)
	    {
	    	console.log(err);           
	    }
   	});
	return res.redirect('/');
});
///////////////////////////////////////////
//     wypożyczenie książki

app.post('/rent', function (req, res)
{
	var rented_title = req.body.hidden_title;
	var rented_author = req.body.hidden_author;
	console.log("trying to rent: "+rented_title+", "+rented_author);
	client = mysql.createConnection(sqlInfo);
   	var sql = client.query('UPDATE books SET status ="yes" WHERE title = "'+rented_title+'" AND author = "'+rented_author+'";',function(err, result) {});
   	var to_rent = {
   		user: req.user.username,
   		title: rented_title,
   		author: rented_author
   		};
   	var sql1 = client.query('INSERT INTO lended SET ? ;', to_rent, function (err,rows)
   	{
   		console.log(rented_title+", "+rented_author+" rented to: "+req.user.username);
	    if(err)
	    {
	    	console.log(err);           
	    }
   	});
	return res.redirect('/');
});

///////////////////////////////////////////
//     rejestracja usera

app.get('/signup', function (req, res)
{
	return res.redirect('signup.html');
});

app.post('/register_user', function (req, res)
{
	var data = req.body;
	delete data['confirm_password'];
    client = mysql.createConnection(sqlInfo);
   	var sql = client.query('INSERT INTO users SET ? ;',data,function (err,rows)
    {
		console.log("registered");
	    if(err)
	    {
	    	console.log(err);           
	    }
  	});
	return res.redirect('/');
});

///////////////////////////////////////////
//     dodawanie książki

app.get('/add_book', function (req, res)
{
	if(req.user && req.user.admin === 'admin')
	{
		return res.redirect('add_book.html');
	}
	else
	{
    	return res.redirect('/login');
	}
});

app.post('/add_book', function (req, res)
{
	var data = req.body;
    client = mysql.createConnection(sqlInfo);
   	var sql = client.query('INSERT INTO books SET ? ;',data,function (err,rows)
    {
		console.log("book added");
	    if(err)
	    {
	    	console.log(err);           
	    }
  	});
	return res.redirect('/');
});

///////////////////////////////////////////
//     mysql validation

app.post('/user_existance', function (req, res)
{
	var nick_to_check = req.body.nick;
    client = mysql.createConnection(sqlInfo);
    client.query("select nick from users where nick='"+nick_to_check+"';",function (err,rows)
    {
		console.log(rows);
		if(err)
		{
			console.log(err);           
		}
		if(rows) 
		{
			if(rows[0])
			{
		    	return res.send(true);  
		  	}
		  	else
		  	{
		    	return res.send(false);  
		  	}
		}
		else
		{
			console.log("not found in db");
			return res.send(false);  
		}
	});
});
app.get('/password_existance', function (req, res)
{
	var nick_to_check = req.body.username;
	var pass_to_check = req.body.password;
    client = mysql.createConnection(sqlInfo);
    client.query("select nick,password from users WHERE nick='"+nick_to_check+"' AND password = '"+pass_to_check+"';",function (err,rows)
    {
	    if(err){
	      console.log(err);           
	    }
	       return res.send(''+rows.length);  
	    });
});
///////////////////////////////////////////
//     serwer start

server = http.createServer(app);

server.listen(3000, function ()
{
    console.log('Serwer pod adresem http://localhost:3000/');
});
