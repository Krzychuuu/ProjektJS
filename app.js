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
  }

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



passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new LocalStrategy(function (username, password, done) {
	client = mysql.createConnection(sqlInfo);
	client.query("select nick,admin from users where nick='"+username+"' AND password='"+password+"';",function (err,rows){
		var user;
		if(typeof rows !== 'undefined'){
			user = rows[0];
		}
		if(err){
			return done(err);           
		}
		if(!user){
			return done(null,false);           
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

/////////////////////////////routes//////////////////////////////////////////////

app.post('/login',
  passport.authenticate('local', { successRedirect: '/logged',
                                   failureRedirect: '/fail',
                                   failureFlash: true })
);

app.get('/login', function (req, res) {
	res.redirect('login.html');
});

app.get('/fail', function (req, res) {
    res.redirect('login');
});

app.get('/', function(req, res) {
    if (req.user) {
		return res.redirect('logged');
    } else {
        return res.redirect('login');
    }
});

// app.get('/logged', function (req, res) {
	// res.redirect('logged.html');	
// });

app.get('/logged', function (req, res) {
  if(req.user && req.user.admin === 'admin'){
      return res.redirect('admin.html');
  }else{
     return res.redirect('logged.html');
  }
});



server = http.createServer(app);

server.listen(3000, function () {
    console.log('Serwer pod adresem http://localhost:3000/');
});
