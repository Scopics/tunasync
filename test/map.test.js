'use strict';

const map = require('../lib/map');
const arr = [1, 2, 4, 5, 2, '12'];


const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

(async () => {
  const res = await map(async item => {
    await sleep(1000);
    return item + 2;
  }, arr, { parallel: true });
  console.log(res);
})();
