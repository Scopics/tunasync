'use strict';

const { sleep, promisifyClosure } = require('./utils/promisify');

const expectInterval = async (data) => {
  const interval = data.exponential ?
    data.interval * data.multiplier :
    data.interval;
  if (interval) await sleep(interval);
};

/**
 * Retry system fot async functions
 *
 * @param {Function} fn -
 * asynchronous function (with or without callback)
 * that has to be repeated several times.
 * @param {Array} args -
 * array of arguments for the function.
 * @param {Object} config -
 * object with settings for a function.
 * @property {Number} config.retries -
 * number of retries, by default 3
 * @property {Number} config.interval -
 * time interval between repeated function calls, by default 0
 * @property {Boolean} config.exponential -
 * expotential repetition type
 * @property {Number} config.multiplier -
 * multiplier for the interval, if we use ekspotential time
 * @property {Boolean} config.isCb -
 * function accepts callback
 * @property {Function} config.onAttemptFail -
 * handler callback for unsuccessful function results, by default expectInterval
 *
 * @example
 *
 * const fnPromises = require('fs').promises;

  retry(
    fsPromises.readFile,
    ['some.js', 'utf8'],
    { retries: 5, interval: 10 })
    .then(data => console.log(data));
 *
 * @returns {any}  the value of the fn, or an error
 */

const retry = async (fn, args = [], config = {}) => {
  const retries = config.retries || 3;
  const interval = config.interval || 0;
  const exponential = config.exponential;
  const multiplier = config.multiplier || 2;
  const presentCb = typeof config.onAttemptFail === 'function';
  const onAttemptFail = presentCb ? config.onAttemptFail : expectInterval;

  let wrappedFn = fn;

  if (config.isCb) {
    const lastArg = args[args.length - 1];
    const cb = typeof lastArg === 'function' ?
      args.pop() : (err, data) => data;
    wrappedFn = promisifyClosure(fn, cb);
  }

  for (let i = 0; i < retries; i++) {
    try {
      const result = await wrappedFn(...args);
      return result;
    } catch (err) {
      if (retries === i + 1) throw err;
      const result = await onAttemptFail({
        err,
        attempt: i + 1,
        retries,
        interval,
        exponential,
        multiplier,
      });
      if (presentCb && !result) return;
    }
  }
};

module.exports = retry;
