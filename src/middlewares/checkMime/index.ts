import { ReadStream } from 'node:fs';

import checkFileFormat from './checkFileFormat';
import checkMimeType from './checkMimeType';

export interface IFileUpload {
  filename?: string | undefined;
  mimetype?: string | undefined;
  encoding?: string | undefined;
  createReadStream?: (() => ReadStream) | undefined;
}

const checkMime = async (file: IFileUpload) => {
  const fileFormat = await checkMimeType(file.createReadStream);

  return {
    fileFormat,
    checkFileFormat: (format: 'image' | 'audio') => checkFileFormat(fileFormat, format),
  };
};

export default checkMime;
