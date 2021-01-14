import path from 'path';
import fs, { ReadStream } from 'fs-extra';

const uploadImage = async (createReadStream?: () => ReadStream, filename?: string) => {
  if (createReadStream && filename) {
    const stream = createReadStream();
    const originalName = `${Date.now()}-${filename}`;
    const pathName = path.join(__dirname, '..', '..', `/public/uploads/images/${originalName}`);

    await stream.pipe(fs.createWriteStream(pathName));
    return `${process.env.HOST}/uploads/images/${originalName}`;
  }
  return '';
};

export default uploadImage;
