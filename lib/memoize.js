'use strict';

const { promisifyClosure } = require('./utils/promisify');
const crypto = require('crypto');

const argKey = x => x.toString() + ':' + typeof x;

const generateKey = args => {
  const key = args.map(argKey).join('|');
  return crypto.createHash('sha256').update(key).digest('hex');
};

/**
 * Function to memoize the function
 * @param {Function} fn - function to memoize
 * @param {Object} config - object with config
 * @param {Boolean} config.isCb - function accepts callback
 * @param {Number} config.cacheSize - max size of cache
 * @example
 * const sum = async (a, b) => {
    await sleep(100);
    return a + b;
  };
  const memoizedSum = memoize(sum);
  const result = [];
  const expectedResult = [4, 6, 4];

  memoizedSum(1, 3)
    .then(res => result.push(res))
    .then(() => memoizedSum(1, 5))
    .then(res => result.push(res))
    .then(() => memoizedSum(1, 3))
    .then(res => result.push(res))
    .them(() => console.log(result));
  @returns {any} the result of function from cache or calculated result
 */
const asyncMemoize = (fn, config = {}) => {
  if (typeof fn !== 'function') {
    throw new Error('fn is not a function');
  }

  const { isCb, cacheSize } = config;
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
            if (cache.size >= cacheSize) {
              const firstKey = cache.keys().next().value;
              cache.delete(firstKey);
            }
            cache.set(key, value);
            return value;
          });
      });
  };

  memoized.clearCache = () => cache.clear();

  return memoized;
};

module.exports = asyncMemoize;
