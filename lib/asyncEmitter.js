'use strict';

class AsyncEmitter {
  constructor() {
    this.events = new Map();
    this.wrappers = new Map();
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

  onTemporary(name, fn, timeout = 0) {
    if (timeout) {
      this.on(name, fn);
      setTimeout(() => {
        this.remove(name, fn);
      }, timeout);
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
    this.wrappers.set(fn, g);
    this.on(name, g);
  }

  async emit(name, ...args) {
    const event = this.events.get(name);
    const fns = event.values();
    return Promise.all(fns.map(fn => fn(...args)));
  }

  remove(name, fn) {
    const { events, wrappers } = this;
    const event = events.get(name);
    if (event.has(fn)) {
      event.delete(fn);
      return;
    }
    const wrapper = wrappers.get(fn);
    if (wrapper) {
      event.delete(wrapper);
      wrappers.delete(fn);
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
