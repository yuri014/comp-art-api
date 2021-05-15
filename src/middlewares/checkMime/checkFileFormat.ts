import { UserInputError } from 'apollo-server-express';

const checkFileFormat = (fileFormat: string, format: 'image' | 'audio') => {
  if (fileFormat !== format) {
    throw new UserInputError('Arquivo precisa ser uma imagem.');
  }

  return fileFormat;
};

export default checkFileFormat;
