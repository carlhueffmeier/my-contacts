export default class Controller {
  constructor(store, view) {
    this.store = store;
    this.view = view;
  }

  init() {
    var { store, view } = this;
    this.contactShowAll();

    /* Wire things up */
    view.bindSearchOpen(this.searchOpen.bind(this));
    view.bindSearchClose(this.searchClose.bind(this));
    view.bindSearchClear(this.searchClear.bind(this));
    view.bindSearchQueryChange(this.queryChange.bind(this));
    view.bindContactAdd(this.contactAdd.bind(this));
    view.bindContactOpen(this.contactOpen.bind(this));
    view.bindContactDetailsClose(this.contactDetailsClose.bind(this));
    view.bindContactDetailsFavorite(this.contactDetailsFavorite.bind(this));
  }

  contactShowAll() {
    var { store, view } = this;
    store.getAll().then(contacts => view.renderContacts(contacts));
  }

  searchOpen() {
    var { view } = this;
    view.toggleSearchVisible(true);
    view.toggleSearchFocus(true);
  }

  searchClose() {
    var { view } = this;
    view.toggleSearchVisible(false);
  }

  searchClear() {
    var { store, view } = this;
    view.toggleSearchFocus(true);
    store.setSearchQuery('');
    this.contactShowAll();
  }

  queryChange(query) {
    var { store, view } = this;
    store.setSearchQuery(query);
    if (query.length > 0) {
      store.getSearchResults().then(results => view.renderContacts(results));
    } else {
      this.contactShowAll();
    }
  }

  contactOpen(id) {
    var { store } = this;
    store.setSelectedContact(id);
    this.showContactDetails();
  }

  showContactDetails() {
    var { store, view } = this;
    store.getSelectedContact().then(contact => {
      view.renderContactDetails(contact);
      view.toggleContactDetailsVisible(true);
    });
  }

  contactAdd() {
    console.log('add contact');
  }

  contactDetailsClose() {
    var { store, view } = this;
    store.setSelectedContact(null);
    view.toggleContactDetailsVisible(false);
  }

  contactDetailsFavorite() {
    var { store, view } = this;
    store
      .modifyContacts({ id: store.selected() }, contact => ({
        ...contact,
        favorite: !contact.favorite
      }))
      .then(this.showContactDetails.bind(this));
  }
}

function without(array, itemToOmit) {
  return array.filter(item => item !== itemToOmit);
}
