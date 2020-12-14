# Tun async

![Logo](https://raw.githubusercontent.com/MaksGovor/Images/master/Voting-system/Logolib.png)

Async library for node.js

## Api

### some(fn, items)

#### Arguments:
* `fn`:
    * `item` - is taken from items
    * `callback`
* `items` - Array

#### Example
```javascript
some((filePath, callback) => {
  fs.access(filePath, err => {
    callback(null, !err);
  });
}, ['file1', 'file2', 'retry.test.js'])
  .then(res => console.log(res))
  .catch(err => console.log(err.message));
```

### reduce(fn, items)

#### Arguments:
* `fn`:
    * `acc` - current value of accumulator
    * `item` - is taken from items
    * `callback`
* `startValue` - start value
* `items` - Array

#### Example
```javascript
reduce((acc, item, callback) => {
  setTimeout(() => callback(null, acc + item), 1000);
}, 10, [1, 2, 3, 4, 5, 6])
  .then(res => console.log(res))
  .catch(err => console.log(err.message));
```