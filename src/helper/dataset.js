import { isDefined, omit, createQueryMatcher } from '../helper/utils';
import uuidv4 from 'uuid/v4';

export default class Dataset {
  constructor({ idField } = {}) {
    this.byId = {};
    this.allIds = [];
    this.idField = idField;
  }

  _isIdAutomaticallyAssigned() {
    return isDefined(this.idField) === false;
  }

  _getId(entry) {
    return entry[this.idField || 'id'];
  }

  size() {
    return this.allIds.length;
  }

  remove(id) {
    return new Promise(resolve => {
      if (this.allIds.includes(id) === false) {
        throw new Error('Unable to remove entry. Id not found: ', id);
      }
      this.allIds = this.allIds.filter(currentId => currentId !== id);
      this.byId = omit(this.byId, id);
      resolve();
    });
  }

  add(entry) {
    return new Promise(resolve => {
      var id = this._isIdAutomaticallyAssigned()
        ? uuidv4()
        : this._getId(entry);
      if (this.allIds.includes(id)) {
        throw new Error('Duplicate id:', id);
      }
      this.allIds = [id, ...this.allIds];
      this.byId[id] = { ...entry, id };
      resolve(this.byId[id]);
    });
  }

  change(id, details) {
    return new Promise(resolve => {
      this.byId[id] = { ...details, id };
      resolve(this.byId[id]);
    });
  }

  getById(id) {
    return Promise.resolve(this.byId[id]);
  }

  getAll() {
    return new Promise(resolve =>
      resolve(this.allIds.map(id => this.byId[id]))
    );
  }

  find(query) {
    var matcher = createQueryMatcher(query);
    return this.getAll().then(allEntries => allEntries.find(matcher));
  }

  findOrCreate(details) {
    var matcher = createQueryMatcher(details);
    var allEntries = this.allIds.map(id => this.byId[id]);
    var searchResult = allEntries.find(matcher);
    if (isDefined(searchResult)) {
      return Promise.resolve(searchResult);
    } else {
      return this.add(details);
    }
  }

  findAndRemove(details) {
    return this.findAll(details).then(results =>
      results.map(entry => this.remove(entry.id))
    );
  }

  findAll(query) {
    var matcher = createQueryMatcher(query);
    return this.getAll().then(allEntries => allEntries.filter(matcher));
  }

  exists(query) {
    var matcher = createQueryMatcher(query);
    return this.getAll().then(allEntries => allEntries.some(matcher));
  }
}
