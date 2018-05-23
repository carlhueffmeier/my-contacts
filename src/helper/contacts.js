import { isDefined, removeEmptySlots } from '../helper/utils';
import { renderIcon } from '../helper/dom';

var allKeys = [
  'name',
  'tags',
  'email',
  'phone',
  'web',
  'github',
  'twitter',
  'linkedin',
  'notes'
];

var fieldsProhibitingDuplication = ['tags'];

var icons = {
  name: 'icon-account_circle',
  tags: 'icon-label_outline',
  email: 'icon-mail_outline',
  phone: 'icon-phone',
  web: 'icon-public',
  github: 'icon-github',
  twitter: 'icon-twitter',
  linkedin: 'icon-linkedin',
  notes: 'icon-library_books'
};

var description = {
  name: {
    firstName: 'First name',
    lastName: 'Last name'
  },
  tags: 'Comma separated list of tags',
  email: {
    value: 'E-Mail',
    label: 'Label'
  },
  phone: {
    value: 'Phone',
    label: 'Label'
  },
  web: 'Website',
  github: 'Github',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  notes: 'Notes'
};

var inputProps = {
  name: {
    firstName: { required: true, pattern: '[a-zA-Z0-9_-]+' }
  },
  email: {
    value: { type: 'email' }
  },
  phone: {
    value: { type: 'tel' }
  },
  web: { type: 'url' },
  github: { type: 'url' },
  linkedin: { type: 'url' }
};

export function getAllKeys() {
  return allKeys;
}

export function getFieldIcon(key) {
  return icons.hasOwnProperty(key) ? renderIcon(icons[key]) : undefined;
}

export function getFieldDescription(key) {
  return description.hasOwnProperty(key) ? description[key] : undefined;
}

export function getName({ name: { firstName, lastName } = {} }) {
  return [firstName, lastName]
    .filter(partial => partial && partial.length > 0)
    .join(' ');
}

export function getAdditionalProps(key) {
  return inputProps.hasOwnProperty(key) ? inputProps[key] : {};
}

// Corrects easily fixable problems given serialized form data
export function normalizeData(source) {
  return allKeys.reduce((result, key) => {
    if (!isDefined(source[key]) || source[key] === '') {
      return result;
    }
    result[key] = source[key];
    if (Array.isArray(result[key])) {
      result[key] = removeEmptySlots(result[key]);
    }
    if (fieldsProhibitingDuplication.includes(key)) {
      result[key] = [...new Set(result[key])];
    }
    return result;
  }, {});
}

// Returns `true` if serialized form data is valid
export function validateFormData(data) {
  return (
    isDefined((data.name || {}).firstName) && data.name.firstName.length > 0
  );
}
