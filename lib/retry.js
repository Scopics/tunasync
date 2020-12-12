'use strict';

const sleep = msec => new Promise(resolve => {
  setTimeout(resolve, msec);
});

const promisify = (fn, args) => new Promise((resolve, reject) => {
  if (!args) args = [];
  args.push((err, data) => (err ? reject(err) : resolve(data)));
  fn(...args);
});

const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  } else if (Array.isArray(obj)) {
    const result = [];
    for (const data of obj) {
      result.push(deepClone(data));
    }
    return result;
  } else {
    const result = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      result[key] = deepClone(obj[key]);
    }
    return result;
  }
};

const expectInterval = async data => {
  const interval = data.exponential ?
    data.interval * data.multiplier :
    data.interval;
  if (interval) await sleep(interval);
};

const retry = async (fn, args = [], config = {}) => {
  const retries = config.retries || 3;
  const interval = config.interval || 0;
  const exp = Object.prototype.hasOwnProperty.call(config, 'exponential') ?
    config.exponential :
    true;
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

module.exports = { retry };
