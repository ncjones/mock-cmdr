# Mock Commander

[![Build Status](https://travis-ci.org/ncjones/mock-cmdr.svg?branch=master)](https://travis-ci.org/ncjones/mock-cmdr)


Wiremock client for Node JS which promotes separation of dynamic mocking
commands from test code logic.


## Installation

```
npm install mock-cmdr
```


## Usage

Mock Commander can be simply used as a Wiremock rest API client:

```
const mockCmdr = require('mock-cmdr');
mockCmdr.init({ baseUrl: 'http://wiremock' });
mockCmdr.createMapping({
  request: {
    method: 'GET',
    urlPath: '/user/1',
  },
  response: {
    jsonBody: {
      id: 1
    }
  },
});
```

However, Mock Commander's real utility comes from defining templated Wiremock
commands. If the mapping definintion above is moved into
`${__dirname}/mock/stub/get-user-by-id.js` then the same create mapping call
can be made by:

```
const user = { id: 1 };
await mockCmdr.stub.getUserById(user);
```

Commands are loaded by providing the `cmdDir` option to `mockCmdr.init()`:

```
const path = require('path');
const mockCmdr = require('mock-cmdr');
mockCmdr.init({
  baseUrl: wiremockBaseUrl,
  cmdDir: path.resolve(__dirname, 'mock'),
});
```

See the [Mock Commander Cucumber Test Suite][] for a full example demonstrating
how to define and use templated Wiremock commands with Cucumber.


### Command Dir Layout

The following example demonstrates the layout of a command dir:

```
[cmdDir]
  |- stub
  |  |- user
  |     |- create.js
  |     |- get-by-id.js
  |
  |- find
     |- user
        |- create-by-email.js
```

The resulting commands after calling `mockCmdr.init({ cmdDir })` will be:

```
mockCmdr.stub.user.create()
mockCmdr.stub.user.getById()
mockCmdr.find.user.createByEmail()
```

### Example Stub Command

```
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
    },
  };
};
```

### Example Find Command

```
/**
 * @returns {WiremockRequestCriteria}
 */
module.exports = function(user) {
  return {
    method: 'GET',
    urlPath: `/user/${user.id}`,
  };
};
```

## API Summary

### mock-cmdr module

#### .init(options)

Initialize the Mock Commander session. If `cmdDir` is specified then
`loadCmds()` will also be called.

**options:**
* **baseUrl** (string) - the mock server base URL, eg: `http://wiremock:8080`.
* **cmdDir** (string) - the dir to load commands from.

#### .defineCmd(command)

Define a templated mocking command that will be available via
`mockCmdr.{type}.{path}` or `mockCmdr.{type}.{name}`. When the command is
invoked then `createMapping()` or `findRequests()` will be called with the
output of the command's template function.

**command:**
* **type** (string) - `"stub"` or `"find"`.
* **path** (string[]) - the path the command will be available at within
  `mockCmdr.stub` or `mockCmdr.find`.
* **name** (string) - shorthand for `{ path: [ name ] }`
* **template** (function) - A function that returns either a "find requests" criteria or a
  "stub mapping" definition.


#### .loadCmds(dir)

Load all "find" and "stub" mocking commands by searching recursively
within baseDir.

The discovered commands will be passed to `defineCmd()` using the camel
cased file names as the command path. Modules found within a "find"
directory are treated as "find" commands and modules found within a
"stub" directory are treated as "stub" commands. Modules not within a
"find" or "stub" directory are ignored.

Any intermediate directories other than "find" and "stub" will be
treated as namespaces. Namespaces can be arbitrarily deep and are also
camel cased. The "find" and "stub" dirs are excluded from the namespace
and need not appear at the top level allowing related commands to be
grouped appropriately.


#### .createMapping(mapping)

*async*

Call the [Wiremock Stub Mapping API][].


#### .findRequests(criteria)

*async*

Call the [Wiremock Find Requests API][].

#### .stub

Access to "stub" commands registered via `mockCmdr.defineCmd()`.


#### .find

Access to "find" commands registered via `mockCmdr.defineCmd()`.


#### .cleanUp()

*async*

Remove stub mappings from the Wiremock server that have been created by the
current session.


Legal
-----

Copyright 2020 Nathan Jones. Licensed under the Apache License, Version 2.0.

[Mock Commander Cucumber Test Suite]: https://github.com/ncjones/mock-cmdr/tree/master/features/
[Wiremock Stub Mapping API]: http://wiremock.org/docs/api/#tag/Stub-Mappings/paths/~1__admin~1mappings/post
[Wiremock Find Requests API]: http://wiremock.org/docs/api/#tag/Requests/paths/~1__admin~1requests~1find/post
