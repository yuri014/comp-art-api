import { ReadStream } from 'fs-extra';

export type IUploadImage = {
  file: {
    filename?: string;
    mimetype?: string;
    encoding?: string;
    createReadStream?: () => ReadStream;
  };
};
