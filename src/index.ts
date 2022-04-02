import * as fs from 'fs/promises';
import {program} from 'commander';
import {jsonSort} from 'json-sorter-lib';
import {Comparators} from 'json-sorter-lib/dist/comparators';

program.name('<package.name>')
  .description('<package.description>')
  .version('<package.version>');

const log = (...args: any[]): void => {
  console.debug('json-sorter-cli>', ...args);
};

program.
  argument('<string...>', 'JSON files to proceed.').
  option('-ci, --case-insensitive', 'For case insensitive sort order.').
  option('-r, --reverse', 'For reverse sort order.').
  option('-n, --natural', 'For natural sort order.').
  action(async (files, options) => {
    log(files, options);

    const {caseInsensitive, reverse, natural} = options;
    const comparatorName = [
      natural ? 'natural' : 'alphabetical',
      reverse ? 'Reverse' : '',
      caseInsensitive ? 'Ci' : '',
      'Sort',
    ].join('');

    for (let filename of files) {
      log('start', filename);
      const input = await fs.readFile(filename, 'utf-8');
      const output = jsonSort(input, (Comparators as any)[comparatorName]);
      await fs.writeFile(filename, output, 'utf-8');
      log('complete', filename);
    }
    log('done');
  });

program.parse();
