var express = require('express');
var router = express.Router();
var contactController = require('../controllers/contactController');
var tagController = require('../controllers/tagController');
var { catchErrors } = require('../handlers/errorHandlers');

// Contacts
router.get('/contacts', catchErrors(contactController.getContacts));
router.get('/contacts/:id', catchErrors(contactController.getContactById));
router.delete(
  '/contacts/:id/remove',
  catchErrors(contactController.removeContact)
);
router.post('/contacts/add', catchErrors(contactController.addContact));

// Tags
router.get('/tags', catchErrors(tagController.getTags));
router.delete('/tags/:id/remove', catchErrors(tagController.removeTag));

module.exports = router;
