var express = require('express');
var router = express.Router();
var users = require('../facade/user');
var User = require('../model/user')
const jwtConfig = require('../config/jwtconfig').jwtConfig;
var passport = require("passport");

var jwt = require('jwt-simple');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
            res.status(401).send({msg: 'Authentication failed. User not found.'});
            //res.render('login', {errormsg: 'Authentication failed. User not found.'});
            
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
                    res.json({success: true, token: 'JWT ' + token});
                     
                } else {
                    //res.render('guest', {errormsg: 'Authentication failed. Wrong password.'})
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});


module.exports = router;
