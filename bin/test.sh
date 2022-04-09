#!/bin/bash

npm run build

rm -rf test/dist/*
cp test/src/* test/dist/

node dist/ -V
node dist/ --help
node dist/ test/dist/*.json -ci -r -n
node dist/ test/dist/**/*.* -ci -r -n -v -i 6 -nf -nl $'\n\n'
