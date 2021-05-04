import path from 'path';
import fs, { ReadStream } from 'fs-extra';
import { UserInputError } from 'apollo-server-express';

export const uploadImage = async (createReadStream?: () => ReadStream, filename?: string) => {
  if (filename && !filename.match(/\.(png|jpg|jpeg|webp)$/)) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: png, webp, jpg e jpeg.',
    );
  }

  try {
    if (createReadStream && filename) {
      const stream = createReadStream();
      const originalName = `${Date.now()}-${filename}`;
      const pathName = path.join(__dirname, '..', '..', `/public/uploads/images/${originalName}`);

      stream.pipe(fs.createWriteStream(pathName));
      return `/uploads/images/${originalName}`;
    }
  } catch (error) {
    throw new UserInputError('Limite máximo de upload: 3MB.');
  }

  return '';
};

export const uploadAudio = async (createReadStream?: () => ReadStream, filename?: string) => {
  if (filename && !filename.match(/\.(mp3|wav)$/)) {
    throw new UserInputError(
      'Upload precisa ser em um formato de imagem suportado. Formatos de imagens suportados: mp3 e wav.',
    );
  }

  try {
    if (createReadStream && filename) {
      const stream = createReadStream();
      const originalName = `${Date.now()}-${filename}`;
      const pathName = path.join(__dirname, '..', '..', `/public/uploads/audio/${originalName}`);

      stream.pipe(fs.createWriteStream(pathName));
      return `/uploads/audio/${originalName}`;
    }
  } catch (error) {
    throw new UserInputError('Limite máximo de upload: 3MB.');
  }
  return '';
};
