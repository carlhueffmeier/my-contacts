import { trim, renderIcon, createInputName } from '../utils/helper';
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
                <button type="reset" class="contact-edit__cancel-button">Cancel</button>
                <button type="button" class="contact-edit__save-button">Save</button>
              </div>`;
}

function renderField(contact, key) {
  return renderMethod.hasOwnProperty(key)
    ? renderMethod[key](contact)
    : `<li>${JSON.stringify(contact[key])}</li>`;
}

var renderMethod = {
  name: createFieldRenderer('name', renderInputPerProperty),
  tags: createFieldRenderer('tags', renderCommaSeparated),
  email: createFieldRenderer('email', renderInputList),
  phone: createFieldRenderer('phone', renderInputList),
  web: createFieldRenderer('web', renderInput),
  github: createFieldRenderer('github', renderInput),
  twitter: createFieldRenderer('twitter', renderInput),
  linkedin: createFieldRenderer('linkedin', renderInput),
  notes: createFieldRenderer('notes', renderInput)
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

function renderInputList({ key, value }) {
  return trim`<ul class="contact-edit__input-list">
                ${value
                  .map(
                    (item, index) =>
                      `<li class="contact-edit__input-item">
                        ${['value', 'label']
                          .map(
                            subkey =>
                              `<input
                            class="contact-edit__input"
                            name="${createInputName({
                              key,
                              subkey,
                              index
                            })}"
                            placeholder="${getFieldDescription(key)[subkey]}"
                            value="${item[subkey]}"
                          >`
                          )
                          .join('')}
                      </li>`
                  )
                  .join('')}
              </ul>`;
}

function renderInput({ key, value }) {
  return trim`<input
                class="contact-edit__input"
                name="${createInputName({ key })}"
                placeholder="${getFieldDescription(key)}"
                value="${value}"
              >`;
}

function renderInputPerProperty({ key, value }) {
  var fieldDescription = getFieldDescription(key);
  return trim`<ul class="contact-edit__input-list">
                ${Object.keys(fieldDescription)
                  .map(
                    subkey =>
                      `<li class="contact-edit__input-item">
                        <input
                          class="contact-edit__input"
                          name="${createInputName({ key, subkey })}"
                          placeholder="${fieldDescription[subkey]}"
                          value="${value[subkey] || ''}"
                        >
                      </li>`
                  )
                  .join('')}
              </ul>`;
}

function renderCommaSeparated({ key, value }) {
  return trim`<input
                class="contact-edit__input"
                name="${createInputName({ key, commaSeparated: true })}"
                placeholder="${getFieldDescription(key)}"
                value="${value.join()}"
              >`;
}
