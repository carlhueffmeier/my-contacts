import { $, $$ } from '../helper/bling';
import { toggleClass, bindToParent, createRenderBuffer } from '../helper/dom';
import {
  serializeInputs,
  encodeInputName,
  decodeInputName
} from '../helper/inputNames';
import textareaAutoResize from '../helper/textareaAutoResize';

export default class View {
  constructor(template) {
    this.template = template;

    // Container
    this.$app = $('.app');
    this.$modalBox = $('.app__modal');
    this.$searchBox = $('.search');

    // Render
    this.$menu = $('.menu__list');
    this.$contactList = $('.contact-list');
    this.$contactDetails = $('.contact-details');
    this.$contactEditDialog = $('.contact-edit');

    // Elements
    this.$menuToggle = $('.header__menu-button');
    this.$contactAdd = $('.add-contact__button');
    this.$searchOpenButton = $('.header__open-search-button');
    this.$searchClose = $('.search__close-button');
    this.$searchClear = $('.search__clear-button');
    this.$searchInput = $('.search__text-input');

    this._initializeRenderBuffer();
  }

  /////////////////////////////
  // Private methods
  /////////////////////////////

  // Render buffers prevent redrawing when no changes occurred;
  _initializeRenderBuffer() {
    this.renderBuffer = {
      contactList: createRenderBuffer(this.$contactList),
      contactDetails: createRenderBuffer(this.$contactDetails),
      editDialog: createRenderBuffer(this.$contactEditDialog),
      menu: createRenderBuffer(this.$menu)
    };
  }

  _activateTextareaAutoResize() {
    var textareas = $$('.textarea--auto-resize');
    textareaAutoResize(textareas);
  }

  /////////////////////////////
  // Event Handling
  /////////////////////////////

  /////////////////////////////
  // Modal

  bindModalClick(callback) {
    this.$modalBox.on('click', event => {
      if (event.target === this.$modalBox) {
        callback();
      }
    });
  }

  /////////////////////////////
  // Primary Actions

  bindMenuToggle(callback) {
    this.$menuToggle.on('click', () => callback());
  }

  bindMenuShowTag(callback) {
    bindToParent({
      parent: this.$menu,
      selector: '.menu__item',
      callback: (event, menuItem) => {
        var tagLink = menuItem.querySelector('.menu__link--tag');
        if (tagLink) {
          callback(tagLink.dataset['tagId']);
        }
      }
    });
  }

  bindContactShowDetails(callback) {
    bindToParent({
      parent: this.$contactList,
      selector: '.contact-list__contact-element',
      callback: (event, contactItem) =>
        callback(contactItem.dataset['contactId'])
    });
  }

  bindContactAdd(callback) {
    this.$contactAdd.on('click', () => callback());
  }

  /////////////////////////////
  // Search

  bindSearchOpen(callback) {
    this.$searchOpenButton.on('click', () => callback());
  }

  bindSearchClose(callback) {
    this.$searchClose.on('click', () => callback());
  }

  bindSearchClear(callback) {
    this.$searchClear.on('click', () => callback());
  }

  bindSearchQueryChange(callback) {
    this.$searchInput.on('input', event => callback(event.target.value));
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
    var newHtml = this.template.contactList(props);
    this.renderBuffer.contactList.update(newHtml);
  }

  renderContactDetails(props) {
    var newHtml = this.template.contactDetails(props);
    this.renderBuffer.contactDetails.update(newHtml);
  }

  renderContactEdit(props) {
    var newHtml = this.template.contactEdit(props);
    var didRepaint = this.renderBuffer.editDialog.update(newHtml);
    if (didRepaint) {
      this._activateTextareaAutoResize();
    }
  }

  renderMenu(props) {
    var newHtml = this.template.tagList(props);
    this.renderBuffer.menu.update(newHtml);
  }

  /////////////////////////////
  // DOM modification
  /////////////////////////////

  toggleMenuVisible(on) {
    toggleClass(this.$app, 'app--menu-visible', on);
  }

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
    var form = $('.contact-edit__form');
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
