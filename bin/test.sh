#!/bin/bash

npm run build

rm -rf test/dist/*
cp test/src/* test/dist/

node dist/ -V
node dist/ --help
node dist/ test/dist/1.json test/dist/2.json -ci -r -n
