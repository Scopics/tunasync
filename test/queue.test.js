'use strict';

const queue = require('../lib/queue');

const createTask = value => () => {
  if (value === 6) return Promise.reject(new Error('sorry'));
  return new Promise(resolve => setTimeout(() => resolve(value), value));
};

const q = new queue();

q.pushTasks(createTask(1));
q.pushTasks([createTask(2), createTask(3)]);
q.pushTasks(createTask(6));

q.doTasks().then(result => console.log(result));
