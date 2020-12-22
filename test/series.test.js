'use strict';

const metatests = require('metatests');
const { series } = require('./../lib/series');

const createFn = val => (err, cb) => {
  if (val === 6) return Promise.reject(new Error('sorry'));
  return new Promise(resolve => setTimeout(() => resolve(cb(err, val)), val));
};

metatests.test('test series', test => {
  const fns = [createFn(2000), createFn(60), createFn(500)];
  const expectedResult = {
    err: null,
    data: [2000, 60, 500]
  };

  series(fns, (err, data) => {
    const result = { err, data };
    test.strictSame(result, expectedResult);
  });

  test.end();
});


