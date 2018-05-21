export function trim(strings, ...values) {
  var result = '';
  strings.forEach((string, i) => {
    result += string.replace(/\s+/g, ' ') + (values[i] || '');
  });
  return result;
}

export function renderIcon(type) {
  return trim`<svg class="icon">
            <use xlink:href="#${type}"></use>
          </svg>`;
}

export function omit(obj, idsToObmit) {
  return Object.keys(obj)
    .filter(key => !idsToObmit.includes(key))
    .reduce(
      (result, key) => ({
        ...result,
        [key]: obj[key]
      }),
      {}
    );
}

export function match(query) {
  return obj =>
    Object.keys(query).every(
      key =>
        isRegexp(query[key])
          ? query[key].test(obj[key])
          : query[key] === obj[key]
    );
}

export function isRegexp(object) {
  return Object.prototype.toString.call(object) === '[object RegExp]';
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

export function bindToParent({ parent, callback, selector, type = 'click' }) {
  parent.addEventListener(type, event => {
    var searchResult = event.target.closest(selector);
    if (searchResult) {
      callback(event);
    }
  });
}

export function serializeInputs(nodeList) {
  return Array.from(nodeList).reduce((result, { name, value }) => {
    if (value.length === 0) {
      return result;
    }

    let { key, subkey, index, commaSeparated } = parseInputName(name);
    if (isDefined(index) && !Array.isArray(result[key])) {
      result[key] = [];
    }

    if (commaSeparated) {
      result[key] = value.split(',').map(s => s.trim());
    } else if (isDefined(index, subkey)) {
      result[key][index] = {
        ...result[key][index],
        [subkey]: value
      };
    } else if (isDefined(subkey)) {
      result[key] = {
        ...result[key],
        [subkey]: value
      };
    } else if (isDefined(index)) {
      result[key][index] = value;
    } else {
      result[key] = value;
    }
    return result;
  }, {});
}

export function isDefined(...refs) {
  return refs.every(ref => typeof ref !== 'undefined');
}

export function parseInputName(name) {
  var key, subkey, index, commaSeparated;
  [key, subkey] = name.split('-');

  commaSeparated = /[+]$/.test(key);
  if (commaSeparated) {
    key = key.slice(0, -1);
  }

  if (/\w+\d{2}/.test(key)) {
    index = Number(key.slice(-2));
    key = key.slice(0, -2);
  }

  return { key, subkey, index, commaSeparated };
}

export function createInputName({ key, subkey, index, commaSeparated }) {
  var name = key;
  if (isDefined(index)) {
    name += index.toString().padStart(2, '0');
  }
  if (isDefined(subkey)) {
    name += `-${subkey}`;
  }
  if (commaSeparated) {
    name += '+';
  }
  return name;
}
