import { splitBy } from '../helper/utils';
import { renderIcon } from '../helper/dom';
import { getName } from '../helper/contacts';

export default function renderContactList({ contacts }) {
  var [favorites, rest] = splitBy(contacts, ({ favorite }) => favorite);
  var groups = [...groupFavorites(favorites), ...groupByInitial(rest)];

  return groups
    .map(
      group => `
        <li class="contact-list__group">
          <div class="contact-list__group-index-wrapper">
            <span class="contact-list__group-index">${group.index}</span>
          </div>
          <ul class="contact-list__group-list">
            ${renderList({
              contacts: group.contacts,
              className: 'contact-list__contact-element'
            })}
          </ul>
        </li>`
    )
    .join('');
}

function renderList({ contacts, className }) {
  return contacts
    .map(
      item => `
        <li
          ${className ? `class=${className}` : ''}
          data-contact-id="${item._id}"
        >
          <a class="contact-list__link" href="#">${getName(item)}</a>
        </li>`
    )
    .join('');
}

function groupByInitial(contacts) {
  var groups = [];

  for (let contact of sortByName(contacts)) {
    let prev = groups[groups.length - 1];
    let index = getInitial(getName(contact));
    if (index === (prev || {}).index) {
      prev.contacts.push(contact);
    } else {
      groups.push({
        index,
        contacts: [contact]
      });
    }
  }
  return groups;
}

function getInitial(name) {
  if (/^\w/.test(name) === false) {
    return '#';
  }
  return name[0].toUpperCase();
}

function groupFavorites(favorites) {
  return favorites.length > 0
    ? [
        {
          index: renderIcon('icon-star'),
          contacts: favorites
        }
      ]
    : [];
}

function sortByName(contacts) {
  return [...contacts].sort((personA, personB) =>
    getName(personA).localeCompare(getName(personB))
  );
}
