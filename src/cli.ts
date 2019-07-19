/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';

import { fileSimilarity, FileSimilarityOptions } from './file-similarity';

type CLIProcess = Pick<NodeJS.Process, 'env' | 'stdout' | 'stderr' | 'argv' | 'exit'>;

export async function run(process: CLIProcess) {
  const argv = process.argv.slice(2);
  const args = parseArgv(argv);
  process.env.NODE_ENV === 'debug' && console.time('similarity');
  const result = await fileSimilarity(args);
  process.env.NODE_ENV === 'debug' && console.timeEnd('similarity');

  // The output is quite large, and can result in bottlenecks in both
  // the final array size as well as JSON.stringify / console.log.
  // Alternative is to:
  // - use a file database
  // - JSONStream
  // - log newline-delimited JSON, which jq handles nicely. Other tools not so

  process.env.NODE_ENV === 'debug' && console.time('stringify');
  const output = JSON.stringify(result);
  process.env.NODE_ENV === 'debug' && console.timeEnd('stringify');

  if (args.output === null) {
    process.env.NODE_ENV === 'debug' && console.time('stdoutwrite');
    process.stdout.write(output);
    process.env.NODE_ENV === 'debug' && console.timeEnd('stdoutwrite');
  } else {
    process.env.NODE_ENV === 'debug' && console.time('filewrite');
    const filePath = path.join(args.root, args.output);
    fs.writeFileSync(filePath, output, 'utf8');
    process.env.NODE_ENV === 'debug' && console.timeEnd('filewrite');
  }

  process.exit(0);
}

// Exported just for testing.
export function parseArgv(argv: string[]): FileSimilarityOptions {
  // The defaults
  const args: FileSimilarityOptions = {
    root: process.cwd(),
    ext: 'js,jsx,ts,tsx,scss,css'.split(','),

    // These patterns are doubled up due to:
    // // https://github.com/prettier/prettier/issues/2110#issuecomment-309255864

    ignore: [
      '**/node_modules/**',
      './node_modules/**',
      '**/coverage/**',
      './coverage/**',
      '**/__snapshots__/**',
      './__snapshots__/**',
    ],

    // Default is stdout
    output: null,
  };

  const rootIdx = argv.indexOf('--root');
  if (rootIdx > -1) args.root = argv[rootIdx + 1];

  const extIdx = argv.indexOf('--ext');
  if (extIdx > -1) args.ext = argv[extIdx + 1].split(',');

  const ignoreIdx = argv.indexOf('--ignore');
  if (ignoreIdx > -1) args.ignore = argv[ignoreIdx + 1].split(',');

  const outputIdx = argv.indexOf('--output');
  if (outputIdx > -1) args.output = argv[outputIdx + 1];

  // prettier-ignore
  const help = `
Determine which files within your project are most similar (or exactly!)
Usage
  $ file-similarity [options]
Global Options
  --root                          Use this directory as root for globs and files
                                    (current: ${args.root})
  --ext                           Only inspect files with these extensions
                                    (current: ${args.ext})
  --ignore                        Ignore these comma-separated glob patterns
                                    (current: ${args.ignore})
  --output                        Output to this file
                                    (current: ${args.output === null ? 'stdout' : args.output})
  --help                          This help.
`;

  if (argv.indexOf('--help') > -1) {
    console.error(help);
    process.exit(1);
  }

  return args;
}
