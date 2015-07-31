var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = mongoose.Schema({
	username  : { type: String, required : true, index : { unique : true } },
	password  : {type : String, required : true } 
});

var User = mongoose.model( 'User', UserSchema );

User.prototype.comparePassword = function(attemptedPassword, callback) {
	bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
		callback(isMatch);
	});
};


module.exports = User;