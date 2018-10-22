var mongoose = require('mongoose');

// Import configuration options from '.env'
require('dotenv').config();

// Connect to database and handle connection issues
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise; // use ES6 promises
mongoose.connection.on('error', err => {
  console.error(`Can't connect to database → ${err.message}`);
});

// Import models
require('./models/contact');
require('./models/tag');

// Start the app!
var app = require('./app');
app.set('port', process.env.PORT);
var server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
