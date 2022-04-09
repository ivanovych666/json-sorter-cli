#!/bin/bash

npm run build

rm -rf test/dist/*
cp test/src/* test/dist/

node dist/ -V
node dist/ --help
node dist/ test/dist/**/*.* -ci -r -n -v
node dist/ test/dist/*.json -ci -r -n
