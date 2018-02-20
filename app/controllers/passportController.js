// var passport = require('passport');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

module.exports = function(passport) {

    // from /auth/github
    exports.auth_github = passport.authenticate('github');

    // from /auth/github/callback
    exports.auth_github_callback = passport.authenticate('github', { successRedirect: '/success',
                                          failureRedirect: '/failure'});

    // from /auth/facebook
    exports.auth_facebook = passport.authenticate('facebook');

    // from /auth/facebook/callback
    exports.auth_facebook_callback = passport.authenticate('facebook', { successRedirect: '/success',
                                        failureRedirect: '/failure'});

    exports.get_home = [
        isAuthenticated,

        function(req, res) {
            res.render('home');
        }
    ]

    return exports;
};
