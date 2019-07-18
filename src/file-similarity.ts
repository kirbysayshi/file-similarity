import * as path from 'path';
import { findFiles } from './find-files';
import { linePercentages, FileLineSimilarity } from './line-percentages';

export type FileSimilarityOptions = {
  root: string;
  ext: string[];
  ignore: string[];
  output: string | null;
}

export async function fileSimilarity(
  options: FileSimilarityOptions,
): Promise<FileLineSimilarity[]> {
  // Apparently minimatch (maybe even bash, not sure) will take a globl like:
  // '**/*.{js}' and match literal `{}` instead of expanding it if there is no
  // | or , within the {}.
  const pattern =
    options.ext.length > 1
      ? `**/*.{${options.ext.join(',')}}`
      : options.ext.length === 1
      ? `**/*.${options.ext[0]}`
      : `**/*`;

  const files = findFiles(pattern, options.root, options.ignore);

  // Create absolute paths so the rest of the code does not need to know about
  // working directory vs root. We later remove them after computing simlarity.
  const absoluteFiles = files.map(f => path.join(options.root, f));
  const result = await linePercentages(absoluteFiles);
  const relativeResult = result.map(result => ({
    ...result,
    filePath0: path.relative(options.root, result.filePath0),
    filePath1: path.relative(options.root, result.filePath1),
  }));
  return relativeResult;
}
