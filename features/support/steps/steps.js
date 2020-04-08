const { Given, When, Then } = require('cucumber');

Given('a random user', async function () {
  this.user = await this.factory.build('user');
});

When('the user resource is stubbed in Wiremock', async function () {
  await this.mockCmdr.stub.userGet(this.user);
});

When('the user resource is requested from Wiremock', async function () {
  this.response = await this.wiremock.request({
    method: 'GET',
    url: `/user/${this.user.id}`,
  });
});

Then('the response body matches the user', async function () {
  this.expect(this.response.data).toEqual(this.user.toApiModel());
});

When('"user get" requests are found in Wiremock', async function () {
  this.matchedRequests = await this.mockCmdr.find.userGet(this.user);
});

Then('the matched requests has length {int}', async function (length) {
  this.expect(this.matchedRequests).toHaveLength(length);
});

Then('the first matched request is a "user get" for the user', async function () {
  this.expect(this.matchedRequests[0]).toHaveProperty('method', 'GET');
  this.expect(this.matchedRequests[0]).toHaveProperty('url', `/user/${this.user.id}`);
});
