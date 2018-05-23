import View from './view';
import Template from './template';
import Store from './store';
import Controller from './controller';
import createSampleData from './data/createSampleData';
import './styles.css';

var store = new Store();
var template = new Template();
var view = new View(template);
var controller = new Controller(store, view);

// Prepopulate with some sample data
createSampleData().forEach(entry => store.addContact(entry));

window.addEventListener('load', () => controller.init());
