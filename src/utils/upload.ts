import { UserInputError } from 'apollo-server-express';

import writeFileDev from './writeFileDev';
import { ICreateReadStream } from '../interfaces/General';
import writeFile from './writeFile';

const getMime = (
  filename: string | undefined,
  match: (_filename: string) => RegExpMatchArray | null,
) => {
  const newFileName = filename && match(filename);
  const mime = newFileName && newFileName[0];

  if (!mime) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: png, webp, jpg e jpeg.',
    );
  }

  return mime;
};

export const uploadImage = async (createReadStream?: ICreateReadStream, filename?: string) => {
  const mime = getMime(filename, _filename => _filename.match(/\.(png|jpg|jpeg|webp)$/));

  if (globalThis.__DEV__) {
    return writeFileDev({ createReadStream, folderPath: '/uploads/images/', mime });
  }

  return writeFile({ createReadStream, mime });
};

export const uploadAudio = async (createReadStream?: ICreateReadStream, filename?: string) => {
  const mime = getMime(filename, _filename => _filename.match(/\.(mp3|wav)$/));

  if (globalThis.__DEV__) {
    return writeFileDev({ createReadStream, folderPath: '/uploads/audio/', mime });
  }

  return writeFile({ createReadStream, mime });
};
