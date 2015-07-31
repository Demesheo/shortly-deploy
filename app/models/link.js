var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LinkSchema= db.Model.extend({
  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});

LinkSchema.on('init', LinkSchema.initialize());

module.exports = mongoose.model('Link', LinkSchema);
