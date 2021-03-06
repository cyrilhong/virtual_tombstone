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

/******************************************************************
  user id 可以在登入後執行 http://localhost:3000/user 看到
  msg id 可以執行 http://localhost:3000/vts/steve_jobs/msgs 看到 steve_jobs 的留言的 id
******************************************************************/

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'vtdb' database");

    var vts = [{
      _id: "steve_jobs",
      owner_id: '53c901e33ee7aa2411c5753f', // 根據測試使用者的資料而改變
      vtPhoto: 'img/face/jobs.png',
      vtName: 'STEVE JOBS',
      vtDes: 'Stewart and his team put out several issues of The Whole Earth Catalog, and then when it had run its course, they put out a final issue. It was the mid-1970s, and I was your age. On the back cover of their final issue was.',
      vtDate: '12.06.2005',
      vtLike: 12,
      vtStare: 34,
      vtMsg: 5
    }, {
      _id: "charlie_chaplin",
      owner_id: '53c901e33ee7aa2411c5753f', // 根據測試使用者的資料而改變
      vtPhoto: 'img/face/chaplin.png',
      vtName: 'CHARLIE CHAPLIN',
      vtDes: 'Sir Charles Spencer "Charlie" Chaplin, KBE (16 April 1889 - 25 December 1977) was an English actor, comedian, and filmmaker, who rose to fame in the silent era.',
      vtDate: '25.12.1977',
      vtLike: 56,
      vtStare: 34,
      vtMsg: 10
    }];

    db.collection('vts', function(err, collection) {
      var i = 0;
      for (i = 0; i < vts.length; i++) {
        collection.update({
          '_id': vts[i]._id
        }, vts[i], {
          safe: true
        }, function(err, result) {
          console.log(err, result);
        });
      }
    });

    // 根據該機器的測試資料而改變
    var msgs_id = ['53c9007ddb0907d0233fadfe', '53c9007ddb0907d0233fadff'];

    var msgs = [{
      vts_id: "steve_jobs", // 根據測試使用者的資料而改變（是否為 steve_jobs 的留言）
      owner: {
        id: new BSON.ObjectID('53c901e33ee7aa2411c5753f'),  // 根據測試使用者的資料而改變
        name: 'Mplus  Lai'
      },
      topic: "test topic1",
      message: "message1"
    }, {
      vts_id: "steve_jobs", // 根據測試使用者的資料而改變（是否為 steve_jobs 的留言）
      owner_id: {
        id: new BSON.ObjectID('53c901e33ee7aa2411c5753f'),  // 根據測試使用者的資料而改變
        name: 'Mplus Lai'
      },
      topic: "test topic2",
      message: "message2"
    }];

    db.collection('msgs', function(err, collection) {
      var i = 0;
      for (i = 0; i < msgs.length; i++) {
        collection.update({
          '_id': new BSON.ObjectID(msgs_id[i])
        }, msgs[i], {
          safe: true
        }, function(err, result) {
          console.log(err, result);
        });
      }
    });

  }
});
