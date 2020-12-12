'use strict';

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
