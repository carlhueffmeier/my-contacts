import renderContactList from './renderContactList';
import renderContactDetails from './renderContactDetails';
import renderContactEdit from './renderContactEdit';

export default class Template {
  contactList(contacts) {
    return renderContactList(contacts);
  }

  contactDetails(contact) {
    return renderContactDetails(contact);
  }

  contactEdit(contact) {
    return renderContactEdit(contact);
  }
}
