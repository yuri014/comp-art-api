import { UserInputError } from 'apollo-server-express';
import FileType from 'file-type';
import { ReadStream } from 'node:fs';

const checkMimeType = async (stream: ReadStream) => {
  const validTypes = ['png', 'jpg', 'jpeg', 'webp', 'mp3', 'wav'];
  const mimeType = await FileType.fromStream(stream);

  if (!mimeType) {
    throw new UserInputError('Formato não suportado');
  }

  const isValidType = validTypes.includes(mimeType.ext);

  if (!isValidType) {
    throw new UserInputError('Formato não suportado');
  }

  return mimeType.mime;
};

export default checkMimeType;
