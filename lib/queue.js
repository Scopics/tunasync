'use strict';

const partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

const Queue = function() {
  this.tasks = [];
  this.onDone = result => result;
};

Queue.prototype.pushTask = function(fn, args = []) {
  const task = partial(fn, ...args);
  this.tasks.push(task);
  return this;
};

Queue.prototype.done = function(fn) {
  this.onDone = fn;
  return this;
};

Queue.prototype.doTasks = function() {
  let taskIndex = 0;
  return new Promise(done => {
    const taskResult = index => result => {
      this.tasks[index] = result;
      taskIndex++;
      nextTask();
    };
    const nextTask = () => {
      if (taskIndex < this.tasks.length) {
        this.tasks[taskIndex]()
          .then(taskResult(taskIndex))
          .catch(taskResult(taskIndex));
      } else {
        done(this.onDone(this.tasks));
      }
    };
    nextTask();
  });
};

const queue = () => new Queue();

module.exports = queue;
