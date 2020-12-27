'use strict';

function Asyncmemoize (fn) {
  this.cache = {};
  this.fn = fn;
}

Asyncmemoize.prototype.run = function(...args) {
  const callback = args.pop();
  const key = `${this.fn.name} -> ${args.join(' & ')}`;
  const item = this.cache[key];
  if (item) {
    console.log(`taking from cache, ${key}`);
    callback(item.err, item.res);
  } else {
    console.log('false', Object.keys(this.cache));
    this.fn(...args, (err, res) => {
      const newItem = { err, res };
      this.cache[key] = newItem;
      callback(err, res);
    })
  }
  return this;
}

module.exports = Asyncmemoize;