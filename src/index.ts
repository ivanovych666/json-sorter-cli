import * as fs from 'fs/promises';
import {program} from 'commander';
import {jsonSort} from 'json-sorter-lib';

// program.name('json-sorter-cli')
// .description('CLI for json-sorter-lib')
// .version('1.0.0');

const log = (...args: any[]): void => {
  console.debug('json-sorter-cli>', ...args);
};

program.argument('<string...>', 'JSON files to proceed.').
  action(async (files, options) => {
    log(files, options);
    for (let filename of files) {
      log('start', filename);
      const input = await fs.readFile(filename, 'utf-8');
      const output = jsonSort(input);
      await fs.writeFile(filename, output, 'utf-8');
      log('complete', filename);
    }
    log('done');
  });

program.parse();
