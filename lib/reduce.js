'use strict';

const reduce = (fn, startValue, arr) => (
  new Promise((resolve, reject) => {
    const len = arr.length;
    let i = 0, acc = startValue;

    const callback = (err, res) => {
      acc = res;
      if (err) reject(err);
      i++;
      iterate();
    };

    const iterate = () => {
      if (i === len) resolve(acc);
      else fn(acc, arr[i], callback);
    };

    iterate();
  })
);

module.exports = reduce;
