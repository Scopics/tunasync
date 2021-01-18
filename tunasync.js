'use strict';

const submodules = [
  'asyncEmitter', // asynchronous Event emitter
  'map', // async map array method
  'memoize', // memorization of asynchronous functions
  'queue', // asynchronous queue
  'reduce', // async reduce array method
  'retry', // repeating the function call until the result
  'series', // calling functions depends on the result of the previous
  'some', // async some array method
].reduce((obj, path) => (
  obj[path] = require('./lib/' + path), obj), {});

module.exports = { ...submodules };
