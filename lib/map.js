'use strict';

const { promisifyClosure } = require('./utils/promisify');

/**
 * Applies the function fn to each argument
 * and returns an array of
 * values that the function returned.
 * @param {Function} fn - A function
 * (with a callback or promise contract)
 * that takes each argument
 * as input and returns the processed value.
 * @param {any} fn.item - current value.
 * @param {any} fn.itemInde - index of the currently
 * processed element in the array.
 * @param {any} fn.callback - The callback function
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
 * const arr = [1, 2, 3, 5];

  map((item, cb) => {
    setTimeout(() => {
      cb(null, item + 2);
    }, 10);
  }, arr, { isCb: true })
    .then(data => console.log(data))
    .catch(err => console.log(err.message));
 *
 * @returns {Array} an array of processed
 * values or an error
 */

const map = async (fn, arr = [], config = {}) => {
  if (!Array.isArray(arr))
    throw new Error('The first argument must be an array');

  const { parallel, isCb } = config;
  const wrappedFn = isCb ? promisifyClosure(fn) : fn;

  if (parallel && !isCb) {
    const result = await Promise.all(arr.map(wrappedFn));
    return result;
  }

  const result = [];
  for (const item of arr) result.push(await wrappedFn(item));
  return result;
};

module.exports = map;
