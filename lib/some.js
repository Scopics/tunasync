'use strict';

const { promisifyClosure } = require('./utils/promisify');

const some = (fn, args, config = {}) => (
  new Promise(resolve => {
    const { isCb } = config;
    let wrappedFn = fn;

    if (isCb) {
      const lastArg = args[args.length - 1];
      const cb = typeof lastArg === 'function' ?
        args.pop() : (err, data) => data;
      wrappedFn = promisifyClosure(fn, cb);
    }

    const promises = args.map(arg => wrappedFn(arg));
    Promise.all(promises).then(results => {
      const result = results.some(res => res);
      resolve(result);
    });
  })
);

module.exports = some;
