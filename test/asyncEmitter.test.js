'use strict';

const metatests = require('metatests');
const AsyncEmitter = require('./../lib/asyncEmitter');
const { sleep } = require('./../lib/utils/promisify');

const fn1 = async (data) => {
  await sleep(10);
  return 'fn1 ' + data;
};

const fn2 = async (data) => {
  await sleep(15);
  return 'fn2 ' + data;
};

metatests.test('test asyncEmitter once', (test) => {
  const ee = new AsyncEmitter();
  const expectedResult1 = ['fn1 called1'];
  const expectedResult2 = ['fn1 called2', 'fn2 called2'];

  ee.on('e1', fn1);
  ee.once('e1', fn2);
  ee.on('e1', fn1);

  ee.on('e2', fn1);
  ee.on('e2', fn2);

  ee.emit('e1', 'called1');
  ee.emit('e1', 'called1').then((data) =>
    test.strictSame(data, expectedResult1)
  );

  ee.emit('e2', 'called2').then((data) =>
    test.strictSame(data, expectedResult2)
  );

  test.end();
});

metatests.test('test asyncEmitter remove', (test) => {
  const ee = new AsyncEmitter();
  const expectedResult = ['fn1 called'];

  ee.on('e1', fn1);
  ee.on('e1', fn2);

  ee.remove('e1', fn2);
  ee.remove('e1', () => {});
  ee.remove('e2', fn1);

  ee.emit('e1', 'called').then((data) => test.strictSame(data, expectedResult));

  test.end();
});

metatests.test('test asyncEmitter onTemporary', (test) => {
  const ee = new AsyncEmitter();
  const expectedResult1 = ['fn1 called1'];
  const expectedResult2 = ['fn1 called2'];
  const expectedResult3 = [];

  ee.onTemporary('e1', fn1, 2000);

  ee.emit('e1', 'called1').then((data) =>
    test.strictSame(data, expectedResult1)
  );

  setTimeout(() => {
    ee.emit('e1', 'called2').then((data) =>
      test.strictSame(data, expectedResult2)
    );
  }, 1000);

  setTimeout(() => {
    ee.emit('e1', 'called3').then((data) =>
      test.strictSame(data, expectedResult3)
    );
  }, 3000);

  test.end();
});

metatests.test('test asyncEmitter clear and names', (test) => {
  const ee = new AsyncEmitter();
  const expectedResult1 = ['e1', 'e2'];
  const expectedResult2 = ['e2'];
  const expectedResult3 = [];

  ee.on('e1', fn1);
  ee.on('e2', fn2);

  const result1 = ee.names();
  test.strictSame(result1, expectedResult1);

  ee.clear('e1');
  const result2 = ee.names();
  test.strictSame(result2, expectedResult2);

  ee.clear();
  const result3 = ee.names();
  test.strictSame(result3, expectedResult3);

  test.end();
});

metatests.test('test asyncEmitter listeners and count', (test) => {
  const ee = new AsyncEmitter();
  const expectedResult1 = [fn1, fn2];
  const expectedResult2 = 1;
  const expectedResult3 = 0;

  ee.on('e1', fn1);
  ee.on('e1', fn2);
  ee.on('e2', fn2);

  const result1 = ee.listeners('e1');
  test.strictSame(result1, expectedResult1);

  const result2 = ee.count('e2');
  test.strictSame(result2, expectedResult2);

  const result3 = ee.count();
  test.strictSame(result3, expectedResult3);

  test.end();
});
