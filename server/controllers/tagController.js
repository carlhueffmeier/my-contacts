var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');
var Contact = mongoose.model('Contact');

exports.getTags = async (req, res) => {
  var tags = await Tag.find();
  res.json(tags.map(t => t.toObject({ versionKey: false })));
};

exports.removeTag = async (req, res) => {
  var removedTag = await Tag.findByIdAndDelete(req.params.id);
  await Contact.updateMany({}, { $pull: { tags: req.params.id } });
  res.json(removedTag.toObject({ versionKey: false }));
};
