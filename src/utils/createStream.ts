import { ReadStream } from 'node:fs';

export interface IFileUpload {
  filename?: string | undefined;
  mimetype?: string | undefined;
  encoding?: string | undefined;
  createReadStream?: (() => ReadStream) | undefined;
}

const createStream = (file: IFileUpload) => {
  if (!file.createReadStream) {
    throw new Error();
  }

  const stream = file.createReadStream();

  return stream;
};

export default createStream;
