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
    email: `${name.toLowerCase()}@gmail.com`,
    website: `www.${name.toLowerCase()}.com`
  });
});

window.addEventListener('load', () => controller.init());
