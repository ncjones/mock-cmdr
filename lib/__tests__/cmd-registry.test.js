const cmdRegistry = require('../cmd-registry');
const path = require('path');
const _get = require('lodash.get');

describe('cmd-registry', () => {

  describe('defineCmd', () => {

    test('type is required', () => {
      const template = () => null;
      expect(() => cmdRegistry.defineCmd({ name: 'foo', template }))
        .toThrow('Invalid type');
    });

    test('unknown type rejected', () => {
      const template = () => null;
      expect(() => cmdRegistry.defineCmd({ type: 'blah', name: 'foo', template }))
        .toThrow('Invalid type');
    });

    test('path cannot be empty', () => {
      const template = () => null;
      expect(() => cmdRegistry.defineCmd({ type: 'find', path: [], template }))
        .toThrow('Invalid command path');
    });

    test('path cannot be string', () => {
      const template = () => null;
      expect(() => cmdRegistry.defineCmd({ type: 'find', path: 'foo', template }))
        .toThrow('Invalid command path');
    });

    test('path or name are required', () => {
      const template = () => null;
      expect(() => cmdRegistry.defineCmd({ type: 'find', template }))
        .toThrow('One of path or name is required');
    });

    test('define by path', () => {
      const template = () => null;
      cmdRegistry.defineCmd({ type: 'find', path: ['foo'], template });
      expect(cmdRegistry.cmds.find.foo).toEqual(template);
    });

    test('define by name', () => {
      const template = () => null;
      cmdRegistry.defineCmd({ type: 'find', name: 'foo', template });
      expect(cmdRegistry.cmds.find.foo).toEqual(template);
    });
  });

  describe('loadCmds', () => {

    const examples = [
      {
        dir: 'basic-find',
        commands: [
          { type: 'find', path: [ 'getUser' ] },
        ]
      },
      {
        dir: 'basic-stub',
        commands: [
          { type: 'stub', path: [ 'getUser' ] },
        ]
      },
      {
        dir: 'basic-multi-stub',
        commands: [
          { type: 'stub', path: [ 'deleteUser' ] },
          { type: 'stub', path: [ 'getUser' ] },
        ]
      },
      {
        dir: 'namespace-find',
        commands: [
          { type: 'find', path: [ 'service', 'component', 'user', 'get', 'byId' ] },
        ]
      },
      {
        dir: 'namespace-stub',
        commands: [
          { type: 'stub', path: [ 'service', 'component', 'user', 'get', 'byId' ] },
        ]
      },
      {
        dir: 'name-transformation',
        commands: [
          { type: 'stub', path: [ 'CamelcaseDirCaps', 'CamelcaseModule' ] },
          { type: 'stub', path: [ 'DashDirCaps', 'DashModule' ] },
          { type: 'stub', path: [ 'UnderscoreDirCaps', 'UnderscoreModule' ] },
          { type: 'stub', path: [ 'camelcaseDir', 'camelcaseModule' ] },
          { type: 'stub', path: [ 'dottedDir', 'dottedModule' ] },
          { type: 'stub', path: [ 'underscoreDir', 'underscoreModule' ] },
        ]
      },
    ];

    describe('ignored', () => {
      test('cmds empty', () => {
        cmdRegistry.reset();
        cmdRegistry.loadCmds(path.resolve(__dirname, 'data', 'cmds', 'ignored'));
        expect(cmdRegistry.cmds).toEqual({ find: {}, stub: {} });
      });

    });

    examples.forEach(({ dir, commands }) => {
      describe(dir, () => {

        cmdRegistry.reset();
        cmdRegistry.loadCmds(path.resolve(__dirname, 'data', 'cmds', dir));


        commands.forEach(({ type, path }) => {

          const cmd = _get(cmdRegistry.cmds, [type, ...path]);

          describe(`${[type, ...path].join('.')}`, () => {

            test('is a function', () => {
              expect(cmd).toBeInstanceOf(Function);
            });

          });
        });
      });
    });

  });

});
