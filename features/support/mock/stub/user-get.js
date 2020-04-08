/**
 * @returns {WiremockStubMapping}
 */
module.exports = function(user) {
  return {
    request: {
      method: 'GET',
      urlPath: `/user/${user.id}`,
    },
    response: {
      jsonBody: user.toApiModel(),
      base64Body: ''
    },
  };
};
