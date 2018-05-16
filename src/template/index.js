export default class Template {
  contactList(contacts) {
    return this.styleGroupedByInitial(contacts);
  }

  contactDetails(contact) {
    return trim`${this.styleContactDetailsTopbar(contact)}
                ${this.styleContactDetailsInfo(contact)}`;
  }

  styleGroupedByInitial(items) {
    return groupByInitial(items)
      .map(
        group =>
          trim`<li class="contact-list__group">
                <div class="contact-list__group-index-wrapper">
                  <span class="contact-list__group-index">${
                    group.initial
                  }</span>
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

  styleContactDetailsTopbar({ favorite }) {
    return trim`<div class="contact-details__topbar">
                  <button class="contact-details__close-button button">
                    <svg class="icon">
                      <use xlink:href="#icon-close"></use>
                    </svg>
                  </button>
                  <button class="contact-details__favorite-button button">
                    <svg class="icon">
                      ${
                        favorite
                          ? `<use xlink:href="#icon-star"></use>`
                          : `<use xlink:href="#icon-star_border"></use>`
                      }
                    </svg>
                  </button>
                  <button class="contact-details__edit-button button">
                    <svg class="icon">
                      <use xlink:href="#icon-mode_edit"></use>
                    </svg>
                  </button>
                  <button class="contact-details__delete-button button">
                    <svg class="icon">
                      <use xlink:href="#icon-delete"></use>
                    </svg>
                  </button>
                </div>`;
  }

  styleContactDetailsInfo(contact) {
    var {
      name,
      tags,
      email,
      phone,
      twitter,
      github,
      linkedin,
      notes
    } = contact;
    return trim`<div class="contact-details__info">
                  <div class="contact-details__header">
                    <h1 class="contact-details__name">${name}</h1>
                    ${tags && this.styleTags(contact)}                    
                  </div>
                  <ul class="contact-details__main">
                    ${email && this.styleFieldEmail(contact)}
                    ${phone && this.styleFieldPhone(contact)}
                    ${twitter &&
                      this.styleListField({
                        value: twitter,
                        icon: '#icon-twitter'
                      })}
                    ${github &&
                      this.styleListField({
                        value: github,
                        icon: '#icon-github'
                      })}
                    ${linkedin &&
                      this.styleListField({
                        value: linkedin,
                        icon: '#icon-linkedin'
                      })}
                    ${notes && this.styleFieldNotes(contact)}
                  </ul>
                </div>`;
  }

  styleTags({ tags }) {
    return trim`<div class="contact-details__tag-container">
                  ${tags
                    .map(
                      tag => `<span class="contact-details__tag">${tag}</span>`
                    )
                    .join(' ')}
                </div>`;
  }

  styleFieldEmail({ email }) {
    return email
      .map(({ type, value }) =>
        this.styleListField({ value, type, icon: '#icon-mail_outline' })
      )
      .join('');
  }

  styleFieldPhone({ phone }) {
    return phone
      .map(({ type, value }) =>
        this.styleListField({ value, type, icon: '#icon-phone' })
      )
      .join('');
  }

  styleFieldTwitter({ twitter }) {
    return this.styleListField({ value: twitter, icon: '#icon-twitter' });
  }

  styleListField({ value, type, icon }) {
    return trim`<li class="contact-details__detail">
                  <div class="contact-details__type-icon">
                    <svg class="icon">
                      <use xlink:href="${icon}"></use>
                    </svg>
                  </div>
                  <div class="contact-details__detail-content">
                    <span class="contact-details__detail-value">${value}</span>
                    ${type &&
                      `<span class="contact-details__detail-type">${type}</span>`}
                  </div>
                </li>`;
  }

  styleFieldNotes({ notes }) {
    return trim`<div class="contact-details__notes">
                  <h2 class="contact-details__notes-heading">Notes</h2>
                  <p class="contact-details__notes-content">
                    ${notes}
                  </p>
                </div>`;
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
