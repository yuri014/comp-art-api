import { ReadStream } from 'fs-extra';

export type IUploadImage = Promise<{
  filename: string;
  mimetype?: string;
  encoding?: string;
  createReadStream: () => ReadStream;
}>;
