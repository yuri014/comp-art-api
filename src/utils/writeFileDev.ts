import path from 'path';
import fs from 'fs-extra';
import { UserInputError } from 'apollo-server-express';
import { nanoid } from 'nanoid';

import { ICreateReadStream } from '../interfaces/General';

type IWriteFile = {
  folderPath: string;
  createReadStream: ICreateReadStream | undefined;
  mime: string | undefined;
};

// @ts-ignore
// eslint-disable-next-line consistent-return
const writeFileDev = ({ folderPath, createReadStream, mime }: IWriteFile) => {
  try {
    if (createReadStream && mime) {
      const id = nanoid();
      const stream = createReadStream();
      const originalName = `${Date.now()}-${id}${mime}`;
      const pathName = path.join(__dirname, '..', '..', `/public${folderPath}${originalName}`);

      stream.pipe(fs.createWriteStream(pathName));
      return `${process.env.HOST}${folderPath}${originalName}`;
    }
  } catch (error) {
    throw new UserInputError('Limite máximo de upload: 8MB.');
  }
};

export default writeFileDev;
