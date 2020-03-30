const cmdRegistry = require('./cmd-registry');
const wiremock = require('./wiremock');

class WiremockMapping {

  constructor(id) {
    this.id = id;
  }

  async delete() {
    await wiremock.deleteMapping(this.id);
  }
}

class CmdProxyHandler {
  constructor({ cmdHandler }) {
    this.cmdHandler = cmdHandler;
  }
  get(target, prop) {
    const cmdHandler = this.cmdHandler;
    const value = target[prop];
    if (typeof value === 'undefined') {
      throw new Error(`Unknown command: ${prop}`);
    }
    if (typeof value !== 'function') {
      return makeCmdProxy({ target: value, cmdHandler });
    }
    const cmdInputTemplate = value;
    return async function() {
      const cmdInput = cmdInputTemplate(...arguments);
      return await cmdHandler(cmdInput);
    };
  }
}

function makeCmdProxy({ target, cmdHandler }) {
  return new Proxy(target, new CmdProxyHandler({ cmdHandler }));
}

class Session {

  constructor() {
    this.stub = makeCmdProxy({
      target: cmdRegistry.cmds.stub,
      cmdHandler: this.createMapping.bind(this),
    });
    this.find = makeCmdProxy({
      target: cmdRegistry.cmds.find,
      cmdHandler: this.findRequests.bind(this),
    });
    this.mappings = [];
  }

  async createMapping(mapping) {
    if (!mapping) {
      return;
    }
    const response = await wiremock.createMapping(mapping);
    this.mappings.push(new WiremockMapping(response.data.id));
  }

  async findRequests(criteria) {
    return await wiremock.findRequests(criteria);
  }

  async cleanUp() {
    await Promise.all(this.mappings.map(m => m.delete()));
  }
}

module.exports = Session;
