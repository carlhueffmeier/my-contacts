export default class Controller {
  constructor(store, view) {
    this.store = store;
    this.view = view;
  }

  init() {
    var { store, view } = this;
    store.getAll().then(contacts => view.showContacts(contacts));
    view.bindAddContact(this.addContact.bind(this));
    view.bindShowContact(this.showContact.bind(this));
  }

  showContact(id) {
    var { store, view } = this;
    store.find({ id }).then(contact => {
      console.log('open contact ', contact);
    });
  }

  addContact() {
    console.log('add contact');
  }
}
