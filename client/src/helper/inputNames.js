import DOMPurify from 'dompurify';
import { isDefined } from '../helper/utils';
import { normalizeData } from '../helper/contacts';

// Given a list of nodes representing <input> elements,
// returns an object with the form data.
export function serializeInputs(nodeList) {
  var contact = Array.from(nodeList).reduce(
    (result, { name, value: dirtyValue }) => {
      var value = DOMPurify.sanitize(dirtyValue).trim();

      if (value.length === 0) {
        return result;
      }

      var { key, subkey, index, commaSeparated } = decodeInputName(name);
      if (isDefined(index) && !Array.isArray(result[key])) {
        result[key] = [];
      }

      if (commaSeparated) {
        result[key] = value.split(',').map(s => s.trim());
      } else if (isDefined(index, subkey)) {
        result[key][index] = {
          ...result[key][index],
          [subkey]: value
        };
      } else if (isDefined(subkey)) {
        result[key] = {
          ...result[key],
          [subkey]: value
        };
      } else if (isDefined(index)) {
        result[key][index] = value;
      } else {
        result[key] = value;
      }
      return result;
    },
    {}
  );

  return normalizeData(contact);
}

// To ensure form data is assigned to the correct
// properties, we use a simple naming scheme:
//
// key:             primary key (`contact.github`)
// subkey:          secondary key (`contact.name.lastName`)
// index:           array index for variable length fields (`contact.phone[1]`)
// commaSeparated:  input holds an array in comma separated notation (`contact.tags`)

export function encodeInputName({ key, subkey, index, commaSeparated }) {
  var name = key;
  if (isDefined(index)) {
    name += index.toString().padStart(2, '0');
  }
  if (isDefined(subkey)) {
    name += `-${subkey}`;
  }
  if (commaSeparated) {
    name += '+';
  }
  return name;
}

export function decodeInputName(name) {
  var key, subkey, index, commaSeparated;
  [key, subkey] = name.split('-');

  commaSeparated = /[+]$/.test(key);
  if (commaSeparated) {
    key = key.slice(0, -1);
  }

  if (/\w+\d{2}/.test(key)) {
    index = Number(key.slice(-2));
    key = key.slice(0, -2);
  }

  return { key, subkey, index, commaSeparated };
}
