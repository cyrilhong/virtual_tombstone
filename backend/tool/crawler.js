/*jslint node: true */
'use strict';

var request = require('request');
var async = require('async');
var fs = require('fs');
request('http://localhost:3000/vts', function(error, response, body) {
  if (!error && response.statusCode == 200) {
    var vts = JSON.parse(body);
    async.each(vts, function(vt, callback) {
      request('http://localhost:3000/vts/' + vt._id + '/msgs', function(error, response, body) {
        fs.writeFile('crawler/' + vt._id + '.js', "var msgs="+body, function(err){
          if(err)
            console.log(err);
        });
      });
      callback();
    }, function(err) {
      if (err)
        console.error(err);
    });

    // for(var i=0, dLen = data.length;i<dLen;i++){
    //   request('http://localhost:3000/vts', function(error, response, body) {

    //   //http://localhost:3000/vts/5447b10753312e9b0cd91f7a
    // }
  }
});


