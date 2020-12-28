'use strict'

class AsyncEmitter {
  constructor() {
    this.events = new Map();
  }

  on(name, fn) {
    const event = this.events.get(name);
    if (event) {
      event.push(fn);
    } else {
      this.events.set(name, [fn]);
    }
  }

  emit(name, ...args) {
    const event = this.events.get(name);
    return Promise.all(event.map(fn => fn(...args)));
  }
}