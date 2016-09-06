var mongoose = require('mongoose');

/**
 * Find all pictures
 */
exports.list = function(callback) {
  var Picture = mongoose.model('Picture');
  Picture.find(function(error, pictures) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, pictures);
    }
  });
};
