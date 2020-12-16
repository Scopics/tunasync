'use strict';

const queue = function() {
  this.tasks = [];
  this.onDone = result => result;
};

queue.prototype.pushTask = function(fn, args = []) {
  const task = fn.bind(this, ...args);
  this.tasks.push(task);
};

queue.prototype.done = function(fn) {
  this.onDone = fn;
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
