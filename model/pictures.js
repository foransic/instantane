var mongoose = require('mongoose');

/**
 * Find all pictures
 */
exports.list = function(callback) {
  var Picture = mongoose.model('Picture');
  Picture.find().sort({picDate:-1}).exec(function(error, pictures) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, pictures);
    }
  });
};

/**
 * Create a picture
 */
exports.create = function(from, title, description, picDate, picture, callback) {
  var Picture = mongoose.model('Picture');
  var _picture = new Picture({
    from: from,
    title: title,
    description: description,
    picDate: picDate,
    picture: picture
  });
  _picture.save(callback);
};
