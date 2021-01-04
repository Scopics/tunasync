'use strict';

const metatests = require('metatests');
const memoize = require('../lib/memoize');
const { sleep } = require('../lib/utils/promisify');

const sum = async (a, b) => {
  await sleep(100);
  return a + b;
};

const sumCb = (a, b, cb) => {
  setTimeout(() => {
    cb(null, a + b);
  }, 100);
};

metatests.test('test queue with error', test => {
  const memoizedSum = memoize(sum);
  const result = [];
  const expectedResult = [4, 6, 4];

  memoizedSum(1, 3)
    .then(res => result.push(res))
    .then(() => memoizedSum(1, 5))
    .then(res => result.push(res))
    .then(() => memoizedSum(1, 3))
    .then(res => result.push(res))
    .then(() => test.strictSame(result, expectedResult));

  test.end();
});

metatests.test('test callback', test => {
  const memoizedSumCb = memoize(sumCb, { isCb: true });
  const expectedResult = [9, 10, 7, 9];
  const result = [];

  memoizedSumCb(4, 5)
    .then(data => {
      result.push(data);
      return memoizedSumCb(4, 6);
    })
    .then(data => {
      result.push(data);
      return memoizedSumCb(4, 3);
    })
    .then(data => {
      result.push(data);
      return memoizedSumCb(4, 5);
    })
    .then(() => test.strictSame(result, expectedResult));

  test.end();
});

metatests.test('test memoize cacheSize', test => {
  const memoizedSum = memoize(sum, { cacheSize: 2 });
  const result = [];
  const expectedResult = [50, 50, 90, 50, 50];

  memoizedSum(30, 20)
    .then(res => result.push(res))
    .then(() => memoizedSum(25, 25))
    .then(res => result.push(res))
    .then(() => memoizedSum(45, 45))
    .then(res => result.push(res))
    .then(() => memoizedSum(30, 20))
    .then(res => result.push(res))
    .then(() => memoizedSum(25, 25))
    .then(res => result.push(res))
    .then(() => test.strictSame(result, expectedResult));

  test.end();
});
