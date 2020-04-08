const cmdTreeLoader = require('./cmd-tree-loader');
const deepSet = require('./deep-set');

function camel(s) {
  return s.replace(/[-_.](.)/g, (a,b) => b.toUpperCase());
}

const cmds = {};

function reset() {
  cmds.stub = {};
  cmds.find = {};
}

reset();

const cmdTreeVisitor = {

  visitParent(node) {
    node.children.forEach(node => node.accept(this));
  },

  visitLeaf(node) {
    defineCmd({
      type: node.mode,
      path: node.path
        .filter(n => !['find', 'stub'].includes(n))
        .map(camel),
      template: require(node.file),
    });
  },
};

function loadCmds(dir) {
  const tree = cmdTreeLoader.loadCmdTree(dir);
  tree.accept(cmdTreeVisitor);
  return this;
}

function defineCmd({ type, name, path, template }) {
  if (!['stub', 'find'].includes(type)) {
    throw new Error(`Invalid type: ${type} (must be one of "stub", "find")`);
  }
  if (!path && !name) {
    throw new Error('One of path or name is required');
  }
  if (path && !Array.isArray(path)) {
    throw new Error('Invalid command path (must be array)');
  }
  if (path && !path.length) {
    throw new Error('Invalid command path (must have at least one item)');
  }
  if (typeof template !== 'function') {
    throw new Error('Invalid command template (must be function)');
  }
  path = path || [ name ];
  deepSet(cmds[type], path, template);
}

module.exports = {
  cmds,
  defineCmd,
  loadCmds,
  reset,
};
