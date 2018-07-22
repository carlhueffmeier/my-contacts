import { debounce } from '../helper/utils';
import escape from 'lodash.escape';

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

export default function textareaAutoResize(nodeList) {
  nodeList.forEach(textarea => {
    if (textarea.classList.contains('textarea--auto-resize-active') === false) {
      activateAutoResize(textarea);
      textarea.classList.add('textarea--auto-resize-active');
    }
  });
}

function activateAutoResize(textarea) {
  var container = createContainerElement();
  var shadow = createShadowElement(textarea);

  textarea.parentNode.insertBefore(container, textarea);
  container.appendChild(textarea);
  container.appendChild(shadow);
  applyTextareaStyles(textarea);

  var resize = () => syncWithShadow(textarea, shadow);
  resize();
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
  // Let's make sure no screen reader catches our shadow element
  shadow.setAttribute('aria-hidden', 'true');

  // To accurately reflect our original textarea,
  // we need to copy all styles over
  shadow.style.cssText = originalStyles.cssText;

  // Make sure that height changes automatically
  shadow.style.height = 'auto';

  // To get the correct height when the textarea is squashed to the side,
  // we need to make sure it fills the parent flex container
  shadow.style.flex = '1';
  shadow.style.left = '0';
  shadow.style.right = '0';

  // Make sure text wraps
  shadow.style['word-break'] = 'break-word';
  shadow.style['word-wrap'] = 'break-word';
  shadow.style['overflow-wrap'] = 'break-word';

  // And hide it!
  // It's not called `shadow` for no reason 👻
  shadow.style['transform'] = 'translateY(-999rem)';

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
  // First, escape special html characters like `<`
  var content = escape(textarea.value);

  // To accurately represent the textarea value inside the div,
  // we need to replace newlines with html <br> tags
  content = content.replace(/\n/g, '<br>');

  // Remember: A <br> at the end of line will be ignored
  var zeroWidthSpace = '&#8203;';
  shadow.innerHTML = content + zeroWidthSpace;

  // 🏁 Finally, get our hard-earned dimensions
  textarea.style.height = `${shadow.clientHeight}px`;
  textarea.style.width = `${shadow.clientWidth}px`;
}

function registerCallback(textarea, callback) {
  setTimeout(callback, 0);
  textarea.addEventListener('input', callback);
  // Remember I said, this was expensive..
  // Let's debounce it to reduce redrawing
  window.addEventListener('resize', debounce(callback, 100));
}
