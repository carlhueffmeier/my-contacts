require('dotenv').config();
var fs = require('fs');
var contactData = JSON.parse(fs.readFileSync(__dirname + '/contactData.json', 'utf-8'));

var mongoose = require('mongoose');
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

var Contact = require('../models/contact');
var Tag = require('../models/tag');

async function addContact(data) {
  var { tags: labels = [], ...contactData } = data;

  // Get all tags already in the database
  var existingTags = await Tag.find({ label: { $in: labels } });

  // Check which labels have to be added and insert them into the database
  var existingLabels = existingTags.map(t => t.label);
  var labelsToAdd = labels.filter(l => !existingLabels.includes(l));
  var insertedTags = await Tag.insertMany(labelsToAdd.map(label => ({ label })));

  // Create a new contact with the aggregated tags
  return new Contact({
    tags: [...existingTags, ...insertedTags],
    ...contactData
  }).save();
}

async function loadData() {
  try {
    for (contact of contactData) {
      await addContact(contact);
    }
    console.log('Data loaded 👍');
    process.exit();
  } catch (error) {
    console.log('Error loading data ‍‍‍‍🤷‍');
    console.log(error);
    process.exit();
  }
}

async function deleteData() {
  try {
    await Contact.remove();
    await Tag.remove();
    console.log('All data gone 💥💥💥');
    process.exit();
  } catch (error) {
    console.log('Error removing data 🤷‍');
    process.exit();
  }
}

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
