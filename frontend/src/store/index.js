import { callAll, isIterable } from '../helper/utils';

function pluck(arrayOfObjects, key) {
  return arrayOfObjects.map(obj => obj[key]);
}

function getServerUrl(endpoint = '') {
  var baseUrl = 'http://localhost:7777';
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

  var processData = callAll(storeTags, storeContacts);
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

var Store = {
  init() {
    this.entities = {
      contacts: {},
      tags: {}
    };
  },

  _populate(contact) {
    var { tags } = this.entities;
    return {
      ...contact,
      tags: contact.tags.map(tagId => tags[tagId])
    };
  },

  _handleServerData(data, { update = false } = {}) {
    var normalizedData = normalize(data);
    if (update) {
      Object.assign(this.entities.contacts, normalizedData.contacts);
      Object.assign(this.entities.tags, normalizedData.tags);
    } else {
      this.entities.contacts = normalizedData.contacts;
      this.entities.tags = normalizedData.tags;
    }
  },

  async fetchAll() {
    this._handleServerData(await serverRequest('contacts'));
  },

  async getContacts() {
    await this.fetchAll();
    var { contacts } = this.entities;
    return Object.values(contacts).map(this._populate, this);
  },

  async getContactById(id) {
    return this._populate(this.entities.contacts[id]);
  },

  async getTags() {
    return Object.values(this.entities.tags);
  },

  async findContactsByName({ queryString, tag } = {}) {
    var contacts = Object.values(this.entities.contacts);
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

  async changeContact(id, modifier) {
    var newData =
      typeof modifier === 'function'
        ? modifier(this.entities.contacts[id])
        : newData;
    var update = await serverRequest(`contacts/${id}/change`, {
      method: 'PUT',
      body: JSON.stringify(newData)
    });
    this._handleServerData(update, { update: true });
  },

  async removeContact(id) {
    await serverRequest(`contacts/${id}/remove`, { method: 'DELETE' });
    delete this.entities.contacts[id];
  }
};

export default Store;
