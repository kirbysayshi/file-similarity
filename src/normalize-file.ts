import * as fs from 'fs';
import { FilePath } from './types';

// We have to sort the file contents in order to compare them later.
// We also filter out empty / white-space-only lines.
export async function normalizeFile(filePath: FilePath) {
  const f0 = await fs.promises.readFile(filePath, 'utf8');
  return f0
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
