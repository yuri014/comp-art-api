import { UserInputError } from 'apollo-server-express';
import getImageSize from 'image-size';
import http from 'http';
import https from 'https';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

interface HttpResolver {
  resolve: (size: ISizeCalculationResult) => void;
  options: URL;
  _http: typeof http | typeof https;
}

const httpResolver = ({ options, resolve, _http }: HttpResolver) => {
  _http.get(options, response => {
    const chunks: Uint8Array[] = [];
    response
      .on('data', chunk => {
        chunks.push(chunk);
      })
      .on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(getImageSize(buffer));
      });
  });
};

const handleImageDimension = async (uploadPath: string) => {
  const options = new URL(uploadPath);

  const getDimensions = () => {
    if (globalThis.__DEV__) {
      const dimensions = new Promise((resolve: (size: ISizeCalculationResult) => void) => {
        httpResolver({ _http: http, options, resolve });
      });

      return dimensions;
    }

    const dimensions = new Promise((resolve: (size: ISizeCalculationResult) => void) => {
      httpResolver({ _http: https, options, resolve });
    });

    return dimensions;
  };

  const imageHeight = await getDimensions().then(result => result.height);

  if (!imageHeight) {
    throw new UserInputError('Arquivo precisa ser uma imagem.');
  }

  if (imageHeight > 600) {
    return '600px';
  }

  if (imageHeight < 300) {
    return '300px';
  }

  return `${imageHeight}px`;
};

export default handleImageDimension;
