import * as fs from 'fs';
import { FilePath } from './types';

// Yes, there is fs.promises, but sadly mock-fs, which is used for testing,
// does not properly support it. When fs.promises is used, several
//  UnhandledPromiseRejectionWarning errors are seen in the console.
const readFile = (filePath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

// We have to sort the file contents in order to compare them later.
// We also filter out empty / white-space-only lines.
export async function normalizeFile(filePath: FilePath) {
  const f0 = await readFile(filePath);
  return normalizeFileContents(f0);
}

export function normalizeFileContents(contents: string) {
  return contents
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
