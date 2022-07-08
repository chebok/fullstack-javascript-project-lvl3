import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import debug from 'debug';

const log = debug('page-loader');

const imgsGet = (data, hostName, dest, filesDir, fixSource) => {
  const $ = cheerio.load(data);
  const src = $('img').map(function(i, el) {
    const imgPath = $(this).attr('src');
    return imgPath;
  }).get();
  const promises = src.map((imageUrl) => axios.get(`${hostName}${imageUrl}`)
    .then((response) => fs.writeFile(path.join(dest, filesDir, (`${fixSource}${imageUrl}`).replace(/[/]/g, '-')), response.data)));
  const promise = Promise.all(promises);
  return promise;
};
export default imgsGet;
