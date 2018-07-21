import './bling';
import { isEmpty, noop, wrappingModulo } from './utils';
import { toggleClass, getFocusableElements } from './dom';

var Modal = {
  init({ node, container, onClose = noop }) {
    this.$modal = node;
    this.$container = container;
    this.onClose = onClose;
    // These functions are used as callbacks
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  },

  open() {
    this.toggle({ on: true });
  },

  close() {
    this.toggle({ on: false });
  },

  toggle({ on } = {}) {
    toggleClass(this.$modal, 'visible', on);
    toggleClass(this.$container, 'visible', on);
    this.$modal.setAttribute('aria-hidden', on ? 'false' : 'true');
    this.toggleFocusTrapping(on);
  },

  toggleFocusTrapping(on) {
    if (on) {
      this.focusFirstElement();
      this.addEventListeners();
    } else {
      this.removeEventListeners();
    }
  },

  focusFirstElement() {
    var focusableElements = getFocusableElements(this.$modal);
    if (!isEmpty(focusableElements)) {
      focusableElements[0].focus();
    }
  },

  addEventListeners() {
    this.$container.addEventListener('touchstart', this.onClick);
    this.$container.addEventListener('click', this.onClick);
    document.addEventListener('keydown', this.onKeydown);
  },

  removeEventListeners() {
    this.$container.removeEventListener('touchstart', this.onClick);
    this.$container.removeEventListener('click', this.onClick);
    document.removeEventListener('keydown', this.onKeydown);
  },

  onClick(event) {
    if (event.target === this.$container) {
      this.onClose();
    }
  },

  onKeydown(event) {
    if (event.key === 'Escape') {
      this.close();
    }
    if (event.key === 'Tab') {
      let focusableElements = getFocusableElements(this.$modal);
      let focusIndex = focusableElements.indexOf(event.target);
      focusIndex += event.shiftKey ? -1 : 1;
      focusIndex = wrappingModulo(focusIndex, focusableElements.length);
      focusableElements[focusIndex].focus();
      event.preventDefault();
    }
  }
};

export default Modal;
