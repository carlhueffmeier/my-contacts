import { encodeInputName, decodeInputName } from '../helper/inputNames';
import { validateFormData } from '../helper/contacts';
import { isDefined } from '../helper/utils';

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
    var { view } = this;
    this.showAllContacts();

    // Search
    view.bindSearchOpen(this.handleSearchOpen.bind(this));
    view.bindSearchClose(this.handleSearchClose.bind(this));
    view.bindSearchClear(this.handleSearchClear.bind(this));
    view.bindSearchQueryChange(this.handleQueryChange.bind(this));

    // Primary Actions
    view.bindContactAdd(this.handleContactAdd.bind(this));
    view.bindContactShowDetails(this.handleContactShowDetails.bind(this));

    // Modal
    view.bindModalClick(this.handleModalClick.bind(this));

    // Contact Details Window
    view.bindContactDetailsClose(this.handleContactDetailsClose.bind(this));
    view.bindContactDetailsFavorite(
      this.handleContactDetailsFavorite.bind(this)
    );
    view.bindContactDetailsEdit(this.handleContactDetailsEdit.bind(this));
    view.bindContactDetailsDelete(this.handleContactDetailsDelete.bind(this));

    // Contact Edit Window
    view.bindContactEditSave(this.handleContactEditSave.bind(this));
    view.bindContactEditCancel(this.handleContactEditCancel.bind(this));
    view.bindContactEditAddRow(this.handleContactEditAddRow.bind(this));
    view.bindContactEditDeleteRow(this.handleContactEditDeleteRow.bind(this));
  }

  /////////////////////////////
  // Contact List
  /////////////////////////////
  showAllContacts() {
    var { store, view } = this;
    store.getAll().then(contacts => view.renderContacts({ contacts }));
  }

  showContactsBy(query) {
    var { store, view } = this;
    store
      .findByName(query)
      .then(results => view.renderContacts({ contacts: results }));
  }

  /////////////////////////////
  // Primary Actions
  /////////////////////////////
  handleContactShowDetails(id) {
    this.state.selectedContact = id;
    this.showContactDetails();
  }

  handleContactAdd() {
    this.showContactEditDialog({ title: 'Add Contact' });
  }

  /////////////////////////////
  // Search
  /////////////////////////////
  handleSearchOpen() {
    var { view } = this;
    view.toggleSearchVisible(true);
    view.toggleSearchFocus(true);
  }

  handleSearchClose() {
    this.view.toggleSearchVisible(false);
  }

  handleSearchClear() {
    this.view.toggleSearchFocus(true);
    this.state.searchQuery = '';
    this.showAllContacts();
  }

  handleQueryChange(query) {
    this.state.query = query;
    if (query.length > 0) {
      this.showContactsBy(query);
    } else {
      this.showAllContacts();
    }
  }

  /////////////////////////////
  // Modal Windows
  /////////////////////////////
  handleModalClick() {
    var { view } = this;
    this.closeContactDetails();
    this.closeContactEditDialog();
    view.toggleModalVisible(false);
  }

  /////////////////////////////
  // Contact Details Window
  handleContactDetailsClose() {
    this.closeContactDetails();
  }

  handleContactDetailsFavorite() {
    var { state, store } = this;
    store
      .modifyContacts({ id: state.selectedContact }, contact => ({
        ...contact,
        favorite: !contact.favorite
      }))
      .then(this.updateAllViews.bind(this));
  }

  handleContactDetailsEdit() {
    var { state, store } = this;
    store
      .getById(state.selectedContact)
      .then(contact => this.showContactEditDialog({ contact }));
  }

  handleContactDetailsDelete() {
    var { state, store } = this;
    store.removeContact(state.selectedContact).then(() => {
      this.closeContactDetails();
      this.showAllContacts();
    });
  }

  showContactDetails() {
    var { state, store, view } = this;
    store.getById(state.selectedContact).then(contact => {
      view.renderContactDetails({ contact });
      view.toggleContactDetailsVisible(true);
      view.toggleModalVisible(true);
      state.contactDetailsOpen = true;
    });
  }

  closeContactDetails() {
    var { state, view } = this;
    state.selectedContact = undefined;
    state.contactDetailsOpen = false;
    view.toggleContactDetailsVisible(false);
    view.toggleModalVisible(false);
  }

  updateAllViews() {
    this.showAllContacts();
    this.showContactDetails();
  }

  /////////////////////////////
  // Contact Edit Window
  handleContactEditSave() {
    var { state, view } = this;
    var data = view.getFormData();

    if (!validateFormData(data)) {
      view.toggleContactEditValidation(true);
    } else if (isDefined(state.selectedContact)) {
      this.modifySelectedContact(data);
    } else {
      this.createNewContact(data);
    }
  }

  handleContactEditCancel() {
    this.closeContactEditDialog();
  }

  handleContactEditAddRow(event) {
    var { view } = this;
    var row = view.getClosestRow(event.target);
    view.appendNewInputField(row);
  }

  handleContactEditDeleteRow(event) {
    var { view } = this;
    var field = view.getClosestField(event.target);
    view.removeInputField(field);
  }

  modifySelectedContact(data) {
    this.store
      .modifyContacts(
        { id: this.state.selectedContact },
        ({ id, favorite }) => ({ id, favorite, ...data })
      )
      .then(this.updateAllViews.bind(this))
      .then(this.closeContactEditDialog.bind(this));
  }

  createNewContact(data) {
    this.store
      .addContact(data)
      .then(({ id }) => {
        this.state.selectedContact = id;
      })
      .then(this.updateAllViews.bind(this))
      .then(this.closeContactEditDialog.bind(this));
  }

  showContactEditDialog(props) {
    var { state, view } = this;
    state.contactEditOpen = true;
    view.renderContactEdit(props);
    view.toggleContactEditVisible(true);
    view.toggleModalVisible(true);
  }

  closeContactEditDialog() {
    var { state, view } = this;
    state.contactEditOpen = false;
    view.toggleContactEditVisible(false);
    if (!state.contactDetailsOpen) {
      view.toggleModalVisible(false);
    }
  }
}
