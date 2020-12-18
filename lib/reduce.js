'use strict';

/**
 * Do function for every element and returns one value
 *
 * @param {Function} fn - function for every element of array.
 * @param {any} fn.acc - result of previous evaluation
 * @param {any} fn.item - current value
 * @param {Function} fn.callback - function to call after evaluations
 * @param {Error} fn.callback.err - error which is returned to callback
 * @param {Function} fn.callback.res
 *   - result of evaluations which is returned to callback
 * @param {any} startValue - start value from which you start your function.
 * @param {Array} arr - array of values.
 *
 * @example
 * reduce((acc, item, callback) => {
    setTimeout(() => callback(null, acc + item), 1000);
  }, 10, [1, 2, 3, 4, 5, 6])
    .then(res => console.log(res))
    .catch(err => console.log(err.message));
 * @returns {any} returns the value after the equation.
 */
const reduce = (fn, startValue, arr) => (
  new Promise((resolve, reject) => {
    const len = arr.length;
    let i = 0, acc = startValue;

    const callback = (err, res) => {
      acc = res;
      if (err) reject(err);
      i++;
      iterate();
    };

    const iterate = () => {
      if (i === len) resolve(acc);
      else fn(acc, arr[i], callback);
    };

    iterate();
  })
);

module.exports = reduce;
