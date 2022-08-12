/* eslint-disable no-undef */
import path from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import os from 'os';
import fs from 'fs/promises';
import debug from 'debug';
import * as cheerio from 'cheerio';
import pageLoad from '../src/pageLoad.js';

const log = debug('page-loader');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
let dest;
let testData;
let testData2;
beforeAll(async () => {
  testData = await fs.readFile(getFixturePath('test.html'), 'utf-8');
  testData2 = await fs.readFile(getFixturePath('test2.html'), 'utf-8');
});
beforeEach(async () => {
  dest = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  log(`${dest} was created!`);
});

afterEach(async () => {
  await fs.rm(dest, { recursive: true });
  log(`${dest} was deleted!`);
  dest = '';
});

test('the axios fails with an error', async () => {
  await expect(() => pageLoad('https://ru.hexlet.io/courseras'))
    .rejects.toThrow('Problem to access https://ru.hexlet.io/courseras\nError 404 Not Found');
});

test('pageLoad', async () => {
  const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, testData);
  const scope2 = nock('https://ru.hexlet.io')
    .get('/assets/professions/nodejs.png')
    .reply(200, 'img');
  const scope3 = nock('https://ru.hexlet.io')
    .get('/packs/js/runtime.js')
    .reply(200, 'script');
  const scope4 = nock('https://ru.hexlet.io')
    .get('/assets/application.css')
    .reply(200, 'link');
  const scope5 = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, testData);
  const pathFile = await pageLoad('https://ru.hexlet.io/courses', dest);
  const data = await fs.readFile(pathFile, 'utf-8');
  const $ = cheerio.load(data);
  const imagePath = $('img').attr('src');
  const imageData = await fs.readFile(path.join(dest, imagePath), 'utf-8');
  expect(scope.isDone()).toBe(true);
  expect(scope2.isDone()).toBe(true);
  expect(scope3.isDone()).toBe(true);
  expect(scope4.isDone()).toBe(true);
  expect(scope5.isDone()).toBe(true);
  expect(imageData).toEqual('img');
  expect(data).toEqual(testData2);
});
