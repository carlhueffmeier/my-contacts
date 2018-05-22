import { trim, renderIcon, createInputName, isDefined } from '../utils/helper';
import {
  getAllKeys,
  getFieldIcon,
  getFieldDescription
} from '../utils/contacts';

export default function renderContactEdit(contact) {
  return trim`<div class="contact-edit__header">
                <h1 class="contact-edit__heading">Edit Contact</h1>
              </div>
              <form class="contact-edit__form">
                <ul class="contact-edit__list">
                  ${getAllKeys()
                    .map(key => renderField(contact, key))
                    .join('')}
                </ul>
              </form>
              <div class="contact-edit__controlbar">
                <button class="contact-edit__cancel-button">Cancel</button>
                <button class="contact-edit__save-button">Save</button>
              </div>`;
}

function renderField(contact, key) {
  return renderMethod.hasOwnProperty(key)
    ? renderMethod[key](contact)
    : `<li><em>No method to render ${key}</em></li>`;
}

var renderMethod = {
  name: createFieldRenderer('name', renderInputPerProperty),
  tags: createFieldRenderer('tags', renderCommaSeparated),
  email: createFieldRenderer('email', renderInputList),
  phone: createFieldRenderer('phone', renderInputList),
  web: createFieldRenderer('web', renderSimpleInput),
  github: createFieldRenderer('github', renderSimpleInput),
  twitter: createFieldRenderer('twitter', renderSimpleInput),
  linkedin: createFieldRenderer('linkedin', renderSimpleInput),
  notes: createFieldRenderer('notes', renderSimpleInput)
};

function createFieldRenderer(key, render) {
  return contact =>
    renderFieldRow({
      contact,
      key,
      render
    });
}

function renderFieldRow({ contact, key, render }) {
  return trim`<li class="contact-edit__row">
                <div class="contact-edit__row-icon">
                  ${getFieldIcon(key)}
                </div>
                <div class="contact-edit__row-content">
                  ${render({ key, value: contact[key] })}
                </div>
              </li>`;
}

function renderSimpleInput({ key, value }) {
  return renderInput({
    name: createInputName({ key }),
    placeholder: getFieldDescription(key),
    value: value
  });
}

function renderCommaSeparated({ key, value }) {
  return renderInput({
    name: createInputName({ key, commaSeparated: true }),
    placeholder: getFieldDescription(key),
    value: value.join(', ')
  });
}

function renderInputPerProperty({ key, value }) {
  var fieldDescription = getFieldDescription(key);
  return trim`<ul class="contact-edit__input-list">
                ${Object.keys(fieldDescription)
                  .map(
                    subkey =>
                      `<li class="contact-edit__input-item">
                        ${renderInput({
                          name: createInputName({ key, subkey }),
                          placeholder: getFieldDescription(key)[subkey],
                          value: value[subkey] || ''
                        })}
                      </li>`
                  )
                  .join('')}
              </ul>`;
}

function renderInputList({ key, value }) {
  var listItems = isDefined(value) && value.length > 0 ? value : [{}];
  return trim`<ul class="contact-edit__input-list">
                ${listItems
                  .map((item, index) =>
                    renderInputListItem({ item, index, key })
                  )
                  .join('')}
              </ul>`;
}

function renderInputListItem({ item, index, key }) {
  return trim`<li class="contact-edit__input-item">
                ${['value', 'label']
                  .map(subkey =>
                    renderInput({
                      name: createInputName({ key, index, subkey }),
                      placeholder: getFieldDescription(key)[subkey],
                      value: item[subkey] || ''
                    })
                  )
                  .join('')}
                <button type="button" class="contact-edit__delete-entry-button">
                  ${renderIcon('icon-cancel')}
                </button>
                <button type="button" class="contact-edit__add-entry-button">
                  ${renderIcon('icon-add_circle')}
                </button>                 
              </li>`;
}

function renderInput({ name, placeholder, value }) {
  return trim`<input
                class="contact-edit__input"
                name="${name}"
                placeholder="${placeholder}"
                value="${value}"
              >`;
}
