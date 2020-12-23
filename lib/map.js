'use strict';

const map = async (fn, arr) => {
  const result = await Promise.all(arr.map(fn));
  return result;
};

module.exports = map;