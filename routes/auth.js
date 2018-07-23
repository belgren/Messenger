var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  router.get('/', function(req, res){
    if (req.user){
      res.redirect('/contacts');
      return;
    }
    res.redirect('/login')
  });

  router.get('/signup', function(req, res){
    res.render('signup')
  });

  router.post('/signup', function(req, res){
    if (req.body.username && req.body.password && req.body.password_repeat
        && req.body.password==req.body.password_repeat){
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      })
      newUser.save(function(err){
        if (err){
          res.send('failed to save user');
          return;
        }
        //res.send('saved user to db');
        res.redirect('/login');
      })
    }
    else{
      res.redirect('/signup');
    }
  });

  router.get('/login', function(req, res){
    res.render('login');
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login'
  }));

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  })
  
  return router;
}
