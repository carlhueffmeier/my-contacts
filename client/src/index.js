import View from './view';
import Template from './template';
import Store from './store';
import Controller from './controller';
import './styles.css';

if ('serviceWorker' in navigator) {
  var publicFolder = process.env.NODE_ENV === 'production' ? '/contacts/' : '/';
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

// Create application instances
var store = Object.create(Store);
var template = Object.create(Template);
var view = Object.create(View);
var controller = Object.create(Controller);

store.init();

// When window finishes loading, initialize view and controller
window.addEventListener('load', () => {
  view.init({ template });
  controller.init({ store, view });
});
