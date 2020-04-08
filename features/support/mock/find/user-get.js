/**
 * @returns {WiremockRequestCriteria}
 */
module.exports = function(user) {
  return {
    method: 'GET',
    urlPath: `/user/${user.id}`,
  };
};
