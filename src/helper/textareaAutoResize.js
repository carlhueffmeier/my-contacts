import { debounce } from '../helper/utils';

// We create a shadow element that mirrors the textarea.
// In contrast to <textarea> elements, <div> elements
// do automatically resize in response to user input.
// These changes are going to be applied to the DOM:
//
// Before:
// [ <textarea> ]
//
// After:
// [   relative container <div>   ]
// [ <textarea> ]  [ shadow <div> ]
//
//
// It is rather expensive, though.
// Every time text changes or window is resized,
// we update and resize.
//

export default function textareaAutoResize(nodes) {
  nodes.forEach(activateAutoResize);
}

function activateAutoResize(textarea) {
  var container = createContainerElement();
  var shadow = createShadowElement(textarea);

  textarea.parentNode.insertBefore(container, textarea);
  container.appendChild(textarea);
  container.appendChild(shadow);
  applyTextareaStyles(textarea);

  var resize = () => syncWithShadow(textarea, shadow);
  registerCallback(textarea, resize);
}

function createContainerElement() {
  var container = document.createElement('div');
  container.style.position = 'relative';
  container.style.display = 'flex';
  container.style.flex = '1';
  return container;
}

function createShadowElement(textarea) {
  var originalStyles = window.getComputedStyle(textarea);
  var shadow = document.createElement('div');

  shadow.innerText = textarea.value.replace(/\n/g, '<br>');
  shadow.style.cssText = originalStyles.cssText;
  shadow.style.height = 'auto';
  shadow.style.flex = '1';
  shadow.style.left = '0';
  shadow.style.right = '0';
  shadow.style['word-break'] = 'break-word';
  shadow.style['word-wrap'] = 'break-word';
  shadow.style['overflow-wrap'] = 'break-word';
  return shadow;
}

function applyTextareaStyles(textarea) {
  textarea.style.position = 'absolute';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '100%';
}

// When user input happens, we copy the content to
// the shadow div and reflect height changes for the
// <textarea> element.
function syncWithShadow(textarea, shadow) {
  var content = textarea.value;
  content = content.length > 0 ? content : ' ';
  shadow.innerText = content.replace(/\n/g, '<br>');
  textarea.style.height = `${shadow.clientHeight}px`;
  textarea.style.width = `${shadow.clientWidth}px`;
}

function registerCallback(textarea, callback) {
  setTimeout(callback, 0);
  textarea.addEventListener('input', callback);
  window.addEventListener('resize', debounce(callback, 50));
}
