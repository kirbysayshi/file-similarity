import * as path from 'path';
import { findFiles } from './find-files';
import { linePercentages } from './line-percentages';
import { FileSimilarityOptions } from './types';
import { FileLineSimilarity } from './common-line-count';

export async function fileSimilarity(
  options: FileSimilarityOptions,
): Promise<FileLineSimilarity[]> {
  const pattern = `**/*.{${options.ext.join(',')}}`;
  const files = await findFiles(pattern, options.root, options.ignore);
  const absoluteFiles = files.map(f => path.join(options.root, f));
  const result = await linePercentages(absoluteFiles);
  const relativeResult = result.map(result => ({
    ...result,
    filePath0: path.relative(options.root, result.filePath0),
    filePath1: path.relative(options.root, result.filePath1),
  }));
  return relativeResult;
}
