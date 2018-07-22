import { isDefined, omit, without, createObjectMatcher } from '../helper/utils';
import uuidv4 from 'uuid/v4';

var Dataset = {
  init({ idField } = {}) {
    this.byId = {};
    this.allIds = [];
    this.idField = idField;
  },

  _isIdAutomaticallyAssigned() {
    return isDefined(this.idField) === false;
  },

  _getId(entry) {
    return entry[this.idField || 'id'];
  },

  size() {
    return this.allIds.length;
  },

  async remove(id) {
    if (this.allIds.includes(id) === false) {
      throw new Error('Unable to remove entry. Id not found: ', id);
    }
    var entry = this.byId[id];
    this.allIds = without(this.allIds, id);
    this.byId = omit(this.byId, id);
    return entry;
  },

  async removeIf(fn) {
    for (let entry of await this.getAll()) {
      if (fn(entry)) this.remove(entry.id);
    }
  },

  async add(entry) {
    var id = this._isIdAutomaticallyAssigned() ? uuidv4() : this._getId(entry);
    if (this.allIds.includes(id)) {
      throw new Error('Duplicate id:', id);
    }
    this.allIds = [id, ...this.allIds];
    this.byId[id] = { ...entry, id };
    return this.byId[id];
  },

  async change(id, details) {
    this.byId[id] = { ...details, id };
    return this.byId[id];
  },

  async getById(id) {
    return this.byId[id];
  },

  async getAll({ filter } = {}) {
    var allEntries = this.allIds.map(id => this.byId[id]);
    return isDefined(filter) ? allEntries.filter(filter) : allEntries;
  },

  async getAllAndSelect(key) {
    return this.allIds.map(id => this.byId[id][key]);
  },

  async find(match) {
    return (await this.getAll()).find(createObjectMatcher(match));
  },

  async findOrCreate(details) {
    var allEntries = this.allIds.map(id => this.byId[id]);
    var searchResult = allEntries.find(createObjectMatcher(details));
    return isDefined(searchResult) ? searchResult : this.add(details);
  },

  async findAll({ match, filter } = {}) {
    return (await this.getAll({ filter })).filter(createObjectMatcher(match));
  },

  async findAllAndSelect({ match, select }) {
    var searchResult = await this.findAll({ match });
    return searchResult.map(a => a[select]);
  },

  async findAllAndRemove(query) {
    var searchResult = await this.findAll(query);
    return Promise.all(searchResult.map(entry => this.remove(entry.id)));
  }
};

export default Dataset;
