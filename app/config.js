var mongoose = require('mongoose');
var Bookshelf = require('bookshelf');
var path = require('path');
var grunt = require('grunt');
var test = 'test';


var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI;
mongoose.connect(connectionString);

module.exports = connectionString;
