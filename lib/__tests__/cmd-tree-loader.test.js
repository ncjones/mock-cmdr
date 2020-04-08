const { loadCmdTree } = require('../cmd-tree-loader');
const path = require('path');

describe('cmd-tree-loader', () => {

  const examples = [
    {
      dir: 'basic-find',
      nodes: [
        { mode: 'find', path: [ 'find' ] },
        { mode: 'find', path: [ 'find', 'get-user' ], leaf: true },
      ]
    },
    {
      dir: 'basic-stub',
      nodes: [
        { mode: 'stub', path: [ 'stub' ] },
        { mode: 'stub', path: [ 'stub', 'get-user' ], leaf: true },
      ]
    },
    {
      dir: 'basic-multi-stub',
      nodes: [
        { mode: 'stub',     path: [ 'stub' ] },
        { mode: 'stub', path: [ 'stub', 'get-user' ], leaf: true },
        { mode: 'stub', path: [ 'stub', 'delete-user' ], leaf: true },
      ]
    },
    {
      dir: 'namespace-find',
      nodes: [
        { mode: undefined, path: [ 'service', ] },
        { mode: undefined, path: [ 'service', 'component', ] },
        { mode: 'find',    path: [ 'service', 'component', 'find', ] },
        { mode: 'find',    path: [ 'service', 'component', 'find', 'user', ] },
        { mode: 'find',    path: [ 'service', 'component', 'find', 'user', 'get', ] },
        { mode: 'find',    path: [ 'service', 'component', 'find', 'user', 'get', 'by-id' ], leaf: true },
      ]
    },
    {
      dir: 'namespace-stub',
      nodes: [
        { mode: undefined, path: [ 'service', ] },
        { mode: undefined, path: [ 'service', 'component', ] },
        { mode: 'stub',    path: [ 'service', 'component', 'stub', ] },
        { mode: 'stub',    path: [ 'service', 'component', 'stub', 'user', ] },
        { mode: 'stub',    path: [ 'service', 'component', 'stub', 'user', 'get', ] },
        { mode: 'stub',    path: [ 'service', 'component', 'stub', 'user', 'get', 'by-id' ], leaf: true },
      ]
    },
  ];

  examples.forEach(({ dir, nodes }) => {
    const cmdDir = path.resolve(__dirname, 'data', 'cmds', dir);
    const tree = loadCmdTree(cmdDir);
    describe(dir, () => {
      nodes.forEach(expectedNode => {
        describe(`tree node: ${expectedNode.path.join('/')}`, () => {
          const fileSuffix = expectedNode.leaf ? '.js' : '';
          const expectedFile = path.resolve(cmdDir, ...expectedNode.path) + fileSuffix;
          const node = tree.get(expectedNode.path);
          test(`has file: ${expectedFile}`, () => {
            expect(node.file).toEqual(expectedFile);
          });
          test(`has mode: ${expectedNode.mode}`, () => {
            expect(node.mode).toEqual(expectedNode.mode);
          });
          test(`is leaf: ${expectedNode.leaf}`, () => {
            expect(node.leaf).toEqual(expectedNode.leaf);
          });
        });
      });
    });
  });

});
