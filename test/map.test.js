'use strict';

const metatests = require('metatests');
const map = require('../lib/map');
const { sleep } = require('../lib/utils/promisify');
const arr = [1, 2, 3, 5, 2, '12'];

metatests.test('test async callback function', (test) => {
  const expectedResult = [3, 4, 6, 7, 4, '122'];
  map(
    (item, cb) => {
      setTimeout(() => {
        cb(null, item + 2);
      }, 10);
    },
    arr,
    { isCb: true }
  ).then((data) => test.strictSame(data, expectedResult));

  // Error
  const expectedError = new Error('Sorry');
  map(
    (item, cb) => {
      setTimeout(() => {
        if (item === 2) cb(new Error('Sorry'), null);
        cb(null, item + 2);
      }, 10);
    },
    arr,
    { isCb: true }
  ).catch((err) => test.strictSame(err, expectedError));

  test.end();
});

metatests.test('test async promise function', (test) => {
  const expectedResult = [3, 4, 6, 7, 4, '122'];
  map(async (item) => {
    await sleep(10);
    return item + 2;
  }, arr).then((data) => test.strictSame(data, expectedResult));

  // Parallel
  map(
    async (item) => {
      await sleep(10);
      return item + 2;
    },
    arr,
    { parallel: true }
  ).then((data) => test.strictSame(data, expectedResult));

  // Error
  const expectedError = new Error('Sorry');
  map(async (item) => {
    await sleep(10);
    if (item === 2) throw new Error('Sorry');
    return item + 2;
  }, arr).catch((err) => test.strictSame(err, expectedError));

  // Parallel error
  map(
    async (item) => {
      await sleep(10);
      if (item === 2) throw new Error('Sorry');
      return item + 2;
    },
    arr,
    { parallel: true }
  ).catch((err) => test.strictSame(err, expectedError));

  test.end();
});
