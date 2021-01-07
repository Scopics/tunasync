'use strict';

const partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

module.exports = partial;
