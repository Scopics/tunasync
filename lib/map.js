'use strict';

const { promisifyClosure } = require('./utils/promisify');

const map = async (fn, args = [], config = {}) => {
  const parallel = config.parallel;
  const isCb = config.isCb;
  const arr = args[0];
  let wrappedFn = fn;

  if (!Array.isArray(arr)) {
    throw new Error('The first argument must be an array');
  }

  if (isCb) {
    const lastArg = args[args.length - 1];
    const cb = typeof lastArg === 'function' ?
      args.pop() : (err, data) => data;
    wrappedFn = promisifyClosure(fn, cb);
  }

  if (parallel && !isCb) {
    const result = await Promise.all(arr.map(wrappedFn));
    return result;
  }

  const result = [];
  for (const item of arr) result.push(await wrappedFn(item));
  return result;
};

module.exports = map;
