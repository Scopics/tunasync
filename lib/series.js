'use strict';

/**
 * Running multiple functions which depend on the output of
 * the previous function. If an error is encountered in any
 * of the tasks, no more functions are run but the final callback
 * is called with the error value.
 * @param {Array} fns - array of functions
 * @param {Function} done - final callback
 * @param {Boolean} isCb - config for functions,
 * is functions has callback logic or async
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
  }, { isCb: 1 });
 *
 */
const series = function(fns, done, config = {}) {

  const { isCb } = config;
  const results = [];

  const nextFn = async (fns, done) => {
    if (!fns.length) return done(null, results);

    const fn = fns.shift();

    if (isCb) {
      const callback = (err, result) => {
        results.push(result);
        if (err) return done(err);
        else return nextFn(fns, done);
      };

      fn(null, callback);
    } else {
      try {
        const result = await fn();
        results.push(result);
        return nextFn(fns, done);
      } catch (err) {
        return done(err);
      }
    }
  };

  nextFn(fns, done);
};

module.exports = { series };
