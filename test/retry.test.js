'use strict';

const fsPromises = require('fs').promises;
const { retry, sleep } = require('./../lib/retry');

async function readDelay(filename, msec) {
  await sleep(msec);
  return fsPromises.readFile(filename);
}

async function openDelay(filename, msec) {
  await sleep(msec);
  return fsPromises.open(filename, 'w');
}

openDelay('test.txt', 4000)
  .then(() => console.log('File created'))
  .catch(err => console.log(err.message));

(async () => {
  await retry(5, readDelay, 'test.txt', 1000);
})();
