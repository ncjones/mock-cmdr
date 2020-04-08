const fs = require('fs');
const path = require('path');
const { Parent, Leaf } = require('./cmd-tree');

function isDir(f) {
  return fs.lstatSync(f).isDirectory();
}

function getMode(name) {
  if ([ 'find', 'stub' ].includes(name)) {
    return name;
  }
}

function shouldIgnore(name) {
  return /^\./.test(name) || !(/\.js$/.test(name));
}

function removeSuffix(s) {
  return s.replace(/\.[^.]*$/, '');
}

function makeNode({ parent, name }) {
  const file = path.resolve(parent.file, name);
  const mode = parent.mode || getMode(name);
  if (isDir(file)) {
    return new Parent({ name, file, mode });
  }
  if (shouldIgnore(name)) {
    return;
  }
  return new Leaf({ name: removeSuffix(name), file, mode });
}

function buildTree(node) {
  if (!node.leaf) {
    fs.readdirSync(node.file)
      .map(name => makeNode({ parent: node, name }))
      .filter(x => x)
      .map(n => node.addChild(n))
      .map(buildTree);
  }
  return node;
}

function loadCmdTree(file) {
  return buildTree(new Parent({ file }));
}

module.exports = {
  loadCmdTree
};
