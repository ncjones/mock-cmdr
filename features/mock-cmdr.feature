Feature: Mock Commander

  Scenario: Parameterized Stub
    Given a random user
    And the user resource is stubbed in Wiremock
    When the user resource is requested from Wiremock
    Then the response body matches the user

  Scenario: Parameterized Find
    Given a random user
    And the user resource is stubbed in Wiremock
    And the user resource is requested from Wiremock
    When "user get" requests are found in Wiremock
    Then the matched requests has length 1
    And the first matched request is a "user get" for the user
