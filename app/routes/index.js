var express = require('express');
var router = express.Router();

var passport_controller = require('../controllers/passportController');

module.exports = function(passport) {

	router.get('/auth/github', passport_controller(passport).auth_github);

	router.get('/auth/github/callback', passport_controller(passport).auth_github_callback);

	router.get('/', function(req, res) {
	    res.render('index', { title: 'Express' });
	});

	router.get('/failure', function(req, res) {
	    res.render('failure');
	});

	router.get('/success', function(req, res) {
	    console.log(req.session);
	    res.render('success');
	});

	return router;
}
