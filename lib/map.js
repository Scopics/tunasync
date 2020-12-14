'use strict';

const map = async (arr, fn) => {
  const result = await Promise.all(arr.map(fn));
  return result;
};

module.exports = map;