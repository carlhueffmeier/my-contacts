import { mapAndMergePromises } from '../helper/utils';
import { getName } from '../helper/contacts';
import Dataset from '../helper/dataset';

var Store = {
  init() {
    this.storage = {
      contacts: Object.create(Dataset),
      contactTags: Object.create(Dataset),
      tags: Object.create(Dataset)
    };
    Object.values(this.storage).forEach(dataset => dataset.init());
  },

  /////////////////////////////
  // Internal
  /////////////////////////////

  // Populates contact with associated tags
  async _populate(contact) {
    var tags = await this.getTagsByContact(contact.id);
    return {
      ...contact,
      tags
    };
  },

  _populateAll(contacts) {
    return mapAndMergePromises(contacts, this._populate.bind(this));
  },

  async _createTagFilter(tagId) {
    var { contactTags } = this.storage;
    var associatedContactIds = new Set(
      await contactTags.findAllAndSelect({
        match: { tagId },
        select: 'contactId'
      })
    );
    return contact => associatedContactIds.has(contact.id);
  },

  /////////////////////////////
  // Selectors
  /////////////////////////////

  // All

  async getAllContacts() {
    var { contacts } = this.storage;
    return this._populateAll(await contacts.getAll());
  },

  getAllTags() {
    var { tags } = this.storage;
    return tags.getAll();
  },

  // By ID

  async getContactById(id) {
    var { contacts } = this.storage;
    var selectedContact = await contacts.getById(id);
    return this._populate(selectedContact);
  },

  getTagById(id) {
    var { contacts } = this.storage;
    return contacts.getById(id);
  },

  // Associations

  async getContactsByTag(tagId) {
    var { contacts, contactTags } = this.storage;
    // Get all contactIds associated with tagId
    var contactIds = await contactTags.findAllAndSelect({
      match: { tagId },
      select: 'contactId'
    });
    return Promise.all(contactIds.map(id => contacts.getById(id)));
  },

  async getTagsByContact(contactId) {
    var { contactTags, tags } = this.storage;
    var tagIds = await contactTags.findAllAndSelect({
      match: { contactId },
      select: 'tagId'
    });
    return Promise.all(tagIds.map(id => tags.getById(id)));
  },

  // Searching

  findContact(query) {
    var { contacts } = this.storage;
    return contacts.find(query);
  },

  async findAllContacts({ tag, ...match }) {
    var { contacts } = this.storage;
    return contacts.findAll({
      filter: tag ? await this._createTagFilter(tag) : undefined,
      match
    });
  },

  // Matches against the full name (which is a computed property)
  // Accepts an optional tag
  async findContactsByName({ queryString, tag } = {}) {
    var { contacts } = this.storage;
    var re = new RegExp(queryString, 'i');
    var tagFilter = tag ? await this._createTagFilter(tag) : () => true;
    return contacts.getAll({
      filter: contact => re.test(getName(contact)) && tagFilter(contact)
    });
  },

  /////////////////////////////
  // Modification
  /////////////////////////////

  // Add

  async addContact(details) {
    var { contacts } = this.storage;
    var { tags: labels = [], ...restProps } = details;
    var newContact = await contacts.add(restProps);
    await this.addLabels(newContact.id, labels);
    return newContact;
  },

  async addLabels(contactId, labels = []) {
    var { contactTags, tags } = this.storage;
    // Fetch tags with the specified labels
    var newTags = await mapAndMergePromises(labels, label =>
      // If it doesn't exist, create a new tag with the label
      tags.findOrCreate({ label })
    );
    // Finally add associations for all
    return mapAndMergePromises(newTags, tag =>
      contactTags.add({ contactId, tagId: tag.id })
    );
  },

  // Remove

  removeContact(contactId) {
    var { contacts, contactTags } = this.storage;
    // Removing associations and entry in parallel
    return Promise.all([
      contactTags.findAllAndRemove({ match: { contactId } }),
      contacts.remove(contactId)
    ]);
  },

  removeTag(tagId) {
    var { contactTags, tags } = this.storage;
    return Promise.all([
      contactTags.findAllAndRemove({ match: { tagId } }),
      tags.remove(tagId)
    ]);
  },

  // Change

  async changeContact(contactId, modifier) {
    var { contacts } = this.storage;
    var originalData = await contacts.getById(contactId);
    return this.replaceContactData(contactId, modifier(originalData));
  },

  replaceContactData(contactId, newData) {
    var { contacts } = this.storage;
    var { tags: labels = [], ...modifiedContactData } = newData;
    return Promise.all([
      this.changeLabelsForContact(contactId, labels),
      contacts.change(contactId, modifiedContactData)
    ]);
  },

  async changeLabelsForContact(contactId, labels) {
    var { contactTags } = this.storage;
    await contactTags.findAllAndRemove({ match: { contactId } });
    return this.addLabels(contactId, labels);
  }
};

export default Store;
