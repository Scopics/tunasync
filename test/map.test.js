'use strict';

const fsPromises = require('fs').promises;
const map = require('../lib/map');
const arr = [
  'mapTestFiles/t1.txt',
  'mapTestFiles/t2.txt',
  'mapTestFiles/t3.txt'];


const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

async function readDelay(filename, msec) {
  await sleep(msec);
  return fsPromises.readFile(filename);
}

(async () => {
  const res = await map(arr, async item => {
    const out = await readDelay(item, 5000);
    return out + '';
  });
  console.log(res);
})();
