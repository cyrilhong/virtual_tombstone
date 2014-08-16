/*jslint node: true */
'use strict';

var mongo = require('mongodb');
var async = require('async');

var Server = mongo.Server,
  Db = mongo.Db,
  BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
  auto_reconnect: true
});
var db = new Db('vtdb', server);
db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'vtdb' database");
    db.collection('vts', {
      strict: true
    }, function(err, collection) {
      if (err) {
        console.log("The 'vts' collection doesn't exist. Creating it with sample data...");
      } else {
        console.log('connect success');
      }
    });
  }
});

exports.findAll = function(req, res) {
  db.collection('vts', function(err, collection) {
    if (err) {
      console.log('[ERR]', err.stack);
    }
    // select fields
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving vt: ' + id);
  db.collection('vts', function(err, collection) {
    //collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
    collection.findOne({
      '_id': new BSON.ObjectID(id)
    }, function(err, item) {
      console.log(item);
      res.send(item);
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
    collection.update({
      '_id': new BSON.ObjectID(id)
    }, vt, {
      safe: true
    }, function(err, result) {
      if (err) {
        console.log('Error updating vt: ' + err);
        res.send({
          'error': 'An error has occurred'
        });
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
    collection.remove({
      '_id': new BSON.ObjectID(id)
    }, {
      safe: true
    }, function(err, result) {
      if (err) {
        res.send({
          'error': 'An error has occurred - ' + err
        });
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
  _getAllMessageByVtsId(vts_id, function(err, items) {
    if (!err) {
      res.send(items);
    } else {
      res.send({
        'error': 'Login first'
      });
    }
  });
};

function _getAllMessageByVtsId(vts_id, callback) {
  db.collection('msgs', function(err, collection) {
    collection.find({
      'vts_id': vts_id
    }).toArray(function(err, items) {
      callback(err, items);
    });
  });
}

exports.addMessage = function(req, res) {
  console.log(req.body);
  //console.log(res);
  var vts_id = req.params.id;
  var msg = req.body;
  msg.vts_id = vts_id;
  console.log('Adding msg by vts_id: ' + JSON.stringify(msg));

  var user_id = req.session.passport.user;
  db.collection('users', function(err, collection) {
    collection.findOne({
      '_id': new BSON.ObjectID(user_id)
    }, function(err, user) {
      if (!err && user) {
        msg.owner = {
          id: new BSON.ObjectID(user_id),
          name: user.name
        };
        db.collection('msgs', function(err, collection) {
          collection.insert(msg, {
            safe: true
          }, function(err, result) {
            if (err) {
              res.send({
                'error': 'An error has occurred'
              });
            } else {
              console.log('Success: ' + JSON.stringify(result[0]));
              // update msg num
              db.collection('vts', function(err, collection) {
                collection.update({
                  '_id': new BSON.ObjectID(vts_id)
                }, {$inc: {vtMsg:1}}, {
                  safe: true
                }, function(err, result) {
                  if (err) {
                    console.log('Error updating vt: ' + err);
                    res.send({
                      'error': 'An error has occurred'
                    });
                  } else {
                    res.send(result[0]);
                  }
                });
              });
            }
          });
        });
      } else {
        res.send({
          'error': 'Login first'
        });
      }
    });
  });
};
