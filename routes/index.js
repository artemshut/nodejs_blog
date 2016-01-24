var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var log = require('../libs/log')(module);
var PostProvider = require('../providers/postProvider').PostProvider;
var postProvider = new PostProvider('localhost', 27017);

router.get('/', function(req, res){
  postProvider.findAll(function(error, docs){
      res.render('posts.jade', {
            title : 'Blog',
            posts : docs
          }
      );
  })
});

router.get('/posts/new', function(req, res) {
  res.render('post_new.jade', {
      title: 'New Post'
    }
  );
});

router.post('/posts/new', function(req, res){
    postProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function(error, docs) {
        res.redirect('/')
    });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    	log.warn(err);
      if (err) {
          return res.render('register', { user : user });
      }

      passport.authenticate('local')(req, res, function () {
          res.redirect('/');
      });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;