const factory = require('factory-bot').factory;
const glob = require('glob');
const path = require('path');
glob.sync('*.factory.js', { cwd: __dirname })
  .map(f => require(path.resolve(__dirname, f)))
  .forEach(f => {
    factory.define(f.name, f.model, f.build);
  });
module.exports = factory;
