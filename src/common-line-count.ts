import { FilePath } from './types';

export type FileLineSimilarity = {
  filePath0: FilePath;
  filePath1: FilePath;
  lineCount0: number;
  lineCount1: number;
  commonLines: number;
  score: number;
};

// Somewhat similar to the `comm` unix command, except it only returns the number
// of lines the files have in common.
// The score is tricky: what does it mean for a 7-line file to have 7-lines in
// common with a 70-line file? But roughly, 1 == 100% of the lines were
// shared, 0.5 === 50% of the lines were shared.
export function commonLineCount(
  filePath0: string,
  filePath1: string,
  lines0: string[],
  lines1: string[],
): FileLineSimilarity {
  let both = 0;
  let nextStart = 0;
  for (let i = 0; i < lines0.length && nextStart < lines1.length; i++) {
    for (let j = nextStart; j < lines1.length; j++) {
      if (lines0[i] === lines1[j]) {
        both++;
        // We don't want to count the same line twice, so mark where to start
        // the next iteration. Since it's sorted, we can be guaranteed not to
        // skip over something.
        nextStart = j + 1;
        break;
      }
    }
  }
  return {
    filePath0,
    filePath1,
    lineCount0: lines0.length,
    lineCount1: lines1.length,
    commonLines: both,
    score: (both / lines0.length + both / lines1.length) / 2,
  };
}
