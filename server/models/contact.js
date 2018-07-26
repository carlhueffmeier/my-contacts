var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var contactSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      trim: true,
      required: 'You must supply a first name'
    },
    lastName: {
      type: String,
      trim: true
    }
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  email: {
    value: {
      type: String,
      lowercase: true,
      trim: true
    },
    label: {
      type: String,
      trim: true
    }
  },
  phone: {
    value: {
      type: String,
      trim: true
    },
    label: {
      type: String,
      trim: true
    }
  },
  web: {
    type: String,
    lowercase: true,
    trim: true
  },
  github: {
    type: String,
    lowercase: true,
    trim: true
  },
  twitter: {
    type: String,
    lowercase: true,
    trim: true
  },
  linkedin: {
    type: String,
    lowercase: true,
    trim: true
  },
  notes: String
});

module.exports = mongoose.model('Contact', contactSchema);
