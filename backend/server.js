var express = require('express'),
    vts = require('./routes/vts');

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = "781476481883407";
var FACEBOOK_APP_SECRET = "5f42a96dd2950b4be69ce0fcf8dd69c8";
var FACEBOOK_CALLBACK_URI = "http://localhost:3000/auth/facebook/callback";

// config 
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URI
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    vts.findOneOrCreateUser(profile, done);
  }
));
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.cookieParser());  // for fb login
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'virtual_tombstone' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  vts.findUserById(id, done);
});

// routes
app.get('/vts', vts.findAll); // retrieve all virtual tombstones
app.get('/vts/:id', vts.findById);  // retrieve the virtual tombstone by id
//app.get('/vts/:url', vts.findByUrl);  // retrieve the virtual tombstone by url
app.post('/vts', ensureAuthenticated, vts.addVt);  // add a new virtual tombstone
app.put('/vts/:id', vts.updateVt);  // update virtual tombstone by id
app.delete('/vts/:id', vts.deleteVt); // delete virtual tombstone by id
//app.options('/vts/:id', vts.deleteVt);  // for jquery test

app.get('/vts/:id/msgs', vts.getAllMessages);
app.post('/vts/:id/msgs', ensureAuthenticated, vts.addMessage);

app.get('/user', vts.getUser);

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'public_profile','user_friends']}));
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.all(/^\/test$/, function(req, res) { res.redirect('/test/'); });
app.use('/test/',express.static(__dirname+'/vt_test'));

app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000...');
