import path from 'path';
import fs, { ReadStream } from 'fs-extra';

const uploadImage = async (createReadStream?: () => ReadStream, filename?: string) => {
  if (createReadStream && filename) {
    const stream = createReadStream();
    const pathName = path.join(__dirname, `/public/uploads/images/${filename}`);
    await stream.pipe(fs.createWriteStream(pathName));
    return {
      url: `${process.env.HOST}/uploads/images/${filename}`,
    };
  }
  return '';
};

export default uploadImage;
