const deepSet = require('../deep-set');

describe('deep-set', () => {

  test('set deep value to zero', () => {
    const x = {};
    deepSet(x, ['a','b'], 0);
    expect(x).toEqual({ a: { b: 0 }});
  });

});
