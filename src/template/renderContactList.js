import { trim, renderIcon } from '../utils/helper';
import { getName } from '../utils/contacts';

export default function renderContactList(contacts) {
  var [favorites, rest] = splitBy(contacts, ({ favorite }) => favorite);
  var groups = [...groupFavorites(favorites), ...groupByInitial(rest)];

  return groups
    .map(
      group =>
        trim`<li class="contact-list__group">
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
      item =>
        trim`<li
                ${className ? `class=${className}` : ''}
                data-contact-id="${item.id}"
              >
                <span class="contact-list__name">${getName(item)}</span>
              </li>`
    )
    .join('');
}

function splitBy(array, criterium) {
  var red = [];
  var black = [];

  array.forEach(item => {
    if (criterium(item)) {
      red.push(item);
    } else {
      black.push(item);
    }
  });
  return [red, black];
}

function groupByInitial(contacts) {
  var groups = [];

  for (let contact of sortByName(contacts)) {
    let prev = groups[groups.length - 1];
    let index = getName(contact)[0].toUpperCase();
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
  return contacts
    .slice()
    .sort((personA, personB) =>
      getName(personA).localeCompare(getName(personB))
    );
}