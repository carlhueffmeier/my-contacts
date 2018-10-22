import { validateFormData } from '../helper/contacts';
import { isDefined } from '../helper/utils';

var Controller = {
  init({ store, view }) {
    this.store = store;
    this.view = view;
    this.state = {
      contactDetailsOpen: false,
      editDialogOpen: false,
      menuOpen: false,
      query: '',
      // `undefined` signifies 'nothing selected'
      selectedContact: undefined,
      selectedTag: undefined
    };

    this.initBindings();
    this.render();
    store.onChange = this.render.bind(this);
  },

  initBindings() {
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

    // Contact Details Window
    view.bindContactDetailsModalClose(
      this.handleContactDetailsClose.bind(this)
    );
    view.bindContactDetailsClose(this.handleContactDetailsClose.bind(this));
    view.bindContactDetailsFavorite(
      this.handleContactDetailsFavorite.bind(this)
    );
    view.bindContactDetailsEdit(this.handleContactDetailsEdit.bind(this));
    view.bindContactDetailsDelete(this.handleContactDetailsDelete.bind(this));

    // Contact Edit Window
    view.bindContactEditDialogModalClose(
      this.handleContactEditClose.bind(this)
    );
    view.bindContactEditSave(this.handleContactEditSave.bind(this));
    view.bindContactEditCancel(this.handleContactEditCancel.bind(this));
    view.bindContactEditAddRow(this.handleContactEditAddRow.bind(this));
    view.bindContactEditDeleteRow(this.handleContactEditDeleteRow.bind(this));
  },

  /////////////////////////////
  // Event handling
  /////////////////////////////

  /////////////////////////////
  // Search

  handleSearchOpen() {
    this.view.toggleSearchVisible(true);
    this.view.toggleSearchFocus(true);
  },

  handleSearchClose() {
    this.view.toggleSearchVisible(false);
  },

  handleSearchClear() {
    this.view.toggleSearchFocus(true);
    this.changeQuery('');
    this.render();
  },

  handleQueryChange(query) {
    this.changeQuery(query);
    this.render();
  },

  /////////////////////////////
  // Menu

  handleMenuToggle() {
    this.toggleMenu();
    this.render();
  },

  handleMenuShowTag(id) {
    if (id === this.state.selectedTag) {
      this.deselectTag();
    } else {
      this.selectTag(id);
    }
    this.render();
  },

  /////////////////////////////
  // Primary Actions

  handleContactShowDetails(id) {
    this.selectContact(id);
    this.rerenderAndOpenContactDetails();
    this.toggleMenu(false);
  },

  handleContactAdd() {
    this.rerenderAndOpenEditDialog();
  },

  /////////////////////////////
  // Contact Details Screen

  handleContactDetailsClose() {
    this.deselectContact();
    this.closeContactDetails();
  },

  async handleContactDetailsFavorite() {
    await this.toggleFavorite();
    this.render();
  },

  handleContactDetailsEdit() {
    this.closeContactDetails();
    this.rerenderAndOpenEditDialog();
  },

  async handleContactDetailsDelete() {
    await this.deleteContact();
    this.closeContactDetails();
    this.render();
  },

  /////////////////////////////
  // Contact Edit Screen

  handleContactEditClose() {
    this.deselectContact();
    this.closeEditDialog();
  },

  async handleContactEditSave() {
    var data = this.view.getFormData();
    if (validateFormData(data)) {
      await this.saveContactData(data);
      this.closeEditDialog();
      this.rerenderAndOpenContactDetails();
    } else {
      this.view.toggleContactEditValidation(true);
    }
  },

  handleContactEditCancel() {
    this.closeEditDialog();
    if (this.isContactSelected()) {
      this.rerenderAndOpenContactDetails();
    }
  },

  handleContactEditAddRow(event) {
    var { view } = this;
    var row = view.getClosestRow(event.target);
    view.appendNewInputField(row);
  },

  handleContactEditDeleteRow(event) {
    var { view } = this;
    var field = view.getClosestField(event.target);
    view.removeInputField(field);
  },

  /////////////////////////////
  // Rendering
  /////////////////////////////
  render() {
    return Promise.all([
      this.renderContactDetails(),
      this.renderContactEdit(),
      this.renderContactList(),
      this.renderMenu()
    ]);
  },

  async renderContactDetails() {
    if (this.state.contactDetailsOpen) {
      return this.renderContactDetailsContent();
    }
  },

  async renderContactEdit() {
    if (this.state.editDialogOpen) {
      return this.renderContactEditContent();
    }
  },

  async renderContactList() {
    var { selectedTag, query } = this.state;
    if (isDefined(selectedTag) || query.length > 0) {
      return this.showContactsBy({ queryString: query, tag: selectedTag });
    } else {
      return this.showAllContacts();
    }
  },

  async renderMenu() {
    if (this.state.menuOpen) {
      await this.renderMenuContent();
    }
    this.view.toggleMenuVisible(this.state.menuOpen);
  },

  /////////////////////////////
  // Menu Rendering
  async renderMenuContent() {
    var { store, view } = this;
    var tags = await store.getTags();
    view.renderMenu({ tags, selectedTag: this.state.selectedTag });
  },

  /////////////////////////////
  // Contact List Rendering
  async showAllContacts() {
    var { store, view } = this;
    var contacts = await store.getContacts();
    view.renderContacts({ contacts });
  },

  async showContactsBy(query) {
    var { store, view } = this;
    var contacts = await store.findContactsByName(query);
    view.renderContacts({ contacts });
  },

  /////////////////////////////
  // Contact Details Rendering
  async renderContactDetailsContent() {
    var {
      state: { selectedContact },
      store,
      view
    } = this;
    var contact = await store.getContactById(selectedContact);
    view.renderContactDetails({ contact });
  },

  /////////////////////////////
  // Contact Edit Rendering
  async renderContactEditContent(props) {
    var {
      state: { selectedContact },
      store,
      view
    } = this;
    if (this.isContactSelected()) {
      let contact = await store.getContactById(selectedContact);
      view.renderContactEdit({ contact });
    } else {
      view.renderContactEdit({ title: 'Add Contact' });
    }
  },

  /////////////////////////////
  // Helper
  /////////////////////////////

  isContactSelected() {
    return isDefined(this.state.selectedContact);
  },

  /////////////////////////////
  // Actions
  /////////////////////////////

  toggleMenu(on) {
    this.state.menuOpen = isDefined(on) ? on : !this.state.menuOpen;
  },

  selectContact(id) {
    this.state.selectedContact = id;
  },

  deselectContact() {
    this.state.selectedContact = undefined;
  },

  selectTag(id) {
    this.state.selectedTag = id;
  },

  deselectTag() {
    this.state.selectedTag = undefined;
  },

  changeQuery(query) {
    this.state.query = query.toString();
  },

  // Open & Close Modals
  //
  async rerenderAndOpenContactDetails() {
    this.state.contactDetailsOpen = true;
    await this.render();
    this.view.openContactDetailsModal();
  },

  closeContactDetails() {
    this.state.contactDetailsOpen = false;
    this.view.closeContactDetailsModal();
  },

  async rerenderAndOpenEditDialog() {
    this.state.editDialogOpen = true;
    await this.render();
    this.view.openContactEditModal();
  },

  closeEditDialog() {
    this.state.editDialogOpen = false;
    this.view.closeContactEditModal();
  },

  // Modify & Create Contacts
  //
  async toggleFavorite() {
    var {
      state: { selectedContact },
      store
    } = this;
    return store.changeContact(selectedContact, contact => ({
      favorite: !contact.favorite
    }));
  },

  async deleteContact() {
    var {
      state: { selectedContact },
      store
    } = this;
    await store.removeContact(selectedContact);
    this.deselectContact();
  },

  saveContactData(data) {
    return this.isContactSelected()
      ? this.modifySelectedContact(data)
      : this.createNewContact(data);
  },

  modifySelectedContact(data) {
    var {
      state: { selectedContact },
      store
    } = this;
    return store.changeContact(selectedContact, ({ favorite }) => ({
      ...data
    }));
  },

  async createNewContact(data) {
    var newContact = await this.store.addContact(data);
    this.selectContact(newContact.id);
  }
};

export default Controller;
