'use strict';

const fsPromises = require('fs').promises;
const { retry } = require('./../lib/retry');

const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

async function readDelay(filename, msec) {
  await sleep(msec);
  return fsPromises.readFile(filename);
}

async function writeDelay(filename, msec) {
  await sleep(msec);
  return fsPromises.writeFile(filename, 'Java is a crap');
}

writeDelay('test.txt', 4000)
  .then(() => console.log('File created'))
  .catch(err => console.log(err.message));

(async () => {
  const res = await retry(readDelay, ['test.txt', 1000], { retries: 5 });
  console.log(res + '');
})();
