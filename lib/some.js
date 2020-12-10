'use strict';

const fs = require('fs');

const callbackSome = (args, fn, onDone) => {
  const len = args.length;
  let i = 0;

  const callback = (err, res) => {
    if (res) {
      onDone(null, true);
      return;
    }
    if (err) {
      onDone(err);
      return;
    }
    i++;
    iterate();
  };

  const iterate = () => {
    if (i === len) onDone(null, false);
    else fn(args[i], callback);
  };

  iterate();
}

const promiseReturnSome = (args, fn) => {
  const len = args.length;
  let i = 0;

  return new Promise((resolve, reject) => {
    const callback = (err, res) => {
      if (res) resolve(true);
      if (err) reject(err);
      i++;
      iterate();
    };

    const iterate = () => {
      if (i === len) resolve(false);
      else fn(args[i], callback);
    };

    iterate();
  });
}

const some = (...options) => {
  const optionsLen = options.length;
  if (optionsLen >= 3) {
    callbackSome(...options);
  } else {
    return promiseReturnSome(...options);
  }
};

module.exports = {
  some
};