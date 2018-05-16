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
    this.$contactDetails = document.querySelector('.contact-details');
    this.$contactDetailsClose = document.querySelector(
      '.contact-details__close_button'
    );
    this.$contactDetailsFavorite = document.querySelector(
      '.contact-details__favorite_button'
    );
    this.$contactDetailsEdit = document.querySelector(
      '.contact-details__edit_button'
    );
    this.$contactDetailsDelete = document.querySelector(
      '.contact-details__delete_button'
    );
  }

  bindContactOpen(callback) {
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

  renderContacts(contacts) {
    this.$contactList.innerHTML = this.template.contactList(contacts);
  }

  renderContactDetails(contact) {
    console.log('rendering contact details', contact);
    this.$contactDetails.innerHTML = this.template.contactDetails(contact);
  }

  toggleSearchVisible(visible) {
    toggleClass(this.$searchBox, 'visible', visible);
  }

  toggleContactDetailsVisible(visible) {
    toggleClass(this.$contactDetails, 'visible', visible);
  }

  toggleSearchFocus(on) {
    if (on) {
      this.$searchInput.focus();
    } else {
      this.$searchInput.blur();
    }
  }
}

function toggleClass(element, className, on) {
  if (typeof on !== 'boolean') {
    element.classList.toggle(className);
  } else if (on) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

function bindToParent({ parent, callback, selector, type = 'click' }) {
  parent.addEventListener(type, event => {
    var searchResult = event.target.closest(selector);
    console.log(event.target);
    if (searchResult) {
      callback(event);
    }
  });
}
