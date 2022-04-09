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
  option('-i, --indent <number|string>', 'Indent string or size (autodetected by default).').
  option('-nl, --newline <string>', 'Newline string (autodetected by default).').
  option('-fn, --final-newline', 'For final newline (autodetected by default).').
  option('-nf, --no-final-newline', 'No final newline.').
  option('-v, --verbose', 'Show logs.').
  action(async (patterns, options) => {
    let {caseInsensitive, reverse, natural, indent, newline, finalNewline, verbose} = options;
    indent = parseInt(indent) || indent;
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
      const output = jsonSort(input, {caseInsensitive, reverse, natural, indent, newline, finalNewline});
      await fs.writeFile(file, output, 'utf-8');
    }

    log('done');
  });

program.parse();
