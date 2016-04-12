/**
 * Created by simon on 3/31/16.
 */

var UserSchema = require('../model/user');


module.exports.getUser = function (username, password, callback) {

    UserSchema.findOne({username: username, password: password}, function (err, user) {
        if (err) {
            callback(err);
        }

        callback(null, user);
    });
};


module.exports.addUser = function (username, password, role, callback) {
    if (username != undefined && password != undefined && role != undefined) {
        // this makes sure that usernames are unique
        UserSchema.findOne({username: username}, function (err, user) {
            if (err) {
                callback(err);
            } else if (user) {
                callback(new Error("Ooops in addUser(username, password, role): Username '" + username + "' is already taken"));
            } else {
                var userToAdd = UserSchema({
                    username: username,
                    password: password,
                    role: (role == 'admin' ? 'admin' : 'user')
                });

                userToAdd.save(function (err) {
                    console.log("user saved!");
                    if (err) {
                        callback(err);
                    }
                });
            }
        });
    }



};

module.exports.deleteUser = function (username) {
    UserSchema.remove({username: username}, function (err, result) {
        if (err) {
            throw "Ooops in deleteUser: " + err;
        }
    });
};

