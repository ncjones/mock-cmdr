#!/bin/sh
set -e
cd "$(dirname "$0")"
./docker-compose.sh run script yarn lint
