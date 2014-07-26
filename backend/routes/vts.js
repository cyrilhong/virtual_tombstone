/*jslint node: true */
'use strict';

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db;

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

exports.findAll = function(req, res) {
  db.collection('vts', function(err, collection) {
    if(err) {
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
    collection.findOne({'_id':id}, function(err, item) {
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