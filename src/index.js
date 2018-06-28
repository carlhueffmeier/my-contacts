import View from './view';
import Template from './template';
import Store from './store';
import Controller from './controller';
import createSampleData from './data/createSampleData';
import './styles.css';

var publicFolder = process.env.NODE_ENV === 'production' ? '/contacts/' : '/';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${publicFolder}service-worker.js`)
      .then(registration => {
        console.log('Service worker registered: ', registration);
      })
      .catch(registrationError => {
        console.log('Service worker registration failed: ', registrationError);
      });
  });
}

var store = Object.create(Store);
store.init();
var template = Object.create(Template);
var view = new View(template);
var controller = new Controller(store, view);

// Prepopulate with some sample data
createSampleData().forEach(entry => store.addContact(entry));

window.addEventListener('load', () => controller.init());
