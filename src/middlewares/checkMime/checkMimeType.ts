import { UserInputError } from 'apollo-server-express';
import FileType from 'file-type';
import { ReadStream } from 'node:fs';

/**
 * @returns {Promise<string>} O formato do arquivo. Ex: "image".
 */
const checkMimeType = async (createReadStream?: () => ReadStream): Promise<string> => {
  const validTypes = ['png', 'jpg', 'jpeg', 'webp', 'mp3', 'wav'];

  if (!createReadStream) {
    throw new Error();
  }

  const stream = createReadStream();
  const mimeType = await FileType.fromStream(stream);

  if (!mimeType) {
    throw new UserInputError('Formato não suportado');
  }

  const isValidType = validTypes.includes(mimeType.ext);

  if (!isValidType) {
    throw new UserInputError('Formato não suportado');
  }

  return mimeType.mime.split('/')[0];
};

export default checkMimeType;
