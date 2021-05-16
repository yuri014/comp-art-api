import { UserInputError } from 'apollo-server-express';
import path from 'path';
import getImageSize from 'image-size';

const handleImageDimension = (uploadPath: string) => {
  const realPath = path.join(__dirname, '..', '..', '..', '..', '..', '..', `/public${uploadPath}`);
  const dimensions = getImageSize(realPath);

  const imageHeight = dimensions.height;

  if (!imageHeight) {
    throw new UserInputError('Arquivo precisa ser uma image.');
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
