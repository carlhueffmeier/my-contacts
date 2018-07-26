var express = require('express');
var routes = require('./routes');
var errorHandlers = require('./handlers/errorHandlers');

var app = express();

// Enable cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Put JSON inside the req.body
app.use(express.json());

// Apply all our routes
app.use(routes);

// If none of the routes apply return a 404
app.use(errorHandlers.notFound);

// Show comprehensive error message in development
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}
// Otherwise hide the stack trace
app.use(errorHandlers.productionErrors);

module.exports = app;
