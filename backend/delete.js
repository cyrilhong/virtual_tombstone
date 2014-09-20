/*jslint node: true */
'use strict';

var mongo = require('mongodb');

var Server = mongo.Server,
  Db = mongo.Db,
  BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
  auto_reconnect: true
});
var db = new Db('vtdb', server);
db.open(function(err, db) {
  var id = '541da960f85de03a49f783d3';
  db.collection('msgs', function(err, collection) {
    collection.remove({
      '_id': new BSON.ObjectID(id)
    }, {
      safe: true
    }, function(err, result) {
      console.log(err, result);
    });
  });
});
