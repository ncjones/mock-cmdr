const mockCmdr = require('../index');

describe('index', () => {

  test('commands available', () => {
    mockCmdr.init();
    mockCmdr.defineCmd({ type: 'find', name: 'test', template: () => null });
    expect(mockCmdr.find.test).not.toBeUndefined();
  });

  describe('session not initialized', () => {

    beforeEach(() => {
      mockCmdr.reset();
    });

    test('find', () => {
      expect(() => mockCmdr.find).toThrow('Not initialized');
    });

    test('stub', () => {
      expect(() => mockCmdr.stub).toThrow('Not initialized');
    });

    test('createMapping', () => {
      return expect(mockCmdr.createMapping()).rejects.toThrow('Not initialized');
    });

    test('findRequests', () => {
      return expect(mockCmdr.findRequests()).rejects.toThrow('Not initialized');
    });

  });

  describe('base url not initialized', () => {

    beforeEach(() => {
      mockCmdr.reset();
    });

    test('error thrown', () => {
      mockCmdr.init();
      mockCmdr.defineCmd({ type: 'find', name: 'test', template: () => null });
      return expect(mockCmdr.find.test()).rejects.toThrow('Not initialized');
    });

  });

});
