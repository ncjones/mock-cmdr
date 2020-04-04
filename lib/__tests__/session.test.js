const Session = require('../session');
const cmdRegistry = require('../cmd-registry');

describe('session', () => {

  beforeEach(() => {
    cmdRegistry.reset();
  });

  test('find command available when defined by path', () => {
    cmdRegistry.defineCmd({ type: 'find', path: [ 'foo', 'bar' ], template: () => null });
    const session = new Session();
    expect(typeof session.find.foo.bar).toBe('function');
  });

  test('stub command available when defined by path', () => {
    cmdRegistry.defineCmd({ type: 'stub', path: [ 'foo', 'bar' ], template: () => null });
    const session = new Session();
    expect(typeof session.stub.foo.bar).toBe('function');
  });

  test('find command available when added before session created', () => {
    cmdRegistry.defineCmd({ type: 'find', name: 'foo', template: () => null });
    const session = new Session();
    expect(session.find.foo).not.toBeUndefined();
  });

  test('find command available when added after session created', () => {
    const session = new Session();
    cmdRegistry.defineCmd({ type: 'find', name: 'foo', template: () => null });
    expect(session.find.foo).not.toBeUndefined();
  });

  test('stub command available when added before session created', () => {
    cmdRegistry.defineCmd({ type: 'stub', name: 'foo', template: () => null });
    const session = new Session();
    expect(session.stub.foo).not.toBeUndefined();
  });

  test('stub command available when added after session created', () => {
    const session = new Session();
    cmdRegistry.defineCmd({ type: 'stub', name: 'foo', template: () => null });
    expect(session.stub.foo).not.toBeUndefined();
  });

  test('error accessing unknown stub command', () => {
    const session = new Session();
    expect(() => session.stub.myCmd).toThrow('Unknown command: stub.myCmd');
  });

  test('error accessing unknown find command', () => {
    const session = new Session();
    expect(() => session.find.myCmd).toThrow('Unknown command: find.myCmd');
  });

  test('error accessing unknown nested command', () => {
    const session = new Session();
    cmdRegistry.defineCmd({ type: 'find', path: [ 'foo', 'bar' ], template: () => null });
    expect(() => session.find.foo.myCmd).toThrow('Unknown command: stub.foo.myCmd');
  });

});
