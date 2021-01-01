'use strict';

const { promisifyClosure } = require('./utils/promisify');

/**
 * The reduce() method reduces the array to a single value. 
 * The reduce() method executes a provided function for each value 
 * of the array (from left-to-right). The return value of the 
 * function is stored in an accumulator (result/total).
 * @param {Function} fn - A function
 * (with a callback or promise contract)
 * that takes each argument
 * as input and returns the processed value.
 * @param {any} fn.acc - accumulator.
 * @param {any} fn.item - current value.
 * @param {Function} fn.callback - The callback function
 * in which the processed value is passed,
 * if fn function with callback contract.
 * @param {any} startValue - your starting value, 
 * otherwise it's 0.
 * @param {Array} arr - array of values.
 * @param {Object} config - object with settings
 * for a function
 * @property {Boolean} confing.isCb -
 * function accepts callback.
 *
 * @example
 *
 * 
  reduce((acc, item, callback) => {
    setTimeout(() => callback(null, acc + item), 1000);
  }, 10, [1, 2, 3, 4, 5, 6], { isCb: true })
    .then(res => console.log(res))
    .catch(err => console.log(err.message));
 *
 * @returns {any} result of calculations
 */
const reduce = (fn, startValue, arr = [], config = {}) => (
  new Promise(resolve => {
    const { isCb } = config;
    const len = arr.length;
    let i = 0, acc = startValue;
    let wrappedFn = fn;

    if (isCb)
      wrappedFn = promisifyClosure(fn);

    const iterate = async () => {
      if (i === len) resolve(acc);
      else {
        await wrappedFn(acc, arr[i]).then(res => acc = res);
        i++;
        iterate();
      }
    };

    iterate();
  })
);

module.exports = reduce;
