#!/bin/sh
set -e
cd "$(dirname "$0")"

echo
echo pwd
pwd

echo
echo yarn --version
yarn --version

echo
echo yarn cache dir
yarn cache dir
