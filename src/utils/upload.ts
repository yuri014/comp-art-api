import { UserInputError } from 'apollo-server-express';

import writeFileDev from './writeFileDev';
import { ICreateReadStream } from '../interfaces/General';
import writeFile from './writeFile';

const getMime = (filename: string | undefined) => {
  const newFileName = filename && filename.match(/\.(png|jpg|jpeg|webp)$/);
  const mime = newFileName && newFileName[0];

  if (!mime) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: png, webp, jpg e jpeg.',
    );
  }

  return mime;
};

export const uploadImage = async (createReadStream?: ICreateReadStream, filename?: string) => {
  const mime = getMime(filename);

  if (globalThis.__DEV__) {
    return writeFileDev({ createReadStream, folderPath: '/uploads/images/', mime });
  }

  return writeFile({ createReadStream, mime });
};

export const uploadAudio = async (createReadStream?: ICreateReadStream, filename?: string) => {
  const mime = getMime(filename);

  if (globalThis.__DEV__) {
    return writeFileDev({ createReadStream, folderPath: '/uploads/audio/', mime });
  }

  return writeFile({ createReadStream, mime });
};
