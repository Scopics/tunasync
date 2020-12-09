'use strict';

const queue = function() {
  this.tasks = [];
};

queue.prototype.pushTasks = function(task) {
  if (typeof task === 'function') this.tasks.push(task);
  else task.forEach(task => this.pushTasks(task));
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
        done(this.tasks);
      }
    };
    nextTask();
  });
};

module.exports = { queue };
