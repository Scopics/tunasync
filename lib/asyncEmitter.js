'use strict';

class AsyncEmitter {
  constructor() {
    this.events = new Map();
  }

  on(name, fn) {
    if (fn === undefined) {
      return new Promise(resolve => {
        this.once(name, resolve);
      });
    }
    const event = this.events.get(name);
    if (event) {
      event.push(fn);
    } else {
      this.events.set(name, new Set([fn]));
    }
  }

  once(name, fn) {
    if (fn === undefined) {
      return new Promise(resolve => {
        this.once(name, resolve);
      });
    }
    const g = (...args) => {
      this.remove(name, g);
      fn(...args);
    }
    this.on(name, g);
  }

  async emit(name, ...args) {
    const event = this.events.get(name);
    return Promise.all(event.map(fn => fn(...args)));
  }

  remove(name, fn) {
    const { events } = this;
    const event = events.get(name);
    if (event) {
      const i = event.indexOf(fn);
      if (i !== -1) event.splice(i, 1);
    }
  }
}

module.exports = AsyncEmitter;
