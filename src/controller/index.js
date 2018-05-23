import { parseInputName, createInputName } from '../helper/inputNames';
import { validateFormData } from '../helper/contacts';

export default class Controller {
  constructor(store, view) {
    this.state = {
      searchQuery: '',
      selectedContact: undefined,
      contactEditOpen: false,
      contactDetailsOpen: false
    };
    this.store = store;
    this.view = view;
  }

  init() {
    var { store, view } = this;
    this.contactShowAll();

    // Search
    view.bindSearchOpen(this.searchOpen.bind(this));
    view.bindSearchClose(this.searchClose.bind(this));
    view.bindSearchClear(this.searchClear.bind(this));
    view.bindSearchQueryChange(this.queryChange.bind(this));

    // Primary Actions
    view.bindContactAdd(this.contactAdd.bind(this));
    view.bindContactOpen(this.contactOpen.bind(this));

    // Modal
    view.bindModalClick(this.modalClick.bind(this));

    // Contact Details Window
    view.bindContactDetailsClose(this.contactDetailsClose.bind(this));
    view.bindContactDetailsFavorite(this.contactDetailsFavorite.bind(this));
    view.bindContactDetailsEdit(this.contactEdit.bind(this));
    view.bindContactDetailsDelete(this.contactDetailsDelete.bind(this));

    // Contact Edit Window
    view.bindContactEditSave(this.contactEditSave.bind(this));
    view.bindContactEditCancel(this.contactEditCancel.bind(this));
    view.bindContactEditAddRow(this.contactEditAddRow.bind(this));
    view.bindContactEditDeleteRow(this.contactEditDeleteRow.bind(this));
  }

  contactShowAll() {
    var { store, view } = this;
    store.getAll().then(contacts => view.renderContacts({ contacts }));
  }

  modalClick() {
    var { view } = this;
    this.contactDetailsClose();
    this.contactEditCancel();
    view.toggleModalVisible(false);
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
      store
        .findByName(query)
        .then(results => view.renderContacts({ contacts: results }));
    } else {
      this.contactShowAll();
    }
  }

  contactOpen(id) {
    this.state.selectedContact = id;
    this.contactDetailsShow();
  }

  contactAdd() {
    var { store, view } = this;
    store.addContact().then(id => {
      this.state.selectedContact = id;
      this.contactEdit({ title: 'Add Contact' });
    });
  }

  contactDetailsShow() {
    var { store, view } = this;
    store.getById(this.state.selectedContact).then(contact => {
      view.renderContactDetails({ contact });
      view.toggleContactDetailsVisible(true);
      view.toggleModalVisible(true);
      this.state.contactDetailsOpen = true;
    });
  }

  contactDetailsDelete() {
    var { selectedContact } = this.state;
    this.store.removeContact(selectedContact).then(() => {
      this.contactDetailsClose();
      this.contactShowAll();
    });
  }

  contactDetailsClose() {
    var { store, view } = this;
    this.state.selectedContact = undefined;
    this.state.contactDetailsOpen = false;
    view.toggleContactDetailsVisible(false);
    view.toggleModalVisible(false);
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

  contactEdit(props) {
    var { store, view } = this;
    this.state.contactEditOpen = true;
    store.getById(this.state.selectedContact).then(contact => {
      view.renderContactEdit({ contact, ...props });
      view.toggleContactEditVisible(true);
      view.toggleModalVisible(true);
    });
  }

  contactEditSave() {
    var { store, view } = this;
    var data = view.getFormData();

    if (!validateFormData(data)) {
      view.toggleContactEditValidation(true);
      return;
    }

    store
      .modifyContacts(
        { id: this.state.selectedContact },
        ({ id, favorite }) => ({ id, favorite, ...data })
      )
      .then(this.contactDetailsShow.bind(this))
      .then(this.contactShowAll.bind(this))
      .then(this.contactEditClose.bind(this));
  }

  contactEditCancel() {
    this.contactEditClose();
  }

  contactEditClose() {
    var { view, state } = this;
    view.toggleContactEditVisible(false);
    state.contactEditOpen = false;
    if (!state.contactDetailsOpen) {
      view.toggleModalVisible(false);
    }
  }

  contactEditAddRow(event) {
    var { view } = this;
    var row = view.getClosestRow(event.target);
    view.appendNewInputField(row);
  }

  contactEditDeleteRow(event) {
    var { view } = this;
    var field = view.getClosestField(event.target);
    view.removeInputField(field);
  }
}
