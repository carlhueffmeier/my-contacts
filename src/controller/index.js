export default class Controller {
  constructor(store, view) {
    this.state = {
      searchQuery: '',
      selectedContact: undefined
    };
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
    view.bindContactDetailsEdit(this.contactEdit.bind(this));
    view.bindContactEditSave(this.contactEditSave.bind(this));
    view.bindContactEditCancel(this.contactEditCancel.bind(this));
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
    this.state.searchQuery = '';
    this.contactShowAll();
  }

  queryChange(query) {
    var { store, view } = this;
    this.state.query = query;
    if (query.length > 0) {
      store.findByName(query).then(results => view.renderContacts(results));
    } else {
      this.contactShowAll();
    }
  }

  contactOpen(id) {
    this.state.selectedContact = id;
    this.contactDetailsShow();
  }

  contactDetailsShow() {
    var { store, view } = this;
    store.getById(this.state.selectedContact).then(contact => {
      view.renderContactDetails(contact);
      view.toggleContactDetailsVisible(true);
    });
  }

  contactAdd() {
    console.log('add contact');
  }

  contactDetailsClose() {
    var { store, view } = this;
    this.state.selectedContact = undefined;
    view.toggleContactDetailsVisible(false);
  }

  contactDetailsFavorite() {
    var { store, view } = this;
    store
      .modifyContacts({ id: this.state.selectedContact }, contact => ({
        ...contact,
        favorite: !contact.favorite
      }))
      .then(this.contactDetailsShow.bind(this))
      .then(this.contactShowAll.bind(this));
  }

  contactEdit() {
    var { store, view } = this;
    store.getById(this.state.selectedContact).then(contact => {
      view.renderContactEdit(contact);
      view.toggleContactEditVisible(true);
    });
  }

  contactEditSave() {
    var { store, view } = this;
    var data = view.getFormData();
    store
      .modifyContacts(
        { id: this.state.selectedContact },
        ({ id, favorite }) => ({ id, favorite, ...data })
      )
      .then(this.contactDetailsShow.bind(this))
      .then(this.contactShowAll.bind(this))
      .then(() => view.toggleContactEditVisible(false));
  }

  contactEditCancel() {
    var { view } = this;
    view.toggleContactEditVisible(false);
  }
}
