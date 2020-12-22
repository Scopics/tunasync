'use strict';

const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

const promisify = (fn, args = []) => new Promise((resolve, reject) => {
  args.push((err, data) => (err ? reject(err) : resolve(data)));
  fn(...args);
});

module.exports = { sleep, promisify };
