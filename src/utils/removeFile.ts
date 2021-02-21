import path from 'path';
import fs from 'fs-extra';

const removeFile = async (pathname: string) => {
  const pathName = path.join(__dirname, '..', '..', `/public${pathname}`);
  return fs.remove(pathName);
};

export default removeFile;
