import renderContactList from './renderContactList';
import renderContactDetails from './renderContactDetails';
import renderContactEdit from './renderContactEdit';

export default class Template {
  contactList({ contacts }) {
    return renderContactList({ contacts });
  }

  contactDetails({ contact }) {
    return renderContactDetails({ contact });
  }

  contactEdit({ title = 'Edit Contact', contact }) {
    return renderContactEdit({
      title,
      contact
    });
  }
}
