import { trim, isBoolean } from '../helper/utils';

export function bindToParent({ parent, callback, selector, type = 'click' }) {
  parent.addEventListener(type, event => {
    var searchResult = event.target.closest(selector);
    if (searchResult) {
      callback(event);
      console.log(`[${type}] ${selector}`);
    }
  });
}

export function renderIcon(type) {
  return trim`<svg class="icon">
                <use xlink:href="#${type}"></use>
              </svg>`;
}

export function toggleClass(element, className, on) {
  if (typeof on !== 'boolean') {
    element.classList.toggle(className);
  } else if (on) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

export function objectToHtmlAttributes(props) {
  return Object.entries(props)
    .map(([key, value]) => {
      if (isBoolean(value)) {
        return value ? key : '';
      }
      return `${key}="${value}"`;
    })
    .join(' ');
}
