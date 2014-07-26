/*jslint node: true */
'use strict';

var mongo = require('mongodb');
var url = require('url');

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
        populateDB();
      }
    });
  }
});

exports.findAll = function(req, res) {

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var condition = {};
  if(query.user) {
    condition.owner_id = query.user;
  }
  console.log(condition);
  db.collection('vts', function(err, collection) {
    // select fields
    collection.find(condition).toArray(function(err, items) {
      res.send(items);
    });
  });
};
 
exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving vt: ' + id);
  db.collection('vts', function(err, collection) {
    //collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
    collection.findOne({'_id':id}, function(err, item) {
      res.send(item);
    });
  });
};

/*exports.findByUrl = function(req, res) {
  var url = req.params.url;
  console.log('Retrieving vt: ' + url);
  db.collection('vts', function(err, collection) {
    collection.find({url: url}).toArray(function(err, results){
      if(results.length > 0) {
        res.send(results[0]);
      } else {
        res.send({});
      }
    });
  });
};*/

exports.addVt = function(req, res) {
  // res.header('Access-Control-Allow-Origin', "*");
  var vt = req.body;
  console.log('Adding vt: ' + JSON.stringify(vt));
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

exports.updateVt = function(req, res) {
  var id = req.params.id;
  var vt = req.body;
  console.log('Updating vt: ' + id);
  console.log(JSON.stringify(vt));
  vt.vtLike = vt.vtLike ? parseInt(vt.vtLike, 10) : 0;
  vt.vtStar = vt.vtStar ? parseInt(vt.vtStar, 10) : 0;
  vt.vtMsg = vt.vtMsg ? parseInt(vt.vtMsg, 10) : 0;
  db.collection('vts', function(err, collection) {
    collection.update({'_id':id}, vt, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating vt: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(vt);
      }
    });
  });
};
 
exports.deleteVt = function(req, res) {
  var id = req.params.id;
  console.log('Deleting vt: ' + id);
  db.collection('vts', function(err, collection) {
    collection.remove({'_id':id}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  });
};

exports.getAllMessages = function(req, res) {
  var vts_id = req.params.id;
  console.log('Retrieving msgs by vts_id: ' + vts_id);
  db.collection('msgs', function(err, collection) {
    collection.find({'vts_id':vts_id}).toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.addMessage = function(req, res) {
  //var vts_id = req.params.id;
  var msg = req.body;
  console.log('Adding msg by vts_id: ' + JSON.stringify(msg));
  db.collection('msgs', function(err, collection) {
    collection.insert(msg, {safe:true}, function(err, result) {
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

// default create testing db
var populateDB = function() {

  var vts = [
    {_id:"steve_jobs", owner_id:1,  vtPhoto:'', vtName:'STEVE JOBS', vtDes:'Stewart and his team put out several issues of The Whole Earth Catalog, and then when it had run its course, they put out a final issue. It was the mid-1970s, and I was your age. On the back cover of their final issue was.', vtDate: '12.06.2005', vtLike: 12, vtStare: 34, vtMsg: 5},
    {_id:"charlie_chaplin", owner_id:2,  vtPhoto:'', vtName:'CHARLIE CHAPLIN', vtDes:'Sir Charles Spencer "Charlie" Chaplin, KBE (16 April 1889 - 25 December 1977) was an English actor, comedian, and filmmaker, who rose to fame in the silent era.', vtDate: '25.12.1977', vtLike: 56, vtStare: 34, vtMsg: 10}
  ];

  db.collection('vts', function(err, collection) {
    collection.insert(vts, {safe:true}, function(err, result) {});
  });

  var msgs = [
    {vts_id: "steve_jobs", owner_id:1, topic:"test topic1", message: "message1"},
    {vts_id: "steve_jobs", owner_id:1, topic:"test topic2", message: "message2"}
  ];

  db.collection('msgs', function(err, collection) {
    collection.insert(msgs, {safe:true}, function(err, result) {});
  });
};