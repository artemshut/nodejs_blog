// var checkAuth = require('../middleware/checkAuth');

// module.exports = function(app) {

//     app.get('/', require('./frontpage').get);

//     app.get('/login', require('./login').get);
//     app.post('/login', require('./login').post);

//     app.post('/logout', require('./logout').post);

//     // app.get('/chat', checkAuth, require('./chat').get);

// };


var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var log = require('../libs/log')(module);


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
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

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;