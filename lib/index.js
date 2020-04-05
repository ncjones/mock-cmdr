const Session = require('./session');
const cmdRegistry = require('./cmd-registry');
const wiremock = require('./wiremock');

let defaultSession = null;

function getSession() {
  if (!defaultSession) {
    throw new Error('Not initialized! Call mockCmdr.init()');
  }
  return defaultSession;
}

module.exports = {

  /**
   * @typedef {Object} InitOptions
   * @property {string} [baseUrl] - The base URL of the mock server (eg http://wiremock:8080).
   * @property {string} [cmdDir] - The base dir to load commands from.
   */

  /**
   * Initialize the Mock Cmdr session. If cmdDir is specified then commands
   * will be loaded.
   * @param {InitOptions} options
   * @see loadCmds
   */
  init(options={}) {
    if (options.cmdDir) {
      this.loadCmds(options.cmdDir);
    }
    if (options.baseUrl) {
      wiremock.init({ baseUrl: options.baseUrl });
    }
    defaultSession = new Session();
    return this;
  },

  /**
   * Reset mockCmdr configuration. This does not remove stub mappings from the
   * remote mock server.
   * @see cleanUp
   */
  reset() {
    defaultSession = null;
    wiremock.reset();
    cmdRegistry.reset();
  },

  /**
   * A mocking command.
   *
   * @typedef {Object} Command
   * @property {string} type - Either "find" or "stub".
   * @property {string[]} path - The path the command will be available at on
   *          a session instance.
   * @property {string} name - The path the command will be available at on
   *          a session instance. Ignored if path is provided.
   * @property {function} template - A function that creates either a
   *          "find requests" criteria or a "stub mapping" definition.
   */

  /**
   * Define a templated mocking command that will be available via
   * `mockCmdr.{type}.{path}` or `mockCmdr.{type}.{name}`. When the command is
   * invoked then `createMapping()` or `findRequests()` will be called with the
   * output of the command's template function.
   *
   * @param {Command} cmd
   *
   * @example
   *
   *    defineCmd({
   *      type: 'stub',
   *      path: [ 'user', 'create' ],
   *      template: (user) => {
   *        return {
   *          method: 'POST',
   *          urlPath: '/api/user'
   *          request: {
   *             bodyPatterns: [
   *               {
   *                 matchesJsonPath: {
   *                   expression: '$.name',
   *                   equalTo: user.name,
   *                 }
   *               }
   *             ]
   *          },
   *          response: {
   *            status: 201,
   *            jsonBody: {
   *              id: user.id,
   *              name: user.name,
   *            },
   *          },
   *        };
   *      }
   *    })
   *
   *    // invoked as:
   *
   *    await mockCmdr.stub.user.create(user);
   *
   */
  defineCmd(cmd) {
    cmdRegistry.defineCmd(cmd);
    return this;
  },

  /**
   * Load all "find" and "stub" mocking commands by searching recursively
   * within cmdDir.
   *
   * The discovered commands will be passed to `defineCmd()` using the camel
   * cased file names as the command path. Modules found within a "find"
   * directory are treated as "find" commands and modules found within a
   * "stub" directory are treated as "stub" commands. Modules not within a
   * "find" or "stub" directory are ignored.
   *
   * Any intermediate directories other than "find" and "stub" will be
   * treated as namespaces. Namespaces can be arbitrarily deep and are also
   * camel cased. The "find" and "stub" dirs are excluded from the namespace
   * and need not appear at the top level allowing related commands to be
   * grouped appropriately.
   *
   * @example
   *
   *    // Simple Layout:
   *    //
   *    // [cmdDir]
   *    //   |
   *    //   |- stub
   *    //   |   |- user-create.js
   *    //   |   |- user-get-by-id.js
   *    //   |
   *    //   |- find
   *    //     |
   *    //     |- user-create-by-email.js
   *    //
   *    // Resulting commands:
   *
   *    mockCmdr.stub.userCreate()
   *    mockCmdr.stub.userGetById()
   *    mockCmdr.find.userCreateByEmail()
   *
   *
   * @example
   *
   *    // Namespaced Layout
   *    //
   *    // [cmdDir]
   *    //   |
   *    //   |- my-service
   *    //    |
   *    //    |- stub
   *    //      |
   *    //      |- user
   *    //        |
   *    //        |- create.js
   *    //        |- get-by-id.js
   *    //
   *    // Resulting commands:
   *
   *    mockCmdr.stub.myService.user.create()
   *    mockCmdr.stub.myService.user.getById()
   *
   * @see defineCmd
   */
  loadCmds(cmdDir) {
    cmdRegistry.loadCmds(cmdDir);
    return this;
  },

  /**
   * Access pre-defined "stub" mocking commands to make templated invocations
   * of "createMapping".
   * @returns {Object}
   * @see defineCmd
   * @see createMapping
   */
  get stub() {
    return getSession().stub;
  },

  /**
   * Access pre-defined "find" mocking commands to make templated invocations
   * of "findRequests".
   * @returns {Object}
   * @see defineCmd
   * @see findRequests
   */
  get find() {
    return getSession().find;
  },

  /**
   * Call the Wiremock create mapping API.
   * @param {WiremockStubMapping} mapping
   */
  async createMapping(mapping) {
    return await getSession().createMapping(mapping);
  },

  /**
   * Call the Wiremock find requests API.
   * @param {WiremockRequestCriteria} criteria
   * @returns {WiremockRequest[]} matchedRequests
   */
  async findRequests(criteria) {
    return await getSession().findRequests(criteria);
  },

  /**
   * Remove all stub mappings that have been created by the current session.
   * This does not modify mockCmdr configuration.
   * @see reset
   */
  async cleanUp() {
    if (defaultSession) {
      await defaultSession.cleanUp();
    }
  },
};
