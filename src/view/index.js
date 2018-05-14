export default class View {
  constructor(template) {
    this.template = template;
    this.$contactList = document.querySelector('.contact-list');
    this.$contactAddButton = document.querySelector('.add-contact-button');
    this.$searchBox = document.querySelector('.search');
    this.$searchOpenButton = document.querySelector(
      '.header__open-search-button'
    );
    this.$searchCloseButton = document.querySelector('.search__close-button');
    this.$searchClearButton = document.querySelector('.search__clear-button');
    this.$searchInput = document.querySelector('.search__text-input');
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
    this.$contactAddButton.addEventListener('click', () => callback());
  }

  bindSearchOpen(callback) {
    this.$searchOpenButton.addEventListener('click', () => callback());
  }

  bindSearchClose(callback) {
    this.$searchCloseButton.addEventListener('click', () => callback());
  }

  bindSearchClear(callback) {
    this.$searchClearButton.addEventListener('click', () => callback());
  }

  bindSearchQueryChange(callback) {
    this.$searchInput.addEventListener('input', event =>
      callback(event.target.value)
    );
  }

  renderContacts(contacts) {
    this.$contactList.innerHTML = this.template.contactList(contacts);
  }

  toggleSearchVisible(visible) {
    toggleClass(this.$searchBox, 'visible', visible);
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
