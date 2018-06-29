import {
  getAllKeys,
  getFieldIcon,
  getName,
  getFieldFormat
} from '../helper/contacts';
import { renderIcon } from '../helper/dom';

export default function contactDetails({ contact }) {
  return renderToolbar(contact) + renderMainContent(contact);
}

// Renders the bar at the top with buttons for close, favorite, edit and delete
function renderToolbar({ favorite } = {}) {
  return `
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

// Renders the contact information with name, tags and a list of details
function renderMainContent(contact) {
  var { name, tags, ...contactInfo } = contact;
  return `
    <div class="contact-details__info">
      <div class="contact-details__header">
        <h1 class="contact-details__name">${getName(contact)}</h1>
        ${tags && tags.length > 0 ? renderTags(tags) : ''}                    
      </div>
      <ul class="contact-details__list">
        ${
          // Iterate over all keys in order and render the field only
          // if the contact has that information
          getAllKeys()
            .map(
              key =>
                contactInfo.hasOwnProperty(key)
                  ? renderField(contactInfo, key)
                  : ''
            )
            .join('')
        }
      </ul>
    </div>`;
}

function renderTags(tags) {
  return `
    <div class="contact-details__tag-container">
      ${tags
        .map(tag => tag.label)
        .sort()
        .map(label => `<span class="contact-details__tag">${label}</span>`)
        .join(' ')}
    </div>`;
}

// Calls the appropriate render function for each field
function renderField(contact, key) {
  return renderMethod.hasOwnProperty(key)
    ? renderMethod[key](contact)
    : `<li><em>No method to render ${key}</em></li>`;
}

// Registry of render functions
// Each key in ../helper/contacts -> allKeys needs to be present
var renderMethod = {
  // `email` and `phone` present lists and not single entries
  email: createFieldRenderer('email', renderItemList),
  phone: createFieldRenderer('phone', renderItemList),
  web: createFieldRenderer('web', renderItem),
  github: createFieldRenderer('github', renderItem),
  twitter: createFieldRenderer('twitter', renderItem),
  linkedin: createFieldRenderer('linkedin', renderItem),
  notes: renderNotes
};

// Create specialized render function for `key`
// This abstraction prevents repetition of the structure we define in `renderFieldRow`
function createFieldRenderer(key, render) {
  return contact =>
    renderFieldRow({
      field: contact[key],
      fieldIcon: getFieldIcon(key),
      // The `format` function adds field specific formating
      // For example `mailto:`-links around email addresses
      format: getFieldFormat(key),
      render
    });
}

function renderFieldRow({ field, fieldIcon, format, render }) {
  return `
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
  return `
    <span class="contact-details__detail-value">
      ${format(item)}
    </span>`;
}

function renderItemList(list, format) {
  return `
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

// Renders an individual entry for `email` and `phone` fields
// Those have a value and a label for each entry
// E.g. `555 12 34 44 (Home)`
function renderItemWithLabel({ value, label }) {
  return `
    <span class="contact-details__detail-value">${value}</span>
    ${
      label
        ? `<span class="contact-details__detail-label">
            ${label}
          </span>`
        : ''
    }`;
}

// Let's render the notes a little more verbosely
function renderNotes({ notes }) {
  return `
    <li class="contact-details__notes">
      <h2 class="contact-details__notes-heading">Notes</h2>
      <p class="contact-details__notes-content">
        ${notes}
      </p>
    </li>`;
}
