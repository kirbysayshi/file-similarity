import { NormalizedFileCache } from './normalized-file-cache';
import { FilePath } from './types';
import { commonLineCount, FileLineSimilarity } from './common-line-count';

export async function linePercentages(
  files: FilePath[],
  cache = new NormalizedFileCache(),
): Promise<FileLineSimilarity[]> {
  const all: FileLineSimilarity[] = [];
  for (let i = 0; i < files.length; i++) {
    const f0 = (await cache.get(files[i]))!;
    const perFile: FileLineSimilarity[] = [];
    for (let j = i + 1; j < files.length; j++) {
      const f1 = (await cache.get(files[j]))!;
      const similarity = commonLineCount(files[i], files[j], f0, f1);
      perFile.push(similarity);
    }
    sortHighestToLowest(perFile);
    // TODO: should this be configurable? It limits the number of results per file.
    const closest = perFile.slice(0, 10);
    all.push(...closest);
  }
  sortHighestToLowest(all);
  return all;
}

function sortHighestToLowest(arr: FileLineSimilarity[]) {
  return arr.sort((a, b) => b.score - a.score);
}
