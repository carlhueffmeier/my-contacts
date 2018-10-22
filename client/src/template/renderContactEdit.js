import {
  getAllKeys,
  getFieldIcon,
  getFieldDescription,
  getAdditionalProps
} from '../helper/contacts';
import { renderIcon, objectToHtmlAttributes } from '../helper/dom';
import { encodeInputName } from '../helper/inputNames';

export default function renderContactEdit({
  contact = {},
  // The title is configurable, because we re-use the same component
  // for the `Add Entry` flow
  title = 'Edit Contact'
}) {
  return `
    <div class="contact-edit__header">
      <h1 class="contact-edit__heading">${title}</h1>
    </div>
    <form class="contact-edit__form">
      <ul class="contact-edit__list">
        ${getAllKeys()
          .map(key => renderField(contact, key))
          .join('')}
      </ul>
    </form>
    <div class="contact-edit__controlbar">
      <button class="contact-edit__cancel-button" aria-label="Cancel">Cancel</button>
      <button class="contact-edit__save-button" aria-label="Save changes">Save</button>
    </div>`;
}

function renderField(contact, key) {
  return renderMethod.hasOwnProperty(key)
    ? renderMethod[key](contact)
    : `<li><em>No method to render ${key}</em></li>`;
}

var renderMethod = {
  name: createFieldRenderer('name', renderInputPerProperty),
  tags: createFieldRenderer('tags', renderTags),
  email: createFieldRenderer('email', renderInputList),
  phone: createFieldRenderer('phone', renderInputList),
  web: createFieldRenderer('web', renderSimpleInput),
  github: createFieldRenderer('github', renderSimpleInput),
  twitter: createFieldRenderer('twitter', renderSimpleInput),
  linkedin: createFieldRenderer('linkedin', renderSimpleInput),
  notes: createFieldRenderer('notes', renderTextarea)
};

function createFieldRenderer(key, render) {
  return contact => `
    <li class="contact-edit__row">
      <div class="contact-edit__row-icon">
        ${getFieldIcon(key)}
      </div>
      <div class="contact-edit__row-content">
        ${render({ key, value: contact[key] })}
      </div>
    </li>`;
}

// Create text input per subkey
// E.g. (1) name-firstName (2) name-lastName
function renderInputPerProperty({ key, value = {} }) {
  var fieldDescription = getFieldDescription(key);
  return `
    <ul class="contact-edit__input-list">
      ${Object.keys(fieldDescription)
        .map(
          subkey =>
            `<li class="contact-edit__input-item">
              ${renderInput({
                name: encodeInputName({ key, subkey }),
                placeholder: getFieldDescription(key)[subkey],
                props: getAdditionalProps(key)[subkey],
                value: value[subkey] || ''
              })}
            </li>`
        )
        .join('')}
    </ul>`;
}

// Renders single text input with comma-separated list of tags
function renderTags({ key, value: tags = [] }) {
  return renderInput({
    name: encodeInputName({ key, commaSeparated: true }),
    placeholder: getFieldDescription(key),
    props: getAdditionalProps(key),
    value: tags
      .map(t => t.label)
      .sort()
      .join(', ')
  });
}

// Renders one row per existing value
function renderInputList({ key, value = [{}] }) {
  return `
    <ul class="contact-edit__input-list">
      ${value
        .map((item, index) => renderInputListItem({ item, index, key }))
        .join('')}
    </ul>`;
}

// Each row consists of `value` and `label`
// Looking somewhat like this
// ___fry@planet-express.com___   ____Work_____   (x) (+)
function renderInputListItem({ item = {}, index, key }) {
  return `
    <li class="contact-edit__input-item">
      ${['value', 'label']
        .map(subkey =>
          renderInput({
            name: encodeInputName({ key, index, subkey }),
            placeholder: getFieldDescription(key)[subkey],
            props: getAdditionalProps(key)[subkey],
            value: item[subkey] || ''
          })
        )
        .join('')}
      <button
        type="button"
        class="contact-edit__delete-entry-button"
        title="Delete entry"
        aria-label="Delete entry"
      >
        ${renderIcon('icon-cancel')}
      </button>
      <button
        type="button"
        class="contact-edit__add-entry-button"
        title="Add new entry"
        aria-label="Add new entry"
      >
        ${renderIcon('icon-add_circle')}
      </button>                 
    </li>`;
}

function renderSimpleInput({ key, value = '' }) {
  return renderInput({
    name: encodeInputName({ key }),
    placeholder: getFieldDescription(key),
    props: getAdditionalProps(key),
    value: value
  });
}

function renderTextarea({ key, value = '' }) {
  return `
    <textarea
      class="contact-edit__input textarea--auto-resize"
      name="${encodeInputName({ key })}"
      placeholder="${getFieldDescription(key)}"
      rows="1"
      aria-label="${key}"
    >${value}</textarea>`;
}

function renderInput({ name, placeholder, value, props = {} }) {
  return `
    <input
      class="contact-edit__input"
      name="${name}"
      placeholder="${placeholder}"
      ${value ? `value="${value}"` : ''}
      ${objectToHtmlAttributes(props)}
      aria-label="${placeholder}"
    >`;
}
