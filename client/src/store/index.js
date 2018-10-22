import idb from 'idb';
import uuid from 'uuid/v4';
import { passAll, isIterable, pluck, noop } from '../helper/utils';

const DATABASE_NAME = 'my-contacts';
const DATABASE_VERSION = 1;

var transactionTypes = {
  REMOVE_CONTACT: 'REMOVE_CONTACT',
  ADD_CONTACT: 'ADD_CONTACT',
  CHANGE_CONTACT: 'CHANGE_CONTACT',
  REMOVE_TAG: 'REMOVE_TAG'
};

function createAction(type, payload) {
  return {
    _id: uuid(),
    type,
    payload
  };
}

function getServerUrl(endpoint = '') {
  var baseUrl = process.env.SERVER_URL;
  return `${baseUrl}/${endpoint}`;
}

async function serverRequest(endpoint = '', options = {}) {
  var data = await (await fetch(getServerUrl(endpoint), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    ...options
  })).json();
  return data;
}

function normalize(data) {
  var normalizedData = {
    contacts: {},
    tags: {}
  };

  var processData = passAll(storeTags, storeContacts);
  if (isIterable(data)) {
    data.forEach(processData);
  } else {
    processData(data);
  }

  return normalizedData;

  function storeTags(contact) {
    var { tags } = contact;
    tags.forEach(tag => {
      normalizedData.tags[tag._id] = tag;
    });
  }
  function storeContacts(contact) {
    normalizedData.contacts[contact._id] = {
      ...contact,
      tags: pluck(contact.tags, '_id')
    };
  }
}

function arrayToHash(array, keyField) {
  return array.reduce((hash, entry) => {
    hash[entry[keyField]] = entry;
    return hash;
  }, {});
}

var Store = {
  async init(onChange = noop) {
    this.storage = {
      changes: {},
      timestamp: undefined,
      entities: {
        contacts: {},
        tags: {}
      }
    };
    this.onChange = onChange;

    // Connect to IndexedDB
    this.localDB = await idb.open(DATABASE_NAME, DATABASE_VERSION, upgradeDB => {
      upgradeDB.createObjectStore('contacts', { keyPath: '_id' });
      upgradeDB.createObjectStore('tags', { keyPath: '_id' });
      upgradeDB.createObjectStore('changes', { keyPath: '_id' });
    });

    // Try to get data from IndexedDB
    var tx = this.localDB.transaction(['contacts', 'tags', 'changes'], 'readwrite');
    this.storage.entities.contacts = arrayToHash(await tx.objectStore('contacts').getAll(), '_id');
    this.storage.entities.tags = arrayToHash(await tx.objectStore('tags').getAll(), '_id');
    this.storage.changes = arrayToHash(await tx.objectStore('changes').getAll(), '_id');
    this.onChange();

    // Look for changes and keep trying
    if (Object.keys(this.storage.changes).length > 0) {
      this.kickoffTransactions();
    }
    setInterval(this.kickoffTransactions.bind(this), 5 * 1000);

    // Look for updates and repeat every few seconds
    this.fetchServerData();
    setInterval(this.fetchServerData.bind(this), 7 * 1000);

    return tx.complete;
  },

  populate(contact) {
    var { tags } = this.storage.entities;
    return {
      ...contact,
      tags: contact.tags.map(tagId => tags[tagId])
    };
  },

  enqueueTransaction(action) {
    this.storage.changes[uuid()] = action;
  },

  async kickoffTransactions() {
    for (let key of Object.keys(this.storage.changes)) {
      try {
        await this.dispatch(this.storage.changes[key]);
        this.fulfillTransaction(key);
      } catch (error) {
        console.warn("Couldn't fulfill queued transaction: ", error);
      }
    }
  },

  fulfillTransaction(key) {
    delete this.storage.changes[key];
    var tx = this.localDB.transaction(['contacts', 'tags', 'changes'], 'readwrite');
    this.fetchServerData();
    return tx.complete;
  },

  async fetchServerData() {
    var serverData = await serverRequest(`contacts`);
    // if (serverData.timestamp > this.storage.timestamp) {
    let normalizedData = normalize(serverData);
    this.storage.entities.contacts = normalizedData.contacts;
    this.storage.entities.tags = normalizedData.tags;
    this.onChange();
    return this.saveToLocal();
  },

  async saveToLocal() {
    var {
      changes,
      entities: { contacts, tags }
    } = this.storage;
    var tx = this.localDB.transaction(['contacts', 'tags', 'changes'], 'readwrite');
    tx.objectStore('contacts').clear();
    tx.objectStore('tags').clear();
    tx.objectStore('changes').clear();
    Object.values(contacts).forEach(contact => tx.objectStore('contacts').put(contact));
    Object.values(tags).forEach(tag => tx.objectStore('tags').put(tag));
    Object.values(changes).forEach(change => tx.objectStore('changes').put(change));
    return tx.complete;
  },

  ////////////////////////////
  // Queries
  async getContacts() {
    return Object.values(this.storage.entities.contacts).map(this.populate, this);
  },

  async getContactById(id) {
    return this.populate(this.storage.entities.contacts[id]);
  },

  async getTags() {
    return Object.values(this.storage.entities.tags);
  },

  async findContactsByName({ queryString, tag } = {}) {
    var contacts = Object.values(this.storage.entities.contacts);
    var nameRegex = new RegExp(queryString, 'i');
    return contacts.filter(contactFilter);

    function contactFilter({ name, tags }) {
      var fullName = [name.firstName, name.lastName]
        .filter(Boolean)
        .join('')
        .replace(/\s/g, '');
      if (tag && !tags.includes(tag)) return false;
      if (!nameRegex.test(fullName)) return false;
      return true;
    }
  },

  ////////////////////////////
  // Modification
  async addContact(data) {
    var action = createAction(transactionTypes.ADD_CONTACT, data);
    this.enqueueTransaction(action);
    this.optimisticallyApplyChanges(action);
  },

  async changeContact(id, changes) {
    var newData =
      typeof changes === 'function' ? changes(this.storage.entities.contacts[id]) : changes;
    var action = createAction(transactionTypes.CHANGE_CONTACT, {
      _id: id,
      ...newData
    });
    this.enqueueTransaction(action);
    this.optimisticallyApplyChanges(action);
  },

  async removeContact(id) {
    var action = createAction(transactionTypes.REMOVE_CONTACT, { _id: id });
    this.enqueueTransaction(action);
    this.optimisticallyApplyChanges(action);
  },

  async removeTag(id) {
    var action = createAction(transactionTypes.REMOVE_TAG, { _id: id });
    this.enqueueTransaction(action);
    this.optimisticallyApplyChanges(action);
  },

  ////////////////////////////
  // Action handling
  async dispatch(action) {
    return this.actionHandler[action.type].call(this, action);
  },

  actionHandler: {
    async [transactionTypes.ADD_CONTACT](action) {
      console.error('Adding contacts is not supported yet');
    },
    async [transactionTypes.CHANGE_CONTACT](action) {
      var { _id, ...data } = action.payload;
      return await serverRequest(`contacts/${_id}/change`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    async [transactionTypes.REMOVE_CONTACT](action) {
      var { _id } = action.payload;
      await serverRequest(`contacts/${_id}/remove`, {
        method: 'DELETE'
      });
    },
    async [transactionTypes.REMOVE_TAG](action) {
      var { _id } = action.payload;
      await serverRequest(`tags/${_id}/remove`, { method: 'DELETE' });
    }
  },

  ////////////////////////////
  // Optimistic updates
  optimisticallyApplyChanges(action) {
    this.applyChange[action.type].call(this, action);
  },

  applyChange: {
    [transactionTypes.ADD_CONTACT](action) {},
    [transactionTypes.CHANGE_CONTACT](action) {
      var { _id, tags: labels = [], ...changes } = action.payload;
      var { tags, contacts } = this.storage.entities;

      if (labels.length > 0) {
        let allTags = Object.values(tags);
        let allLabels = pluck(allTags, 'label');
        // Aggregate existing tag ids
        let existingTags = allTags.filter(tag => labels.includes(tag.label));
        let tagIds = pluck(existingTags, '_id');
        // Add nonexisting tags and aggregate new ids
        let labelsToAdd = labels.filter(label => !allLabels.includes(label));
        labelsToAdd.forEach(label => {
          let _id = uuid();
          tags[_id] = { _id, label };
          tagIds.push(_id);
        });
        changes = { ...changes, tags: tagIds };
      }
      // Save modified contact in memory
      contacts[_id] = {
        ...contacts[_id],
        ...changes
      };
    },
    [transactionTypes.REMOVE_CONTACT](action) {
      var { contacts } = this.storage.entities;
      var { _id: idToRemove } = action.payload;
      // Delete contact from memory
      delete contacts[idToRemove];
    },
    [transactionTypes.REMOVE_TAG](action) {
      var { tags } = this.storage.entities;
      var { _id: idToRemove } = action.payload;
      // Remove tag from all contacts
      Object.values(contacts).forEach(contact => {
        contact.tags = contact.tags.filter(tag => tag !== idToRemove);
      });
      // Delete tag from memory
      delete tags[idToRemove];
    }
  }
};

export default Store;
