var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');
var Tag = mongoose.model('Tag');

exports.getContacts = async (req, res) => {
  var contacts = await Contact.find().populate('tags');
  res.json(contacts.map(c => c.toObject({ versionKey: false })));
};

exports.getContactById = async (req, res) => {
  var contact = await Contact.findById(req.params.id).populate('tags');
  res.json(contact.toObject({ versionKey: false }));
};

exports.addContact = async (req, res) => {
  var { tags: labels, ...contactData } = req.body;

  // Get all tags already in the database
  var existingTags = await Tag.find({ label: { $in: labels } });

  // Check which labels have to be added and insert them into the database
  var existingLabels = existingTags.map(t => t.label);
  var labelsToAdd = labels.filter(l => !existingLabels.includes(l));
  var insertedTags = await Tag.insertMany(
    labelsToAdd.map(label => ({ label }))
  );

  // Create a new contact with the aggregated tags
  var newContact = await new Contact({
    tags: [...existingTags, ...insertedTags],
    ...contactData
  }).save();

  // Format the response
  res.json(newContact.toObject({ versionKey: false }));
};

exports.removeContact = async (req, res) => {
  var removedContact = await Contact.findByIdAndDelete(req.params.id);
  res.json(removedContact.toObject({ versionKey: false }));
};
