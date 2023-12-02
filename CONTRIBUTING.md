# Contributing to Mock Commander

### Run Unit Tests

```
yarn install
yarn test
```


### Run Cucumber Tests

```
docker compose run script yarn install
docker compose run cucumber yarn cucumber
```


### Inspect Test Traffic with Mitmweb

After running `docker compose up` Mitmproxy debugger will be available from
your web browser at http://localhost:8081/. Then Cucumber tests can be run with:

```
docker-compose run cucumber yarn cucumber
```

HTTP traffic will be visible from the Mitmweb UI.


### Publishing

Tagged commits are automatically published by the Travis pipeline. The tag name
should match the version in package.json.
