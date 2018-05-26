import { encodeInputName, decodeInputName } from '../helper/inputNames';
import { validateFormData } from '../helper/contacts';
import { isDefined } from '../helper/utils';

export default class Controller {
  constructor(store, view) {
    this.state = {
      query: '',
      selectedContact: undefined,
      editing: false,
      menuOpen: false
    };
    this.store = store;
    this.view = view;
  }

  init() {
    this.render();

    var { view } = this;
    // Search
    view.bindSearchOpen(this.handleSearchOpen.bind(this));
    view.bindSearchClose(this.handleSearchClose.bind(this));
    view.bindSearchClear(this.handleSearchClear.bind(this));
    view.bindSearchQueryChange(this.handleQueryChange.bind(this));

    // Menu
    view.bindMenuToggle(this.handleMenuToggle.bind(this));
    view.bindMenuShowTag(this.handleMenuShowTag.bind(this));

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
  // Event handling
  /////////////////////////////

  /////////////////////////////
  // Search

  handleSearchOpen() {
    this.view.toggleSearchVisible(true);
    this.view.toggleSearchFocus(true);
  }

  handleSearchClose() {
    this.view.toggleSearchVisible(false);
  }

  handleSearchClear() {
    this.view.toggleSearchFocus(true);
    this.changeQuery('');
  }

  handleQueryChange(query) {
    this.changeQuery(query);
  }

  /////////////////////////////
  // Menu

  handleMenuToggle() {
    this.toggleMenu();
  }

  handleMenuShowTag(id) {
    this.showContactsByTag(id);
  }

  /////////////////////////////
  // Primary Actions

  handleContactShowDetails(id) {
    this.selectContact(id);
    this.toggleMenu(false);
  }

  handleContactAdd() {
    this.setEditing(true);
  }

  /////////////////////////////
  // Modal

  handleModalClick() {
    this.deselectContact(); // TODO: duplicate render
    this.setEditing(false);
  }

  /////////////////////////////
  // Contact Details Screen

  handleContactDetailsClose() {
    this.deselectContact();
  }

  handleContactDetailsFavorite() {
    this.toggleFavorite();
  }

  handleContactDetailsEdit() {
    this.setEditing(true);
  }

  handleContactDetailsDelete() {
    this.deleteContact();
  }

  /////////////////////////////
  // Contact Edit Screen

  handleContactEditSave() {
    var data = this.view.getFormData();
    if (validateFormData(data)) {
      this.saveContactData(data).then(() => this.setEditing(false));
    } else {
      this.view.toggleContactEditValidation(true);
    }
  }

  handleContactEditCancel() {
    this.setEditing(false);
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

  /////////////////////////////
  // Rendering
  /////////////////////////////
  render() {
    this.renderModal();
    this.renderContactDetails();
    this.renderContactEdit();
    this.renderContactList();
    this.renderMenu();
  }

  renderModal() {
    var visible = this.isDetailsScreenShown() || this.isEditScreenShown();
    this.view.toggleModalVisible(visible);
  }

  renderContactDetails() {
    var visible = this.isDetailsScreenShown();
    if (visible) {
      this.renderContactDetailsContent();
    }
    this.view.toggleContactDetailsVisible(visible);
  }

  renderContactEdit() {
    var visible = this.isEditScreenShown();
    if (visible) {
      this.renderContactEditContent();
    }
    this.view.toggleContactEditVisible(visible);
  }

  renderContactList() {
    var { query } = this.state;
    if (query.length > 0) {
      this.showContactsBy(query);
    } else {
      this.showAllContacts();
    }
  }

  renderMenu() {
    var visible = this.isMenuVisible();
    if (visible) {
      this.renderMenuContent();
    }
    this.view.toggleMenuVisible(visible);
  }

  /////////////////////////////
  // Menu Rendering
  isMenuVisible() {
    return this.state.menuOpen;
  }

  renderMenuContent() {
    var { store, view } = this;
    store.getAllTags().then(tags => view.renderMenu({ tags }));
  }

  /////////////////////////////
  // Contact List Rendering
  showAllContacts() {
    var { store, view } = this;
    store.getAllContacts().then(contacts => view.renderContacts({ contacts }));
  }

  showContactsBy(query) {
    var { store, view } = this;
    store
      .findContactsByName(query)
      .then(contacts => view.renderContacts({ contacts }));
  }

  showContactsByTag(id) {
    var { store, view } = this;
    store
      .getContactsByTag(id)
      .then(contacts => view.renderContacts({ contacts }));
  }

  /////////////////////////////
  // Contact Details Rendering
  isDetailsScreenShown() {
    return this.isContactSelected() && !this.isEditScreenShown();
  }

  renderContactDetailsContent() {
    var {
      state: { selectedContact },
      store,
      view
    } = this;

    return store
      .getContactById(selectedContact)
      .then(contact => view.renderContactDetails({ contact }));
  }

  /////////////////////////////
  // Contact Edit Rendering
  isEditScreenShown() {
    return this.state.editing;
  }

  renderContactEditContent(props) {
    var {
      state: { selectedContact },
      store,
      view
    } = this;

    if (this.isContactSelected()) {
      store
        .getContactById(selectedContact)
        .then(contact => view.renderContactEdit({ contact }));
    } else {
      view.renderContactEdit({ title: 'Add Contact' });
    }
  }

  /////////////////////////////
  // Helper
  /////////////////////////////

  isContactSelected() {
    return isDefined(this.state.selectedContact);
  }

  /////////////////////////////
  // Actions
  /////////////////////////////

  toggleMenu(on) {
    this.state.menuOpen = isDefined(on) ? on : !this.state.menuOpen;
    this.render();
  }

  selectContact(id) {
    this.state.selectedContact = id;
    this.render();
  }

  deselectContact() {
    this.state.selectedContact = undefined;
    this.render();
  }

  setEditing(on) {
    this.state.editing = Boolean(on);
    this.render();
  }

  changeQuery(query) {
    this.state.query = query.toString();
    this.render();
  }

  toggleFavorite() {
    var {
      state: { selectedContact },
      store
    } = this;

    return store
      .changeContactsByQuery({ id: selectedContact }, contact => ({
        ...contact,
        favorite: !contact.favorite
      }))
      .then(this.render.bind(this));
  }

  deleteContact() {
    var {
      state: { selectedContact },
      store
    } = this;

    store
      .removeContact(selectedContact)
      .then(this.deselectContact.bind(this))
      .then(this.render.bind(this));
  }

  saveContactData(data) {
    return this.isContactSelected()
      ? this.modifySelectedContact(data)
      : this.createNewContact(data);
  }

  modifySelectedContact(data) {
    var {
      state: { selectedContact },
      store
    } = this;

    return store
      .changeContactsByQuery({ id: selectedContact }, ({ id, favorite }) => ({
        id,
        favorite,
        ...data
      }))
      .then(this.render.bind(this));
  }

  createNewContact(data) {
    return this.store
      .addContact(data)
      .then(({ id }) => this.selectContact(id))
      .then(this.render.bind(this));
  }
}
