'use strict';

const submodules = [
  'asyncEmitter',
  'map',
  'memoize',
  'queue',
  'reduce',
  'retry',
  'series',
  'some',
].reduce((obj, path) => (
  obj[path] = require('./lib/' + path), obj), {});

module.exports = { ...submodules };
