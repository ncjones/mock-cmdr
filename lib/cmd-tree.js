class TreeNode {

  constructor(options) {
    Object.assign(this, options);
  }

  get ancestors() {
    if (!this.parent) {
      return [];
    }
    return this.parent.ancestors.concat(this.parent);
  }

  get path() {
    return this.ancestors
      .map(n => n.name)
      .filter(x => x)
      .concat(this.name);
  }
}

class Parent extends TreeNode {

  constructor(options) {
    super(options);
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
    node.parent = this;
    return node;
  }

  getChild(name) {
    return this.children.find(n => n.name === name);
  }

  get(path) {
    return path.reduce((node, name) => node.getChild(name), this);
  }

  accept(visitor) {
    visitor.visitParent(this);
  }
}

class Leaf extends TreeNode {

  get leaf() {
    return true;
  }

  accept(visitor) {
    visitor.visitLeaf(this);
  }
}

module.exports = {
  Parent,
  Leaf,
};
