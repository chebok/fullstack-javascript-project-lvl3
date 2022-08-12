import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import Listr from 'listr';
import * as cheerio from 'cheerio';

const scriptsGet = (data, hostName, dest, filesDir, fixSource) => {
  const $ = cheerio.load(data);
  const src = $('script').map(function script() {
    const scriptPath = $(this).attr('src');
    if (!scriptPath) {
      return 0;
    }
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
  const uniqsrc = [...new Set(src)];
  const assetsTasks = uniqsrc.map((scriptUrl) => {
    const objTask = {
      title: `Save ${scriptUrl}`,
      task: () => axios.get(`${hostName}${scriptUrl}`, { responseType: 'arraybuffer' })
        .catch((e) => {
          if (e.response) {
            throw new Error(`Problem to access ${hostName}${scriptUrl}\nError ${e.response.status} ${e.response.statusText}`);
          } throw new Error(`Problem to access ${hostName}${scriptUrl}\n No response error`);
        })
        .then((response) => fs.writeFile(path.join(dest, filesDir, (`${fixSource}${scriptUrl}`).replace(/[/]/g, '-')), response.data))
        .catch(console.error),
    };
    return objTask;
  });
  const tasks = new Listr(assetsTasks);
  return tasks.run();
};
export default scriptsGet;
