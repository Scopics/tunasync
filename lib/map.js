'use strict';

const { promisifyClosure } = require('./utils/promisify');

const map = async (fn, arr = [], config = {}) => {
  if (!Array.isArray(arr))
    throw new Error('The first argument must be an array');

  const parallel = config.parallel;
  const isCb = config.isCb;
  const wrappedFn = isCb ?
    promisifyClosure(fn, (err, data) => data) : fn;

  if (parallel && !isCb) {
    const result = await Promise.all(arr.map(wrappedFn));
    return result;
  }

  const result = [];
  for (const item of arr) result.push(await wrappedFn(item));
  return result;
};

module.exports = map;
