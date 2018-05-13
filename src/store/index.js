import uuidv1 from 'uuid/v1';

export default class Store {
  constructor() {
    this.storage = {
      allIds: [],
      byId: {}
    };
  }

  getAll() {
    return new Promise(resolve => {
      var { allIds, byId } = this.storage;
      resolve(allIds.map(id => byId[id]));
    });
  }

  findAll(query) {
    return new Promise(resolve => {
      this.getAll().then(allContacts => {
        resolve(allContacts.filter(match(query)));
      });
    });
  }

  find(query) {
    return new Promise(resolve => {
      this.getAll().then(allContacts => {
        resolve(allContacts.find(match(query)));
      });
    });
  }

  addContact(details) {
    var id = uuidv1();
    this.storage.byId[id] = {
      id,
      ...details
    };
    this.storage.allIds.push(id);
  }

  removeContact(id) {
    var { allIds, byId } = this.storage;
    this.storage.allIds = allIds.filter(currentId !== id);
    this.storage.byId = omit(byId, [id]);
  }
}

function omit(obj, idsToObmit) {
  return Object.keys(obj)
    .filter(key => !idsToObmit.includes(key))
    .reduce(
      (result, key) => ({
        ...result,
        [key]: obj[key]
      }),
      {}
    );
}

function match(query) {
  return obj =>
    Object.keys(query).every(
      key =>
        isRegexp(query[key])
          ? query[key].test(obj[key])
          : query[key] === obj[key]
    );
}

function isRegexp(object) {
  return Object.prototype.toString.call(object) === '[object RegExp]';
}
