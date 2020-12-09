'use strict';

const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

const promisify = fn => (...args) => (
  new Promise((resolve, reject) => (
    fn(...args, (err, data) => (
      err ? reject(err) : resolve(data)
    ))
  ))
);

const retry = async (times, fn, ...args) => {
  let tries = 0;
  let done = false;
  let res = null;
  const fnR = fn;
  if (args[args.length - 1] instanceof Function) {
    fnR = promisify(fn);
    args.pop();
  }
  while (!done && tries < times) {
    tries++;
    try {
      res = await fnR(...args);
      done = true;
    } catch (err) {
      if (tries >= times) throw err;
      else console.dir({ error: err.message, tries });
    }
  }
  return res;
};

const retryInterval = async (times, msec, fn, ...args) => {
  let count = 0;
  const wrapFn = async () => {
    count++;
    let res;
    try {
      res = await fn(...args);
    } catch (err) {
      if (count !== times) await sleep(msec);
      throw err;
    }
    return res;
  };
  return await retry(times, wrapFn);
}

module.exports = { retry, sleep, retryInterval };
