var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var tagSchema = new mongoose.Schema({
  label: {
    type: String,
    trim: true,
    required: 'You must supply a label'
  }
});

module.exports = mongoose.model('Tag', tagSchema);
