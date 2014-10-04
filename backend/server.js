/*jslint node: true */
'use strict';

var express = require('express'),
  vts = require('./routes/vts'),
  users = require('./routes/users');

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

// server //
var FACEBOOK_APP_ID = "781476481883407";
var FACEBOOK_APP_SECRET = "5f42a96dd2950b4be69ce0fcf8dd69c8";
var FACEBOOK_CALLBACK_URI = "http://virtualmonument.co/auth/facebook/callback";

// Cyril app ID //
// var FACEBOOK_APP_ID = "754983211225886";
// var FACEBOOK_APP_SECRET = "593acf13a4ae2cbdc176e8763a3cc74b";
// var FACEBOOK_CALLBACK_URI = "http://localhost:3000/auth/facebook/callback";

// Eden app ID //
// var FACEBOOK_APP_ID = "1451628085120058";
// var FACEBOOK_APP_SECRET = "3ed332ed5bab913f68dc891a0277d62e";
// var FACEBOOK_CALLBACK_URI = "http://localhost:3000/auth/facebook/callback";

// config 
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URI
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(done);
    console.log(profile);
    users.findOneOrCreateUser(accessToken, profile, done);
  }
));

var app = express();

app.configure(function() {
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.cookieParser()); // for fb login
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: 'virtual_tombstone'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(express.bodyParser({ uploadDir: __dirname + '/../www/img/face' }));
  app.use(app.router);
});

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  users.findUserById(id, done);
});

// redirect
app.get('/*', function(req, res, next) {
  var isOld = req.headers.host.match(/virtualtombstone/);
  if(isOld){
    console.log("******redirect", url);
    var url = ['http://virtualmonument.co', req.url].join('');
    res.redirect(301, url)
  } else {
    next();
  }
});
// routes
app.get('/vts', vts.findAll); // retrieve all virtual tombstones
app.get('/vts/:id', vts.findById); // retrieve the virtual tombstone by id
app.put('/vts/:id', vts.updateVt); // update virtual tombstone by id
app.delete('/vts/:id', vts.deleteVt); // delete virtual tombstone by id
//app.options('/vts/:id', vts.deleteVt);  // for jquery test

app.get('/vts/:id/msgs', vts.getAllMessages);
app.post('/vts/:id/msgs', ensureAuthenticated, vts.addMessage);

app.get('/user', users.getUser);
app.get('/user/:id/vts', users.findVtsByUser);
app.post('/user/:id/vts', ensureAuthenticated, users.addVt); // add vts for user

app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile', 'user_friends', 'read_friendlists', 'publish_actions']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login-failed.html'
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.all(/^\/test$/, function(req, res) {
  res.redirect('/test/');
});
app.use('/test/', express.static(__dirname + '/vt_test'));

// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/www')); // Eden 開發用資料夾

app.listen(80);
console.log('Listening on port 80...');
// app.listen(3000);
// console.log('Listening on port 3000...');
