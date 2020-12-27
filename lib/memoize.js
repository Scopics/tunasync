'use strict';

const generateKey = args => args
  .map(item =>
    (typeof item === 'function' ?
      JSON.stringify(item.name) :
      JSON.stringify(item)))
  .join(' | ');


const promisifyClosure = fn => (...args) =>
  new Promise((resolve, reject) => {
    fn(...args, (err, res) => (err ? reject(err) : resolve(res)));
  });

const asyncMemoize = (fn, config = {}) => {
  if (typeof fn !== 'function') {
    throw new Error('fn is not a function');
  }

  const { isCb } = config;
  const cache = new Map();

  const memoized = (...args) => Promise.resolve(generateKey(args))
    .then(key => {
      let wrappedFn = fn;
      if (isCb) {
        const lastArg = args[args.length - 1];
        if (typeof lastArg === 'function') {
          args.pop();
        }
        wrappedFn = promisifyClosure(fn);
      }
      const value = cache.get(key);
      if (value) return Promise.resolve(value);
      return Promise.resolve(wrappedFn(...args))
        .then(value => {
          cache.set(key, value);
          return value;
        });
    });

  memoized.clearCache = () => cache.clear();

  return memoized;
};

module.exports = asyncMemoize;
