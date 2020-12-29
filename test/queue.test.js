'use strict';

const metatests = require('metatests');
const queue = require('./../lib/queue');

const createTask = value => {
  if (value === 6) return Promise.reject(new Error('sorry'));
  return new Promise(resolve => setTimeout(() => resolve(value), value));
};

metatests.test('test queue', test => {
  const q = queue();

  q.pushTask(createTask, [1]);
  q.pushTask(createTask, [2]);
  q.pushTask(createTask, [3]);

  const expectedQresult = [1, 2, 3];
  q.doTasks().then(result => test.strictSame(result, expectedQresult));

  test.end();
});

metatests.test('test queue with error', test => {
  const q = queue();

  q.pushTask(createTask, [1]);
  q.pushTask(createTask, [6]);
  q.pushTask(createTask, [3]);

  const expectedQresult = [1, new Error('sorry'), 3];
  q.doTasks().then(result => test.strictSame(result, expectedQresult));
  test.end();
});
