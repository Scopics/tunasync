'use strict';

/**
 * Now, an event emitter is an object/method which
 * triggers an event as soon as some action takes
 * place so as to pass the control to the parent function.
 */
class AsyncEmitter {
  constructor() {
    this.events = new Map();
    this.wrappers = new Map();
  }

  /**
   * It's used to add function when certain event is triggered
   * @param {String} name - name of the event
   * @param {Function} fn - function which will be called when
   * event is triggered
   * */
  on(name, fn) {
    if (fn === undefined) {
      return new Promise((resolve) => {
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

  /**
   * It's used to hinge a function on a
   * certain event for a time specified by the third argument
   * @param {String} name - name of the event
   * @param {Function} fn - function which will be called when
   * event is triggered
   * @param {Number} timeout - time during which the function
   * will process this event,
   * and after which it will be removed from this event
   */
  onTemporary(name, fn, timeout = 0) {
    if (timeout) {
      this.on(name, fn);
      setTimeout(() => {
        this.remove(name, fn);
      }, timeout);
    }
  }

  /**
   * It's used to add function which will occur only once
   * @param {String} name - name of the event
   * @param {Function} fn - function which will be called when
   * event is triggered
   * */
  once(name, fn) {
    if (fn === undefined) {
      return new Promise((resolve) => {
        this.once(name, resolve);
      });
    }
    const g = (...args) => {
      this.remove(name, g);
      return fn(...args);
    };
    this.wrappers.set(fn, g);
    this.on(name, g);
  }

  /**
   * It's used to trigger events
   * @param {String} name - name of the event
   * @param {any} args - arguments for functions
   * */
  async emit(name, ...args) {
    const event = this.events.get(name);
    const fns = [...event.values()];
    return Promise.all(fns.map((fn) => fn(...args)));
  }

  /**
   * It`s used to detach (delete) a function
   * from a specific event
   * @param {String} name - name of the event
   * @param {Function} fn - function that we want to
   * remove from this event
   */
  remove(name, fn) {
    const { events, wrappers } = this;
    const event = events.get(name);
    if (event && event.has(fn)) {
      event.delete(fn);
      return;
    }
    const wrapper = wrappers.get(fn);
    if (wrapper) {
      event.delete(wrapper);
      wrappers.delete(fn);
    }
  }

  /**
   * Method to clear all events from emmiter or just one event
   * @param {String} name - name of event, optinal paramater
   */
  clear(name) {
    return name ? this.events.delete(name) : this.events.clear();
  }

  /**
   * Return all listeners of event
   * @param {String} name - name of event
   * @returns {Array} of listeners
   */
  listeners(name) {
    if (name) {
      const listeners = this.events.get(name);
      return listeners ? [...listeners] : [];
    }
  }

  /**
   * Return number of listeners of event, or number of events
   * @param {String} name - name of event, optinal paramater
   * @returns {Number}
   */
  count(name) {
    const event = this.events.get(name);
    return event ? event.size : 0;
  }

  /**
   * Return array of all events of emitter
   * @returns {Array}
   */
  names() {
    return [...this.events.keys()];
  }
}

module.exports = AsyncEmitter;
