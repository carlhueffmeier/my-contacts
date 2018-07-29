export function noop() {}

export function identity(arg) {
  return arg;
}

export function isEmpty(list) {
  return list.length === 0;
}

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

export function isIterable(obj) {
  return typeof obj[Symbol.iterator] === 'function';
}

export function omit(obj, ...keysToOmit) {
  return Object.keys(obj)
    .filter(key => !keysToOmit.includes(key))
    .reduce(
      (result, key) => ({
        ...result,
        [key]: obj[key]
      }),
      {}
    );
}

export function without(array, ...itemsToOmit) {
  return array.filter(item => itemsToOmit.includes(item) === false);
}

export function pipe(firstFn = identity, ...fns) {
  return (...args) => fns.reduce((acc, fn) => fn(acc), firstFn(...args));
}

export function callAll(...fns) {
  return (...args) => fns.forEach(fn => fn(...args));
}

export function removeEmptySlots(array) {
  return array.filter(() => true);
}

export function wrappingModulo(val, lim) {
  return (val % lim + lim) % lim;
}

export function debounce(fn, wait) {
  var timeout;
  return function debouncer() {
    var context = this,
      args = arguments;
    var later = () => {
      timeout = null;
      fn.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// For convenient use in Array.filter
export function createObjectMatcher(query) {
  return obj =>
    Object.keys(query).every(key => {
      var criterium = query[key];
      var subject = obj[key];

      if (isRegexp(criterium)) {
        return criterium.test(subject);
      } else if (Array.isArray(criterium)) {
        return isSubArray(criterium, subject);
      }
      return criterium === subject;
    });
}

export function isSubArray(sub, main) {
  return sub.every(item => main.includes(item));
}

export function splitBy(array, criterium) {
  var red = [];
  var black = [];

  array.forEach(item => {
    if (criterium(item)) {
      red.push(item);
    } else {
      black.push(item);
    }
  });
  return [red, black];
}

export function mapAndMergePromises(array, fn) {
  return Promise.all(array.map(fn));
}
