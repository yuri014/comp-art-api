import path from 'path';
import fs from 'fs-extra';
import { UserInputError } from 'apollo-server-express';

import { ICreateReadStream } from '../interfaces/General';

type IWriteFile = {
  folderPath: string;
  createReadStream: ICreateReadStream | undefined;
  filename: string | undefined;
};

// @ts-ignore
// eslint-disable-next-line consistent-return
const writeFileDev = ({ folderPath, createReadStream, filename }: IWriteFile) => {
  try {
    if (createReadStream && filename) {
      const stream = createReadStream();
      const originalName = `${Date.now()}-${filename}`;
      const pathName = path.join(__dirname, '..', '..', `/public${folderPath}${originalName}`);

      stream.pipe(fs.createWriteStream(pathName));
      return `${folderPath}${originalName}`;
    }
  } catch (error) {
    throw new UserInputError('Limite máximo de upload: 8MB.');
  }
};

export default writeFileDev;
