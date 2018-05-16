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
  'Carl',
  'Anna',
  'John',
  'Peter',
  'Marc',
  'Francine',
  'Steven',
  'Beth',
  'Adriane',
  'Lukas',
  'Tim'
].forEach(name => {
  store.addContact({
    name,
    email: [{ type: 'Private', value: `${name.toLowerCase()}@gmail.com` }],
    phone: [
      { type: 'Mobile', value: '555 - 23 45 678' },
      { type: 'Home', value: '555 - 874 09 633' }
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
