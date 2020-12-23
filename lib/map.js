'use strict';

const { promisifyClosure } = require('./utils/promisify');

const map = async (fn, arr = [], config = {}) => {
  const parallel = Object.prototype.hasOwnProperty.call(config, 'parallel') ?
    config.parallel : false;
  const isCb = config.isCb;
  const mapper = !isCb ? fn : promisifyClosure(fn);

  if (parallel && !isCb) {
    const result = await Promise.all(arr.map(mapper));
    return result;
  }

  const result = [];
  for (const item of arr) {
    result.push(await mapper(item));
  }
  return result;
};

module.exports = map;
