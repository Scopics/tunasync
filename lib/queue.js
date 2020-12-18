'use strict';

const partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

const queue = function() {
  this.tasks = [];
  this.onDone = result => result;
};

queue.prototype.pushTask = function(fn, args = []) {
  const task = partial(fn, ...args);
  this.tasks.push(task);
  return this;
};

queue.prototype.done = function(fn) {
  this.onDone = fn;
  return this;
};

queue.prototype.doTasks = function() {
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

module.exports = queue;
