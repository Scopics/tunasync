'use strict';

class AsyncEmitter {
  constructor() {
    this.events = new Map();
  }

  on(name, fn) {
    if (fn === undefined) {
      return new Promise(resolve => {
        this.on(name, resolve);
      });
    }
    const event = this.events.get(name);
    if (event) {
      event.add(fn);
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
    };
    this.on(name, g);
  }

  async emit(name, ...args) {
    const event = this.events.get(name);
    const fns = event.values();
    return Promise.all(fns.map(fn => fn(...args)));
  }

  remove(name, fn) {
    const { events } = this;
    const event = events.get(name);
    if (event) {
      const i = event.indexOf(fn);
      if (i !== -1) event.splice(i, 1);
    }
  }

  clear(name) {
    if (name) this.events.delete(name);
    else this.events.clear();
  }

  listeners(name) {
    if (name) {
      const listeners = this.events.get(name);
      if (listeners) return listeners;
      else return [];
    }
  }

  count(name) {
    if (name) return this.listeners(name).length;
    else return this.events.size;
  }

  names() {
    return Array.from(this.events.keys());
  }
}

module.exports = AsyncEmitter;
