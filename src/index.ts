#! /usr/bin/env node

import * as fs from 'fs/promises';
import {program} from 'commander';
import {jsonSort} from 'json-sorter-lib';
import {glob} from 'glob';
import * as path from 'path';

program.name('<package.name>')
  .description('<package.description>')
  .version('<package.version>');

const logOn = (...args: any[]): void => {
  console.debug('json-sorter-cli>', ...args);
};

const logOff = () => null;

program.
  argument('<string...>', 'JSON files to proceed.').
  option('-ci, --case-insensitive', 'For case insensitive sort order.').
  option('-r, --reverse', 'For reverse sort order.').
  option('-n, --natural', 'For natural sort order.').
  option('-v, --verbose', 'Show logs.').
  action(async (patterns, options) => {
    const {caseInsensitive, reverse, natural, verbose} = options;
    const log = verbose ? logOn : logOff;
    log(patterns, options);
    const filesGlob = await glob.sync(patterns.join(' '));
    const files = [...patterns, ...filesGlob];
    const filesSet = new Set<string>();

    for (let file of files) {
      const filename = path.resolve(file);
      try {
        const stat = await fs.stat(filename);
        if (stat.isFile()) {
          filesSet.add(filename);
        }
      } catch {}
    }

    const filesArr = Array.from(filesSet.values());
    for (let file of filesArr) {
      log(file);
      const input = await fs.readFile(file, 'utf-8');
      const output = jsonSort(input, {caseInsensitive, reverse, natural});
      await fs.writeFile(file, output, 'utf-8');
    }

    log('done');
  });

program.parse();
