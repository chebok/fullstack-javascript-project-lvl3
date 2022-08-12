import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import Listr from 'listr';
import * as cheerio from 'cheerio';

const imgsGet = (data, hostName, dest, filesDir, fixSource) => {
  const $ = cheerio.load(data);
  const src = $('img').map(function img() {
    const imgPath = $(this).attr('src');
    if (!imgPath) {
      return 0;
    }
    if (!imgPath.startsWith('/')) {
      const myUrl = new URL(imgPath);
      const checkUrl = myUrl.origin;
      const pathName = myUrl.pathname;
      if (checkUrl === hostName) {
        return pathName;
      } return 0;
    }

    return imgPath;
  }).get().filter((a) => a !== 0);
  const uniqsrc = [...new Set(src)];
  const assetsTasks = uniqsrc.map((imageUrl) => {
    const objTask = {
      title: `Save ${imageUrl}`,
      task: () => axios.get(`${hostName}${imageUrl}`, { responseType: 'arraybuffer' })
        .catch((e) => {
          if (e.response) {
            throw new Error(`Problem to access ${hostName}${imageUrl}\nError ${e.response.status} ${e.response.statusText}`);
          } throw new Error(`Problem to access ${hostName}${imageUrl}\n No response error`);
        })
        .then((response) => fs.writeFile(path.join(dest, filesDir, (`${fixSource}${imageUrl}`).replace(/[/]/g, '-')), response.data))
        .catch(console.error),
    };
    return objTask;
  });
  const tasks = new Listr(assetsTasks);
  return tasks.run();
};
export default imgsGet;
