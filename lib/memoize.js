'use strict';

const generateKey = args => args
  .map(item =>
    (typeof item === 'function' ?
      JSON.stringify(item.name) :
      JSON.stringify(item)))
  .join(' | ');


const asyncMemoize = fn => {
  if (typeof fn !== 'function') {
    throw new Error('fn is not a function');
  }

  const cache = new Map();

  const memoized = (...args) => Promise.resolve(generateKey(args))
    .then(key => {
      const value = cache.get(key);
      if (value) return Promise.resolve(value);
      return Promise.resolve(fn(...args))
        .then(value => {
          cache.set(key, value);
          return value;
        });
    });

  memoized.clearCache = () => cache.clear();

  return memoized;
};

module.exports = asyncMemoize;
