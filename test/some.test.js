'use strict';

const fs = require('fs');
const metatests = require('metatests');
const some = require('./../lib/some');
const { sleep } = require('../lib/utils/promisify');


metatests.test('test some 1', (test) => {
  const expectedResult = true;
  some((filePath, callback) => {
    fs.access(filePath, (err) => {
      callback(null, !err);
    });
  }, ['file1', 'file2', 'retry.test.js'],
  { isCb: true })
    .then((res) => test.strictSame(res, expectedResult))
    .catch((err) => console.log(err.message));

  test.end();
});

metatests.test('test some 2', (test) => {
  const expectedResult = true;
  some(async (str) => {
    await sleep(1000);
    return str.length === 5;
  }, ['text11', 'text1', 'text'])
    .then((res) => test.strictSame(res, expectedResult))
    .catch((err) => console.log(err.message));

  test.end();
});
