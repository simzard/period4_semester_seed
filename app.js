var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

var config = require('./config/config');

var passport = require("passport");
var passportConfig = require("./config/passport");
passportConfig(passport);

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/*
app.use(session({
    secret: 'simzardo',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 2 * 60 * 1000 } // should only be valid for 2 minutes - good for testing :)
}));
*/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);


app.use('/api', function(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user, info) {
        if (err) {
        	res.status(403).json({message: "Token could not be authenticated", fullError: err})
        	//res.render('guest');
        }        
        if (user) {
        	return next(); 
        }
        
        return res.status(403).json({message: "Token could not be authenticated", fullError: info});
        //res.render('guest');
    })(req, res, next);
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
