'use strict';

const metatests = require('metatests');
const retry = require('./../lib/retry');
const { sleep } = require('./../lib/utils/promisify');

metatests.test('test retry succes', (test) => {
  let minSum = 20;
  const expectedResult = 5;

  const asyncSum = async (a, b) => {
    await sleep(100);
    if (a + b < minSum) {
      minSum -= a + b;
      throw new Error('Sorry');
    }
    return a + b;
  };

  const expectedResultCb = 10;
  let minSumCb = 20;
  const sumCb = (a, b, cb) => {
    if (a + b < minSumCb) {
      minSumCb -= a + b;
      cb(new Error('Sorry'));
    }
    cb(null, a + b);
  };

  retry(asyncSum, [2, 3], { retries: 5, interval: 10 })
    .then((data) => test.strictSame(data, expectedResult));

  retry(
    sumCb,
    [2, 3, (err, data) => data * 2],
    { isCb: true, retries: 5, interval: 10 })
    .then((data) => test.strictSame(data, expectedResultCb));

  test.end();
});

metatests.test('test retry error', (test) => {
  let minSum = 100;
  const expectedResult = new Error('Sorry');

  const asyncSum = async (a, b) => {
    await sleep(100);
    if (a + b < minSum) {
      minSum -= a + b;
      throw new Error('Sorry');
    }
    return a + b;
  };

  let minSumCb = 100;
  const sumCb = (a, b, cb) => {
    if (a + b < minSumCb) {
      minSumCb -= a + b;
      cb(new Error('Sorry'));
    }
    cb(null, a + b);
  };

  retry(asyncSum, [2, 3], { retries: 5, interval: 10 })
    .catch((err) => test.strictSame(err, expectedResult));

  retry(
    sumCb,
    [2, 3, (err, data) => data * 2],
    { isCb: true, retries: 5, interval: 10 })
    .catch((err) => test.strictSame(err, expectedResult));

  test.end();
});
