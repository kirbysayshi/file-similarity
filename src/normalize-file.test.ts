import { normalizeFileContents } from './normalize-file';

test(`empty lines are removed and whitespace is trimmed`, () => {
  const lines = normalizeFileContents(`
    line2

    line4
  `);

  expect(lines).toMatchInlineSnapshot(`
            Array [
              "line2",
              "line4",
            ]
      `);
});

test(`lines are sorted`, () => {
  const lines = normalizeFileContents(`
    line2
    line6
    line5
    line7
    line4
    line3
  `);

  expect(lines).toMatchInlineSnapshot(`
    Array [
      "line2",
      "line3",
      "line4",
      "line5",
      "line6",
      "line7",
    ]
  `);
});
