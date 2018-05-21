import View from './view';
import Template from './template';
import Store from './store';
import Controller from './controller';
import './styles.css';

var store = new Store();
var template = new Template();
var view = new View(template);
var controller = new Controller(store, view);

// Prepopulate with some data
[
  'Saori',
  'Anna',
  'John',
  'Peter',
  'Marc',
  'Francine',
  'Steven',
  'Beth',
  'Adriane',
  'Lukas',
  'Tim',
  'Martin'
].forEach(name => {
  store.addContact({
    name: { firstName: name, lastName: '' },
    email: [{ label: 'Private', value: `${name.toLowerCase()}@gmail.com` }],
    phone: [
      { label: 'Mobile', value: '555 - 23 45 678' },
      { label: 'Home', value: '555 - 874 09 633' }
    ],
    notes: 'a really cool guy / girl / person',
    twitter: `@${name.toLowerCase()}`,
    github: `github.com/${name.toLowerCase()}`,
    linkedin: `linkedin.com/${name.toLowerCase()}`,
    website: `www.${name.toLowerCase()}.com`,
    tags: ['friend']
  });
});

window.addEventListener('load', () => controller.init());
