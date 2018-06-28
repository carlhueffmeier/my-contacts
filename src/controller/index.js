import { validateFormData } from '../helper/contacts';
import { isDefined } from '../helper/utils';

var Controller = {
  init({ store, view }) {
    this.store = store;
    this.view = view;
    this.state = {
      editing: false,
      menuOpen: false,
      query: '',
      // `undefined` signifies 'nothing selected'
      selectedContact: undefined,
      selectedTag: undefined
    };

    this.initBindings();
    this.render();
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
  },

  handleQueryChange(query) {
    this.changeQuery(query);
  },

  /////////////////////////////
  // Menu

  handleMenuToggle() {
    this.toggleMenu();
  },

  handleMenuShowTag(id) {
    if (id === this.state.selectedTag) {
      this.deselectTag();
    } else {
      this.selectTag(id);
    }
  },

  /////////////////////////////
  // Primary Actions

  handleContactShowDetails(id) {
    this.selectContact(id);
    this.toggleMenu(false);
  },

  handleContactAdd() {
    this.setEditing(true);
  },

  /////////////////////////////
  // Modal

  handleModalClick() {
    this.deselectContact();
    this.setEditing(false);
  },

  /////////////////////////////
  // Contact Details Screen

  handleContactDetailsClose() {
    this.deselectContact();
  },

  handleContactDetailsFavorite() {
    this.toggleFavorite();
  },

  handleContactDetailsEdit() {
    this.setEditing(true);
  },

  handleContactDetailsDelete() {
    this.deleteContact();
  },

  /////////////////////////////
  // Contact Edit Screen

  async handleContactEditSave() {
    var data = this.view.getFormData();
    if (validateFormData(data)) {
      await this.saveContactData(data);
      this.setEditing(false);
    } else {
      this.view.toggleContactEditValidation(true);
    }
  },

  handleContactEditCancel() {
    this.setEditing(false);
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
    this.renderModal();
    this.renderContactDetails();
    this.renderContactEdit();
    this.renderContactList();
    this.renderMenu();
  },

  renderModal() {
    var visible = this.isDetailsScreenShown() || this.isEditScreenShown();
    this.view.toggleModalVisible(visible);
  },

  renderContactDetails() {
    var visible = this.isDetailsScreenShown();
    if (visible) {
      this.renderContactDetailsContent();
    }
    this.view.toggleContactDetailsVisible(visible);
  },

  renderContactEdit() {
    var visible = this.isEditScreenShown();
    if (visible) {
      this.renderContactEditContent();
    }
    this.view.toggleContactEditVisible(visible);
  },

  renderContactList() {
    var { selectedTag, query } = this.state;
    if (isDefined(selectedTag) || query.length > 0) {
      this.showContactsBy({ queryString: query, tag: selectedTag });
    } else {
      this.showAllContacts();
    }
  },

  renderMenu() {
    var visible = this.isMenuVisible();
    if (visible) {
      this.renderMenuContent();
    }
    this.view.toggleMenuVisible(visible);
  },

  /////////////////////////////
  // Menu Rendering
  isMenuVisible() {
    return this.state.menuOpen;
  },

  async renderMenuContent() {
    var { store, view } = this;
    var tags = await store.getAllTags();
    view.renderMenu({ tags, selectedTag: this.state.selectedTag });
  },

  /////////////////////////////
  // Contact List Rendering
  async showAllContacts() {
    var { store, view } = this;
    var contacts = await store.getAllContacts();
    view.renderContacts({ contacts });
  },

  async showContactsBy(query) {
    var { store, view } = this;
    var contacts = await store.findContactsByName(query);
    view.renderContacts({ contacts });
  },

  /////////////////////////////
  // Contact Details Rendering
  isDetailsScreenShown() {
    return this.isContactSelected() && !this.isEditScreenShown();
  },

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
  isEditScreenShown() {
    return this.state.editing;
  },

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
    this.render();
  },

  selectContact(id) {
    this.state.selectedContact = id;
    this.render();
  },

  selectTag(id) {
    this.state.selectedTag = id;
    this.render();
  },

  deselectTag() {
    this.state.selectedTag = undefined;
    this.render();
  },

  deselectContact() {
    this.state.selectedContact = undefined;
    this.render();
  },

  setEditing(on) {
    this.state.editing = Boolean(on);
    this.render();
  },

  changeQuery(query) {
    this.state.query = query.toString();
    this.render();
  },

  async toggleFavorite() {
    var {
      state: { selectedContact },
      store
    } = this;

    await store.changeContact(selectedContact, contact => ({
      ...contact,
      favorite: !contact.favorite
    }));
    this.render();
  },

  async deleteContact() {
    var {
      state: { selectedContact },
      store
    } = this;

    await store.removeContact(selectedContact);
    this.deselectContact();
    this.render();
  },

  saveContactData(data) {
    return this.isContactSelected()
      ? this.modifySelectedContact(data)
      : this.createNewContact(data);
  },

  async modifySelectedContact(data) {
    var {
      state: { selectedContact },
      store
    } = this;

    await store.changeContact(selectedContact, ({ favorite }) => ({
      favorite,
      ...data
    }));
    this.render();
  },

  async createNewContact(data) {
    var newContact = await this.store.addContact(data);
    this.selectContact(newContact.id);
    this.render();
  }
};

export default Controller;
