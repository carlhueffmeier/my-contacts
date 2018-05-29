import {
  getAllKeys,
  getFieldIcon,
  getName,
  getFieldFormat
} from '../helper/contacts';
import { trim } from '../helper/utils';
import { renderIcon, renderLink } from '../helper/dom';

export default function contactDetails({ contact }) {
  return trim`${renderContactDetailsTopbar(contact)}
              ${renderContactDetailsInfo(contact)}`;
}

function renderContactDetailsTopbar({ favorite } = {}) {
  return trim`
    <div class="contact-details__topbar">
      <button
        class="contact-details__close-button button"
        aria-label="Close contact details"
      >
        ${renderIcon('icon-close')}   
      </button>
      <button
        class="contact-details__favorite-button button"
        aria-label="Contact currently marked as ${
          favorite ? 'favorite' : 'not favorite'
        }. Toggle it ${favorite ? 'off' : 'on'}"
      >
        ${renderIcon(favorite ? 'icon-star' : 'icon-star_border')}
      </button>
      <button
        class="contact-details__edit-button button"
        aria-label="Turn on edit mode"
      >
        ${renderIcon('icon-mode_edit')}            
      </button>
      <button
        class="contact-details__delete-button button"
        aria-label="Delete contact"
      >
        ${renderIcon('icon-delete')}            
      </button>
    </div>`;
}

function renderContactDetailsInfo(contact) {
  var { name, tags, ...contactInfo } = contact;
  return trim`
    <div class="contact-details__info">
      <div class="contact-details__header">
        <h1 class="contact-details__name">${getName(contact)}</h1>
        ${tags && tags.length > 0 && renderTags(tags)}                    
      </div>
      <ul class="contact-details__list">
        ${getAllKeys()
          .map(
            key =>
              contactInfo.hasOwnProperty(key)
                ? renderField(contactInfo, key)
                : ''
          )
          .join('')}
      </ul>
    </div>`;
}

function renderTags(tags) {
  return trim`
    <div class="contact-details__tag-container">
      ${tags
        .map(tag => `<span class="contact-details__tag">${tag.label}</span>`)
        .join(' ')}
    </div>`;
}

function renderField(contact, key) {
  return renderMethod.hasOwnProperty(key)
    ? renderMethod[key](contact)
    : `<li><em>No method to render ${key}</em></li>`;
}

var renderMethod = {
  email: createFieldRenderer('email', renderItemList),
  phone: createFieldRenderer('phone', renderItemList),
  web: createFieldRenderer('web', renderItem),
  github: createFieldRenderer('github', renderItem),
  twitter: createFieldRenderer('twitter', renderItem),
  linkedin: createFieldRenderer('linkedin', renderItem),
  notes: renderNotes
};

function createFieldRenderer(key, render) {
  var format = getFieldFormat(key);
  return contact =>
    renderFieldRow({
      field: contact[key],
      fieldIcon: getFieldIcon(key),
      render,
      format
    });
}

function renderFieldRow({ field, fieldIcon, render, format }) {
  return trim`
    <li class="contact-details__row">
      <div class="contact-details__row-icon">
        ${fieldIcon}
      </div>
      <div class="contact-details__row-content">
        ${render(field, format)}
      </div>
    </li>`;
}

function renderItem(item, format) {
  return trim`
    <span class="contact-details__detail-value">
      ${format(item)}
    </span>`;
}

function renderItemList(list, format) {
  return trim`
    <ul class="contact-details__row-list">
      ${list
        .map(
          item =>
            `<li class="contact-details__row-item">
              ${renderItemWithLabel(format(item))}
            </li>`
        )
        .join('')}
    </ul>`;
}

function renderItemWithLabel({ value, label }) {
  return trim`
    <span class="contact-details__detail-value">${value}</span>
    ${label &&
      `<span class="contact-details__detail-label">
        ${label}
      </span>`}`;
}

function renderNotes({ notes }) {
  return trim`
    <li class="contact-details__notes">
      <h2 class="contact-details__notes-heading">Notes</h2>
      <p class="contact-details__notes-content">
        ${notes}
      </p>
    </li>`;
}
