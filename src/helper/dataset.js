import { isDefined, omit, createObjectMatcher } from '../helper/utils';
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

  getAll({ filter } = {}) {
    return Promise.resolve(this.allIds)
      .then(ids => ids.map(id => this.byId[id]))
      .then(
        allEntries =>
          isDefined(filter) ? allEntries.filter(filter) : allEntries
      );
  }

  find(match) {
    var matcher = createObjectMatcher(match);
    return this.getAll().then(allEntries => allEntries.find(matcher));
  }

  findAll({ match, filter } = {}) {
    var matcher = createObjectMatcher(match);
    return this.getAll({ filter }).then(allEntries =>
      allEntries.filter(entry => matcher(entry))
    );
  }

  findOrCreate(details) {
    var matcher = createObjectMatcher(details);
    var allEntries = this.allIds.map(id => this.byId[id]);
    var searchResult = allEntries.find(matcher);
    if (isDefined(searchResult)) {
      return Promise.resolve(searchResult);
    } else {
      return this.add(details);
    }
  }

  findAndRemove(query) {
    return this.findAll(query).then(results =>
      results.map(entry => this.remove(entry.id))
    );
  }
}
