import { UserInputError } from 'apollo-server-express';

import writeFileDev from './writeFileDev';
import { ICreateReadStream } from '../interfaces/General';
import writeFile from './writeFile';

export const uploadImage = async (createReadStream?: ICreateReadStream, filename?: string) => {
  if (filename && !filename.match(/\.(png|jpg|jpeg|webp)$/)) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: png, webp, jpg e jpeg.',
    );
  }

  if (globalThis.__DEV__) {
    return writeFileDev({ createReadStream, filename, folderPath: '/uploads/images/' });
  }

  return writeFile({ createReadStream, filename });
};

export const uploadAudio = async (createReadStream?: ICreateReadStream, filename?: string) => {
  if (filename && !filename.match(/\.(mp3|wav)$/)) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: mp3 e wav.',
    );
  }

  if (globalThis.__DEV__) {
    return writeFileDev({ createReadStream, filename, folderPath: '/uploads/audio/' });
  }

  return writeFile({ createReadStream, filename });
};
