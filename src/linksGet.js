import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import debug from 'debug';
import Listr from 'listr';
import url from 'url';
import * as cheerio from 'cheerio';

const log = debug('page-loader');

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
  const uniqsrc = [...new Set(src)];
  const assetsTasks = uniqsrc.map((linkUrl) => {
    const objTask = {
      title: `Save ${linkUrl}`,
      task: () => axios.get(`${hostName}${linkUrl}`)
        .catch((e) => {
          if (e.response) {
            throw new Error(`Problem to access ${hostName}${linkUrl}\nError ${e.response.status} ${e.response.statusText}`);
          } throw new Error(`Problem to access ${hostName}${linkUrl}\n No response error`);
        })
        .then((response) => fs.writeFile(path.join(dest, filesDir, (`${fixSource}${linkUrl}`).replace(/[/]/g, '-')), response.data))
        .catch(console.error)
    };
    return objTask;
  });
  const tasks = new Listr(assetsTasks);
  return tasks.run();
};
export default linksGet;
