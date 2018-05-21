import { renderIcon } from './helper';

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
