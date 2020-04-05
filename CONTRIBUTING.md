# Contributing to Mock Commander

### Run Unit Tests

```
yarn install
yarn test
```


### Run Cucumber Tests

```
yarn install
docker-compose run cucumber yarn cucumber
```


### Inspect Test Traffic with Mitmweb

Start Mitmweb:

```
docker-compose \
  -f ./docker-compose.yml \
  -f ./docker-compose.proxy.yml \
  up --detach
```

Browse to Mitmweb at http://localhost:8081/ then run tests:

```
docker-compose \
  -f ./docker-compose.yml \
  -f ./docker-compose.proxy.yml \
  run cucumber yarn cucumber
```


### Publishing

Tagged commits are automatically published by the Travis pipeline. The tag name
should match the version in package.json.
