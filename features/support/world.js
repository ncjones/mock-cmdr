const { setWorldConstructor, BeforeAll, AfterAll } = require('cucumber');
const path = require('path');
const waitOn = require('wait-on');
const url = require('url');
const expect = require('expect');
const config = require('./config');
const factory = require('./factory');
const mockCmdr = require('../../lib');
const wiremock = require('../../lib/wiremock');

const wiremockBaseUrl = config.get('wiremock.baseUrl');
const wiremockHost = url.parse(wiremockBaseUrl).host;

mockCmdr.init({
  baseUrl: wiremockBaseUrl,
  cmdDir: path.resolve(__dirname, 'mock'),
});

class World {

  constructor() {
    this.expect = expect;
    this.factory = factory;
    this.mockCmdr = mockCmdr;
    this.wiremock = wiremock;
  }
}

setWorldConstructor(World);

BeforeAll(async function() {
  await waitOn({
    resources: [ `tcp:${wiremockHost}` ],
    timeout: 5000,
    verbose: true,
  });
});

AfterAll(async function() {
  await mockCmdr.cleanUp();
});
