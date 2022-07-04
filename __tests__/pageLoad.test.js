/* eslint-disable no-undef */
import path from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import os from 'os';
import fs from 'fs/promises';
import * as cheerio from 'cheerio';
import pageLoad from '../src/pageLoad.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
let dest;
let testData;
beforeAll(async () => {
  testData = await fs.readFile(getFixturePath('test.html'), 'utf-8');
});
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
    .reply(200, testData);
  const scope2 = nock('https://ru.hexlet.io')
    .get('/courses/assets/professions/nodejs.png')
    .reply(200, 'img');
  const pathFile = await pageLoad('https://ru.hexlet.io/courses', dest);
  const data = await fs.readFile(pathFile, 'utf-8');
  const $ = cheerio.load(data);
  const imagePath = $('img').attr('src');
  const imageData = await fs.readFile(imagePath, 'utf-8');
  expect(scope.isDone()).toBe(true);
  expect(scope2.isDone()).toBe(true);
  expect(imageData).toBe('img');
  expect(data).not.toBe(testData);
});
