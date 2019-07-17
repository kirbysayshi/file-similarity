import { default as glob } from 'glob';
export function findFiles(
  pattern: string,
  cwd: string,
  ignore: string[],
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(
      pattern,
      {
        // https://github.com/prettier/prettier/issues/2110#issuecomment-309255864
        ignore,
        cwd,
      },
      (err, files) => {
        if (err) reject(err);
        else resolve(files);
      },
    );
  });
}
