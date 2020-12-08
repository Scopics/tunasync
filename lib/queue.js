'use strict';

const queue = () => {
  this.tasks = [];
};

queue.prototype.pushTasks = newTasks => {
  if (typeof newTasks === 'function') this.tasks.push(newTasks);
  else {
    newTasks.forEach(task => {
      if (typeof task === 'function') this.tasks.push(task);
    });
  }
};

queue.prototype.doTasks = () => {
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
