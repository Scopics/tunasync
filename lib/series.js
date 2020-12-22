'use strict';

/**
 * Running multiple functions which depend on the output of
 * the previous function. If an error is encountered in any
 * of the tasks, no more functions are run but the final callback
 * is called with the error value.
 * @param {Array} fns - array of functions
 * @param {Function} done - final callback
 *
 * @example
 * const createFn = value => (err, cb) => {
    setTimeout(() => {
      if (value === 6) return cb(new Error('sorry'));
      else return cb(err, value);
    }, value);
  };

  const fns = [createFn(2000), createFn(60), createFn(500)];

  series(fns, (err, data) => {
    const result = { err, data };
    console.log(result);
  });
 *
 */
const series = function(fns, done) {
  const results = [];

  const nextFn = (fns, done) => {
    if (fns.length) {
      const fn = fns.shift();

      const callback = (err, result) => {
        results.push(result);
        if (err) done(err);
        else return nextFn(fns, done);
      };

      fn(null, callback);
    } else {
      done(null, results);
    }
  };

  nextFn(fns, done);
};

module.exports = { series };
