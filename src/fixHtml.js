import path from 'path';
import * as cheerio from 'cheerio';
import url from 'url';

const hasExt = (pathname) => (pathname.includes('.') ? pathname : `${pathname}.html`);

const fixHtml = (html, filesDir, fixSource, hostName) => {
  const $ = cheerio.load(html);
  $('img').each(function(i, elem) {
    const imgPath = $(this).attr('src');
    $(this).attr('src', path.join(filesDir, (`${fixSource}${imgPath}`).replace(/[/]/g, '-')));
  });

  $('script').each(function(i, elem) {
    const scriptPath = $(this).attr('src');
    if (!scriptPath.startsWith('/')) {
      const myUrl = new URL(scriptPath);
      const checkUrl = myUrl.origin;
      const pathName = myUrl.pathname;
      if (checkUrl === hostName) {
        $(this).attr('src', path.join(filesDir, (`${fixSource}${hasExt(pathName)}`).replace(/[/]/g, '-')));
      } return;
    } $(this).attr('src', path.join(filesDir, (`${fixSource}${hasExt(scriptPath)}`).replace(/[/]/g, '-')));
  });

  $('link').each(function(i, elem) {
    const linkPath = $(this).attr('href');
    if (!linkPath.startsWith('/')) {
      const myUrl = new URL(linkPath);
      const checkUrl = myUrl.origin;
      const pathName = myUrl.pathname;
      if (checkUrl === hostName) {
        $(this).attr('href', path.join(filesDir, (`${fixSource}${hasExt(pathName)}`).replace(/[/]/g, '-')));
      } return;
    } $(this).attr('href', path.join(filesDir, (`${fixSource}${hasExt(linkPath)}`).replace(/[/]/g, '-')));
  });
  return $.html();
};
export default fixHtml;
