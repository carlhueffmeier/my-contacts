import { renderIcon, isDefined } from './helper';

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
  linkedin: 'Linked In',
  notes: 'Notes'
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

export function getName({ name: { firstName, lastName } }) {
  if (lastName && lastName.length > 0) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

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

function removeEmptySlots(array) {
  return array.filter(() => true);
}
