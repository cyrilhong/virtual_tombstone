var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('vtdb', server);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'vtdb' database");
    db.collection('vts', {strict:true}, function(err, collection) {
      if (err) {
        console.log("The 'vts' collection doesn't exist. Creating it with sample data...");
      } else {

        var vts = [
          {_id:"steve_jobs", owner_id:'53c901e33ee7aa2411c5753f',  vtPhoto:'', vtName:'STEVE JOBS', vtDes:'Stewart and his team put out several issues of The Whole Earth Catalog, and then when it had run its course, they put out a final issue. It was the mid-1970s, and I was your age. On the back cover of their final issue was.', vtDate: '12.06.2005', vtLike: 12, vtStare: 34, vtMsg: 5},
          {_id:"charlie_chaplin", owner_id:'53c901e33ee7aa2411c5753f',  vtPhoto:'', vtName:'CHARLIE CHAPLIN', vtDes:'Sir Charles Spencer "Charlie" Chaplin, KBE (16 April 1889 - 25 December 1977) was an English actor, comedian, and filmmaker, who rose to fame in the silent era.', vtDate: '25.12.1977', vtLike: 56, vtStare: 34, vtMsg: 10}
        ];

        db.collection('vts', function(err, collection) {
          for(var i=0; i<vts.length;i++) {
            collection.update({'_id':vts[i]._id}, vts[i], {safe:true}, function(err, result) {
              console.log(err, result);
            });
          }
        });
      }
    });
  }
});

