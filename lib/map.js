'use strict';

const map = async (fn, arr = [], config = {}) => {
  const parallel = Object.prototype.hasOwnProperty.call(config, 'parallel') ?
    config.parallel : false;

  if (parallel) {
    const result = await Promise.all(arr.map(fn));
    return result;
  }

  const result = [];
  for (const item of arr) {
    result.push(await fn(item));
  }
  return result;
};

module.exports = map;
