/* eslint-disable no-undef */
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import nock from 'nock';
import os from 'os';
import fs from 'fs/promises';
import pageLoad from '../src/pageLoad.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturePath = path.join(__dirname, '..', '__fixtures__');
let dest;
beforeEach(async () => {
  dest = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  console.log(`${dest} was created!`);
});

afterEach(async () => {
  await fs.rm(dest, { recursive: true });
  console.log(`${dest} was deleted!`);
  dest = '';
});

test('pageLoad', async () => {
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, 'hei');
  const pathFile = await pageLoad('https://ru.hexlet.io/courses', dest);
  const data = await fs.readFile(pathFile, 'utf-8');
  expect(scope.isDone()).toBe(true);
  expect(data).toBe('hei');
});
