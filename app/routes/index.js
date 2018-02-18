var express = require('express');
var router = express.Router();
var passport = require('passport');


router.use(passport.initialize());

router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/success',
                                    failureRedirect: '/failure'})

  );

router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/failure', function(req, res) {
    res.render('failure');
});

router.get('/success', function(req, res) {
    res.render('success');
});

module.exports = router;
