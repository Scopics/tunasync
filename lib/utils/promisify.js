'use strict';

const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

const promisifyClosure = (fn, hasher) => (...args) => new Promise(
  (resolve, reject) => {
    fn(...args, (err, data) => {
      const res = hasher(err, data) || data;
      return (err ? reject(err) : resolve(res));
    });
  });

module.exports = { sleep, promisifyClosure };
