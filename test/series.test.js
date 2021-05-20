'use strict';

const metatests = require('metatests');
const series = require('./../lib/series');

const createFn = (value) => (err, cb) => {
  setTimeout(() => {
    if (value === 6) return cb(new Error('sorry'));
    else return cb(err, value);
  }, value);
};

const createAsyncFn = (value) => () => {
  if (value === 6) return Promise.reject(new Error('sorry'));
  return new Promise((resolve) => setTimeout(() => resolve(value), value));
};

metatests.test('test series', (test) => {
  const fns1 = [createFn(2000), createFn(60), createFn(500)];
  const fns2 = [createAsyncFn(2000), createAsyncFn(60), createAsyncFn(500)];
  const expectedResult = {
    err: null,
    data: [2000, 60, 500],
  };

  series(
    fns1,
    (err, data) => {
      const result = { err, data };
      test.strictSame(result, expectedResult);
    },
    { isCb: true }
  );

  series(fns2, (err, data) => {
    const result = { err, data };
    test.strictSame(result, expectedResult);
  });

  test.end();
});

metatests.test('test series with error', (test) => {
  const fns1 = [createFn(2000), createFn(6), createFn(500)];
  const fns2 = [createAsyncFn(2000), createAsyncFn(6), createAsyncFn(500)];
  const expectedResult = {
    err: new Error('sorry'),
    data: undefined,
  };

  series(
    fns1,
    (err, data) => {
      const result = { err, data };
      test.strictSame(result, expectedResult);
    },
    { isCb: true }
  );

  series(fns2, (err, data) => {
    const result = { err, data };
    test.strictSame(result, expectedResult);
  });

  test.end();
});
