import path from 'path';
import * as cheerio from 'cheerio';

const hasExt = (pathname) => (pathname.includes('.') ? pathname : `${pathname}.html`);

const fixHtml = (html, filesDir, fixSource, hostName) => {
  const $ = cheerio.load(html, {
    normalizeWhitespace: true,
    decodeEntities: false,
  });
  $('img').each(function img() {
    const imgPath = $(this).attr('src');
    $(this).attr('src', path.join(filesDir, (`${fixSource}${imgPath}`).replace(/[/]/g, '-')));
  });

  $('script').each(function script() {
    const scriptPath = $(this).attr('src');
    if (!scriptPath) {
      return;
    }
    if (!scriptPath.startsWith('/')) {
      const myUrl = new URL(scriptPath);
      const checkUrl = myUrl.origin;
      const pathName = myUrl.pathname;
      if (checkUrl === hostName) {
        $(this).attr('src', path.join(filesDir, (`${fixSource}${hasExt(pathName)}`).replace(/[/]/g, '-')));
      } return;
    } $(this).attr('src', path.join(filesDir, (`${fixSource}${hasExt(scriptPath)}`).replace(/[/]/g, '-')));
  });

  $('link').each(function link() {
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
  // const htmlka = $.html();
  // const fixin = prettier.format(htmlka, { parser: 'html', printWidth: 150 });
  // return fixin.slice(0, -1).replace(/\s[/]/g, '')
  // .replace('h3 { font-weight: normal; }\n', 'h3 { font-weight: normal; }');
  return $.html();
};
export default fixHtml;
