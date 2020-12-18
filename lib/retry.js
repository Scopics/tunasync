'use strict';

const { sleep, promisify } = require('./utils/promisify');
const deepClone = require('./utils/deepClone');

const expectInterval = async data => {
  const interval = data.exponential ?
    data.interval * data.multiplier :
    data.interval;
  if (interval) await sleep(interval);
};

/**
 * Retry system fot async functions
 * 
 * @param {Function} fn - An asynchronous function that has to be repeated several times.
 * @param {Array} args - Array of arguments for the function.
 * @param {Object} confing - An object with settings for a function.
 * @property {Number} config.retries - Number of retries, by default 3
 * @property {Number} config.interval - Time interval between repeated function calls, by default 0
 * @property {Boolean} confing.exponential - Expotential repetition type (each time the time is multiplied by a number), by default false
 * @property {Number} config.multiplier - The multiplier for the interval, if we use ekspotential time
 * @property {Boolean} confing.isCb - The function accepts callback
 * @property {Function} config.onAttemptFail - Handler callback for unsuccessful function results, by default expectInterval
 * 
 * @example 
 * 
 * let minSum = 20;

  const asyncSum = async (a, b) => {
    await sleep(100);
    if (a + b < minSum) {
      minSum -= a + b;
      throw new Error('Sorry');
    }
    return a + b;
  };

  retry(asyncSum, [2, 3], { retries: 5, interval: 10 })
    .then(data => test.strictSame(data, expectedResult));
 * 
 * @returns {any}  the value of the fn, or an error 
 */

const retry = async (fn, args = [], config = {}) => {
  const retries = config.retries || 3;
  const interval = config.interval || 0;
  const exp = Object.prototype.hasOwnProperty.call(config, 'exponential') ?
    config.exponential :
    false;
  const multiplier = config.multiplier || 2;
  const presentCb = typeof config.onAttemptFail === 'function';
  const onAttemptFail = presentCb ? config.onAttemptFail : expectInterval;

  for (let i = 0; i < retries; i++) {
    try {
      const result = !config.isCb ?
        await fn(...args) :
        await promisify(fn, deepClone(args));
      return result;
    } catch (err) {
      if (retries === i + 1) throw err;
      const result = await onAttemptFail({
        err,
        attempt: i + 1,
        retries,
        interval,
        exponential: exp,
        multiplier,
      });
      if (presentCb && !result) return;
    }
  }
};

module.exports = retry;
