export default class Template {
  contactList(contacts) {
    return this.styleGroupedByInitial(contacts);
  }

  styleList({ contacts, className }) {
    return contacts
      .map(
        item =>
          trim`<li
            ${className ? `class=${className}` : ''}
            data-contact-id="${item.id}"
          >
            <span class="contact-list__name">${item.name}</span>
          </li>`
      )
      .join('');
  }

  styleGroupedByInitial(items) {
    return groupByInitial(items)
      .map(
        group =>
          trim`<li class="contact-list__group">
            <div class="contact-list__group-index-wrapper">
              <span class="contact-list__group-index">${group.initial}</span>
            </div>
            <ul class="contact-list__group-list">
              ${this.styleList({
                contacts: group.contacts,
                className: 'contact-list__contact-element'
              })}
            </ul>
          </li>`
      )
      .join('');
  }
}

function groupByInitial(contacts) {
  var sortedContacts = contacts
    .slice()
    .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

  var index = [];

  for (let contact of sortedContacts) {
    let prev = index[index.length - 1];
    let initial = contact.name[0].toUpperCase();
    if (initial === (prev || {}).initial) {
      prev.contacts.push(contact);
    } else {
      index.push({
        initial,
        contacts: [contact]
      });
    }
  }

  return index;
}

function trim(strings, ...values) {
  var result = '';
  strings.forEach((string, i) => {
    result += string.replace(/\s+/g, ' ') + (values[i] || '');
  });
  return result;
}
