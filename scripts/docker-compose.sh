#!/bin/sh
set -e
cd "$(dirname "$0")"
docker-compose \
  -f ../docker-compose.yml \
  -f ../docker-compose.ci.yml \
  build
docker-compose \
  -f ../docker-compose.yml \
  -f ../docker-compose.ci.yml \
  "$@"
