'use strict';

const map = require('../lib/map');
const arr = [1, 2, 4, 5, 2, '12'];


const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

(async () => {
  map((item, cb) => {
    cb(null, item + 2);
  }, arr, { parallel: false, isCb: true})
  .then(res => console.log(res))
  .catch(err => console.log(err));
})();
