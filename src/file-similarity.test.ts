import { default as MockFS } from 'mock-fs';
import { fileSimilarity, FileSimilarityOptions } from './file-similarity';

test(`relative paths are resolved absolutely, but final output is relative`, async () => {
  MockFS({
    '/does/not/exist/file1.js': 'line1',
    '/does/not/exist/file2.js': 'line1\nline2',
    '/does/not/exist/file3.js': 'line1\nline2\nline3',
    '/does/not/exist/file4.ts': 'line1\nline2\nline3',
  });

  const opts: FileSimilarityOptions = {
    root: '/does/not/exist/',
    ext: ['js'],
    ignore: ['**/node_modules/*'],
    output: null,
  };

  const results = await fileSimilarity(opts);

  // Need to restore the FS mock before jest attempts to load modules
  // necessary for the snapshot!
  MockFS.restore();
  expect(results[0].filePath0).not.toMatch('/does/not/exist/');
  expect(results).toMatchInlineSnapshot(`
    Array [
      Object {
        "commonLines": 2,
        "filePath0": "file2.js",
        "filePath1": "file3.js",
        "lineCount0": 2,
        "lineCount1": 3,
        "score": 0.8333333333333333,
      },
      Object {
        "commonLines": 1,
        "filePath0": "file1.js",
        "filePath1": "file2.js",
        "lineCount0": 1,
        "lineCount1": 2,
        "score": 0.75,
      },
      Object {
        "commonLines": 1,
        "filePath0": "file1.js",
        "filePath1": "file3.js",
        "lineCount0": 1,
        "lineCount1": 3,
        "score": 0.6666666666666666,
      },
    ]
  `);
});
