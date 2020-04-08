const { Parent, Leaf } = require('../cmd-tree');

describe('cmd-tree', () => {

  test('leaf name', () => {
    const root = new Parent();
    const leaf = new Leaf({ name: 'foo' });
    root.addChild(leaf);
    expect(leaf.name).toEqual('foo');
  });

  test('ancestors', () => {
    const root = new Parent({ name: 'root' });
    const leaf = new Leaf({ name: 'foo' });
    root.addChild(leaf);
    expect(leaf.ancestors.map(n => n.name)).toEqual([ 'root' ]);
  });

  test('path', () => {
    const root = new Parent({ name: 'root' });
    const child = new Parent({ name: 'foo' });
    const leaf = new Leaf({ name: 'bar' });
    root.addChild(child);
    child.addChild(leaf);
    expect(leaf).toHaveProperty('path', [ 'root', 'foo', 'bar' ]);
  });

  test('unnamed node skipped in path', () => {
    const root = new Parent();
    const leaf = new Leaf({ name: 'foo' });
    root.addChild(leaf);
    expect(leaf.path).toEqual([ 'foo' ]);
  });

  test('get child', () => {
    const root = new Parent();
    const leaf = new Leaf({ name: 'foo' });
    root.addChild(leaf);
    expect(root.getChild('foo')).toHaveProperty('name', 'foo');
  });

  test('get by path', () => {
    const root = new Parent();
    const child = new Parent({ name: 'foo' });
    const leaf = new Leaf({ name: 'bar' });
    root.addChild(child);
    child.addChild(leaf);
    expect(root.get([ 'foo', 'bar' ])).toHaveProperty('name', 'bar');
  });

});

