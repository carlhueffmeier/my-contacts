import { isDefined } from '../helper/utils';
import { getName } from '../helper/contacts';
import Dataset from '../helper/dataset';

export default class Store {
  constructor() {
    this.storage = {
      contacts: Object.create(Dataset),
      contactTags: Object.create(Dataset),
      tags: Object.create(Dataset)
    };
    Object.values(this.storage).forEach(dataset => dataset.init());
  }

  /////////////////////////////
  // Internal
  /////////////////////////////

  // Populates contact with associated tags
  _populate(contact) {
    return this.getTagsByContact(contact.id).then(tags => ({
      ...contact,
      tags
    }));
  }

  _populateAll(contacts) {
    return Promise.all(contacts.map(this._populate.bind(this)));
  }

  // Returns neutral filter if tagId is undefined
  _createTagFilter(tagId) {
    var { contacts, contactTags } = this.storage;
    if (!isDefined(tagId)) {
      return Promise.resolve(() => true);
    }
    return contactTags
      .findAll({ match: { tagId } })
      .then(associations => associations.map(a => a.contactId))
      .then(contactIds => new Set(contactIds))
      .then(setOfIds => contact => setOfIds.has(contact.id));
  }

  /////////////////////////////
  // Selectors
  /////////////////////////////

  // All

  getAllContacts() {
    var { contacts } = this.storage;
    return contacts.getAll().then(this._populateAll.bind(this));
  }

  getAllTags() {
    var { tags } = this.storage;
    return tags.getAll();
  }

  // By ID

  getContactById(id) {
    var { contacts } = this.storage;
    return contacts.getById(id).then(this._populate.bind(this));
  }

  getTagById(id) {
    var { contacts } = this.storage;
    return contacts.getById(id);
  }

  // Associations

  getContactsByTag(tagId) {
    var { contacts, contactTags } = this.storage;
    return contactTags
      .findAll({ match: { tagId } })
      .then(associations => associations.map(a => a.contactId))
      .then(contactIds => contactIds.map(id => contacts.getById(id)))
      .then(p => Promise.all(p));
  }

  getTagsByContact(contactId) {
    var { contactTags, tags } = this.storage;
    return contactTags
      .findAll({ match: { contactId } })
      .then(associations => associations.map(a => a.tagId))
      .then(tagIds => tagIds.map(id => tags.getById(id)))
      .then(p => Promise.all(p));
  }

  // Searching

  findContact(query) {
    var { contacts } = this.storage;
    return contacts.find(query);
  }

  findAllContacts({ tag, ...match }) {
    var { contacts } = this.storage;
    return this._createTagFilter(tag).then(filter =>
      contacts.findAll({ filter, match })
    );
  }

  // Matches against the full name
  findContactsByName({ queryString, tag } = {}) {
    var re = new RegExp(queryString, 'i');
    var { contacts } = this.storage;
    return this._createTagFilter(tag)
      .then(tagFilter => contact =>
        tagFilter(contact) && re.test(getName(contact))
      )
      .then(filter => contacts.getAll({ filter }));
  }

  /////////////////////////////
  // Modification
  /////////////////////////////

  // Add

  addContact(details) {
    var { contacts } = this.storage;
    var { tags: labels = [], ...restProps } = details;
    return contacts
      .add(restProps)
      .then(newContact =>
        this.addLabels(newContact.id, labels).then(() => newContact)
      );
  }

  addLabels(contactId, labels = []) {
    var { contactTags, tags } = this.storage;
    return Promise.all(labels.map(label => tags.findOrCreate({ label })))
      .then(allTags => allTags.map(t => t.id))
      .then(tagIds =>
        tagIds.map(tagId => contactTags.add({ contactId, tagId }))
      );
  }

  // Remove

  removeContact(contactId) {
    var { contacts, contactTags } = this.storage;
    return contactTags
      .findAndRemove({ match: { contactId } })
      .then(() => contacts.remove(contactId));
  }

  removeTag(tagId) {
    var { contactTags, tags } = this.storage;
    return contactTags
      .findAndRemove({ match: { tagId } })
      .then(() => tags.remove(tagId));
  }

  // Change

  changeContactsByQuery(match, modifier) {
    var { contacts, contactTags, tags } = this.storage;
    return contacts
      .findAll({ match })
      .then(matches =>
        matches.map(match => this.changeContact(match.id, modifier(match)))
      )
      .then(p => Promise.all(p));
  }

  changeContact(contactId, newData) {
    var { contacts, contactTags } = this.storage;
    var { tags: labels, ...modifiedContact } = newData;
    return Promise.resolve()
      .then(() => isDefined(labels) && this.changeLabels(contactId, labels))
      .then(() => contacts.change(contactId, modifiedContact));
  }

  changeLabels(contactId, labels) {
    var { contactTags } = this.storage;
    return contactTags
      .findAndRemove({ match: { contactId } })
      .then(() => this.addLabels(contactId, labels));
  }
}
