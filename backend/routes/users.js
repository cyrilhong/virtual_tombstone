/*jslint node: true */
'use strict';

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;


var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('vtdb', server);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'vtdb' database");
    db.collection('vts', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'vts' collection doesn't exist. Creating it with sample data...");
      } else {
        console.log('connect success');
      }
    });
  }
});

exports.addVt = function(req, res) {
  // res.header('Access-Control-Allow-Origin', "*");
  var user_id = req.params.id;
  var vt = req.body;
  console.log('Adding vt: ' + JSON.stringify(vt));
  vt.owner_id = user_id;
  vt.vtLike = vt.vtLike ? parseInt(vt.vtLike, 10) : 0;
  vt.vtStar = vt.vtStar ? parseInt(vt.vtStar, 10) : 0;
  vt.vtMsg = vt.vtMsg ? parseInt(vt.vtMsg, 10) : 0;
  db.collection('vts', function(err, collection) {
    collection.insert(vt, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
          console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
};


exports.getUser = function(req, res){
  if(req.session.passport.user);
  _findUserById(req.session.passport.user, function(err, user){
    if(!err && user) {
      res.send(user);
    } else {
      res.send({
        code: 99
      });
    }
  });
};

exports.findVtsByUser = function(req, res) {
  var user_id = req.params.id;
  
  var condition = {
    owner_id: user_id
  };
  db.collection('vts', function(err, collection) {
    // select fields
    collection.find(condition).toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.findOneOrCreateUser = function(accessToken, profile, done){
  db.collection('users', function(err, collection) {
    collection.findOne({'oauthID': profile.id}, function(err, user) {
      if (err) {
        console.log(err);
      }
      if(!err && user) {
        user.name = profile.displayName;
        user.email = profile.emails[0].value;
        user.token = accessToken;
        collection.update({'_id':user._id}, user);
        done(null, user);
      } else {
        var _user = {
          oauthID: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          token: accessToken,
          created: Date.now()
        };
        collection.insert(_user, {safe:true}, function(err, result) {
          if(err) {
            console.log(err);
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  });
};

exports.findUserById = function(id, done){
  _findUserById(id, done);
};

function _findUserById(id, done) {
  db.collection('users', function(err, collection) {
    collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, user) {
      if(!err && user) {
        done(null, user);
      } else {
        done(err, null);
      }
    });
  });
}

