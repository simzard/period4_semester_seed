var users = require('../facade/user');

// validate function to validate username and password by using the model (mongoose)
module.exports.validate = function (username, password) {
    // returns boolean value based on the result of the validation
    // OR should it instead return the user object or NULL ??????
    // sessions issue here! ;-)

    //var user = users.getUser(username, password) {

    //}


};