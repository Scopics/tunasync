'use strict';

const metatests = require('metatests');
const reduce = require('../lib/reduce');

metatests.test('test reduce', test => {
  const expectedResult = 31;
  reduce((acc, item, callback) => {
    setTimeout(() => callback(null, acc + item), 1000);
  }, 10, [1, 2, 3, 4, 5, 6])
    .then(res => test.strictSame(res, expectedResult))
    .catch(err => console.log(err.message));
  
  test.end();
});