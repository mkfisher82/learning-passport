var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');

var User = require('./app/models/user');
// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/passport';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function () {
    console.log('Connection to db successful');
});


// Passport set-up and routes here.
app.use(passport.initialize());

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

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/success',
                                    failureRedirect: '/failure'})

  );

/* GET home page. */
app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

app.get('/failure', function(req, res) {
    res.render('failure');
});

app.get('/success', function(req, res) {
    res.render('success');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
