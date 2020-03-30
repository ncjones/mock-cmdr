# mock-cmdr

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

Run tests:

```
docker-compose \
  -f ./docker-compose.yml \
  -f ./docker-compose.proxy.yml \
  run cucumber yarn cucumber
```

Browse to Mitmweb at http://localhost:8081/.
