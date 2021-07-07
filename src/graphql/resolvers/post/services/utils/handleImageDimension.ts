import { UserInputError } from 'apollo-server-express';
import getImageSize from 'image-size';
import http from 'https';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

const handleImageDimension = async (uploadPath: string) => {
  const options = new URL(uploadPath);

  const getDimensions = () => {
    const dimensions = new Promise((resolve: (size: ISizeCalculationResult) => void) => {
      http.get(options, response => {
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
