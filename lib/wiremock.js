const axios = require('axios');

let axiosClient = null;

const axiosPlaceholderClient = {
  request() {
    throw new Error('Not initialized! Please call mockCmdr.init({ baseUrl })');
  }
};

function init({ baseUrl }) {
  axiosClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
  });
}

function reset() {
  axiosClient = axiosPlaceholderClient;
}

reset();

function request() {
  return axiosClient.request(...arguments);
}

/**
 * Wiremock stub mapping.
 *
 * @see {@link http://wiremock.org/docs/api/#tag/Stub-Mappings/paths/~1__admin~1mappings/post}
 *
 * @typedef {Object} WiremockStubMapping
 *
 * @property {WiremockRequestCriteria} request
 * @property {WiremockResponseDefinition} response
 * @property {string} id - This stub mapping's unique identifier.
 * @property {string} uuid - Alias for the id
 * @property {string} name - The stub mapping's name.
 * @property {boolean} persistent - Indicates that the stub mapping should be persisted immediately on create/update/delete and survive resets to default.
 * @property {number} priority - This stub mapping's priority relative to others. 1 is highest.
 * @property {string} scenarioName - The name of the scenario that this stub mapping is part of.
 * @property {string} requiredScenarioState - The required state of the scenario in order for this stub to be matched.
 * @property {string} newScenarioState - The new state for the scenario to be updated to after this stub is served.
 * @property {Object} postServeActions - A map of the names of post serve action extensions to trigger and their parameters.
 * @property {Object} metadata - Arbitrary metadata to be used for e.g. tagging, documentation. Can also be used to find and remove stubs.
 */

/***
 * @typedef {Object} WiremockResponseDefinition
 *
 * @property {number} status - The HTTP status code to be returned.
 * @property {string} statusMessage - The HTTP status message to be returned.
 * @property {Object} headers - Map of response headers to send.
 * @property {Object} additionalProxyRequestHeaders - Extra request headers to send when proxying to another host.
 * @property {string} body - The response body as a string.
 *           Only one of body, base64Body, jsonBody or bodyFileName may be specified.
 * @property {string} base64Body - The response body as a base64 encoded string (useful for binary content).
 *           Only one of body, base64Body, jsonBody or bodyFileName may be specified.
 * @property {Object} jsonBody - The response body as a JSON object.
 *           Only one of body, base64Body, jsonBody or bodyFileName may be specified.
 * @property {string} bodyFileName - The path to the file containing the response body, relative to the configured file root.
 *           Only one of body, base64Body, jsonBody or bodyFileName may be specified.
 * @property {string} fault - The fault to apply (instead of a full, valid response).
             One of "CONNECTION_RESET_BY_PEER" "EMPTY_RESPONSE" "MALFORMED_RESPONSE_CHUNK" "RANDOM_DATA_THEN_CLOSE"
 * @property {number} fixedDelayMilliseconds - Number of milliseconds to delay be before sending the response.
 * @property {boolean} fromConfiguredStub - Read-only flag indicating false if this was the default, unmatched response. Not present otherwise.
 * @property {string} proxyBaseUrl - The base URL of the target to proxy matching requests to.
 * @property {Object} transformerParameters - Parameters to apply to response transformers.
 * @property {string[]} transformers - List of names of transformers to apply to this response.
 * @property {string} type - "uniform" or "lognormal"
 * @property {number} median - when type lognormal
 * @property {number} sigma - when type lognormal
 * @property {number} lower - when type uniform
 * @property {number} upper - when type uniform
 */

/**
 * Wiremock request matching criteria.
 *
 * @typedef {Object} WiremockRequestCriteria
 * @see {@link http://wiremock.org/docs/api/#tag/Requests/paths/~1__admin~1requests~1find/post}
 *
 * @property {string} method - The HTTP request method e.g. GET
 * @property {string} url - The path and query to match exactly against. Only one of url, urlPattern, urlPath or urlPathPattern may be specified.
 * @property {string} urlPath - The path to match exactly against. Only one of url, urlPattern, urlPath or urlPathPattern may be specified.
 * @property {string} urlPathPattern - The path regex to match against. Only one of url, urlPattern, urlPath or urlPathPattern may be specified.
 * @property {string} urlPattern - The path and query regex to match against. Only one of url, urlPattern, urlPath or urlPathPattern may be specified.
 * @property {Object} queryParameters - Query parameter patterns to match against.
 * @property {Object} headers - Header patterns to match against.
 * @property {Object} basicAuthCredentials - Pre-emptive basic auth credentials to match against.
 * @property {Object} cookies - Cookie patterns to match against.
 * @property {Object[]} bodyPatterns - Request body patterns to match against.
 * TODO document bodyPatterns
 */

/**
 * Wiremock intercepted request.
 *
 * @typedef {Object} WiremockRequest
 * @see {@link http://wiremock.org/docs/api/#tag/Requests/paths/~1__admin~1requests~1find/post}
 *
 * @property {string} url
 * @property {string} absoluteUrl
 * @property {string} method
 * @property {Object} headers
 * @property {string} body
 * @property {boolean} browserProxyRequest
 * @property {number} loggedDate
 * @property {string} loggedDateString
 */

/**
 * Call the Wiremock create mapping API.
 * @param {WiremockStubMapping} mapping
 */
function createMapping(mapping) {
  return request({
    method: 'POST',
    url: '/__admin/mappings',
    data: mapping
  });
}

function deleteMapping(id) {
  return request({
    method: 'DELETE',
    url: `/__admin/mappings/${id}`,
  });
}

/**
 * Call the Wiremock find requests API.
 * @param {WiremockRequestCriteria} criteria
 * @returns {WiremockRequest[]} matchedRequests
 */
function findRequests(criteria) {
  return request({
    method: 'POST',
    url: '/__admin/requests/find',
    data: criteria
  }).then(response => response.data.requests);
}

module.exports = {
  init,
  reset,
  request,
  createMapping,
  deleteMapping,
  findRequests,
};
