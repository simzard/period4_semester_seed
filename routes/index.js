var express = require('express');
var router = express.Router();
var users = require('../facade/user');
var User = require('../model/user')
const jwtConfig = require('../config/jwtconfig').jwtConfig;
var passport = require("passport");

var jwt = require('jwt-simple');

/* GET home page. */
router.get('/', function (req, res, next) {
	passport.authenticate('jwt', {session: false}, function(err, user, info) {
        if (err) {
        	//res.status(403).json({message: "Token could not be authenticated", fullError: err})
        	res.render('guest');
        }        
        if (user) {
        	console.log("user: " + user);        	
        	return next(); 
        }
        
        //return res.status(403).json({message: "Token could not be authenticated", fullError: info});
        res.render('guest');
    })(req, res, next);
	
	
	
    // determine which page to render based on the user role
    var currentUser = req.session.user;
        
    if (currentUser.role == 'admin') {
        res.render('admin', {userObj: currentUser});
    } else if (currentUser.role == 'user') {
        res.render('user', {userObj: currentUser});
    } else {
    	// bad user role - just render the guest page
    	res.render('guest');
    }
    
    //res.render('guest');
    next();

});


router.get("/logout", function (req, res, next) {
    req.session.destroy(); // clear the session so that it will not be set any more
    res.redirect('/');
});

router.get("/login", function (req, res, next) {
    res.render('login');
});

router.get("/adduser", function (req, res, next) {
    res.render('adduser');
});

// create a new user account (POST http://localhost:8080/api/signup)
router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password || !req.body.role) {
        res.json({success: false, msg: 'Please pass username and password and role.'});
    } else {
        console.log("req.body.name:" + req.body.username + ", req.body.password: " + req.body.password);
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            //res.status(401).send({msg: 'Authentication failed. User not found.'});
            res.render('login', {errormsg: 'Authentication failed. User not found.'});
            
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var iat = new Date().getTime() / 1000; // convert to seconds
                    var exp = iat + jwtConfig.tokenExpirationTime;
                    var payload = {
                        aud: jwtConfig.audience,
                        iss: jwtConfig.issuer,
                        iat: iat,
                        exp: exp,
                        sub: user.userName
                    };
                    var token = jwt.encode(payload, jwtConfig.secret);
                    // return the information including token as JSON
                    //res.json({success: true, token: 'JWT ' + token});
                    if (user.role == 'admin') {
        				res.render('admin', {userObj: user, token: 'JWT ' + token});
    				} else if (currentUser.role == 'user') {
        				res.render('user', {userObj: user, token: 'JWT ' + token});
    				} 
                } else {
                    res.render('guest', {errormsg: 'Authentication failed. Wrong password.'})
                    //res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

module.exports = router;
