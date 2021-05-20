'use strict';

const { promisifyClosure } = require('./utils/promisify');

/**
 * Applies the function fn to each argument
 * and returns true if result of function
 * with any arg is true
 * @param {Function} fn - A function
 * (with a callback or promise contract)
 * that takes each argument
 * as input and returns the processed value.
 * @param {any} fn.item - current value.
 * @param {Function} fn.callback - The callback function
 * in which the processed value is passed,
 * if fn function with callback contract.
 * @param {Array} arr - array of values.
 * @param {Object} config - object with settings
 * for a function
 * @property {Boolean} confing.isCb -
 * function accepts callback.
 *
 * @example
 *
 *
  some((filePath, callback) => {
    fs.access(filePath, err => {
      callback(null, !err);
    });
  }, ['file1', 'file2', 'retry.test.js'],
  { isCb: true })
    .then(res => console.log(res))
    .catch(err => console.log(err.message));
 *
 * @returns {Boolean} shows if function from any arg
 * returns true
 */
const some = (fn, arr = [], config = {}) =>
  new Promise((resolve) => {
    const { isCb } = config;
    const wrappedFn = isCb ? promisifyClosure(fn) : fn;

    const promises = arr.map((item) => wrappedFn(item));
    Promise.all(promises).then((results) => {
      const result = results.some((res) => res);
      resolve(result);
    });
  });

module.exports = some;
