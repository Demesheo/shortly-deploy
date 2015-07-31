var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var LinkSchema = mongoose.Schema({
  visits : Number,
  link : String,
  title : String,
  code : String,
  base_url : String,
  url : String
});

var Link = mongoose.model('Link', LinkSchema);

var createSha = function (url){
  var shasum = crypto.createHash('sha1');
  shasum.update(model.get('url'));
  return shasum.digest('hex').slice(0, 5);
};

LinkSchema.pre('save', function (next){
  var code = createSha(this.url);
  this.code = code;
  next();
});

module.exports = Link;