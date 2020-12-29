'use strict';

const generateKey = args => args
  .map(item =>
    `${item.toString()}:${typeof item}`)
  .join('|');

const promisifyClosure = (fn, hasher) => (...args) => new Promise(
  (resolve, reject) => {
    fn(...args, (err, data) => {
      const res = hasher(err, data) || data;
      return (err ? reject(err) : resolve(res));
    });
  });

const asyncMemoize = (fn, config = {}) => {
  if (typeof fn !== 'function') {
    throw new Error('fn is not a function');
  }

  const { isCb } = config;
  const cache = new Map();

  const memoized = (...args) => {
    let wrappedFn = fn;
    const key = generateKey(args);
    if (isCb) {
      const lastArg = args[args.length - 1];
      const cb = typeof lastArg === 'function' ?
        args.pop() : (err, data) => data;
      wrappedFn = promisifyClosure(fn, cb);
    }
    return Promise.resolve(key)
      .then(key => {
        const value = cache.get(key);
        if (value) return Promise.resolve(value);
        return Promise.resolve(wrappedFn(...args))
          .then(value => {
            cache.set(value);
            return value;
          });
      });
  };

  memoized.clearCache = () => cache.clear();

  return memoized;
};

module.exports = asyncMemoize;
