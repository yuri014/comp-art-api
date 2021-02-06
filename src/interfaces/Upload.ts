import { ReadStream } from 'fs-extra';

export type IUpload = {
  file: {
    filename?: string;
    mimetype?: string;
    encoding?: string;
    createReadStream?: () => ReadStream;
  };
};
