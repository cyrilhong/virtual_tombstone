var express = require('express'),
    vts = require('./routes/vts');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/vts', vts.findAll); // retrieve all virtual tombstones
app.get('/vts/:id', vts.findById);  // retrieve the virtual tombstone by id
//app.get('/vts/:url', vts.findByUrl);  // retrieve the virtual tombstone by url
app.post('/vts', vts.addVt);  // add a new virtual tombstone
app.put('/vts/:id', vts.updateVt);  // update virtual tombstone by id
app.delete('/vts/:id', vts.deleteVt); // delete virtual tombstone by id
//app.options('/vts/:id', vts.deleteVt);  // for jquery test

app.get('/vts/:id/msgs', vts.getAllMessages);
app.post('/vts/:id/msgs', vts.addMessage);

app.all(/^\/test$/, function(req, res) { res.redirect('/test/'); });
app.use('/test/',express.static(__dirname+'/vt_test'));

app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000...');
