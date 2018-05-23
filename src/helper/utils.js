export function isRegexp(object) {
  return getPrototypeString(object) === getPrototypeString(/./);
}

export function isBoolean(object) {
  return getPrototypeString(object) === getPrototypeString(true);
}

export function getPrototypeString(object) {
  return Object.prototype.toString.call(object);
}

export function isDefined(...refs) {
  return refs.every(ref => typeof ref !== 'undefined');
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

export function trim(strings, ...values) {
  var result = '';
  strings.forEach((string, i) => {
    result += string.replace(/\s+/g, ' ') + (values[i] || '');
  });
  return result;
}

export function removeEmptySlots(array) {
  return array.filter(() => true);
}

export function debounce(f, wait) {
  var timeout;
  return function debouncer() {
    var context = this,
      args = arguments;
    var later = () => {
      timeout = null;
      f.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// For convenient use in Array.filter
export function createQueryMatcher(query) {
  return obj =>
    Object.keys(query).every(
      key =>
        isRegexp(query[key])
          ? query[key].test(obj[key])
          : query[key] === obj[key]
    );
}
