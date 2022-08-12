import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import debug from 'debug';
import 'axios-debug-log';
import fixHtml from './fixHtml.js';
import imgsGet from './imgsGet.js';
import scriptsGet from './scriptsGet.js';
import linksGet from './linksGet.js';

// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const log = debug('page-loader');
debug.enable('page-loader');

const pageLoad = (source, dest = '') => {
  const myUrl = new URL(source);
  const fixSource = myUrl.hostname.replace(/[.]/g, '-');
  const hostName = myUrl.origin;
  const newName = `${source.replace(/.+\/\//, '').replace(/[/.]/g, '-')}.html`;
  const filesDir = `${source.replace(/.+\/\//, '').replace(/[/.]/g, '-')}_files`;

  const newDest = path.join(dest, newName);

  return axios.get(source).catch((e) => {
    if (e.response) {
      throw new Error(`Problem to access ${source}\nError ${e.response.status} ${e.response.statusText}`);
    } throw new Error(`Problem to access ${source}\n No response error`);
  }).then(({ data }) => {
    log('url is correct');
    return fs.mkdir(path.join(dest, filesDir))
      .catch(() => {
        throw new Error('Directory already exist!');
      })
      .then(() => {
        log('dir was created');
        return imgsGet(data, hostName, dest, filesDir, fixSource);
      })
      .then(() => {
        log('images recieved');
        return scriptsGet(data, hostName, dest, filesDir, fixSource);
      })
      .then(() => {
        log('scripts recieved');
        return linksGet(data, hostName, dest, filesDir, fixSource);
      })
      .then(() => {
        log('links recieved');
        const newData = fixHtml(data, filesDir, fixSource, hostName);
        return fs.writeFile(newDest, newData);
      });
  }).then(() => {
    log(`Create ${newDest}`);
    return newDest;
  });
};
export default pageLoad;
