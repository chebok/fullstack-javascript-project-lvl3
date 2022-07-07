import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import * as cheerio from 'cheerio';

const linksGet = (data, hostName, dest, filesDir, fixSource) => {
  const $ = cheerio.load(data);
  const src = $('link').map(function(i, el) {
    const linkPath = $(this).attr('href');
    if (!linkPath.startsWith('/')) {
      const myUrl = new URL(linkPath);
      const checkUrl = myUrl.origin;
      const pathName = myUrl.pathname;
      if (checkUrl === hostName) {
        return pathName;
      } return 0;
    }

    return linkPath;
  }).get().filter((a) => a !== 0);
  const promises = src.map((linkUrl) => axios.get(`${hostName}${linkUrl}`)
    .then((response) => fs.writeFile(path.join(dest, filesDir, (`${fixSource}${linkUrl}`).replace(/[/]/g, '-')), response.data)));
  const promise = Promise.all(promises);
  return promise;
};
export default linksGet;
