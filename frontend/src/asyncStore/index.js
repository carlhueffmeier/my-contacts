function pluck(arrayOfObjects, key) {
  return arrayOfObjects.map(obj => obj[key]);
}

function getServerUrl({ endpoint = '' } = {}) {
  var baseUrl = 'http://localhost:7777';
  return `${baseUrl}/${endpoint}`;
}

function normalize(data) {
  var normalizedData = {
    contacts: {},
    tags: {}
  };

  // Add tag entities
  data.forEach(contact => {
    let { tags } = contact;
    tags.forEach(tag => {
      normalizedData.tags[tag._id] = tag;
    });
  });

  // Add contact entities
  data.forEach(contact => {
    normalizedData.contacts[contact._id] = {
      ...contact,
      tags: pluck(contact.tags, '_id')
    };
  });

  return normalizedData;
}

var Store = {
  init() {
    this.entities = {
      contacts: {},
      tags: {}
    };
    return this.fetchServerData();
  },

  async fetchServerData() {
    var data = await (await fetch(
      getServerUrl({ endpoint: 'contacts' })
    )).json();
    this.entities = normalize(data);
  },

  getContacts() {
    var { contacts, tags } = this.entities;
    return Object.values(contacts).map(contact => ({
      ...contact,
      tags: contact.tags.map(tagId => tags[tagId])
    }));
  },

  getTags() {
    return Object.values(this.entities.tags);
  }
};

export default Store;
