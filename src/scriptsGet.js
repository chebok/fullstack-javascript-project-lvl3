import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import * as cheerio from 'cheerio';

const scriptsGet = (data, hostName, dest, filesDir, fixSource) => {
  const $ = cheerio.load(data);
  const src = $('script').map(function(i, el) {
    const scriptPath = $(this).attr('src');
    if (!scriptPath.startsWith('/')) {
      const myUrl = new URL(scriptPath);
      const checkUrl = myUrl.origin;
      const pathName = myUrl.pathname;
      if (checkUrl === hostName) {
        return pathName;
      } return 0;
    }

    return scriptPath;
  }).get().filter((a) => a !== 0);
  const promises = src.map((scriptUrl) => axios.get(`${hostName}${scriptUrl}`)
    .then((response) => fs.writeFile(path.join(dest, filesDir, (`${fixSource}${scriptUrl}`).replace(/[/]/g, '-')), response.data)));
  const promise = Promise.all(promises);
  return promise;
};
export default scriptsGet;
