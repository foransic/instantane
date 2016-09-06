var mongoose = require('mongoose');
var config = require('./../config');

var pictureSchema = new mongoose.Schema({
  from: String,
  title: String,
  description: String,
  url: String
});

mongoose.model('Picture', pictureSchema);
mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.base);
