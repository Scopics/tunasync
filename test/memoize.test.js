'use strict';

const metatests = require('metatests');
const memoize = require('../lib/memoize');
const { sleep } = require('../lib/utils/promisify');

const sum = async (a, b) => {
  await sleep(100);
  return a + b;
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
