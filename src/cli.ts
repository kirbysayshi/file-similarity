import * as fs from 'fs';
import * as path from 'path';

import { FileSimilarityOptions } from './types';
import { fileSimilarity } from './file-similarity';

type CLIProcess = Pick<NodeJS.Process, 'stdout' | 'stderr' | 'argv' | 'exit'>;

export async function run(process: CLIProcess) {
  const argv = process.argv.slice(2);
  const args = parseArgv(argv);
  const result = await fileSimilarity(args);

  // TODO: The results can get quite large given that it's basically a
  // cartesian join. An alternative is to either: use JSONStream to stream
  // an array out, OR to change the output format to newline-delimited JSON
  // instead of an array. jq handles this fine, so perhaps it's the way to go.

  const output = JSON.stringify(result);

  if (args.output === null) {
    process.stdout.write(output);
  } else {
    const filePath = path.join(args.root, args.output);
    fs.writeFileSync(filePath, output, 'utf8');
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
