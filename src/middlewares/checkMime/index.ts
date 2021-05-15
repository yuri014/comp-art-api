import createStream, { IFileUpload } from '../../utils/createStream';
import checkFileFormat from './checkFileFormat';
import checkMimeType from './checkMimeType';

const checkMime = async (file: IFileUpload) => {
  const stream = createStream(file);
  const fileFormat = await checkMimeType(stream);

  return {
    stream,
    fileFormat,
    checkFileFormat: (format: 'image' | 'audio') => checkFileFormat(fileFormat, format),
  };
};

export default checkMime;
