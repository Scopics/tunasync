'use strict';

const queue = require('../lib/queue');

const createTask = value => {
  if (value === 6) return Promise.reject(new Error('sorry'));
  return new Promise(resolve => setTimeout(() => resolve(value), value));
};

const q = new queue();

q.pushTask(createTask, [1]);
q.pushTask(createTask, [2]);
q.pushTask(createTask, [6]);
q.done(result => console.log(result));

q.doTasks().then(() => console.log('done'));
