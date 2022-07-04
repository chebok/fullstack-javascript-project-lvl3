import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const pageLoad = (source, dest = '') => {
  const newName = `${source.replace(/.+\/\//, '').replace(/[/.]/g, '-')}.html`;
  const filesDir = `${source.replace(/.+\/\//, '').replace(/[/.]/g, '-')}_files`;
  const fixSource = source.split('//').at(-1).split('/')[0].replace(/[.]/g, '-');

  const fixHtml = (html) => {
    const $ = cheerio.load(html);
    $('img').each(function(i, elem) {
      const imgPath = $(this).attr('src');
      $(this).attr('src', path.join(dest, filesDir, (`${fixSource}${imgPath}`).replace(/[/]/g, '-')));
    });
    return $.html();
  };

  const imgUrls = (data) => {
    const $ = cheerio.load(data);
    const src = $('img').map(function(i, el) {
      const imgPath = $(this).attr('src');
      return imgPath;
    }).get();
    const promises = src.map((imageUrl) => axios.get(`${source}${imageUrl}`)
      .then((response) => fs.writeFile(path.join(dest, filesDir, (`${fixSource}${imageUrl}`).replace(/[/]/g, '-')), response.data)));
    const promise = Promise.all(promises);
    return promise;
  };

  const newDest = path.join(dest, newName);
  return axios.get(source).then(({ data }) => {
    const newData = fixHtml(data);
    return fs.mkdir(path.join(dest, filesDir))
      .then(() => imgUrls(data)).then(() => fs.writeFile(newDest, newData));
  }).then(() => newDest);
};
export default pageLoad;
