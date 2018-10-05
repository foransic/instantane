const express = require('express');
const bodyParser = require('body-parser');
const request = require('request').defaults({ encoding : null });
var ExifImage = require('exif').ExifImage;
var moment = require('moment');
const mime = require('mime/lite');
const sharp = require('sharp');

var db = require('./model/db');
var picturesModel = require('./model/pictures.js');

var config = require('./config');

var app = express();
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

// to be deleted for production !!
app.use(express.static('assets'));

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

app.post('/api/pictures', function(req, res) {  
  // 1. Retrieve & test API Key
  var apikey = null;
  
  if (req.get('X-Instantane-Api-Key')) {
    apikey = req.get('X-Instantane-Api-Key');
  }
  
  if (req.query.apikey) {
    apikey = req.query.apikey;
  } 

  if (apikey == config.apikey) {
    // 2. Get POST parameters
    var _from = req.body.from;
    var _title = req.body.title;
    var _description = req.body.description;
    var _url = req.body.url;
    var base64header = 'data:' + mime.getType(_url) + ';base64,';
    
    // 3. Get picture from URL
    request.get(_url, function (error, response, buffer) {    
      try {
        var _date = null;
        new ExifImage({ image : buffer }, function (error, exifData) {
          if (error) {
            return res.json({'result' : '0', 'error' : error.message });
          } else {
            _date = moment(exifData.exif.CreateDate, 'YYYY:MM:DD HH:mm:ss').toDate();
          }
          sharp(buffer).resize({ width: 1000 })
            .toBuffer()
            .then(_picture => {
              picturesModel.create(_from, _title, _description, _date, base64header + _picture.toString('base64'), function(err, pic) {
                if (err) {
                  return res.json({'result' : '0', 'error' : error.message });
                } else {
                  return res.json({'result' : '1' });
                }
              });  
            });
        });
      } catch (error) {
         return res.json({'result' : '0', 'error' : error.message });
      }
    });
  } else {
    return res.json({'result' : '0', 'error' : 'Bad API key' });
  }
});
app.listen(config.app.port);
