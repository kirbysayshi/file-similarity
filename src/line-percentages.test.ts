import { default as mockFS } from 'mock-fs';
import { linePercentages } from './line-percentages';

test(`
  Two normalized files that are exactly the same are scored the same
`, async () => {

  const files = {
    '/fake/root/file1.js': 'line1\nline2',
    '/fake/root/file2.js': 'line1\nline2',
  }

  mockFS(files);
  const percentages = await linePercentages(Object.keys(files));
  mockFS.restore();
  expect(percentages).toMatchInlineSnapshot(`
            Array [
              Object {
                "commonLines": 2,
                "filePath0": "/fake/root/file1.js",
                "filePath1": "/fake/root/file2.js",
                "lineCount0": 2,
                "lineCount1": 2,
                "score": 1,
              },
            ]
      `);
});

test(`
  Two normalized files that are half the same are scored half-ly
`, async () => {
  const files = {
    '/fake/root/file1.js': 'line1\nline2',
    '/fake/root/file2.js': 'line1\nline3',
  }
  mockFS(files);
  const percentages = await linePercentages(Object.keys(files));
  mockFS.restore();
  expect(percentages).toMatchInlineSnapshot(`
        Array [
          Object {
            "commonLines": 1,
            "filePath0": "/fake/root/file1.js",
            "filePath1": "/fake/root/file2.js",
            "lineCount0": 2,
            "lineCount1": 2,
            "score": 0.5,
          },
        ]
    `);
});

test(`
  Two files that are half the same but different order are scored half-ly
  due to normalization of the file inputs
`, async () => {
  const files = {
    '/fake/root/file1.js': 'line2\n    \nline1',
    '/fake/root/file2.js': 'line1\nline3',
  }
  mockFS(files);
  const percentages = await linePercentages(Object.keys(files));
  mockFS.restore();
  expect(percentages).toMatchInlineSnapshot(`
    Array [
      Object {
        "commonLines": 1,
        "filePath0": "/fake/root/file1.js",
        "filePath1": "/fake/root/file2.js",
        "lineCount0": 2,
        "lineCount1": 2,
        "score": 0.5,
      },
    ]
  `);
});
