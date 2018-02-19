// var passport = require('passport');

module.exports = function(passport) {
    
    // from /auth/github
    exports.auth_github = passport.authenticate('github');

    // from /auth/github/callback
    exports.auth_github_callback = passport.authenticate('github', { successRedirect: '/success',
                                          failureRedirect: '/failure'});

    return exports;
};
