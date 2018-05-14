export default class Controller {
  constructor(store, view) {
    this.store = store;
    this.view = view;
  }

  init() {
    var { store, view } = this;
    this.contactShowAll();

    /* Wire things up */
    view.bindContactAdd(this.contactAdd.bind(this));
    view.bindContactOpen(this.contactOpen.bind(this));
    view.bindSearchOpen(this.searchOpen.bind(this));
    view.bindSearchClose(this.searchClose.bind(this));
    view.bindSearchClear(this.searchClear.bind(this));
    view.bindSearchQueryChange(this.queryChange.bind(this));
  }

  contactShowAll() {
    var { store, view } = this;
    store.getAll().then(contacts => view.renderContacts(contacts));
  }

  contactOpen(id) {
    var { store, view } = this;
    store.find({ id }).then(contact => {
      console.log('open contact ', contact);
    });
  }

  contactAdd() {
    console.log('add contact');
  }

  searchOpen() {
    this.view.toggleSearchVisible(true);
  }

  searchClose() {
    this.view.toggleSearchVisible(false);
  }

  searchClear() {
    this.view.toggleSearchFocus(true);
    this.store.setSearchQuery('');
    this.contactShowAll();
  }

  queryChange(query) {
    this.store.setSearchQuery(query);
    if (query.length > 0) {
      this.store
        .getSearchResults()
        .then(results => this.view.renderContacts(results));
    } else {
      this.contactShowAll();
    }
  }
}
