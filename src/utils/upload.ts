import { UserInputError } from 'apollo-server-express';

import writeFileDev from './writeFileDev';
import { ICreateReadStream } from '../interfaces/General';

const __DEV__ = process.env.NODE_ENV === 'development';

export const uploadImage = async (createReadStream?: ICreateReadStream, filename?: string) => {
  if (filename && !filename.match(/\.(png|jpg|jpeg|webp)$/)) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: png, webp, jpg e jpeg.',
    );
  }

  if (__DEV__) {
    return writeFileDev({ createReadStream, filename, folderPath: '/uploads/images/' });
  }

  return '';
};

export const uploadAudio = async (createReadStream?: ICreateReadStream, filename?: string) => {
  if (filename && !filename.match(/\.(mp3|wav)$/)) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: mp3 e wav.',
    );
  }

  if (__DEV__) {
    return writeFileDev({ createReadStream, filename, folderPath: '/uploads/audio/' });
  }
  return '';
};
