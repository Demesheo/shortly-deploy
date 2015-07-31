var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.reset().fetch().then(function(link) {
    res.send(200, link.models);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          visits: 0
        });

        newLink.save().then(function(newLink) {
          Link.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user){
      if(!user){
        var newUser = new User({
          username : username,
          password : password
        });
        newUser.save(function(err, newUser){
          if(err){
            res.send(500, err);
          }
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
  };

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

   User.findOne({ username: username })
    .exec(function(err, user){
      if(!user){
        res.redirect('/login');
        } else {
          var savedPassword = user.password;
          User.comparePassword(password, savedPassword, function(err, match){
            if(match){
              util.createSession(req, res, user)
            } else {
              res.redirect('/login');
            }
          });
        }
     
      }
    )};

exports.navToLink = function(req, res) {
  Link.findOne({code: req.params[0]}).exec(function(err, link){
    if(!link){
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link){
        res.redirect(link.url);
        return;
      })
    }
  });
};