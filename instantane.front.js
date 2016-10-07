var express = require('express');

var db = require('./model/db');
var picturesModel = require('./model/pictures.js');

var config = require('./config');

var app = express();
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('list.ejs');
  });

app.get('/api/pictures', function(req, res) {
  picturesModel.list(function(error, pictures) {
    if (error) {
      res.json({error : error});
    } else {
      res.json(pictures);
    }
  });
});

app.listen(config.app.port);
