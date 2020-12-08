'use strict';

const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

const retry = async (times, fn, ...args) => {
  let tries = 0;
  let done = false;
  let res = null;
  while (!done && tries < times) {
    tries++;
    try {
      res = await fn(...args);
      done = true;
    } catch (err) {
      if (tries >= times) {
        throw err;
      } else {
        console.dir({ error: err.message, tries });
      }
    }
  }
  return res;
};

module.exports = { retry, sleep };
