var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var contactTagSchema = new mongoose.Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }
});

module.exports = mongoose.model('contactTag', contactTagSchema);
