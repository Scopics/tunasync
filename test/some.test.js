'use strict';

const fs = require('fs');
const some = require('./../lib/some');

some((filePath, callback) => {
  fs.access(filePath, err => {
    callback(null, !err);
  });
}, ['file1', 'file2', 'retry.test.js'])
  .then(res => console.log(res))
  .catch(err => console.log(err.message));
