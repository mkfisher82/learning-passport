var express = require('express');
var router = express.Router();
var passport = require('passport');
var passport_config = require('../config/passport');
var passport_controller = require('../controllers/passportController');


router.use(passport.initialize());

router.get('/auth/github', passport_controller.auth_github);

router.get('/auth/github/callback', passport_controller.auth_github_callback);

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
