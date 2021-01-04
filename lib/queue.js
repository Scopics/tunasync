'use strict';

const partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

/**
 * Queue constructor
 */
const Queue = function() {
  this.tasks = [];
  this.onDone = result => result;
};

/**
 * Add a new task to the queue
 * @param {Function} fn - task to add to the queue
 * @param {Array} args - array of arguments for task
 * @returns {this}
 */
Queue.prototype.pushTask = function(fn, args = []) {
  const task = partial(fn, ...args);
  this.tasks.push(task);
  return this;
};

/**
 * Set function that will be done after the all task of queue
 * @param {Function} fn - function to be done
 * @returns {this}
 */
Queue.prototype.done = function(fn) {
  this.onDone = fn;
  return this;
};

/**
 * Completion of tasks in the queue and save their result
 * @returns {Promise}
 */
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

/**
 * Main function to export
 * @returns {Queue} new instance of Queue
 * @example
 * const q = queue();

  const createTask = v => new Promise(res => setTimeout(() => res(v), v));

  q.pushTask(createTask, [100])
    .pushTask(createTask, [200])
    .pushTask(createTask, [300]);

  q.done(result => console.log(result));
  q.doTasks();
 */
const queue = () => new Queue();

module.exports = queue;
