import path from 'path';
import fs, { ReadStream } from 'fs-extra';
import { UserInputError } from 'apollo-server-express';

const uploadImage = async (createReadStream?: () => ReadStream, filename?: string) => {
  if (filename && !filename.match(/\.(png|jpg|jpeg|webp)$/)) {
    throw new UserInputError('Upload precisa ser em um formato de imagem suportado.', {
      errors: 'Formatos de imagens suportados: png, webp, jpg e jpeg.',
    });
  }

  try {
    if (createReadStream && filename) {
      const stream = createReadStream();
      const originalName = `${Date.now()}-${filename}`;
      const pathName = path.join(__dirname, '..', '..', `/public/uploads/images/${originalName}`);

      stream.pipe(fs.createWriteStream(pathName));
      return `${process.env.HOST}/uploads/images/${originalName}`;
    }
  } catch (error) {
    throw new UserInputError('Limite máximo excedido.', {
      errors: 'Limite máximo de upload: 1MB.',
    });
  }

  return '';
};

export default uploadImage;
