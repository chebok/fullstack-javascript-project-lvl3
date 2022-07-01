import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const pageLoad = (source, dest = '') => {
  const newName = `${source.replace(/.+\/\//, '').replace(/[/.]/g, '-')}.html`;
  const newDest = path.join(dest, newName);
  return axios.get(source).then((response) => fs.writeFile(newDest, response.data))
    .then(() => newDest);
};
export default pageLoad;
