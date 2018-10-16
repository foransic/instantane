var mongoose = require('mongoose');
var config = require('./../config');

var pictureSchema = new mongoose.Schema({
  from: String,
  title: String,
  description: String,
  picDate: Date,
  picture: String
});

mongoose.model('Picture', pictureSchema);

if (config.db.user && config.db.password) {
	mongoose.connect('mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.base);	
} else {
	mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.base);
}
