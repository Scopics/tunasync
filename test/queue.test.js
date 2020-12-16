'use strict';

const metatests = require('metatests');
const queue = require('../queue.js');

const createTask = value => {
  if (value === 6) return Promise.reject(new Error('sorry'));
  return new Promise(resolve => setTimeout(() => resolve(value), value));
};

metatests.test('test queue', test => {
  const q = new queue();

  q.pushTasks(createTask(1));
  q.pushTasks([createTask(2), createTask(3)]);

  const expectedQresult = [1, 2, 3];
  q.doTasks().then(result => test.strictSame(result, expectedQresult));

  test.end();
});

metatests.test('test queue with error', test => {
  const q = new queue();

  q.pushTasks(createTask(1));
  q.pushTasks([createTask(6), createTask(3)]);

  const expectedQresult = [1, new Error('sorry'), 3];
  q.doTasks().then(result => test.strictSame(result, expectedQresult));
  test.end();
});
