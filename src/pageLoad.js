import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import debug from 'debug';
import 'axios-debug-log/enable.js';
import fixHtml from './fixHtml.js';
import imgsGet from './imgsGet.js';
import scriptsGet from './scriptsGet.js';
import linksGet from './linksGet.js';

// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const log = debug('page-loader');

const pageLoad = (source, dest = '') => {
  const myUrl = new URL(source);
  const fixSource = myUrl.hostname.replace(/[.]/g, '-');
  const hostName = myUrl.origin;
  const newName = `${source.replace(/.+\/\//, '').replace(/[/.]/g, '-')}.html`;
  const filesDir = `${source.replace(/.+\/\//, '').replace(/[/.]/g, '-')}_files`;

  const newDest = path.join(dest, newName);

  return axios.get(source).then(({ data }) => {
    log('site is ok');
    const newData = fixHtml(data, filesDir, fixSource, hostName);
    return fs.mkdir(path.join(dest, filesDir))
      .then(() => imgsGet(data, hostName, dest, filesDir, fixSource))
      .then(() => scriptsGet(data, hostName, dest, filesDir, fixSource))
      .then(() => linksGet(data, hostName, dest, filesDir, fixSource))
      .then(() => fs.writeFile(newDest, newData));
  }).then(() => newDest);
};
export default pageLoad;
