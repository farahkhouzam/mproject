

var express = require('express');
var path =  require('path');
var cookieparser = require('cookie-parser');
var bodyparser = require('body-parser');
//var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var Flash = require('req-flash');
var session = require('express-session');
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://localhost/myproject');
var db = mongoose.connection;
//$('a.external').attr('target', '_blank');



var routes = require('./routes/index');
var users = require('./routes/users');

//init app
var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));



//bodyparser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true}));
app.use(cookieparser());


//set static folder (css,..something that is accessable for all files)
app.use(express.static(path.join(__dirname,'public')));

//express session
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());


//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect flash
app.use(flash());

//global variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
  res.locals.username = req.username;
  res.locals.user = req.user || null;
  res.locals.flag = false;
	next();
});

app.use('/',routes);
app.use('/users',users);




// start the server
app.listen(8080, function(){
    console.log("server is listening on port 8080");
});



