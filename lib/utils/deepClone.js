'use strict';

const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  } else if (Array.isArray(obj)) {
    const result = [];
    for (const data of obj) {
      result.push(deepClone(data));
    }
    return result;
  } else {
    const result = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      result[key] = deepClone(obj[key]);
    }
    return result;
  }
};

module.exports = deepClone;