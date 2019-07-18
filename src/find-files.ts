import { default as glob } from 'glob';
export function findFiles(
  pattern: string,
  cwd: string,
  ignore: string[]
): string[] {
  return glob.sync(pattern, {
    // https://github.com/prettier/prettier/issues/2110#issuecomment-309255864
    ignore,
    cwd,
  });
}
