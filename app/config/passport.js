
var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');


module.exports = function(passport) {
    // Passport set-up here.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GitHubStrategy({
        clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, cb) {

          User.findOne({ 'github.id': profile.id }, function (err, user) {

              if (err) {
                  return cb(err);
              }
              if (user) {
                  return cb(null, user);
              } else {
                  console.log('This user does not have a profile')

                  var newUser = new User();

                  newUser.github.id = profile.id;
                  newUser.github.username = profile.username;
                  newUser.github.displayName = profile.displayName;
                  newUser.github.publicRepos = profile._json.public_repos;

                  newUser.save(function (err) {
                      if (err) {
                          throw err;
                      }

                      return cb(null, newUser);
                  });
              }
          });
      }
    ));

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_KEY,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {

            if (err) {
                return cb(err);
            }
            if (user) {
                return cb(null, user);
            } else {
                console.log('This user does not have a profile')

                var newUser = new User();

                newUser.facebook.id = profile.id;
                newUser.facebook.displayName = profile.displayName;

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }

                    return cb(null, newUser);
                });
            }
        });
      }
    ));
}
