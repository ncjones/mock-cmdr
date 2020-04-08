const convict = require('convict');

const schema = {
  wiremock: {
    baseUrl: {
      format: String,
      default: 'http://wiremock:8080',
      env: 'WIREMOCK_BASE_URL',
    },
  },
};

module.exports = convict(schema)
  .validate({allowed: 'strict'});
