import { isDefined } from '../helper/utils';
import { getName } from '../helper/contacts';
import Dataset from '../helper/dataset';

export default class Store {
  constructor() {
    this.storage = {
      contacts: new Dataset(),
      contactTags: new Dataset(),
      tags: new Dataset()
    };
  }

  /////////////////////////////
  // Internal
  /////////////////////////////

  _populate(contact) {
    return this.getTagsByContact(contact.id).then(tags => ({
      ...contact,
      tags
    }));
  }

  _populateAll(contacts) {
    return Promise.all(contacts.map(this._populate.bind(this)));
  }

  /////////////////////////////
  // Queries
  /////////////////////////////

  getAllContacts() {
    var { contacts } = this.storage;
    return contacts.getAll().then(this._populateAll.bind(this));
  }

  getAllTags() {
    var { tags } = this.storage;
    return tags.getAll();
  }

  getAllAssociations() {
    var { contactTags } = this.storage;
    return contactTags.getAll();
  }

  getContactById(id) {
    var { contacts } = this.storage;
    return contacts.getById(id).then(this._populate.bind(this));
  }

  getTagById(id) {
    var { contacts } = this.storage;
    return contacts.getById(id);
  }

  getContactsByTag(tagId) {
    var { contacts, contactTags } = this.storage;
    return contactTags
      .findAll({ tagId })
      .then(associations => associations.map(a => a.contactId))
      .then(contactIds => contactIds.map(id => contacts.getById(id)))
      .then(p => Promise.all(p));
  }

  getTagsByContact(contactId) {
    var { contactTags, tags } = this.storage;
    return contactTags
      .findAll({ contactId })
      .then(associations => associations.map(a => a.tagId))
      .then(tagIds => tagIds.map(id => tags.getById(id)))
      .then(p => Promise.all(p));
  }

  findContact(query) {
    var { contacts } = this.storage;
    return contacts.find(query);
  }

  findAllContacts(query) {
    var { contacts } = this.storage;
    return contacts.findAll(query);
  }

  // Matches against the full name
  findContactsByName(query) {
    var re = new RegExp(query, 'i');
    var { contacts } = this.storage;
    return contacts
      .getAll()
      .then(allContacts =>
        allContacts.filter(contact => re.test(getName(contact)))
      );
  }

  /////////////////////////////
  // Modification
  /////////////////////////////

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

  removeContact(contactId) {
    var { contacts, contactTags } = this.storage;
    return contactTags
      .findAndRemove({ contactId })
      .then(() => contacts.remove(contactId));
  }

  removeTag(tagId) {
    var { contactTags, tags } = this.storage;
    return contactTags.findAndRemove({ tagId }).then(() => tags.remove(tagId));
  }

  changeContactsByQuery(query, modifier) {
    var { contacts, contactTags, tags } = this.storage;
    return contacts
      .findAll(query)
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
      .findAndRemove({ contactId })
      .then(() => this.addLabels(contactId, labels));
  }
}
