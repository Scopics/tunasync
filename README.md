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