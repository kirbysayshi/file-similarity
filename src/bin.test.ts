import {promisify } from 'util';
import { exec as execCb } from 'child_process';
import * as path from 'path';

const exec = promisify(execCb);

test(`ensure the bin is executable`, async () => {
  const binPath = path.join(__dirname, '..', 'bin/simfiles');
  const results = await exec(`${binPath} --help`);
  expect(results.stderr).toMatch('Usage');
});