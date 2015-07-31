var mongoose = require('mongoose');
var Bookshelf = require('bookshelf');
var path = require('path');
var grunt = require('grunt');
var test = 'test';


var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/shortlydb';
mongoose.connect(connectionString);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
	console.log('MongoDB connection open');
});

module.exports = db;
