export default class View {
  constructor(template) {
    this.template = template;
    this.$contactList = document.querySelector('.contact-list');
    this.$addButton = document.querySelector('.add-contact-button');
  }

  showContacts(contacts) {
    this.$contactList.innerHTML = this.template.contactList(contacts);
  }

  bindShowContact(callback) {
    this.$contactList.addEventListener('click', event => {
      var closestContact = event.target.closest(
        '.contact-list__contact-element'
      );
      if (closestContact) {
        callback(closestContact.dataset['contactId']);
      }
    });
  }

  bindAddContact(callback) {
    this.$addButton.addEventListener('click', () => callback());
  }
}
