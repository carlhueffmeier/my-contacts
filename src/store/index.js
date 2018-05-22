import { createQueryMatcher, omit, isRegexp } from '../utils/helper';
import uuidv4 from 'uuid/v4';

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
      return resolve(allIds.map(id => byId[id]));
    });
  }

  getById(id) {
    return new Promise(resolve => {
      return resolve(this.storage.byId[id]);
    });
  }

  findByName(query) {
    var re = new RegExp(query, 'i');
    return new Promise(resolve => {
      this.getAll().then(allContacts => {
        return resolve(
          allContacts.filter(({ name }) =>
            re.test(name.firstName + name.lastName)
          )
        );
      });
    });
  }

  findAll(query) {
    return new Promise(resolve => {
      this.getAll().then(allContacts => {
        return resolve(allContacts.filter(createQueryMatcher(query)));
      });
    });
  }

  find(query) {
    return new Promise(resolve => {
      this.getAll().then(allContacts => {
        return resolve(allContacts.find(createQueryMatcher(query)));
      });
    });
  }

  modifyContacts(query, modifier) {
    return new Promise(resolve => {
      this.getAll().then(allContacts => {
        var matches = allContacts.filter(createQueryMatcher(query));
        matches.forEach(contact => {
          this.storage.byId[contact.id] = modifier(
            this.storage.byId[contact.id]
          );
        });
        return resolve(matches.length);
      });
    });
  }

  addContact(details) {
    var id = uuidv4();
    this.storage.byId[id] = {
      id,
      ...details
    };
    this.storage.byId[id].tags = [...(details.tags || [])];
    this.storage.allIds.push(id);
  }

  removeContact(id) {
    var { allIds, byId } = this.storage;
    this.storage.allIds = allIds.filter(currentId !== id);
    this.storage.byId = omit(byId, [id]);
  }
}
