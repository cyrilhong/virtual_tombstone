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
db.collection('vts', function(err, collection) {
  var id = '5415a59e309407a359360fce';
  var vt = {
    "_id": "5415a59e309407a359360fce",
    "owner_id": "54159495694ab8d24e4d4d5b",
    "vtPhoto": "/img/face/54159495694ab8d24e4d4d5b_1410704798274.png",
    "vtName": "柑中閃電戰神酷霸",
    "vtDes": "年少輕狂、敢愛敢恨，中二時期做一堆蠢事，向王煦棻告白跟自殺沒兩樣。該追的不追，一起在西畫社的劉怡君其實人不錯，很後悔。至於屍停陳，我不太懂啊。",
    "vtDate": "06/30/2002",
    "vtLike": 0,
    "vtStar": 0,
    "vtMsg": 4,
    "vtCreateDate": 1410704798274
  };
  collection.update({
    '_id': new BSON.ObjectID(id)
  }, vt, {
    safe: true
  }, function(err, result) {
    console.log(err, result);
  });
});
