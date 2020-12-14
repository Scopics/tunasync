'use strict';

const reduce = require('../lib/reduce');

reduce((acc, item, callback) => {
  // pointless async:
  setTimeout(() => callback(null, acc + item), 1000);
}, 10, [1, 2, 3, 4, 5, 6])
  .then(res => console.log(res))
  .catch(err => console.log(err.message));
