var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/user');

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
    clientID: '84663f1ca58bb184cc5f',
    clientSecret: '7e296dc502af6ef6a6c29ed18e3c9880dd0895e6',
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(accessToken + ':' + profile);
      User.findOne({ 'github.id': profile.id }, function (err, user) {
          console.log(user);
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
