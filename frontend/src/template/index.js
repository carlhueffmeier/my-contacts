import renderContactList from './renderContactList';
import renderContactDetails from './renderContactDetails';
import renderContactEdit from './renderContactEdit';
import renderTagList from './renderTagList';

var Template = {
  contactList({ contacts }) {
    return renderContactList({ contacts });
  },

  contactDetails({ contact }) {
    return renderContactDetails({ contact });
  },

  contactEdit({ title = 'Edit Contact', contact }) {
    return renderContactEdit({
      title,
      contact
    });
  },

  tagList({ tags, selectedTag }) {
    return renderTagList({ tags, selectedTag });
  }
};

export default Template;
