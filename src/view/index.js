import {
  serializeInputs,
  encodeInputName,
  decodeInputName
} from '../helper/inputNames';
import { toggleClass, bindToParent } from '../helper/dom';
import textareaAutoResize from '../helper/textareaAutoResize';

export default class View {
  constructor(template) {
    this.template = template;

    this.$contactList = document.querySelector('.contact-list');
    this.$contactAdd = document.querySelector('.add-contact-button');
    this.$searchBox = document.querySelector('.search');
    this.$searchOpenButton = document.querySelector(
      '.header__open-search-button'
    );
    this.$searchClose = document.querySelector('.search__close-button');
    this.$searchClear = document.querySelector('.search__clear-button');
    this.$searchInput = document.querySelector('.search__text-input');
    this.$modalBox = document.querySelector('.app__modal');
    this.$contactDetails = document.querySelector('.contact-details');
    this.$contactEditDialog = document.querySelector('.contact-edit');
  }

  /////////////////////////////
  // Private methods
  /////////////////////////////
  _activateTextareaAutoResize() {
    var textareas = document.querySelectorAll('.textarea--auto-resize');
    textareaAutoResize(textareas);
  }

  /////////////////////////////
  // Event Handling
  /////////////////////////////

  /////////////////////////////
  // Modal
  bindModalClick(callback) {
    this.$modalBox.addEventListener('click', event => {
      if (event.target === this.$modalBox) {
        callback();
      }
    });
  }

  /////////////////////////////
  // Primary Actions
  bindContactShowDetails(callback) {
    this.$contactList.addEventListener('click', event => {
      var closestContact = event.target.closest(
        '.contact-list__contact-element'
      );
      if (closestContact) {
        callback(closestContact.dataset['contactId']);
      }
    });
  }

  bindContactAdd(callback) {
    this.$contactAdd.addEventListener('click', () => callback());
  }

  /////////////////////////////
  // Search
  bindSearchOpen(callback) {
    this.$searchOpenButton.addEventListener('click', () => callback());
  }

  bindSearchClose(callback) {
    this.$searchClose.addEventListener('click', () => callback());
  }

  bindSearchClear(callback) {
    this.$searchClear.addEventListener('click', () => callback());
  }

  bindSearchQueryChange(callback) {
    this.$searchInput.addEventListener('input', event =>
      callback(event.target.value)
    );
  }

  /////////////////////////////
  // Contact Details
  bindContactDetailsClose(callback) {
    bindToParent({
      parent: this.$contactDetails,
      selector: '.contact-details__close-button',
      callback
    });
  }

  bindContactDetailsFavorite(callback) {
    bindToParent({
      parent: this.$contactDetails,
      selector: '.contact-details__favorite-button',
      callback
    });
  }

  bindContactDetailsEdit(callback) {
    bindToParent({
      parent: this.$contactDetails,
      selector: '.contact-details__edit-button',
      callback
    });
  }

  bindContactDetailsDelete(callback) {
    bindToParent({
      parent: this.$contactDetails,
      selector: '.contact-details__delete-button',
      callback
    });
  }

  /////////////////////////////
  // Contact Edit
  bindContactEditSave(callback) {
    bindToParent({
      parent: this.$contactEditDialog,
      selector: '.contact-edit__save-button',
      callback
    });
  }

  bindContactEditCancel(callback) {
    bindToParent({
      parent: this.$contactEditDialog,
      selector: '.contact-edit__cancel-button',
      callback
    });
  }

  bindContactEditAddRow(callback) {
    bindToParent({
      parent: this.$contactEditDialog,
      selector: '.contact-edit__add-entry-button',
      callback
    });
  }

  bindContactEditDeleteRow(callback) {
    bindToParent({
      parent: this.$contactEditDialog,
      selector: '.contact-edit__delete-entry-button',
      callback
    });
  }

  /////////////////////////////
  // Retrieve DOM information
  /////////////////////////////
  getFormData() {
    var allInputs = this.$contactEditDialog.querySelectorAll(
      '.contact-edit__input'
    );
    var data = serializeInputs(allInputs);
    return data;
  }

  getClosestRow(element) {
    return event.target.closest('.contact-edit__row');
  }

  getClosestField(element) {
    return event.target.closest('.contact-edit__input-item');
  }

  /////////////////////////////
  // Render methods
  /////////////////////////////
  renderContacts(props) {
    this.$contactList.innerHTML = this.template.contactList(props);
  }

  renderContactDetails(props) {
    this.$contactDetails.innerHTML = this.template.contactDetails(props);
  }

  renderContactEdit(props) {
    this.$contactEditDialog.innerHTML = this.template.contactEdit(props);
    this._activateTextareaAutoResize();
  }

  /////////////////////////////
  // DOM modification
  /////////////////////////////
  toggleSearchVisible(on) {
    toggleClass(this.$searchBox, 'visible', on);
  }

  toggleSearchFocus(on) {
    if (on) {
      this.$searchInput.focus();
    } else {
      this.$searchInput.blur();
    }
  }

  toggleContactDetailsVisible(on) {
    toggleClass(this.$contactDetails, 'visible', on);
  }

  toggleContactEditVisible(on) {
    toggleClass(this.$contactEditDialog, 'visible', on);
  }

  toggleModalVisible(on) {
    toggleClass(this.$modalBox, 'visible', on);
  }

  toggleContactEditValidation(on) {
    var form = document.querySelector('.contact-edit__form');
    toggleClass(form, 'form--show-validation-results', on);
  }

  appendNewInputField(row) {
    // We are going to clone a whole field, which may contain multiple inputs
    var lastInputField = row.querySelector(
      '.contact-edit__input-item:last-of-type'
    );
    var newInputField = lastInputField.cloneNode(true);

    // After cloning, modify name and reset value of all containing inputs
    var inputElements = newInputField.querySelectorAll('.contact-edit__input');
    inputElements.forEach(input => {
      var { index, ...rest } = decodeInputName(input.name);
      input.name = encodeInputName({ index: index + 1, ...rest });
      input.value = '';
    });

    // Append the new element to the end of the list
    var list = lastInputField.closest('.contact-edit__input-list');
    list.appendChild(newInputField);
  }

  removeInputField(field) {
    var list = field.closest('.contact-edit__input-list');
    var allFields = list.querySelectorAll('.contact-edit__input-item');

    if (allFields.length > 1) {
      list.removeChild(field);
    } else {
      let inputElements = field.querySelectorAll('.contact-edit__input');
      inputElements.forEach(input => {
        input.value = '';
      });
    }
  }
}
